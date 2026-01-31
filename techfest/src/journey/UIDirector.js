/**
 * UI Director - Cinematic UI Authoring Layer
 * 
 * PHASE 10: GSAP-First Timeline Authorship
 * 
 * Core Principle:
 * No UI element animates itself. Only section timelines animate UI.
 * 
 * This file defines AUTHORIAL INTENT, not animation code.
 * Think: Film editor's beat sheet, not animator's keyframes.
 */

/**
 * UI Beats - Section-level animation authority
 * 
 * Each section defines:
 * - enter: Entry delay and behavior
 * - dominant: Primary element that claims the frame
 * - supports: Supporting elements that wait
 * - tempo: Optional pacing descriptor (fast/rhythmic/slow)
 * - pin: Whether section should pin during scroll
 * - pinDuration: How long to hold pin ("section" or scroll length)
 */
export const UI_BEATS = {
  HERO: {
    enter: { delay: 0.1 },
    dominant: "title",
    supports: ["tagline", "cta"],
    tempo: "slow",
    timing: {
      title: 0.0,      // Title starts immediately
      tagline: 0.40,   // Tagline waits for title to claim frame
      cta: 0.70        // CTA waits for tagline to settle
    }
  },

  ABOUT: {
    enter: { delay: 0.15 },
    dominant: "headline",
    supports: ["points"],
    tempo: "normal",
    timing: {
      headline: 0.0,
      point1: 0.25,
      point2: 0.45,
      point3: 0.65
    }
  },

  EVENTS: {
    enter: { delay: 0 },
    dominant: "gallery",
    supports: ["caption"],
    tempo: "slow",
    pin: true,
    pinDuration: "section", // Hold gallery for entire section
    timing: {
      allCards: 0.0,      // All cards appear together (opacity 0.85)
      activeCard: 0.20,   // Active card scales up
      caption: 0.40       // Caption fades in
    },
    visualHierarchy: {
      active: { scale: 1.0, opacity: 1.0 },
      supporting: { scale: 0.96, opacity: 0.85 }
    }
  },

  WORKSHOPS: {
    enter: { delay: 0.1 },
    dominant: "list",
    supports: [],
    tempo: "fast",
    timing: {
      heading: 0.0,
      content: 0.15
    }
  },

  SCHEDULE: {
    enter: { delay: 0 },
    dominant: "timeline",
    supports: ["items"],
    tempo: "rhythmic",
    timing: {
      heading: 0.0,
      itemInterval: 0.12  // Fast tempo: 120ms between items
    }
  },

  FINAL: {
    enter: { delay: 0.2 },
    dominant: "headline",
    supports: ["cta"],
    tempo: "slow",
    timing: {
      headline: 0.0,
      cta: 0.30
    }
  }
}

/**
 * UI Timing Constants
 * Use these instead of magic numbers in components
 */
export const UI_TIMING = {
  fast: 0.2,      // Quick reveals, high energy
  normal: 0.35,   // Standard pacing
  slow: 0.5       // Deliberate, cinematic
}

/**
 * Exit Grammar
 * Exits are 30% faster than enters (cinematic cut-out)
 */
export const UI_EXIT_MULTIPLIER = 0.7

/**
 * Animation Constraints
 */
export const ANIMATION_CONSTRAINTS = {
  // Maximum elements revealing simultaneously
  maxSimultaneous: 2,
  
  // Minimum interval between reveals (ms)
  minRevealInterval: 150,
  
  // Blur should only exist on entry, not final state
  blurOnEntry: true,
  blurOnFinal: false
}

/**
 * Get UI beats for a specific section
 */
export function getUIBeats(sectionId) {
  return UI_BEATS[sectionId] || UI_BEATS.HERO
}

/**
 * Get timing constant by name
 */
export function getUITiming(tempo) {
  switch(tempo) {
    case 'fast': return UI_TIMING.fast
    case 'rhythmic': return UI_TIMING.fast // Rhythmic uses fast timing
    case 'slow': return UI_TIMING.slow
    default: return UI_TIMING.normal
  }
}

/**
 * Get exit multiplier for timeline reversal
 */
export function getExitMultiplier() {
  return UI_EXIT_MULTIPLIER
}

/**
 * Validate timeline pattern
 * Use in development to ensure sections follow the rules
 */
export function validateTimelinePattern(timeline, sectionId) {
  if (import.meta.env.DEV) {
    const beats = getUIBeats(sectionId)
    
    // Check if timeline is paused initially
    if (!timeline.paused()) {
      console.warn(`[UIDirector] ${sectionId}: Timeline should start paused`)
    }
    
    // Check if exit multiplier is set
    if (timeline.timeScale() !== 1) {
      console.warn(`[UIDirector] ${sectionId}: Timeline timeScale should be 1 initially`)
    }
    
    return true
  }
}

/**
 * Helper: Apply exit behavior to timeline
 */
export function applyExitBehavior(timeline) {
  return timeline.timeScale(UI_EXIT_MULTIPLIER).reverse()
}

/**
 * Helper: Reset timeline for re-entry
 */
export function resetTimelineForEntry(timeline) {
  timeline.timeScale(1)
  return timeline
}
