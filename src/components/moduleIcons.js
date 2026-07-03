import {
  Telescope, Orbit, Sun, Globe, Wind, Moon, Gem, CircleDashed,
  Star, Flame, Sparkles, CircleDot, Radar, Layers,
  Zap, EyeOff, Waves, Activity, Rocket, Satellite,
} from 'lucide-react'

// Maps the plain-string `icon` field on each module (src/data/modules.js) to
// its Lucide component — kept out of modules.js so that data file stays
// framework-agnostic (plain strings/objects, no JSX).
export const MODULE_ICONS = {
  Telescope, Orbit, Sun, Globe, Wind, Moon, Gem, CircleDashed,
  Star, Flame, Sparkles, CircleDot, Radar, Layers,
  Zap, EyeOff, Waves, Activity, Rocket, Satellite,
}

export function getModuleIcon(name) {
  return MODULE_ICONS[name] || Telescope
}
