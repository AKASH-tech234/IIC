/**
 * Identity Tokens - Brand-Grade Color System
 * 
 * PHASE 8: Color & Identity Lock
 * 
 * RULES (NON-NEGOTIABLE):
 * - NO inline hex values anywhere else in codebase
 * - NO gradients in body text
 * - Accents only appear when something is dominant
 * - All Three.js materials read from this file
 * - All CSS reads from these tokens
 */

export const BRAND_COLORS = {
  // Base palette - backdrop and structure
  base: {
    bg: "#05070D",           // Deep space background
    sky: "#0A1022",          // Sky/fog color
    text: "#EAF2FF",         // Pure white text
    textMuted: "#8B92A8",    // Supporting text
    surface: "#0D1117"       // Card surfaces
  },

  // Accent colors - section identity
  accents: {
    primary: "#00E5FF",      // HERO - Cyan (opening, orientation)
    secondary: "#7C7CFF",    // EVENTS - Purple (gallery, focus)
    tertiary: "#00F5E5",     // FINAL - Teal (arrival, resolution)
    schedule: "#8B5CF6",     // SCHEDULE - Violet
    workshops: "#3B82F6"     // WORKSHOPS - Blue
  },

  // Semantic colors - specific purposes
  semantic: {
    road: "#00E5FF",         // Road centerline
    roadSurface: "#0E3A45",  // Road surface (muted blue-cyan)
    ground: "#02030A",       // Ground plane
    groundStrip: "#0A1420",  // Transit strip
    city: "#08131E",         // City buildings
    fog: "#0A1022"           // Fog color
  },

  // State opacity levels - visual hierarchy
  states: {
    muted: 0.4,              // Background elements
    supporting: 0.7,         // Supporting content
    dominant: 1.0            // Main focus
  },

  // Emissive intensity ranges - Three.js materials
  emissive: {
    off: 0,
    subtle: 0.08,
    low: 0.3,
    medium: 0.6,
    high: 0.9,
    peak: 1.2
  }
}

/**
 * Section Color Mapping
 * Maps each section to its accent color
 */
export const SECTION_COLORS = {
  HERO: BRAND_COLORS.accents.primary,
  ABOUT: BRAND_COLORS.accents.primary,
  EVENTS: BRAND_COLORS.accents.secondary,
  EVENTS_SIDE_PROFILE: BRAND_COLORS.accents.secondary,
  WORKSHOPS: BRAND_COLORS.accents.workshops,
  SCHEDULE: BRAND_COLORS.accents.schedule,
  FORWARD_CONTENT: BRAND_COLORS.accents.tertiary,
  FINAL: BRAND_COLORS.accents.tertiary
}

/**
 * Get accent color for a section/phase
 */
export function getAccentColor(phaseId) {
  return SECTION_COLORS[phaseId] || BRAND_COLORS.accents.primary
}

/**
 * Get opacity for hierarchy level
 */
export function getHierarchyOpacity(level) {
  switch(level) {
    case 'dominant': return BRAND_COLORS.states.dominant
    case 'supporting': return BRAND_COLORS.states.supporting
    case 'muted': return BRAND_COLORS.states.muted
    default: return BRAND_COLORS.states.dominant
  }
}

/**
 * Get emissive intensity for state
 */
export function getEmissiveIntensity(state) {
  return BRAND_COLORS.emissive[state] || BRAND_COLORS.emissive.medium
}

/**
 * Convert to CSS custom properties
 * Use this to sync with Tailwind/CSS
 */
export function getCSSVariables() {
  return {
    '--color-bg': BRAND_COLORS.base.bg,
    '--color-sky': BRAND_COLORS.base.sky,
    '--color-text': BRAND_COLORS.base.text,
    '--color-text-muted': BRAND_COLORS.base.textMuted,
    '--color-surface': BRAND_COLORS.base.surface,
    '--color-accent-primary': BRAND_COLORS.accents.primary,
    '--color-accent-secondary': BRAND_COLORS.accents.secondary,
    '--color-accent-tertiary': BRAND_COLORS.accents.tertiary,
    '--color-accent-schedule': BRAND_COLORS.accents.schedule,
    '--color-accent-workshops': BRAND_COLORS.accents.workshops
  }
}

/**
 * Apply CSS variables to document root
 */
export function applyCSSVariables() {
  const variables = getCSSVariables()
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
}
