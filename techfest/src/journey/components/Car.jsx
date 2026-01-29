import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Car Component
 * 
 * Stays fixed at bottom-center of viewport.
 * Subtle motion effects only - not cartoonish.
 * 
 * Motion:
 * - Idle vibration (very subtle)
 * - Light glow pulse
 * - Optional speed effect trigger
 */
export default function Car() {
  const carRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Idle subtle vibration
      gsap.to(carRef.current, {
        y: 2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Light glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.1,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

    }, carRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      id="car"
      className="fixed bottom-[10vh] md:bottom-[10vh] left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{ willChange: "transform" }}
    >
      {/* Glow effect behind car */}
      <div 
        ref={glowRef}
        className="absolute inset-0 -m-8 rounded-full opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)",
          filter: "blur(20px)"
        }}
      />

      {/* Car body */}
      <div ref={carRef} className="relative scale-75 md:scale-100">
        <svg 
          width="120" 
          height="60" 
          viewBox="0 0 120 60" 
          className="drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}
        >
          {/* Car silhouette - modern, minimal, sleek */}
          
          {/* Body */}
          <path
            d="M 20 45 L 10 40 L 10 30 L 20 25 L 35 25 L 40 15 L 70 15 L 80 25 L 100 25 L 110 30 L 110 40 L 100 45 Z"
            fill="url(#carGradient)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          
          {/* Windshield */}
          <path
            d="M 42 18 L 45 25 L 68 25 L 68 18 Z"
            fill="rgba(56,189,248,0.3)"
            stroke="rgba(56,189,248,0.5)"
            strokeWidth="1"
          />

          {/* Wheels */}
          <circle cx="30" cy="45" r="8" fill="#1a1a1a" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="30" cy="45" r="5" fill="rgba(100,100,100,0.8)" />
          
          <circle cx="90" cy="45" r="8" fill="#1a1a1a" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="90" cy="45" r="5" fill="rgba(100,100,100,0.8)" />

          {/* Headlight glow */}
          <circle cx="105" cy="35" r="3" fill="rgba(255,255,255,0.9)" opacity="0.8">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Gradient definition */}
          <defs>
            <linearGradient id="carGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.8)" />
              <stop offset="100%" stopColor="rgba(30,100,150,0.9)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Speed lines effect (hidden by default, triggered by GSAP) */}
        <div 
          id="speed-lines"
          className="absolute right-full top-1/2 -translate-y-1/2 w-20 h-[2px] opacity-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyan-400 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyan-400 opacity-40 translate-y-2" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyan-400 opacity-40 -translate-y-2" />
        </div>
      </div>
    </div>
  )
}
