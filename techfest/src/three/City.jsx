import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

/**
 * City Component
 * 
 * Simple box buildings along road sides
 * Moves slower than road: z = scrollProgress * 40
 */
export default function City({ scrollProgress }) {
  const cityRef = useRef()

  useFrame(() => {
    if (!cityRef.current) return
    
    const progress = scrollProgress.current || 0
    
    // Move city backward (slower than road for parallax)
    cityRef.current.position.z = progress * 40
  })

  // Building positions (left and right of road)
  const buildings = [
    // Left side
    { x: -4, y: 1.5, z: -10, height: 3, color: "#05010F" },
    { x: -4.5, y: 2.5, z: -25, height: 5, color: "#0A0520" },
    { x: -3.5, y: 1, z: -40, height: 2, color: "#05010F" },
    { x: -4, y: 3, z: -60, height: 6, color: "#0A0520" },
    { x: -3.8, y: 1.8, z: -80, height: 3.6, color: "#05010F" },
    
    // Right side
    { x: 4, y: 2, z: -15, height: 4, color: "#0A0520" },
    { x: 4.5, y: 1.2, z: -30, height: 2.4, color: "#05010F" },
    { x: 3.5, y: 2.8, z: -50, height: 5.6, color: "#0A0520" },
    { x: 4.2, y: 1.5, z: -70, height: 3, color: "#05010F" },
    { x: 4, y: 2.5, z: -90, height: 5, color: "#0A0520" },
  ]

  return (
    <group ref={cityRef}>
      {buildings.map((building, i) => (
        <mesh 
          key={i}
          position={[building.x, building.y, building.z]}
        >
          <boxGeometry args={[1, building.height, 1.5]} />
          <meshStandardMaterial 
            color={building.color}
            emissive="#8B5CF6"
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}
