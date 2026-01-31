import * as THREE from "three"
import { useMemo } from "react"

/**
 * Ground Plane - Mandatory depth reference with Tron elements
 */
export default function Ground() {
  // Light panels positions
  const panels = useMemo(() => {
    const arr = []
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 300,
        z: -Math.random() * 400 - 20,
        width: Math.random() * 8 + 4,
        height: Math.random() * 8 + 4
      })
    }
    return arr
  }, [])

  // Low pylons
  const pylons = useMemo(() => {
    const arr = []
    for (let i = 0; i < 20; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 200,
        z: -Math.random() * 350 - 30,
        height: Math.random() * 0.4 + 0.4
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -200]}>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial
          color="#02030A"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Light panels */}
      {panels.map((panel, i) => (
        <mesh key={`panel-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[panel.x, -0.04, panel.z]}>
          <planeGeometry args={[panel.width, panel.height]} />
          <meshBasicMaterial
            color="#0B2A3A"
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}

      {/* Low pylons */}
      {pylons.map((pylon, i) => (
        <mesh key={`pylon-${i}`} position={[pylon.x, pylon.height / 2 - 0.05, pylon.z]}>
          <boxGeometry args={[0.4, pylon.height, 0.4]} />
          <meshStandardMaterial
            color="#08131E"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Directional lines */}
      {[...Array(15)].map((_, i) => (
        <mesh 
          key={`line-${i}`} 
          rotation={[-Math.PI / 2, 0, Math.PI / 6]} 
          position={[(i - 7) * 30, -0.045, -150 - i * 15]}
        >
          <planeGeometry args={[0.3, 80]} />
          <meshBasicMaterial
            color="#0A1420"
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}
