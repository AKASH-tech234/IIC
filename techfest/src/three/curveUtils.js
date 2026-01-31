import * as THREE from "three"

/**
 * SEGMENTED ROAD SYSTEM - True Forward Journey
 * 
 * Each segment is a distinct curve that connects end-to-end.
 * Car progresses through segments based on scroll distance.
 * NO curve reuse, NO looping illusion.
 */

export const roadSegments = [
  {
    id: "HERO",
    curve: new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -80),
        new THREE.Vector3(0, 0, -160),
        new THREE.Vector3(0, 0, -200)
      ],
      false,
      "catmullrom",
      0.3
    )
  },
  {
    id: "TURN_1",
    curve: new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, -200),
        new THREE.Vector3(5, 0, -260),
        new THREE.Vector3(15, 0, -330),
        new THREE.Vector3(25, 0, -400)
      ],
      false,
      "catmullrom",
      0.3
    )
  },
  {
    id: "EVENTS",
    curve: new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(25, 0, -400),
        new THREE.Vector3(30, 0, -480),
        new THREE.Vector3(35, 0, -580),
        new THREE.Vector3(40, 0, -700)
      ],
      false,
      "catmullrom",
      0.3
    )
  },
  {
    id: "TURN_2",
    curve: new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(40, 0, -700),
        new THREE.Vector3(42, 0, -780),
        new THREE.Vector3(43, 0, -850),
        new THREE.Vector3(42, 0, -900)
      ],
      false,
      "catmullrom",
      0.3
    )
  },
  {
    id: "FINAL",
    curve: new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(42, 0, -900),
        new THREE.Vector3(40, 0, -1000),
        new THREE.Vector3(40, 0, -1100),
        new THREE.Vector3(40, 0, -1200)
      ],
      false,
      "catmullrom",
      0.3
    )
  }
]

// Calculate length for each segment
roadSegments.forEach(segment => {
  segment.length = segment.curve.getLength()
})

// Calculate cumulative distances for segment lookup
let cumulativeDistance = 0
roadSegments.forEach(segment => {
  segment.startDistance = cumulativeDistance
  segment.endDistance = cumulativeDistance + segment.length
  cumulativeDistance += segment.length
})

export const totalRoadLength = cumulativeDistance

/**
 * Get segment and local t for a given distance along the road
 * @param {number} distance - Distance from start (0 to totalRoadLength)
 * @returns {{segment: object, localT: number}} - Current segment and parameter
 */
export function getSegmentAtDistance(distance) {
  // Clamp to valid range
  distance = Math.max(0, Math.min(distance, totalRoadLength))
  
  // Find which segment we're in
  for (let i = 0; i < roadSegments.length; i++) {
    const segment = roadSegments[i]
    if (distance >= segment.startDistance && distance <= segment.endDistance) {
      // Calculate local t within this segment
      const localDistance = distance - segment.startDistance
      const localT = Math.min(localDistance / segment.length, 1)
      return { segment, localT }
    }
  }
  
  // Fallback to last segment (should never reach here)
  const lastSegment = roadSegments[roadSegments.length - 1]
  return { segment: lastSegment, localT: 1 }
}
