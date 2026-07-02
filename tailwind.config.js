/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#0a0a0f',
        surface:  '#0f1117',
        border:   '#1e2130',
        blue:     '#4f8ef7',
        purple:   '#8b5cf6',
        success:  '#22c55e',
        warning:  '#eab308',
        danger:   '#ef4444',
        debate:   '#f97316',
        'text-primary': '#f0f4ff',
        'text-muted':   '#8892a4',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        btn:   '8px',
        card:  '12px',
        panel: '16px',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
    },
  },
  plugins: [],
}
