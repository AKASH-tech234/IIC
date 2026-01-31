/**
 * Scene Director - Cinematic Authoring Layer
 * 
 * Declarative rules for how each section behaves cinematically.
 * This does NOT animate anything - it only declares intent.
 * 
 * Think: Film editor's notes, not animation keyframes.
 */

export const SCENE_RULES = {
  HERO: {
    // Opening shot - establish world, orient viewer
    carMotion: "slow",
    cameraMode: "wide",
    uiDelay: 0,
    dominantElement: "title",
    timing: {
      titleReveal: 0.8,
      taglineDelay: 0.3,
      ctaDelay: 0.6
    },
    // PHASE 8: Color Authority
    accent: "primary",
    contrastBoost: false,
    vignette: "light",
    fogDensity: "medium"
  },

  ABOUT: {
    // Informative passage - clear, sequential
    carMotion: "steady",
    cameraMode: "follow",
    uiDelay: 0,
    dominantElement: "cards",
    timing: {
      cardStagger: 0.2,
      cardDuration: 0.6
    },
    // PHASE 8: Color Authority
    accent: "primary",
    contrastBoost: false,
    vignette: "light",
    fogDensity: "medium"
  },

  EVENTS: {
    // Gallery moment - STOP and observe
    carMotion: "frozen",
    cameraMode: "locked",
    uiDelay: 0,
    dominantElement: "cards-all-visible",
    timing: {
      cardsEnterTogether: 0.8,
      lineDraw: 0.6,
      holdDuration: "15-20% scroll"
    },
    visualHierarchy: {
      active: { scale: 1.0, opacity: 1.0 },
      adjacent: { scale: 0.96, opacity: 0.65 },
      others: { scale: 0.92, opacity: 0.4 }
    },
    // PHASE 8: Color Authority
    accent: "secondary",
    contrastBoost: true,  // Spotlight effect
    vignette: "strong",   // Frame the gallery
    fogDensity: "heavy"   // Compress space
  },

  WORKSHOPS: {
    // Re-accelerate momentum
    carMotion: "accelerate",
    cameraMode: "follow",
    uiDelay: 0.1,
    dominantElement: "content-blocks",
    timing: {
      blockStagger: 0.18
    },
    // PHASE 8: Color Authority
    accent: "workshops",
    contrastBoost: false,
    vignette: "medium",
    fogDensity: "light"
  },

  SCHEDULE: {
    // Rhythmic passage
    carMotion: "steady",
    cameraMode: "follow",
    uiDelay: 0,
    dominantElement: "timeline-items",
    timing: {
      itemStagger: 0.15,
      itemDuration: 0.5
    },
    // PHASE 8: Color Authority
    accent: "schedule",
    contrastBoost: false,
    vignette: "light",
    fogDensity: "medium"
  },

  FINAL: {
    // Arrival - resolution, not excitement
    carMotion: "crawl",
    cameraMode: "arrival",
    uiDelay: 0.1,
    dominantElement: "headline",
    timing: {
      badgeFade: 0.8,
      headlineDelay: 0.2,
      textDelay: 0.4,
      ctaDelay: 0.6
    },
    mood: "calm-brightness", // No bounce, no spikes
    // PHASE 8: Color Authority
    accent: "tertiary",
    contrastBoost: false,
    vignette: "fade",     // Open highway feel
    fogDensity: "light"   // Clear visibility
  }
}

/**
 * Animation Constraints - Global Rules
 */
export const ANIMATION_RULES = {
  // FORBIDDEN PROPERTIES
  forbidden: [
    "translateY", 
    "y-axis-translation",
    "bounce-easing",
    "easeOutBack"
  ],

  // ALLOWED PROPERTIES ONLY
  allowed: [
    "opacity",
    "blur",
    "letter-spacing",
    "scale",
    "clipPath",
    "lateral-motion" // X-axis only
  ],

  // TIMING CONSTRAINTS
  timing: {
    minStagger: 0.15, // Minimum delay between elements
    maxSimultaneous: 2, // Max elements moving at once
    defaultDuration: 0.6,
    fastDuration: 0.3,
    slowDuration: 0.8
  },

  // EASING
  easing: {
    standard: "power2.out",
    slow: "power1.inOut",
    arrival: "expo.out"
  }
}

/**
 * Visual Hierarchy - One Dominant Element Rule
 */
export const HIERARCHY_LEVELS = {
  DOMINANT: {
    opacity: 1.0,
    scale: 1.0,
    blur: 0,
    zIndex: 10
  },
  SUPPORTING: {
    opacity: 0.7,
    scale: 0.98,
    blur: 0,
    zIndex: 5
  },
  BACKGROUND: {
    opacity: 0.4,
    scale: 0.95,
    blur: 1,
    zIndex: 1
  }
}

/**
 * Get scene rules for a specific section
 */
export function getSceneRules(sectionId) {
  return SCENE_RULES[sectionId] || SCENE_RULES.HERO
}

/**
 * Check if animation property is allowed
 */
export function isAllowedProperty(property) {
  return !ANIMATION_RULES.forbidden.some(forbidden => 
    property.toLowerCase().includes(forbidden.toLowerCase())
  )
}

/**
 * Get recommended timing for section
 */
export function getSectionTiming(sectionId) {
  const rules = getSceneRules(sectionId)
  return rules.timing || ANIMATION_RULES.timing
}

/**
 * PHASE 8: Get accent color key for section
 */
export function getAccentKey(sectionId) {
  const rules = getSceneRules(sectionId)
  return rules.accent || "primary"
}

/**
 * PHASE 8: Get vignette strength for section
 */
export function getVignetteStrength(sectionId) {
  const rules = getSceneRules(sectionId)
  const vignetteMap = {
    "light": 0.3,
    "medium": 0.5,
    "strong": 0.7,
    "fade": 0.1
  }
  return vignetteMap[rules.vignette] || 0.3
}

/**
 * PHASE 8: Get fog density for section
 */
export function getFogDensity(sectionId) {
  const rules = getSceneRules(sectionId)
  const densityMap = {
    "light": { near: 80, far: 500 },
    "medium": { near: 60, far: 400 },
    "heavy": { near: 40, far: 300 }
  }
  return densityMap[rules.fogDensity] || densityMap.medium
}

/**
 * PHASE 8: Check if section needs contrast boost
 */
export function needsContrastBoost(sectionId) {
  const rules = getSceneRules(sectionId)
  return rules.contrastBoost || false
}
