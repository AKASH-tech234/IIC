import * as THREE from "three"
import { useEffect, useMemo, useRef } from "react"
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
  const groundSegmentRefs = useRef([])

  // Phase 5: Ripple pulse tracking
  const ripplePulseStartTimeRef = useRef(0)
  const lastRippleSectionRef = useRef(null)

  const groundGeometry = useMemo(() => new THREE.PlaneGeometry(2000, 1), [])
  const groundSegments = useMemo(
    () => [
      {
        key: "near",
        position: [0, -0.05, -200],
        length: 404,
        colorMultiplier: 1.0,
        roughness: 0.85,
        metalness: 0.12,
        emissiveIntensity: 0.03
      },
      {
        key: "mid",
        position: [0, -0.05, -600],
        length: 504,
        colorMultiplier: 0.94,
        roughness: 0.9,
        metalness: 0.12,
        emissiveIntensity: 0.02
      },
      {
        key: "far",
        position: [0, -0.05, -1000],
        length: 604,
        colorMultiplier: 0.88,
        roughness: 0.95,
        metalness: 0.12,
        emissiveIntensity: 0.01
      }
    ],
    []
  )

  const groundMaterials = useMemo(() => {
    const baseColor = new THREE.Color(BRAND_COLORS.semantic.ground)
    return groundSegments.map(segment => {
      const color = baseColor.clone().multiplyScalar(segment.colorMultiplier)
      return new THREE.MeshStandardMaterial({
        color,
        roughness: segment.roughness,
        metalness: segment.metalness,
        emissive: color,
        emissiveIntensity: segment.emissiveIntensity
      })
    })
  }, [groundSegments])

  const contactMaterials = useMemo(() => {
    const baseColor = new THREE.Color(BRAND_COLORS.semantic.ground)
    return {
      near: new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.75,
        metalness: 0.08,
        emissive: baseColor,
        emissiveIntensity: 0.02
      }),
      far: new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.9,
        metalness: 0.02,
        emissive: baseColor,
        emissiveIntensity: 0
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      groundGeometry.dispose()
      groundMaterials.forEach(material => material.dispose())
      contactMaterials.near.dispose()
      contactMaterials.far.dispose()
    }
  }, [groundGeometry, groundMaterials, contactMaterials])

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

    const phaseMultiplier = phase === "EVENTS_SIDE_PROFILE" ? 1.15 : phase === "FINAL" ? 1.25 : 1.0
    groundSegmentRefs.current.forEach((material, index) => {
      if (!material) return
      const baseIntensity = groundSegments[index]?.emissiveIntensity ?? 0.0
      const targetSegmentIntensity = baseIntensity * phaseMultiplier
      material.emissiveIntensity += (targetSegmentIntensity - material.emissiveIntensity) * 0.1
    })
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
      {/* Segmented ground plane - extended to cover entire road */}
      {groundSegments.map((segment, index) => (
        <mesh
          key={`ground-${segment.key}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={segment.position}
          scale={[1, segment.length, 1]}
        >
          <primitive object={groundGeometry} attach="geometry" />
          <primitive
            object={groundMaterials[index]}
            attach="material"
            ref={el => {
              groundSegmentRefs.current[index] = el
            }}
          />
        </mesh>
      ))}

      {/* T2.1: Road-adjacent ground contact strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, -600]}>
        <planeGeometry args={[18, 2400]} />
        <primitive object={contactMaterials.near} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.071, -600]}>
        <planeGeometry args={[28, 2400]} />
        <primitive object={contactMaterials.far} attach="material" />
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
