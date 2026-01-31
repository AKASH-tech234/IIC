import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { masterRoadCurve } from "./curveUtils"

const createMaterial = (color, emissiveScale, emissiveIntensity, roughness = 0.9, metalness = 0.1) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive: new THREE.Color(color).multiplyScalar(emissiveScale),
    emissiveIntensity
  })

const ROAD_CLEAR_WIDTH = 55 // Keep buildings away from road corridor (prevents collision at curve apex X:40)

const createBuildings = ({ count, xRange, zCenter, zJitter, heightRange, scaleRange }) => {
  const buildings = []

  for (let i = 0; i < count; i += 1) {
    const x = THREE.MathUtils.randFloatSpread(xRange)
    
    // Skip if too close to road
    if (Math.abs(x) < ROAD_CLEAR_WIDTH) continue
    
    buildings.push({
      position: new THREE.Vector3(
        x,
        0,
        zCenter + THREE.MathUtils.randFloatSpread(zJitter)
      ),
      height: THREE.MathUtils.randFloat(...heightRange),
      scale: THREE.MathUtils.randFloat(...scaleRange),
      seed: Math.random() * 100
    })
  }

  return buildings
}

export default function City({ motionDensity, activeAccent, activePhase }) {
  const farRef = useRef()
  const midRef = useRef()
  const nearRef = useRef()
  
  console.log('City component mounted')

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  // City bands along the entire road - extended to Z: -1200
  const CITY_BANDS = [-80, -220, -380, -540, -700, -860, -1020]
  
  const farBuildings = useMemo(() => {
    const allBuildings = []
    CITY_BANDS.forEach(bandZ => {
      const bandBuildings = createBuildings({
        count: 28,
        xRange: 160,
        zCenter: bandZ - 80,
        zJitter: 60,
        heightRange: [14, 26],
        scaleRange: [1.6, 3]
      })
      allBuildings.push(...bandBuildings)
    })
    return allBuildings
  }, [])

  const midBuildings = useMemo(() => {
    const allBuildings = []
    CITY_BANDS.forEach(bandZ => {
      const bandBuildings = createBuildings({
        count: 20,
        xRange: 120,
        zCenter: bandZ,
        zJitter: 60,
        heightRange: [14, 28],
        scaleRange: [1.6, 3.2]
      })
      allBuildings.push(...bandBuildings)
    })
    return allBuildings
  }, [])

  const nearBuildings = useMemo(() => {
    const allBuildings = []
    CITY_BANDS.forEach(bandZ => {
      const bandBuildings = createBuildings({
        count: 14,
        xRange: 80,
        zCenter: bandZ + 40,
        zJitter: 50,
        heightRange: [12, 20],
        scaleRange: [1.2, 2.2]
      })
      allBuildings.push(...bandBuildings)
    })
    return allBuildings
  }, [])

  // Layered depth with procedural roughness variation
  const farMat = useMemo(() => createMaterial("#121B3A", 0, 0, 0.95, 0.05), []) // Flattest
  const midMat = useMemo(() => createMaterial("#1A2550", 0.08, 0.35, 0.9, 0.1), []) // Medium
  const nearMat = useMemo(() => createMaterial("#24347A", 0.1, 0.3, 0.85, 0.15), []) // Most detail
  
  // Roadside pylons that FOLLOW the road curve
  const pylons = useMemo(() => {
    const pylonArray = []
    const curveLength = masterRoadCurve.getLength()
    const spacing = 25
    const numPylons = Math.floor(curveLength / spacing)
    
    for (let i = 1; i < numPylons; i++) {
      const t = i / numPylons
      const point = masterRoadCurve.getPointAt(t)
      const tangent = masterRoadCurve.getTangentAt(t)
      
      // Get perpendicular offset (left and right of road)
      const perpendicular = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      const offset = 5.8
      
      pylonArray.push(
        { 
          position: point.clone().add(perpendicular.clone().multiplyScalar(offset)),
          height: THREE.MathUtils.randFloat(1.8, 2.4)
        },
        { 
          position: point.clone().add(perpendicular.clone().multiplyScalar(-offset)),
          height: THREE.MathUtils.randFloat(1.8, 2.4)
        }
      )
    }
    return pylonArray
  }, [])

  // Antenna spires for scale reference
  const antennaSpires = useMemo(() => {
    const spires = []
    const positions = [
      { x: -90, z: -180, height: 42 },
      { x: 110, z: -320, height: 38 },
      { x: -70, z: -480, height: 45 },
      { x: 95, z: -640, height: 40 },
      { x: -85, z: -820, height: 43 },
      { x: 105, z: -980, height: 41 }
    ]
    return positions
  }, [])

  // Horizontal skybridges
  const skybridges = useMemo(() => {
    return [
      { x1: -80, z: -250, x2: -40, height: 18 },
      { x1: 60, z: -420, x2: 95, height: 20 },
      { x1: -70, z: -710, x2: -35, height: 19 }
    ]
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const density = motionDensity?.current ?? 0

    const layerNames = ['FAR', 'MID', 'NEAR']
    const phase = activePhase?.current || "HERO"
    const isEventsHold = phase === "EVENTS_SIDE_PROFILE"
    
    ;[farRef, midRef, nearRef].forEach((layer, idx) => {
      if (!layer.current) return

      // Log first frame with actual building positions
      if (t < 0.1 && layer.current.children.length > 0) {
        console.log(`${layerNames[idx]} layer: ${layer.current.children.length} buildings (segmented bands)`)
      }

      // Relative motion during EVENTS hold - MID layer drifts, others frozen
      let speed
      if (isEventsHold) {
        speed = idx === 1 ? 0.02 : 0 // Only MID layer moves at 2%
      } else {
        speed = [0, 0.04, 0.06][idx] // Normal speeds
      }
      layer.current.position.z = density * speed

      layer.current.children.forEach((child, i) => {
        if (!child.isMesh || !child.material || child.material.emissiveIntensity === undefined) return

        // Layered depth with spotlight effect
        if (idx === 0) {
          // FAR layer - no emissive (silhouette)
          child.material.emissiveIntensity = 0
        } else {
          const flicker = Math.sin(t * 0.35 + i * 0.7) * 0.15 + 0.82
          // MID layer gets boost during EVENTS, keep visibility
          const layerBoost = idx === 1 ? (isEventsHold ? 0.45 : 0.35) : 0.3
          child.material.emissiveIntensity = flicker * layerBoost
        }
      })
    })
  })

  const renderLayer = (ref, buildings, material, neonRatio, neonScale) => (
    <group ref={ref}>
      {buildings.map((building, i) => {
        const hasNeon = Math.random() < neonRatio
        return (
          <group key={i} position={[building.position.x, building.height / 2, building.position.z]}>
            <mesh geometry={geometry} material={material} scale={[building.scale, building.height, building.scale]} />
            {hasNeon && (
              <mesh position={[building.scale * 0.5, 0, 0]}>
                <boxGeometry args={[0.04, building.height * neonScale, 0.04]} />
                <meshStandardMaterial
                  color={activeAccent?.current || "#00E5FF"}
                  emissive={activeAccent?.current || "#00E5FF"}
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )

  return (
    <>
      {renderLayer(farRef, farBuildings, farMat, 0, 0)}
      {renderLayer(midRef, midBuildings, midMat, 0, 0)}
      {renderLayer(nearRef, nearBuildings, nearMat, 0.2, 0.7)}
      
      {/* Roadside pylons that follow curve */}
      {pylons.map((pylon, i) => (
        <mesh key={`pylon-${i}`} position={[pylon.position.x, pylon.height / 2, pylon.position.z]}>
          <boxGeometry args={[0.15, pylon.height, 0.15]} />
          <meshStandardMaterial
            color={activeAccent?.current || "#00E5FF"}
            emissive={activeAccent?.current || "#00E5FF"}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Antenna spires for scale */}
      {antennaSpires.map((spire, i) => (
        <mesh key={`spire-${i}`} position={[spire.x, spire.height / 2, spire.z]}>
          <cylinderGeometry args={[0.12, 0.18, spire.height, 8]} />
          <meshStandardMaterial
            color="#1A2550"
            emissive="#1A2550"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* Horizontal skybridges */}
      {skybridges.map((bridge, i) => {
        const width = Math.abs(bridge.x2 - bridge.x1)
        const centerX = (bridge.x1 + bridge.x2) / 2
        return (
          <mesh key={`bridge-${i}`} position={[centerX, bridge.height, bridge.z]}>
            <boxGeometry args={[width, 0.3, 1.5]} />
            <meshStandardMaterial
              color="#1A2550"
              emissive="#1A2550"
              emissiveIntensity={0.2}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      })}
    </>
  )
}
