import { useMemo } from "react"
import * as THREE from "three"

const createSkyTexture = () => {
  const canvas = document.createElement("canvas")
  canvas.width = 2
  canvas.height = 512
  const ctx = canvas.getContext("2d")
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#010205")
    gradient.addColorStop(0.7, "#020712")
    gradient.addColorStop(1, "#083042")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  return canvas
}

export default function Sky({ horizonColor }) {
  const skyTexture = useMemo(() => new THREE.CanvasTexture(createSkyTexture()), [])
  skyTexture.wrapS = THREE.ClampToEdgeWrapping
  skyTexture.wrapT = THREE.ClampToEdgeWrapping
  skyTexture.needsUpdate = true

  return (
    <group>
      <mesh scale={-1}>
        <sphereGeometry args={[700, 32, 32]} />
        <meshBasicMaterial map={skyTexture} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0, 8, -420]}>
        <planeGeometry args={[600, 120]} />
        <meshBasicMaterial
          color={horizonColor}
          transparent
          opacity={0.14}
        />
      </mesh>
    </group>
  )
}
