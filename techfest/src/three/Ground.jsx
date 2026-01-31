import * as THREE from "three"
import { useMemo } from "react"

/**
 * Ground Plane - Mandatory depth reference with Tron elements
 */
export default function Ground() {
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
      {/* Main ground plane - extended to cover entire road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -600]}>
        <planeGeometry args={[2000, 2400]} />
        <meshStandardMaterial
          color="#02030A"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Tron Transit Ground Layer - road corridor strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, -600]}>
        <planeGeometry args={[140, 2400]} />
        <meshStandardMaterial
          color="#0A1420"
          roughness={0.9}
          metalness={0.1}
          emissive="#0A1420"
          emissiveIntensity={0.08}
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

      {/* Directional lines - extended along road */}
      {[...Array(30)].map((_, i) => (
        <mesh 
          key={`line-${i}`} 
          rotation={[-Math.PI / 2, 0, Math.PI / 6]} 
          position={[(i - 15) * 30, -0.045, -100 - i * 30]}
        >
          <planeGeometry args={[0.3, 100]} />
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
