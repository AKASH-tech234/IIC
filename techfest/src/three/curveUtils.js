import * as THREE from "three"

/**
 * SINGLE SOURCE OF TRUTH
 * One curve for entire journey - shared by road, car, and camera
 * NEVER rebuild this dynamically
 */
export const masterRoadCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 0),        // Start
    new THREE.Vector3(0, 0, -80),      // Straight section
    new THREE.Vector3(0, 0, -160),     // Pre-turn
    new THREE.Vector3(12, 0, -240),    // Begin curve
    new THREE.Vector3(30, 0, -340),    // Mid curve
    new THREE.Vector3(40, 0, -440),    // End curve
    new THREE.Vector3(40, 0, -560),    // Post-curve straight
    new THREE.Vector3(40, 0, -700)     // Extended past final section
  ],
  false,
  "catmullrom",
  0.3
)

// Legacy function for backward compatibility - now returns master curve
export const buildRoadCurve = (profile = "STRAIGHT") => {
  return masterRoadCurve
}
