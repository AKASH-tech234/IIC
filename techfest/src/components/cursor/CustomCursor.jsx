import { useEffect, useRef } from "react"
import gsap from "gsap"
import "./cursor.css"

/**
 * Custom Cursor - HUD Style
 * 
 * Features:
 * - Dual layer (inner dot + outer ring)
 * - Syncs with section accent color
 * - Click energy pulse effect
 * - Hover enhancements
 * - Disabled on touch devices
 */
export default function CustomCursor() {
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    const cursorDot = cursorDotRef.current
    const cursorRing = cursorRingRef.current

    // Mouse move handler
    const moveCursor = (e) => {
      // Fast dot
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      })

      // Slower ring (cinematic lag)
      gsap.to(cursorRing, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out"
      })
    }

    // Click effect - Energy pulse
    const clickEffect = (e) => {
      const pulse = document.createElement("div")
      pulse.className = "click-pulse"
      pulse.style.left = `${e.clientX}px`
      pulse.style.top = `${e.clientY}px`
      document.body.appendChild(pulse)

      gsap.fromTo(
        pulse,
        { scale: 0, opacity: 0.6 },
        {
          scale: 2,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => pulse.remove()
        }
      )
    }

    // Hover effect on interactive elements
    const handleMouseEnter = () => {
      gsap.to(cursorRing, {
        scale: 1.5,
        duration: 0.3,
        ease: "back.out(1.5)"
      })
    }

    const handleMouseLeave = () => {
      gsap.to(cursorRing, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    // Attach listeners
    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("click", clickEffect)

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll("a, button, .event-card, .glass-card")
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("click", clickEffect)
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      {/* Outer Ring - Slow lag */}
      <div ref={cursorRingRef} className="cursor-ring" />
      
      {/* Inner Dot - Fast */}
      <div ref={cursorDotRef} className="cursor-dot" />
    </>
  )
}
