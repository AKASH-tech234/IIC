import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Foundation Section (Chapter 1)
 * 
 * Content from spec:
 * - Heading: Foundation of Innovation
 * - Body: MNNIT Allahabad has a strong legacy...
 * - Key points: Academic excellence, Student-led societies, Industry exposure
 * - CTA: Discover the Vision
 * 
 * Innovation Core behavior:
 * - Glow: Neon Blue (#38BDF8)
 * - Scale: 1.0
 * - Tooltip: FOUNDATION
 */
export default function Foundation() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content on scroll
      gsap.fromTo(".foundation-heading",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".foundation-body",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".foundation-point",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".foundation-points",
            start: "top 70%",
            end: "top 40%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".foundation-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: ".foundation-cta",
            start: "top 80%",
            end: "top 60%",
            scrub: 1
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="foundation"
      className="story-section relative min-h-screen w-full py-32 px-6"
      data-color="blue"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Subtle radial gradient */}
        <div 
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 60%)"
          }}
        />
      </div>

      {/* Content Container - Left side (right side reserved for orb timeline) */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 md:pr-16">
          
          {/* Section Label */}
          <div className="mb-4 font-mono text-sm text-cyan-400/70 tracking-widest">
            // CHAPTER 01
          </div>

          {/* Heading */}
          <h2 className="foundation-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Foundation of
            <span className="block text-cyan-400">Innovation</span>
          </h2>

          {/* Body Text */}
          <p className="foundation-body text-lg text-gray-400 leading-relaxed mb-10 border-l-2 border-cyan-500/30 pl-6">
            MNNIT Allahabad has a strong legacy of academic excellence and hands-on engineering culture. TechSummit builds on this foundation by bringing students, mentors, and innovators together to explore real-world technology challenges.
          </p>

          {/* Key Points */}
          <div className="foundation-points space-y-4 mb-10">
            <div className="foundation-point flex items-start gap-4 group">
              <div className="w-2 h-2 mt-2 bg-cyan-400 rounded-full shrink-0 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-shadow" />
              <div>
                <h3 className="text-white font-semibold mb-1">Academic Excellence</h3>
                <p className="text-gray-500 text-sm">Research-driven learning and rigorous technical education</p>
              </div>
            </div>

            <div className="foundation-point flex items-start gap-4 group">
              <div className="w-2 h-2 mt-2 bg-cyan-400 rounded-full shrink-0 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-shadow" />
              <div>
                <h3 className="text-white font-semibold mb-1">Student-Led Technical Societies</h3>
                <p className="text-gray-500 text-sm">Clubs driving innovation through collaboration and competition</p>
              </div>
            </div>

            <div className="foundation-point flex items-start gap-4 group">
              <div className="w-2 h-2 mt-2 bg-cyan-400 rounded-full shrink-0 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-shadow" />
              <div>
                <h3 className="text-white font-semibold mb-1">Industry-Grade Tools & Practices</h3>
                <p className="text-gray-500 text-sm">Exposure to real-world technologies and methodologies</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="foundation-cta px-6 py-3 border border-cyan-500/50 text-cyan-400 font-medium tracking-wide rounded backdrop-blur-sm transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Discover the Vision
          </button>

        </div>
      </div>

      {/* Abstract Shape - Right Side Decoration */}
      <div className="hidden md:block absolute right-[10%] top-1/2 -translate-y-1/2 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <polygon 
            points="100,10 180,60 180,140 100,190 20,140 20,60" 
            fill="none" 
            stroke="rgba(56,189,248,0.5)" 
            strokeWidth="1"
          />
          <polygon 
            points="100,40 150,70 150,130 100,160 50,130 50,70" 
            fill="none" 
            stroke="rgba(56,189,248,0.3)" 
            strokeWidth="1"
          />
          <circle cx="100" cy="100" r="20" fill="rgba(56,189,248,0.1)" />
        </svg>
      </div>
    </section>
  )
}
