import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Hero Section - Establishes identity and introduces the Innovation Core
 * 
 * Content from spec:
 * - Title: MNNIT TECHSUMMIT 2026
 * - Subtitle: Innovate. Collaborate. Accelerate.
 * - Description: A three-day technology summit...
 * - Meta: March 18–20, 2026 | MNNIT Allahabad Campus
 * - CTAs: Register Now, Explore the Summit
 */
export default function Hero() {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(".hero-badge", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
      )
      .fromTo(".hero-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.4"
      )
      .fromTo(".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(".hero-description",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(".hero-meta",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.3"
      )
      .fromTo(".hero-scroll-hint",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2"
      )

      // Floating animation for scroll hint
      gsap.to(".scroll-arrow", {
        y: 8,
        duration: 1.2,
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
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14] via-[#0B0E14] to-[#050510]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px"
          }}
        />

        {/* Radial glow behind content */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 60%)"
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-cyan-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-cyan-500/10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-cyan-500/10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-cyan-500/10" />
      </div>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-[20vh]"
      >
        {/* Badge */}
        <div className="hero-badge inline-block mb-6">
          <div className="px-4 py-2 border border-cyan-500/30 rounded-full bg-cyan-500/5 backdrop-blur-sm">
            <span className="text-cyan-400 text-xs font-mono tracking-[0.25em] uppercase">
              MNNIT Allahabad presents
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="hero-title mb-4">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
            MNNIT
          </span>
          <span 
            className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ textShadow: "0 0 80px rgba(56,189,248,0.5)" }}
          >
            TECHSUMMIT
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.3em] text-white/80 mt-2">
            2026
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-xl sm:text-2xl md:text-3xl font-light text-white/90 tracking-wide mb-6">
          <span className="text-cyan-400">Innovate.</span>
          {" "}
          <span className="text-purple-400">Collaborate.</span>
          {" "}
          <span className="text-green-400">Accelerate.</span>
        </p>

        {/* Description */}
        <p className="hero-description text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          A three-day technology summit by MNNIT Allahabad celebrating engineering, software, and innovation.
        </p>

        {/* Meta Line */}
        <div className="hero-meta flex items-center justify-center gap-4 mb-10 text-sm text-gray-500 font-mono">
          <span className="h-[1px] w-8 bg-white/20" />
          <span>March 18–20, 2026</span>
          <span className="text-cyan-500">|</span>
          <span>MNNIT Allahabad Campus</span>
          <span className="h-[1px] w-8 bg-white/20" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="hero-cta group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold tracking-wide rounded overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E14]">
            <span className="relative z-10">Register Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="hero-cta px-8 py-4 border border-white/20 text-white/80 font-medium tracking-wide rounded backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E14]">
            Explore the Summit
          </button>
        </div>

        {/* Scroll Hint */}
        <div className="hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs font-mono tracking-wider uppercase">Scroll to explore</span>
          <div className="scroll-arrow w-5 h-5 border-b-2 border-r-2 border-cyan-500/50 rotate-45" />
        </div>
      </div>
    </section>
  )
}
