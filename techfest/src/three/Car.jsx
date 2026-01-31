import { useRef, forwardRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { totalRoadLength, getSegmentAtDistance } from "./curveUtils"
import { getSegmentFrames, ROAD_RADIUS } from "./Road"

/**
 * 3D Sports Car Component - Scroll-Driven Animation
 * 
 * Features:
 * - Low-poly sports car geometry
 * - Wheels rotate based on scroll progress
 * - Forward tilt when scrolling
 * - Subtle vibration effect
 * - Neon accents and emissive headlights
 */
const Car = forwardRef(({ 
  scrollProgress, 
  motionDensity, 
  activePhase, 
  phaseProgress, 
  activeCardIndex, 
  activeAccent, 
  textPhase,
  // Phase 5: UI ↔ World coupling signals
  cardChangeSignal
}, ref) => {
  const carRef = useRef()
  const currentSegmentRef = useRef({ id: "HERO", localT: 0 })
  
  // Expose both carRef and currentSegmentRef through forwarded ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(carRef.current)
      } else {
        ref.current = carRef.current
        // Attach currentSegmentRef for Scene to read
        if (carRef.current) {
          carRef.current.currentSegmentRef = currentSegmentRef
        }
      }
    }
  }, [])
  const frontLeftWheelRef = useRef()
  const frontRightWheelRef = useRef()
  const rearLeftWheelRef = useRef()
  const rearRightWheelRef = useRef()

  // Refs for dynamic material updates
  const bodyMaterialRef = useRef()
  const cabinMaterialRef = useRef()
  const headlightRefs = useRef([])
  const underglowRef = useRef()

  const lastPhaseRef = useRef(null)
  const lockedPoseRef = useRef(null)
  const lastCardIndexRef = useRef(activeCardIndex?.current ?? 0)
  
  // Phase 5: Card change pulse tracking
  const cardPulseStartTimeRef = useRef(0)
  const lastCardSignalRef = useRef(null)

  useFrame(({ clock }) => {
    if (!carRef.current) return
    const now = clock.elapsedTime
    
    // ===== PHASE 5: CARD CHANGE PULSE DETECTION =====
    // Detect card change signal and trigger underglow pulse
    if (cardChangeSignal?.current !== null && cardChangeSignal.current !== lastCardSignalRef.current) {
      cardPulseStartTimeRef.current = now
      lastCardSignalRef.current = cardChangeSignal.current
      // Note: cardChangeSignal will be reset by Road.jsx
    }

    const progress = scrollProgress.current || 0
    const density = motionDensity.current || 0
    const phase = activePhase.current || "HERO"
    const phaseProgressValue = phaseProgress.current || 0

    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      lockedPoseRef.current = null
    }

    const isHeroPhase = phase === "HERO"
    const isEventsPhase = phase === "EVENTS_SIDE_PROFILE"
    const isTurningPhase = phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD"
    const isTextHold = textPhase?.current === "HOLD"

    // DISTANCE-BASED POSITIONING - True forward journey
    const distance = progress * totalRoadLength
    const { segment, localT } = getSegmentAtDistance(distance)
    
    // Store current segment for other components to read
    currentSegmentRef.current = { id: segment.id, localT, distance }
    
    // Sample current segment curve
    const curvePoint = segment.curve.getPointAt(localT)
    
    // Get Frenet frames for current segment
    const segmentFrames = getSegmentFrames(segment.id)
    const f = localT * (segmentFrames.normals.length - 1)
    const i0 = Math.floor(f)
    const i1 = Math.min(i0 + 1, segmentFrames.normals.length - 1)
    const lerpT = f - i0
    
    const normal = segmentFrames.normals[i0].clone().lerp(segmentFrames.normals[i1], lerpT).normalize()
    const tangent = segmentFrames.tangents[i0].clone().lerp(segmentFrames.tangents[i1], lerpT).normalize()
    
    // Lift car ABOVE tube surface using normal (NOT world Y)
    // Adjusted clearance: ROAD_RADIUS is 2.8, so we need minimal clearance to sit ON the road
    const CAR_CLEARANCE = 0.05 // Reduced from 0.35 to make car sit on road surface
    const basePosition = curvePoint.clone().add(
      normal.clone().multiplyScalar(ROAD_RADIUS + CAR_CLEARANCE)
    )

    const lerpSpeed = isTextHold ? 0.03 : phase === "ROTATE_TO_SIDE" || phase === "EVENTS_SIDE_PROFILE" ? 0.05 : 0.12

    // ALWAYS update car position based on scroll distance (allows reverse scrolling)
    // During EVENTS, position updates but motion feels slower due to cinematic holds
    carRef.current.position.lerp(basePosition, lerpSpeed)
    carRef.current.up.lerp(normal, lerpSpeed)
    
    const lookAtTarget = basePosition.clone().add(tangent)
    carRef.current.lookAt(lookAtTarget)

    // ===== PHASE 10: Fix static float - vibration only when moving =====
    // Check velocity threshold to prevent see-saw when static
    const velocity = Math.abs(progress - (carRef.current.userData?.lastProgress || 0))
    carRef.current.userData = carRef.current.userData || {}
    carRef.current.userData.lastProgress = progress
    
    // Only vibrate if velocity above threshold (car is actually moving)
    const velocityThreshold = 0.0001
    const isMoving = velocity > velocityThreshold
    
    // Subtle vibration along the normal (not world Y)
    const vibrationIntensity = isEventsPhase ? 0.003 : isHeroPhase ? 0.01 : 0.02
    const vibration = isMoving ? Math.sin(Date.now() * 0.002) * vibrationIntensity : 0
    const vibrationOffset = normal.clone().multiplyScalar(vibration)
    carRef.current.position.add(vibrationOffset)

    // ===== PHASE 10: Wheel rotation - clamp when static =====
    // Wheels stop during HERO and EVENTS phases
    const curveSlowdown = phase === "ROTATE_TO_SIDE" || phase === "EVENTS_SIDE_PROFILE" ? 0.4 : 1
    let wheelRotation = isHeroPhase || isEventsPhase ? 0 : (progress - 0.05) * Math.PI * 14 * curveSlowdown
    
    // Clamp wheel rotation when static to prevent drift
    if (!isMoving && !isHeroPhase && !isEventsPhase) {
      // Keep last rotation when static
      wheelRotation = carRef.current.userData.lastWheelRotation || wheelRotation
    } else {
      carRef.current.userData.lastWheelRotation = wheelRotation
    }
    
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x = wheelRotation
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x = wheelRotation
    if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x = wheelRotation
    if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x = wheelRotation

    const accentColor = activeAccent.current || "#00E5FF"
    
    // UPGRADED: Enhanced body material with better opacity and emissive
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.opacity = isHeroPhase ? 0.5 : Math.min(1, 0.5 + (progress - 0.05) * 10) // Increased from 0.3
      bodyMaterialRef.current.transparent = true
      bodyMaterialRef.current.emissive.set(accentColor)
      bodyMaterialRef.current.emissiveIntensity = isHeroPhase ? 0.08 : 0.12 // Increased glow
      bodyMaterialRef.current.metalness = 0.9 // More metallic
      bodyMaterialRef.current.roughness = 0.2 // Shinier
    }
    if (cabinMaterialRef.current) {
      cabinMaterialRef.current.opacity = isHeroPhase ? 0.4 : Math.min(0.9, 0.4 + (progress - 0.05) * 10)
      cabinMaterialRef.current.transparent = true
    }

    headlightRefs.current.forEach(light => {
      if (light) {
        const shimmer = isEventsPhase ? 0.3 + Math.sin(Date.now() * 0.001) * 0.1 : 0
        light.emissiveIntensity = isHeroPhase ? 2.5 : 2.0 + shimmer
        light.emissive.set(accentColor)
      }
    })

    if (underglowRef.current) {
      const breathe = isEventsPhase ? 0.1 + Math.sin(Date.now() * 0.0012) * 0.1 : 0
      let baseIntensity = isHeroPhase ? 0.3 : 0.5 + density * 0.2 + breathe
      
      // ===== PHASE 5: UNDERGLOW PULSE ON CARD CHANGE (100ms synchronized with road) =====
      const timeSinceCardPulse = (now - cardPulseStartTimeRef.current) * 1000 // Convert to ms
      if (timeSinceCardPulse < 100) {
        // Brief intensity pulse synchronized with road glow
        const t = timeSinceCardPulse / 100
        const eased = Math.sin(t * Math.PI) // Smooth pulse in/out
        const pulseBoost = eased * 0.4 // +0.4 peak intensity boost
        baseIntensity += pulseBoost
      }
      
      underglowRef.current.emissive.set(accentColor)
      underglowRef.current.color.set(accentColor)
      underglowRef.current.emissiveIntensity = baseIntensity
      underglowRef.current.opacity = isHeroPhase ? 0.2 : 0.3
    }

    // Card index tracking removed - Y position adjustment was causing floating issues
    // Card changes are now handled via underglow pulse only (Phase 5)

    // DEBUG: Log car progress through segments
    if (Math.random() < 0.01) {
      console.log('CAR - Segment:', segment.id, 'LocalT:', localT.toFixed(3), 'Distance:', distance.toFixed(1), '/', totalRoadLength.toFixed(1), 'Pos Z:', carRef.current.position.z.toFixed(1))
    }
  })

  return (
    <group ref={carRef} position={[0, 0, 0]}>
      {/* Main Body - Sports Car Shape */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.4, 0.35, 2.8]} />
        <meshStandardMaterial 
          ref={bodyMaterialRef}
          color="#1a1f3a" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#22D3EE"
          emissiveIntensity={0.05}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Cabin/Roof - Lower and sleeker */}
      <mesh position={[0, 0.45, -0.2]} castShadow>
        <boxGeometry args={[1.0, 0.3, 1.4]} />
        <meshStandardMaterial 
          ref={cabinMaterialRef}
          color="#0f1729" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#3B82F6"
          emissiveIntensity={0.03}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Front Spoiler */}
      <mesh position={[0, 0.05, 1.5]}>
        <boxGeometry args={[1.3, 0.1, 0.2]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          metalness={1} 
          roughness={0.1}
          emissive="#22D3EE"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* UPGRADED: Rear Spoiler - Larger and brighter */}
      <mesh position={[0, 0.7, -1.35]}>
        <boxGeometry args={[1.4, 0.1, 0.35]} />
        <meshStandardMaterial 
          color="#8B5CF6" 
          metalness={1} 
          roughness={0.05}
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Spoiler Support Struts */}
      <mesh position={[-0.55, 0.5, -1.35]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial 
          color="#1a1f3a" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.55, 0.5, -1.35]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial 
          color="#1a1f3a" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>

      {/* Front Left Wheel */}
      <group ref={frontLeftWheelRef} position={[-0.65, -0.15, 0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Front Right Wheel */}
      <group ref={frontRightWheelRef} position={[0.65, -0.15, 0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group ref={rearLeftWheelRef} position={[-0.65, -0.15, -0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group ref={rearRightWheelRef} position={[0.65, -0.15, -0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Headlights - Emissive Glow (ALWAYS BRIGHT - Presence Mode) */}
      <mesh position={[0.35, 0.1, 1.42]}>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial 
          ref={(el) => {
            if (el && !headlightRefs.current.includes(el)) {
              headlightRefs.current[0] = el
            }
          }}
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={2.5}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-0.35, 0.1, 1.42]}>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial 
          ref={(el) => {
            if (el && !headlightRefs.current.includes(el)) {
              headlightRefs.current[1] = el
            }
          }}
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={2.5}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Tail Lights */}
      <mesh position={[0.4, 0.15, -1.42]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#EC4899" 
          emissive="#EC4899" 
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[-0.4, 0.15, -1.42]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#EC4899" 
          emissive="#EC4899" 
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Side Accent Lines */}
      <mesh position={[0.72, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.08, 2.2]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[-0.72, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.08, 2.2]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Underglow Effect - Subtle in Hero, stronger in Journey */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 2.8]} />
        <meshStandardMaterial 
          ref={underglowRef}
          color="#22D3EE"
          emissive="#22D3EE"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
})

export default Car
