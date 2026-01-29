import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SportsCar from "./SportsCar"

gsap.registerPlugin(ScrollTrigger)

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
      // CRITICAL: Car horizontal movement tied to scroll
      gsap.to(carRef.current, {
        x: 40, // subtle forward movement
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      })

      // Idle subtle vibration (on inner car, not container)
      const carInner = carRef.current.querySelector(".car-inner")
      if (carInner) {
        gsap.to(carInner, {
          y: 2,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        })
      }

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
      ref={carRef}
      id="car"
      className="fixed bottom-[10vh] md:bottom-[10vh] left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{ willChange: "transform" }}
    >
      {/* Neon Underglow */}
      <div 
        ref={glowRef}
        id="car-underglow"
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[140%] h-4 opacity-80"
        style={{
          background: "radial-gradient(ellipse, var(--accent-color) 0%, transparent 70%)",
          filter: "blur(12px)"
        }}
      />

      {/* Car body - Sports Car Component */}
      <div className="car-inner relative scale-75 md:scale-100">
        <SportsCar />

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
