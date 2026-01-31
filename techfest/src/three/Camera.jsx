import { useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { canCameraBreathe, getCameraBreathScale, canShiftFov } from "../journey/DeviceDirector"

/**
 * Dynamic Chase Camera
 * 
 * ANCHORED to car position - never leads, always follows
 * Camera reads car position and applies local offset
 * Creates cinematic forward motion effect
 */
export default function Camera({ 
  activePhase, 
  carRef, 
  currentSegment,
  // Phase 5: UI ↔ World coupling signals
  finalCTAActive,
  scrollVelocity
}) {
  const { camera } = useThree()
  const lastPhaseRef = useRef(null)
  const lockedPoseRef = useRef(null)
  
  // Phase 5: FINAL CTA arrival tracking
  const finalCTAStartTimeRef = useRef(0)
  const baseTiltRef = useRef(0)
  
  // Phase 9: Stability tracking
  const lastScrollTimeRef = useRef(0)

  useFrame(({ clock }) => {
    // CRITICAL: Camera MUST read carRef EVERY FRAME
    if (!carRef || !carRef.current) return

    const phase = activePhase.current || "HERO"
    const carPosition = carRef.current.position
    const segmentId = currentSegment?.current?.id || "HERO"
    const localT = currentSegment?.current?.localT || 0
    const now = clock.elapsedTime
    
    // ===== PHASE 5: FINAL CTA ARRIVAL DETECTION =====
    // Track when FINAL CTA becomes active
    if (finalCTAActive?.current && finalCTAStartTimeRef.current === 0) {
      finalCTAStartTimeRef.current = now
    } else if (!finalCTAActive?.current) {
      finalCTAStartTimeRef.current = 0
      baseTiltRef.current = 0
    }

    // ===== PHASE 9: CAMERA STABILITY - Clamp breathing during scroll spikes =====
    const velocity = scrollVelocity?.current || 0
    const velocityThreshold = 0.05 // Threshold for "fast scroll"
    const isFastScroll = Math.abs(velocity) > velocityThreshold
    
    // ===== PHASE 7: CAMERA MICRO BREATHING =====
    // Subtle FOV + Z offset breathing - felt, not seen
    // DISABLED during EVENTS (frozen gallery)
    // PHASE 9: Reduced during fast scroll
    // PHASE 11: Device-aware breathing (scaled by device profile)
    
    const isEventsPhase = phase === "EVENTS_SIDE_PROFILE"
    
    // Check device permissions
    const breathingAllowed = canCameraBreathe()
    const deviceBreathScale = getCameraBreathScale()
    
    // Breathing effect - slow sine wave (4 second period)
    const breathingCycle = Math.sin(now * 0.5) // Period ~12.5 seconds
    
    // PHASE 9: Clamp breathing during scroll velocity spikes (reduce by 50%)
    const breathingDamping = isFastScroll ? 0.5 : 1.0
    
    // PHASE 11: Apply device scaling (mobile=0, tablet=0.5x, desktop=1.0x)
    const finalBreathScale = breathingAllowed ? (breathingDamping * deviceBreathScale) : 0
    
    const fovBreathing = isEventsPhase ? 0 : breathingCycle * 0.5 * finalBreathScale // ±0.5 FOV (scaled by device)
    const zBreathing = isEventsPhase ? 0 : breathingCycle * 0.06 * finalBreathScale // ±0.06 Z offset (scaled by device)
    
    // SEGMENT-AWARE FOV MICRO-BEATS
    // PHASE 11: Only apply FOV shifts if device allows it
    const allowFovShifts = canShiftFov()
    let targetFOV = 50
    
    if (allowFovShifts) {
      if (segmentId === "TURN_1" && localT < 0.3) {
        targetFOV = 55 // Slight zoom-out before curve
      } else if (segmentId === "EVENTS") {
        targetFOV = 38 // Compression for gallery
      } else if (segmentId === "TURN_2") {
        targetFOV = 52 // Gentle recovery
      } else if (segmentId === "FINAL") {
        targetFOV = 50 // Stable approach
      }
    }
    
    // Apply breathing to target FOV
    camera.fov += ((targetFOV + fovBreathing) - camera.fov) * 0.08
    camera.updateProjectionMatrix()

    // Track phase changes
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      lockedPoseRef.current = null
    }

    // FIXED LOCAL OFFSET - adjusts per phase for visibility
    let localOffset
    if (phase === "EVENTS_SIDE_PROFILE") {
      // PHASE 9: Side-top view with downward bias for grounded feel (was 4, now 3.8)
      localOffset = new THREE.Vector3(6, 3.8, 2) // Downward bias: camera feels more grounded
    } else {
      // Apply Z breathing to offset (micro push/pull feel)
      localOffset = new THREE.Vector3(0, 2.2, 6 + zBreathing) // Always behind car + breathing
    }

    // Camera target = car position + offset (NEVER independent)
    const cameraTarget = carPosition.clone().add(localOffset)

    // ===== PHASE 5: CAMERA DAMPENING + TILT FOR FINAL CTA =====
    let lerpFactor = 0.08 // Default smooth follow
    let tiltAngle = 0 // Default no tilt
    
    if (finalCTAActive?.current && finalCTAStartTimeRef.current > 0) {
      const timeSinceFinalCTA = now - finalCTAStartTimeRef.current
      
      // Dampen camera motion (slower lerp for calmer feel)
      lerpFactor = 0.03
      
      // Gradual vertical tilt-up: +0.5° over 3 seconds
      const tiltDuration = 3.0 // seconds
      const tiltProgress = Math.min(1, timeSinceFinalCTA / tiltDuration)
      tiltAngle = tiltProgress * 0.5 * (Math.PI / 180) // Convert degrees to radians
    }

    // PHASE 9: Smooth lerp clamping - ensure factor never exceeds 0.12 (prevent jitter)
    lerpFactor = Math.min(lerpFactor, 0.12)

    // Smooth follow - ALWAYS lerp, supports reverse scrolling
    camera.position.lerp(cameraTarget, lerpFactor)
    
    // Apply tilt by adjusting lookAt target slightly upward
    const lookAtTarget = carPosition.clone()
    lookAtTarget.y += Math.tan(tiltAngle) * localOffset.z // Tilt based on distance
    camera.lookAt(lookAtTarget)
    
    // Track phase changes
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
    }
  })

  return null
}
