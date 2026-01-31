import { useMemo } from "react"
import * as THREE from "three"

const createSkyTexture = () => {
  const canvas = document.createElement("canvas")
  canvas.width = 2
  canvas.height = 512
  const ctx = canvas.getContext("2d")
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#000033")
    gradient.addColorStop(0.5, "#001166")
    gradient.addColorStop(1, "#0033CC")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  return canvas
}

export default function Sky({ horizonColor }) {
  const skyTexture = useMemo(() => {
    const texture = new THREE.CanvasTexture(createSkyTexture())
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [])

  console.log('Sky component mounted')

  return (
    <group renderOrder={-1000}>
      {/* Main sky dome with gradient */}
      <mesh scale={500}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          side={THREE.BackSide}
          color="#070B14"
        />
      </mesh>
      
      {/* Gradient texture overlay */}
      <mesh scale={-1}>
        <sphereGeometry args={[700, 32, 32]} />
        <meshBasicMaterial map={skyTexture} side={THREE.BackSide} transparent opacity={0.8} />
      </mesh>
      
      {/* Skyline cutout - creates silhouette separation */}
      <mesh position={[0, 10, -380]}>
        <planeGeometry args={[2000, 120]} />
        <meshBasicMaterial
          color="#03050A"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      
      {/* Horizon glow band */}
      <mesh position={[0, 8, -420]}>
        <planeGeometry args={[600, 140]} />
        <meshBasicMaterial
          color={horizonColor}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}
