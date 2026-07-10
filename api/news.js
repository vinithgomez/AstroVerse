// api/news.js — Vercel serverless function backing the /news page.
//
// Written against the raw Node http.ServerResponse API (res.statusCode /
// res.setHeader / res.end) rather than Vercel's res.status()/res.json()
// sugar, so the exact same handler also runs under Vite's dev middleware
// (see vite.config.js) without a compatibility shim — both runtimes hand
// this function a real http.ServerResponse under the hood.

import Parser from 'rss-parser'
import { decodeHTML } from 'entities'

const FEEDS = [
  { url: 'https://www.nasa.gov/news-release/feed/', source: 'NASA' },
  { url: 'http://www.space.com/feeds.xml', source: 'Space.com' },
]

// 20 minutes — comfortably inside the "15-30 min" range from the spec.
// In-memory only: fine at this scale, and naturally per-instance on
// Vercel's serverless runtime (a cold start just refetches).
const CACHE_TTL_MS = 20 * 60 * 1000

let cache = null // { payload, timestamp }

const parser = new Parser({
  timeout: 8000, // don't let a slow/down feed hang the request
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent'],
    ],
  },
})

function stripHtml(s) {
  return (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// Small, fast, stable string hash (djb2) — used as bookmarks.content_id
// for news articles, which have no id of their own in our database.
function hashId(input) {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = ((h * 33) ^ input.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

function extractThumbnail(item) {
  const thumb = item.mediaThumbnail?.$?.url
  if (thumb) return thumb
  const content = item.mediaContent?.$
  if (content?.url && content.medium !== 'video') return content.url
  const enclosure = item.enclosure
  if (enclosure?.url && (!enclosure.type || enclosure.type.startsWith('image'))) return enclosure.url
  return null
}

function normalize(item, source) {
  const link = item.link || ''
  const summary = decodeHTML(stripHtml(item.contentSnippet || item.summary || item.content || '')).slice(0, 220)
  return {
    id: hashId(link || item.title || ''),
    title: decodeHTML(stripHtml(item.title || '')),
    summary,
    source,
    category: item.categories?.[0] ? decodeHTML(item.categories[0]) : null,
    publishedAt: item.isoDate || item.pubDate || null,
    link,
    thumbnail: extractThumbnail(item),
  }
}

async function fetchSource({ url, source }) {
  try {
    const feed = await parser.parseURL(url)
    return { source, ok: true, items: (feed.items || []).map(item => normalize(item, source)) }
  } catch (err) {
    console.error(`[api/news] ${source} feed failed:`, err.message)
    return { source, ok: false, items: [] }
  }
}

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=1200, stale-while-revalidate=600')
  res.end(JSON.stringify(data))
}

export default async function handler(req, res) {
  const now = Date.now()
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return sendJson(res, 200, cache.payload)
  }

  const results = await Promise.all(FEEDS.map(fetchSource))
  const articles = results
    .flatMap(r => r.items)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
  const sources = Object.fromEntries(results.map(r => [r.source, r.ok ? 'ok' : 'error']))

  const payload = { articles, sources, fetchedAt: new Date(now).toISOString() }

  if (articles.length > 0) {
    cache = { payload, timestamp: now }
    return sendJson(res, 200, payload)
  }

  // Both feeds failed this round — serve a stale cache rather than an
  // empty page if we have one, even past its normal TTL.
  if (cache) {
    return sendJson(res, 200, { ...cache.payload, stale: true })
  }

  return sendJson(res, 502, payload)
}
