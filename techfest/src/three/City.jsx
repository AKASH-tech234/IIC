import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"

const createMaterial = (color, emissiveScale, emissiveIntensity) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    metalness: 0.1,
    emissive: new THREE.Color(color).multiplyScalar(emissiveScale),
    emissiveIntensity
  })

const createBuildings = ({ count, xRange, zCenter, zJitter, heightRange, scaleRange }) => {
  const buildings = []

  for (let i = 0; i < count; i += 1) {
    buildings.push({
      position: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(xRange),
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

  const farBuildings = useMemo(
    () =>
      createBuildings({
        count: 32,
        xRange: 160,
        zCenter: -280,
        zJitter: 80,
        heightRange: [14, 26],
        scaleRange: [1.6, 3]
      }).filter(b => Math.abs(b.position.x) > 20), // Keep buildings away from road
    []
  )

  const midBuildings = useMemo(
    () =>
      createBuildings({
        count: 24,
        xRange: 120,
        zCenter: -160,
        zJitter: 80,
        heightRange: [14, 28],
        scaleRange: [1.6, 3.2]
      }).filter(b => Math.abs(b.position.x) > 18), // Keep buildings away from road AND curve
    []
  )

  const nearBuildings = useMemo(
    () =>
      createBuildings({
        count: 16,
        xRange: 80,
        zCenter: -65,
        zJitter: 50,
        heightRange: [12, 20],
        scaleRange: [1.2, 2.2]
      }).filter(b => Math.abs(b.position.x) > 15), // Keep buildings away from road
    []
  )

  const farMat = useMemo(() => createMaterial("#3366FF", 0.5, 1.5), [])
  const midMat = useMemo(() => createMaterial("#00CCFF", 0.8, 2.0), [])
  const nearMat = useMemo(() => createMaterial("#00FFFF", 1.0, 3.0), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const density = motionDensity?.current ?? 0

    const layerNames = ['FAR', 'MID', 'NEAR']
    ;[farRef, midRef, nearRef].forEach((layer, idx) => {
      if (!layer.current) return

      // Log first frame with actual building positions
      if (t < 0.1 && layer.current.children.length > 0) {
        const firstBuilding = layer.current.children[0]
        console.log(`${layerNames[idx]} layer: ${layer.current.children.length} buildings at Z: ${firstBuilding.position.z.toFixed(1)}`)
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
    </>
  )
}
