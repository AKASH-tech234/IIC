import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { BRAND_COLORS } from "../styles/identity.tokens"

/**
 * Ground Plane - Mandatory depth reference with Tron elements
 */
export default function Ground({ 
  activePhase, 
  scrollProgress,
  // Phase 5: UI ↔ World coupling signals
  sectionPulse
}) {
  const transitStripRef = useRef()
  
  // Phase 5: Ripple pulse tracking
  const ripplePulseStartTimeRef = useRef(0)
  const lastRippleSectionRef = useRef(null)
  
  useFrame(({ clock }) => {
    if (!transitStripRef.current) return
    const phase = activePhase?.current || "HERO"
    const progress = scrollProgress?.current || 0
    const now = clock.elapsedTime
    
    // ===== PHASE 5: RIPPLE PULSE DETECTION =====
    // Detect new section pulse and start ripple animation
    if (sectionPulse?.current && sectionPulse.current !== lastRippleSectionRef.current) {
      ripplePulseStartTimeRef.current = now
      lastRippleSectionRef.current = sectionPulse.current
      // Note: Don't reset sectionPulse here, let Road.jsx consume it
    }
    
    // ===== PHASE 9: CONTRAST TUNING - Ground > Road hierarchy =====
    // MOMENT OF ARRIVAL - Ground strip activates on first scroll
    let targetIntensity
    if (progress < 0.05) {
      // Ramp up from 0 to base during first 5% scroll
      targetIntensity = (progress / 0.05) * 0.12 // Increased from 0.08 to 0.12
    } else if (phase === "EVENTS_SIDE_PROFILE") {
      targetIntensity = 0.20 // Increased from 0.18 to 0.20
    } else if (phase === "FORWARD_CONTENT") {
      targetIntensity = 0.14 // Increased from 0.10 to 0.14
    } else {
      targetIntensity = 0.12 // Increased from 0.08 to 0.12 (ground brighter than road)
    }
    
    // ===== PHASE 5: GROUND STRIP RIPPLE (120ms outward expansion) =====
    const timeSinceRipple = (now - ripplePulseStartTimeRef.current) * 1000 // Convert to ms
    if (timeSinceRipple < 120) {
      // Ripple effect: expanding wave of intensity
      const t = timeSinceRipple / 120
      const eased = Math.sin(t * Math.PI) // Smooth pulse in/out
      // Add intensity boost that feels like a ripple expanding outward
      const rippleBoost = eased * 0.12 // Peak +0.12 intensity
      targetIntensity += rippleBoost
    }
    
    transitStripRef.current.emissiveIntensity += (targetIntensity - transitStripRef.current.emissiveIntensity) * 0.1
  })
  // Light panels positions - extended to Z: -1200
  const panels = useMemo(() => {
    const arr = []
    for (let i = 0; i < 60; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 300,
        z: -Math.random() * 1180 - 20,
        width: Math.random() * 8 + 4,
        height: Math.random() * 8 + 4
      })
    }
    return arr
  }, [])

  // Low pylons - extended to Z: -1200
  const pylons = useMemo(() => {
    const arr = []
    for (let i = 0; i < 30; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 200,
        z: -Math.random() * 1150 - 30,
        height: Math.random() * 0.4 + 0.4
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* PHASE 8: Ground materials from identity tokens */}
      {/* Main ground plane - extended to cover entire road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -600]}>
        <planeGeometry args={[2000, 2400]} />
        <meshStandardMaterial
          color={BRAND_COLORS.semantic.ground}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Tron Transit Ground Layer - road corridor strip with spotlight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, -600]}>
        <planeGeometry args={[140, 2400]} />
        <meshStandardMaterial
          ref={transitStripRef}
          color={BRAND_COLORS.semantic.groundStrip}
          roughness={0.88}
          metalness={0.12}
          emissive={BRAND_COLORS.semantic.groundStrip}
          emissiveIntensity={0.10} /* PHASE 9: Increased from 0.08 to 0.10 */
        />
      </mesh>

      {/* Light panels */}
      {panels.map((panel, i) => (
        <mesh key={`panel-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[panel.x, -0.04, panel.z]}>
          <planeGeometry args={[panel.width, panel.height]} />
          <meshBasicMaterial
            color={BRAND_COLORS.semantic.city}
            transparent
            opacity={0.25} /* PHASE 9: Reduced from 0.35 to 0.25 (less light panel distraction) */
          />
        </mesh>
      ))}

      {/* Low pylons */}
      {pylons.map((pylon, i) => (
        <mesh key={`pylon-${i}`} position={[pylon.x, pylon.height / 2 - 0.05, pylon.z]}>
          <boxGeometry args={[0.4, pylon.height, 0.4]} />
          <meshStandardMaterial
            color={BRAND_COLORS.semantic.city}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Directional lines - extended along road */}
      {[...Array(30)].map((_, i) => (
        <mesh 
          key={`line-${i}`} 
          rotation={[-Math.PI / 2, 0, Math.PI / 6]} 
          position={[(i - 15) * 30, -0.045, -100 - i * 30]}
        >
          <planeGeometry args={[0.3, 100]} />
          <meshBasicMaterial
            color={BRAND_COLORS.semantic.groundStrip}
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}
