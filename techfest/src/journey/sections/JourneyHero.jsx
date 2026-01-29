import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Journey Hero Section
 * 
 * Content:
 * - MNNIT TECHSUMMIT 2026
 * - Innovate. Collaborate. Accelerate.
 * - Description
 * - CTAs: Register Now, Explore the Journey
 * 
 * Visual State:
 * - Car is idle
 * - Background slowly moving
 * - Minimal UI, strong typography
 */
export default function JourneyHero() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic letter-by-letter reveal for title
      const titleWords = gsap.utils.toArray(".title-word")
      
      gsap.fromTo(titleWords,
        { 
          opacity: 0, 
          y: 100,
          rotationX: -90,
          transformOrigin: "center bottom"
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.15,
          delay: 0.3,
          ease: "power4.out"
        }
      )

      // Animated divider line
      gsap.fromTo(".hero-divider",
        { scaleX: 0, opacity: 0 },
        { 
          scaleX: 1, 
          opacity: 1, 
          duration: 1.5, 
          delay: 1.5,
          ease: "power2.inOut"
        }
      )

      // Subtitle with blur removal
      gsap.fromTo(".journey-hero-subtitle",
        { opacity: 0, filter: "blur(10px)", y: 30 },
        { 
          opacity: 1, 
          filter: "blur(0px)", 
          y: 0, 
          duration: 1.2,
          delay: 1.8,
          ease: "power3.out"
        }
      )

      // Description fade in
      gsap.fromTo(".journey-hero-description",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 2.2,
          ease: "power2.out"
        }
      )

      // CTA buttons with stagger
      gsap.fromTo(".journey-hero-cta",
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.15,
          delay: 2.5,
          ease: "back.out(1.5)"
        }
      )

      // Scroll hint animation
      gsap.fromTo(".journey-scroll-hint",
        { opacity: 0, y: -20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 2.8,
          ease: "power2.out"
        }
      )

      gsap.to(".scroll-indicator", {
        y: 10,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 3
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="journey-hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-20"
    >
      {/* Content Container */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        
        {/* Main Title - Cinematic Letter Reveal */}
        <h1 className="journey-hero-title mb-8">
          <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none">
            <span className="title-word inline-block">MNNIT</span>
          </span>
          <span 
            className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mt-2"
            style={{
              background: "linear-gradient(to right, var(--accent-cyan), var(--accent-blue), var(--accent-cyan))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px var(--accent-color))"
            }}
          >
            <span className="title-word inline-block">TECH</span>
            <span className="title-word inline-block">SUMMIT</span>
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.4em] mt-4" style={{ color: "var(--text-secondary)" }}>
            <span className="title-word inline-block">2026</span>
          </span>
        </h1>

        {/* Animated Divider Line */}
        <div className="hero-divider w-32 h-[2px] mx-auto mb-8" style={{ 
          background: "linear-gradient(to right, transparent, var(--accent-color), transparent)",
          boxShadow: `0 0 10px var(--accent-color)`
        }} />

        {/* Subtitle */}
        <p className="journey-hero-subtitle text-2xl sm:text-3xl md:text-4xl font-light mb-8" style={{ color: "var(--text-primary)" }}>
          <span style={{ color: "var(--accent-cyan)" }}>Innovate.</span>
          {" "}
          <span style={{ color: "var(--accent-blue)" }}>Collaborate.</span>
          {" "}
          <span style={{ color: "var(--accent-lime)" }}>Accelerate.</span>
        </p>

        {/* Description */}
        <p className="journey-hero-description text-lg sm:text-xl max-w-3xl mx-auto mb-12 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          A three-day technology summit by MNNIT Allahabad celebrating engineering, software, and innovation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button 
            className="journey-hero-cta group relative px-10 py-5 text-white font-bold text-lg tracking-wide rounded overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: `linear-gradient(to right, var(--accent-cyan), var(--accent-blue))`,
              boxShadow: `0 0 40px ${getComputedStyle(document.documentElement).getPropertyValue('--accent-color')}40`,
              focusVisibleRingColor: "var(--accent-color)",
              focusVisibleRingOffsetColor: "var(--bg-base)"
            }}
          >
            <span className="relative z-10">Register Now</span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(to right, var(--accent-blue), var(--accent-cyan))`
              }}
            />
          </button>
          
          <button 
            className="journey-hero-cta px-10 py-5 border-2 font-semibold text-lg tracking-wide rounded backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "var(--text-primary)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-color)"
              e.currentTarget.style.color = "var(--accent-color)"
              e.currentTarget.style.backgroundColor = "rgba(34, 211, 238, 0.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.color = "var(--text-primary)"
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            Explore the Journey
          </button>
        </div>

        {/* Scroll Hint - Animated Arrow */}
        <div className="journey-scroll-hint flex flex-col items-center gap-3" style={{ color: "var(--text-tertiary)" }}>
          <span className="text-sm font-mono tracking-wider uppercase">Begin Your Journey</span>
          <div 
            className="scroll-indicator w-6 h-10 border-2 rounded-full flex items-start justify-center p-1"
            style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <div 
              className="w-1 h-2 rounded-full"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#050510]/40 pointer-events-none" />
    </section>
  )
}
