import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Journey Hero Section
 * 
 * INTRO PHASE OF THE JOURNEY
 * 
 * Content (Spec-locked):
 * - H1: "MNNIT TechSummit 2026"
 * - H2: "Innovate. Collaborate. Accelerate."
 * - Description: Summit overview
 * - CTAs: "Register Now", "Explore Events"
 * 
 * Visual Design:
 * - Clean dark gradient background
 * - Pure white typography
 * - Minimal, professional aesthetic
 * - Letter-by-letter title reveal (GSAP)
 * 
 * Three.js Context (Future Integration):
 * - 3D scene renders behind this section (z-index: 0)
 * - Car positioned at bottom-center during Hero
 * - Camera in rear-view position (forward journey)
 * - No 3D motion during initial Hero animations
 * - 3D elements become active during scroll transitions
 * - Scene remains calm here; motion begins on scroll
 */
export default function JourneyHero() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (prefersReducedMotion) {
        // Simple fade-in for reduced motion
        gsap.set([".hero-title-letter", ".hero-tagline", ".hero-description", ".hero-cta-button"], { opacity: 1 })
        return
      }

      // ===== 1. TITLE ANIMATION: Letter-by-letter reveal =====
      const titleLetters = gsap.utils.toArray(".hero-title-letter")
      
      gsap.fromTo(titleLetters,
        { 
          opacity: 0, 
          y: 40 
        },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.6,
          stagger: 0.05, // 50ms per letter
          ease: "power3.out"
        }
      )

      // ===== 2. TAGLINE ANIMATION: Fade in with upward movement =====
      // Delay: After title completes (~0.6s + (letters * 0.05s))
      const titleDelay = 0.6 + (titleLetters.length * 0.05)
      
      gsap.fromTo(".hero-tagline",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: titleDelay,
          ease: "power2.out"
        }
      )

      // ===== 3. DESCRIPTION ANIMATION: Fade with blur removal =====
      // Delay: +0.2s after tagline starts
      gsap.fromTo(".hero-description",
        { opacity: 0, filter: "blur(4px)" },
        { 
          opacity: 1, 
          filter: "blur(0px)", 
          duration: 0.8,
          delay: titleDelay + 0.2,
          ease: "power2.out"
        }
      )

      // ===== 4. CTA BUTTONS: Scale + stagger =====
      // Delay: +0.4s after description starts
      gsap.fromTo(".hero-cta-button",
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.6, 
          stagger: 0.15, // 150ms between buttons
          delay: titleDelay + 0.6,
          ease: "back.out(1.7)"
        }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="journey-hero"
      className="relative w-full flex items-center justify-center"
      style={{
        // Professional header-aware layout
        minHeight: "calc(100vh - var(--header-height))",
        paddingTop: "calc(var(--header-height) + 2rem)",
        paddingBottom: "2rem"
      }}
    >
      {/* Content Container */}
      <div className="relative z-10 w-full px-6 md:px-8 text-center section-stack">
        
        {/* H1: Event Title - Letter-by-letter reveal (Tron Display) */}
        <h1 className="mb-4 section-title" aria-label="MNNIT TechSummit 2026">
          {"MNNIT TECHSUMMIT   2026".split("").map((char, i) => (
            <span 
              key={i}
              className="hero-title-letter inline-block"
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "0.06em",
                lineHeight: 1.1,
                textTransform: "uppercase"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* H2: Tagline - Tron Display Style */}
        <h2 
          className="hero-tagline mb-6 section-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.85)",
            letterSpacing: "0.12em",
            textTransform: "uppercase"
          }}
        >
          Innovate. Collaborate. Accelerate.
        </h2>

        {/* Description - Space Grotesk Body */}
        <p 
          className="hero-description mb-10 section-body"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            color: "rgba(255, 255, 255, 0.75)",
            maxWidth: "52ch",
            lineHeight: 1.6
          }}
        >
          A three-day technology summit by MNNIT Allahabad bringing together developers, engineers, and innovators through hackathons, workshops, and competitions.
        </p>

        {/* CTA Buttons - Tron Hard-Edge Style */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          
          {/* Primary CTA - Tron Button (Hard Edges) */}
          <button 
            className="hero-cta-button px-10 py-4 font-semibold text-lg tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070617]"
            style={{
              fontFamily: "var(--font-display)",
              borderRadius: "6px",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              background: "rgba(0, 229, 255, 0.08)",
              color: "#FFFFFF",
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 229, 255, 0.6)"
              e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.8)"
              e.currentTarget.style.background = "rgba(0, 229, 255, 0.12)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none"
              e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.4)"
              e.currentTarget.style.background = "rgba(0, 229, 255, 0.08)"
            }}
            aria-label="Register for MNNIT TechSummit 2026"
          >
            Register Now
          </button>

          {/* Secondary CTA - Tron Outline Button */}
          <button 
            className="hero-cta-button px-10 py-4 font-medium text-lg tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070617]"
            style={{
              fontFamily: "var(--font-display)",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              backgroundColor: "transparent",
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-color)"
              e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 229, 255, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.boxShadow = "none"
            }}
            aria-label="Explore events at TechSummit"
          >
            Explore Events
          </button>
        </div>
      </div>
    </section>
  )
}
