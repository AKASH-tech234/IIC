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

const createBuildings = ({ count, xRange, zRange, heightRange, scaleRange }) => {
  const buildings = []

  for (let i = 0; i < count; i += 1) {
    buildings.push({
      position: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(xRange),
        0,
        THREE.MathUtils.randFloat(zRange[0], zRange[1])
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

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  const farBuildings = useMemo(
    () =>
      createBuildings({
        count: 32,
        xRange: 160,
        zRange: [-340, -640],
        heightRange: [14, 26],
        scaleRange: [1.6, 3]
      }),
    []
  )

  const midBuildings = useMemo(
    () =>
      createBuildings({
        count: 24,
        xRange: 100,
        zRange: [-160, -320],
        heightRange: [14, 28],
        scaleRange: [1.6, 3.2]
      }),
    []
  )

  const nearBuildings = useMemo(
    () =>
      createBuildings({
        count: 16,
        xRange: 60,
        zRange: [-50, -140],
        heightRange: [12, 20],
        scaleRange: [1.2, 2.2]
      }),
    []
  )

  const farMat = useMemo(() => createMaterial("#020407", 0.04, 0.18), [])
  const midMat = useMemo(() => createMaterial("#0B0F1A", 0.12, 0.42), [])
  const nearMat = useMemo(() => createMaterial("#11131B", 0.08, 0.32), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const density = motionDensity?.current ?? 0

    ;[farRef, midRef, nearRef].forEach((layer, idx) => {
      if (!layer.current) return

      const speed = [0.06, 0.12, 0.18][idx]
      layer.current.position.z = density * speed

      layer.current.children.forEach((child, i) => {
        if (!child.isMesh || !child.material || child.material.emissiveIntensity === undefined) return

        const flicker = Math.sin(t * 0.35 + i * 0.7) * 0.18 + 0.78
        const layerBoost = idx === 0 ? 0.3 : idx === 1 ? 0.55 : 0.75
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
              <mesh position={[building.scale * 0.35, building.height * 0.1, building.scale * 0.55]}>
                <boxGeometry args={[0.14, building.height * neonScale, 0.03]} />
                <meshStandardMaterial
                  color={activeAccent?.current || "#00E5FF"}
                  emissive={activeAccent?.current || "#00E5FF"}
                  emissiveIntensity={0.45}
                  transparent
                  opacity={0.75}
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
      {renderLayer(farRef, farBuildings, farMat, 0, 0.5)}
      {renderLayer(midRef, midBuildings, midMat, 0.12, 0.55)}
      {renderLayer(nearRef, nearBuildings, nearMat, 0.16, 0.65)}
    </>
  )
}
