import { useEffect, useState } from "react"

/**
 * Lighting Setup
 * 
 * - Ambient: Base illumination
 * - Directional: Main shape definition (purple neon)
 * - Rim: Car outline highlight (syncs with accent color)
 */
export default function Lights() {
  const [accentColor, setAccentColor] = useState("#7C3AED")

  useEffect(() => {
    // Listen for accent color changes from CSS variable
    const updateAccentColor = () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color")
        .trim()
      if (color) setAccentColor(color)
    }

    // Initial update
    updateAccentColor()

    // Update on interval (CSS var changes)
    const interval = setInterval(updateAccentColor, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Ambient Light - Base */}
      <ambientLight intensity={0.4} />

      {/* Directional Light - Main (Purple City Glow) */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#8B5CF6"
      />

      {/* Rim Light - Car Outline (Accent Color) */}
      <pointLight
        position={[-3, 2, 2]}
        intensity={1.2}
        color={accentColor}
      />
    </>
  )
}
