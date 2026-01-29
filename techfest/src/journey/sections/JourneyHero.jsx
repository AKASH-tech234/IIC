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
      // Entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(".journey-hero-title",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5 }
      )
      .fromTo(".journey-hero-subtitle",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.6"
      )
      .fromTo(".journey-hero-description",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(".journey-hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        "-=0.3"
      )
      .fromTo(".journey-scroll-hint",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2"
      )

      // Scroll hint animation
      gsap.to(".scroll-indicator", {
        y: 10,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
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
        
        {/* Main Title */}
        <h1 className="journey-hero-title mb-6">
          <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none">
            MNNIT
          </span>
          <span 
            className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent"
          >
            TECHSUMMIT
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.4em] text-white/70 mt-4">
            2026
          </span>
        </h1>

        {/* Subtitle */}
        <p className="journey-hero-subtitle text-2xl sm:text-3xl md:text-4xl font-light text-white/90 mb-8">
          <span className="text-cyan-400">Innovate.</span>
          {" "}
          <span className="text-blue-400">Collaborate.</span>
          {" "}
          <span className="text-cyan-500">Accelerate.</span>
        </p>

        {/* Description */}
        <p className="journey-hero-description text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          A three-day technology summit by MNNIT Allahabad celebrating engineering, software, and innovation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button className="journey-hero-cta group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg tracking-wide rounded overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]">
            <span className="relative z-10">Register Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="journey-hero-cta px-10 py-5 border-2 border-white/30 text-white font-semibold text-lg tracking-wide rounded backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]">
            Explore the Journey
          </button>
        </div>

        {/* Scroll Hint */}
        <div className="journey-scroll-hint flex flex-col items-center gap-3 text-gray-500">
          <span className="text-sm font-mono tracking-wider uppercase">Begin Your Journey</span>
          <div className="scroll-indicator w-6 h-10 border-2 border-gray-500/50 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-cyan-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#050510]/40 pointer-events-none" />
    </section>
  )
}
