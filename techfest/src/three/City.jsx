import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { masterRoadCurve } from "./curveUtils"

const createMaterial = (color, emissiveScale, emissiveIntensity) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    metalness: 0.1,
    emissive: new THREE.Color(color).multiplyScalar(emissiveScale),
    emissiveIntensity
  })

const ROAD_CLEAR_WIDTH = 45 // Keep buildings away from road corridor (extra wide for curves)

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

export default function City({ motionDensity, activeAccent }) {
  const farRef = useRef()
  const midRef = useRef()
  const nearRef = useRef()
  
  console.log('City component mounted')

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  // City bands along the entire road
  const CITY_BANDS = [-80, -220, -380, -540]
  
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

  const farMat = useMemo(() => createMaterial("#3366FF", 0.5, 1.5), [])
  const midMat = useMemo(() => createMaterial("#00CCFF", 0.8, 2.0), [])
  const nearMat = useMemo(() => createMaterial("#00FFFF", 1.0, 3.0), [])
  
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

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const density = motionDensity?.current ?? 0

    const layerNames = ['FAR', 'MID', 'NEAR']
    ;[farRef, midRef, nearRef].forEach((layer, idx) => {
      if (!layer.current) return

      // Log first frame with actual building positions
      if (t < 0.1 && layer.current.children.length > 0) {
        console.log(`${layerNames[idx]} layer: ${layer.current.children.length} buildings (segmented bands)`)
      }

      // Reduce drift multiplier for calmer motion
      const speed = [0, 0.04, 0.06][idx]
      layer.current.position.z = density * speed

      layer.current.children.forEach((child, i) => {
        if (!child.isMesh || !child.material || child.material.emissiveIntensity === undefined) return

        // MAX VISIBILITY - ALL LAYERS BRIGHT
        const flicker = Math.sin(t * 0.5 + i * 0.8) * 0.3 + 0.7
        const layerBoost = [1.5, 2.0, 3.0][idx]
        child.material.emissiveIntensity = flicker * layerBoost
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
    </>
  )
}
