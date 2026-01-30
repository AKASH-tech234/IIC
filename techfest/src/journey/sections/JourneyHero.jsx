import { useEffect, useRef } from "react"
import gsap from "gsap"
import AnimatedShaderBackground from "../../components/ui/AnimatedShaderBackground"
import { Highlight } from "../../components/ui/hero-highlight"
import { NoiseBackground } from "../../components/ui/noise-background"

/**
 * Journey Hero Section
 * 
 * Content:
 * - MNNIT TECHSUMMIT 2026
 * - Innovate. Collaborate. Accelerate.
 * - Description
 * - CTAs: Register Now, Explore Events
 * 
 * Visual State:
 * - Animated aurora shader background
 * - Letter-by-letter title reveal
 * - Minimal UI, strong typography
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
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-20"
    >
      {/* Animated Shader Background */}
      <AnimatedShaderBackground />
      
      {/* Dark overlay for text readability */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(7, 6, 23, 0.4) 0%, rgba(7, 6, 23, 0.8) 100%)"
        }}
      />

      {/* Content Container - Centered, Max Width */}
      <div className="relative z-10 text-center w-full max-w-5xl mx-auto">
        
        {/* H1: Event Title - Letter-by-letter reveal */}
        <h1 className="mb-6">
          {"MNNIT TechSummit 2026".split("").map((char, i) => (
            <span 
              key={i}
              className="hero-title-letter inline-block"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* H2: Tagline */}
        <h2 
          className="hero-tagline mb-8"
          style={{
            fontSize: "clamp(1.25rem, 3vw, 2rem)",
            fontWeight: 300,
            color: "var(--text-secondary)",
            letterSpacing: "0.05em"
          }}
        >
          Innovate. Collaborate. <Highlight className="text-white dark:text-white bg-gradient-to-r from-cyan-400 to-blue-500">Accelerate</Highlight>.
        </h2>

        {/* Description */}
        <p 
          className="hero-description mx-auto mb-12"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            color: "var(--text-tertiary)",
            maxWidth: "42rem",
            lineHeight: 1.7
          }}
        >
          A three-day technology summit by MNNIT Allahabad bringing together developers, engineers, and innovators through hackathons, workshops, and competitions.
        </p>

        {/* CTA Buttons - Horizontal on desktop, stacked on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary CTA - with Noise Background */}
          <NoiseBackground
            containerClassName="w-fit p-2 rounded-full hero-cta-button"
            gradientColors={[
              "rgb(34, 211, 238)",  // cyan
              "rgb(59, 130, 246)",  // blue
              "rgb(139, 92, 246)",  // purple
            ]}
            noiseIntensity={0.15}
            speed={0.15}
          >
            <button className="h-full w-full cursor-pointer rounded-full px-10 py-4 text-white shadow-[0px_2px_0px_0px_rgba(34,211,238,0.3)_inset,0px_0.5px_1px_0px_rgba(34,211,238,0.5)] transition-all duration-100 active:scale-98 font-semibold text-lg tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
              style={{
                background: "linear-gradient(to bottom, rgba(10, 14, 42, 0.9), rgba(7, 6, 23, 0.95))",
              }}
            >
              Register Now →
            </button>
          </NoiseBackground>

          {/* Secondary CTA */}
          <button 
            className="hero-cta-button px-10 py-4 rounded-full font-medium text-lg tracking-wide transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            style={{
              border: "2px solid rgba(255, 255, 255, 0.2)",
              color: "var(--text-primary)",
              backgroundColor: "transparent"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-color)"
              e.currentTarget.style.backgroundColor = `${getComputedStyle(document.documentElement).getPropertyValue('--accent-color')}10`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            Explore Events
          </button>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#050510]/40 pointer-events-none" />
    </section>
  )
}
