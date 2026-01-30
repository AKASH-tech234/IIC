import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

/**
 * City Component
 * 
 * Simple box buildings along road sides
 * Moves slower than road: z = scrollProgress * 40
 */
export default function City({ scrollProgress, motionDensity, activePhase }) {
  const nearRef = useRef()
  const midRef = useRef()
  const farRef = useRef()

  useFrame(() => {
    const progress = scrollProgress.current || 0
    const density = motionDensity.current || 0
    const phase = activePhase?.current || "HERO"
    const eventMultiplier = phase === "EVENTS_SIDE_PROFILE" ? 0.2 : 1
    const turnMultiplier = phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD" ? 0.4 : 1

    if (nearRef.current) {
      nearRef.current.position.z = progress * (50 + density * 15) * eventMultiplier * turnMultiplier
      nearRef.current.scale.set(
        phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD" ? 1.15 : 1,
        phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD" ? 0.9 : 1,
        1
      )
    }
    if (midRef.current) {
      midRef.current.position.z = progress * (35 + density * 10) * eventMultiplier * turnMultiplier
    }
    if (farRef.current) {
      farRef.current.position.z = progress * (20 + density * 6) * eventMultiplier * turnMultiplier
    }
  })

  const nearBuildings = [
    { x: -4.2, y: 1.2, z: -10, height: 3, width: 1.1, depth: 1.8 },
    { x: -4.5, y: 2.2, z: -25, height: 4.8, width: 1.2, depth: 1.6 },
    { x: -3.6, y: 1.6, z: -40, height: 3.4, width: 1, depth: 1.7 },
    { x: -4.1, y: 2.8, z: -60, height: 5.6, width: 1.2, depth: 1.9 },
    { x: -3.7, y: 2, z: -80, height: 4, width: 1.1, depth: 1.6 },
    { x: -4.4, y: 1.8, z: -100, height: 3.6, width: 1, depth: 1.5 },
    { x: 4.1, y: 1.8, z: -15, height: 4, width: 1.1, depth: 1.7 },
    { x: 4.6, y: 1.1, z: -30, height: 2.6, width: 1.1, depth: 1.6 },
    { x: 3.6, y: 2.6, z: -50, height: 5.2, width: 1.2, depth: 1.8 },
    { x: 4.3, y: 1.4, z: -70, height: 3.1, width: 1, depth: 1.5 },
    { x: 4.2, y: 2.3, z: -90, height: 4.6, width: 1.1, depth: 1.7 },
    { x: 3.8, y: 2.1, z: -110, height: 4.2, width: 1, depth: 1.6 }
  ]

  const midBuildings = [
    { x: -6.2, y: 2.8, z: -20, height: 6, width: 1.8, depth: 2.2 },
    { x: -6.8, y: 3.4, z: -55, height: 7.2, width: 2, depth: 2.5 },
    { x: -5.8, y: 2.4, z: -80, height: 5.4, width: 1.6, depth: 2.1 },
    { x: -6.4, y: 3.8, z: -115, height: 7.8, width: 2.2, depth: 2.6 },
    { x: 6.1, y: 2.6, z: -35, height: 5.8, width: 1.8, depth: 2.2 },
    { x: 6.7, y: 3.2, z: -70, height: 6.8, width: 2.1, depth: 2.4 },
    { x: 5.9, y: 2.6, z: -100, height: 6.2, width: 1.7, depth: 2.1 },
    { x: 6.3, y: 3.9, z: -130, height: 8.2, width: 2.2, depth: 2.6 }
  ]

  const farBuildings = [
    { x: -9, y: 3.5, z: -40, height: 8, width: 2.5, depth: 3.2 },
    { x: -9.5, y: 4.2, z: -90, height: 9.2, width: 2.8, depth: 3.4 },
    { x: -8.6, y: 3.2, z: -130, height: 7.4, width: 2.4, depth: 3 },
    { x: 8.8, y: 3.6, z: -60, height: 8.4, width: 2.6, depth: 3.3 },
    { x: 9.4, y: 4.1, z: -110, height: 9, width: 2.7, depth: 3.5 },
    { x: 8.5, y: 3.3, z: -150, height: 7.8, width: 2.5, depth: 3.1 }
  ]

  const renderBuildings = (buildings, palette, flickerOffset = 0) => (
    buildings.map((building, i) => (
      <group key={`${palette.base}-${i}`} position={[building.x, building.y, building.z]}>
        <mesh>
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial 
            color={palette.base}
            emissive={palette.emissive}
            emissiveIntensity={palette.intensity}
          />
        </mesh>
        {/* Neon vertical strip */}
        <mesh position={[0, building.height * 0.2, building.depth * 0.51]}>
          <boxGeometry args={[building.width * 0.1, building.height * 0.6, 0.02]} />
          <meshStandardMaterial 
            color={palette.neon}
            emissive={palette.neon}
            emissiveIntensity={palette.neonIntensity}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Window glow */}
        <mesh position={[building.width * 0.2, building.height * 0.05, building.depth * 0.51]}>
          <boxGeometry args={[building.width * 0.4, building.height * 0.3, 0.02]} />
          <meshStandardMaterial 
            color={palette.window}
            emissive={palette.window}
            emissiveIntensity={palette.windowIntensity + Math.sin((i + flickerOffset) * 1.5) * 0.1}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    ))
  )

  return (
    <group>
      <group ref={farRef}>
        {renderBuildings(farBuildings, {
          base: "#03050C",
          emissive: "#1A2338",
          intensity: 0.15,
          neon: "#3B82F6",
          neonIntensity: 0.5,
          window: "#9CA3AF",
          windowIntensity: 0.2
        }, 1)}
      </group>
      <group ref={midRef}>
        {renderBuildings(midBuildings, {
          base: "#050914",
          emissive: "#1F2A44",
          intensity: 0.2,
          neon: "#8B5CF6",
          neonIntensity: 0.6,
          window: "#CBD5F5",
          windowIntensity: 0.25
        }, 3)}
      </group>
      <group ref={nearRef}>
        {renderBuildings(nearBuildings, {
          base: "#070D1A",
          emissive: "#283552",
          intensity: 0.25,
          neon: "#00E5FF",
          neonIntensity: 0.7,
          window: "#E2E8F0",
          windowIntensity: 0.3
        }, 5)}
      </group>
    </group>
  )
}
