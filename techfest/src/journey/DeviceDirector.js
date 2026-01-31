/**
 * Device Director - Single Source of Truth for Device Behavior
 * 
 * PHASE 11: Device-Aware Motion & Camera System
 * 
 * Core Principle:
 * No component should check window.innerWidth directly.
 * All device-dependent behavior flows through this module.
 * 
 * Responsibilities:
 * - Device classification (desktop/tablet/mobile)
 * - Motion scaling for GSAP timelines
 * - Camera breathing permissions
 * - Typography limits
 * - FOV shift permissions
 */

// ===== 1. DEVICE CLASSIFICATION (Hard, Deterministic) =====

export const DEVICE_TYPES = {
  DESKTOP: "desktop",
  TABLET: "tablet",
  MOBILE: "mobile"
}

/**
 * Classify device based on viewport width
 * Uses existing pattern: mobile <768, tablet 768-1279, desktop 1280+
 */
export function getDeviceType() {
  const w = window.innerWidth

  if (w >= 1280) return DEVICE_TYPES.DESKTOP
  if (w >= 768) return DEVICE_TYPES.TABLET
  return DEVICE_TYPES.MOBILE
}

// ===== 2. CANONICAL DEVICE PROFILES (LOCKED) =====

/**
 * Device profiles - intentionally conservative values
 * These define the feel of each device tier
 */
export const DEVICE_PROFILE = {
  desktop: {
    // Full-speed animations
    uiMotionScale: 1.0,
    
    // Full camera breathing
    cameraBreathing: true,
    cameraBreathScale: 1.0,
    
    // Allow FOV shifts during segments
    allowFovShift: true,
    
    // Typography maximums
    maxHeadlinePx: 72,
    maxSectionTitlePx: 48,
    maxBodyPx: 18
  },

  tablet: {
    // Calmer animations (60% speed)
    uiMotionScale: 0.6,
    
    // Reduced camera breathing (50% amplitude)
    cameraBreathing: true,
    cameraBreathScale: 0.5,
    
    // Allow FOV shifts (tablet can handle it)
    allowFovShift: true,
    
    // Typography maximums
    maxHeadlinePx: 56,
    maxSectionTitlePx: 40,
    maxBodyPx: 17
  },

  mobile: {
    // Very calm animations (30% speed)
    uiMotionScale: 0.3,
    
    // No camera breathing (performance + touch scroll stability)
    cameraBreathing: false,
    cameraBreathScale: 0,
    
    // No FOV shifts (keep camera stable)
    allowFovShift: false,
    
    // Typography maximums
    maxHeadlinePx: 48,
    maxSectionTitlePx: 36,
    maxBodyPx: 16
  }
}

// ===== 3. RUNTIME RESOLVER (Single Call, Cached) =====

let _cachedDevice = null

/**
 * Resolve device profile once and cache
 * Call this at app startup
 */
export function resolveDeviceProfile() {
  if (_cachedDevice) return _cachedDevice

  const type = getDeviceType()
  _cachedDevice = {
    type,
    profile: DEVICE_PROFILE[type]
  }

  return _cachedDevice
}

/**
 * Force re-resolution (for testing/dev only)
 */
export function clearDeviceCache() {
  _cachedDevice = null
}

// ===== 4. GSAP INTEGRATION HELPER (MANDATORY) =====

/**
 * Apply device motion scaling to GSAP timeline
 * REQUIRED: Every GSAP timeline must pass through this
 * 
 * Usage:
 *   const tl = gsap.timeline({ paused: true })
 *   applyDeviceMotionScaling(tl)
 *   tl.to(...)
 */
export function applyDeviceMotionScaling(timeline) {
  const { profile } = resolveDeviceProfile()

  if (!timeline || !timeline.timeScale) {
    console.warn("[DeviceDirector] Invalid timeline passed to applyDeviceMotionScaling")
    return timeline
  }

  // Apply motion scale via timeScale
  // This slows down animations on smaller devices
  timeline.timeScale(profile.uiMotionScale)
  
  return timeline
}

// ===== 5. CAMERA PERMISSION HELPERS =====

/**
 * Check if camera breathing is allowed on this device
 * Used in Camera.jsx to enable/disable breathing
 */
export function canCameraBreathe() {
  return resolveDeviceProfile().profile.cameraBreathing
}

/**
 * Get camera breathing scale multiplier
 * Returns 0 for mobile, 0.5 for tablet, 1.0 for desktop
 */
export function getCameraBreathScale() {
  return resolveDeviceProfile().profile.cameraBreathScale
}

/**
 * Check if FOV shifts are allowed on this device
 * Mobile should have stable FOV, desktop/tablet can shift
 */
export function canShiftFov() {
  return resolveDeviceProfile().profile.allowFovShift
}

// ===== 6. TYPOGRAPHY CLAMP HELPER =====

/**
 * Get typography limits for current device
 * Can be used by typography system or layout components
 */
export function getTypographyLimits() {
  const { profile } = resolveDeviceProfile()

  return {
    headlineMax: profile.maxHeadlinePx,
    sectionTitleMax: profile.maxSectionTitlePx,
    bodyMax: profile.maxBodyPx
  }
}

// ===== 7. DEVELOPMENT SAFETY CHECK =====

/**
 * Warn if viewport changes significantly after load
 * We don't support dynamic resizing - user should reload
 */
if (import.meta.env.DEV) {
  let initialWidth = window.innerWidth

  window.addEventListener("resize", () => {
    if (Math.abs(window.innerWidth - initialWidth) > 100) {
      console.warn(
        "[DeviceDirector] Viewport resized significantly. Device profile is cached. Reload recommended."
      )
    }
  })
}

// ===== 8. DEBUG HELPER =====

/**
 * Log current device profile (dev only)
 */
export function logDeviceProfile() {
  if (import.meta.env.DEV) {
    const device = resolveDeviceProfile()
    console.log("[DeviceDirector] Current device profile:", device)
  }
}
