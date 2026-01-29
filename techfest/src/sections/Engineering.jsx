import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Engineering Section (Chapter 2)
 * 
 * Content from spec:
 * - Heading: Engineering in Motion
 * - Body: From robotics arenas to embedded systems labs...
 * - Feature blocks: Robotics Challenge, IoT & Embedded Systems, Hardware Expo
 * - CTA: Register Your Team
 * 
 * Innovation Core behavior:
 * - Glow: Neon Purple (#A855F7)
 * - Scale: ~1.2
 * - Tooltip: ENGINEERING
 */
export default function Engineering() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content on scroll
      gsap.fromTo(".engineering-heading",
        { opacity: 0, x: 50 },
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

      gsap.fromTo(".engineering-body",
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

      // Staggered feature cards
      gsap.fromTo(".feature-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".feature-cards",
            start: "top 75%",
            end: "top 35%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".engineering-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: ".engineering-cta",
            start: "top 85%",
            end: "top 65%",
            scrub: 1
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      title: "Robotics Challenge",
      description: "Design and build autonomous robots to compete in challenging arenas",
      icon: (
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          <rect x="10" y="8" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="16" r="2" fill="currentColor" />
          <circle cx="25" cy="16" r="2" fill="currentColor" />
          <line x1="12" y1="24" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5" />
          <line x1="28" y1="24" x2="28" y2="32" stroke="currentColor" strokeWidth="1.5" />
          <line x1="8" y1="32" x2="16" y2="32" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="32" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: "IoT & Embedded Systems",
      description: "Connect the physical and digital worlds with smart sensor networks",
      icon: (
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          <circle cx="20" cy="20" r="4" fill="currentColor" />
          <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="32" cy="15" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="32" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="30" cy="28" r="2" fill="currentColor" opacity="0.7" />
        </svg>
      )
    },
    {
      title: "Hardware Expo",
      description: "Showcase your innovations and see cutting-edge hardware projects",
      icon: (
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          <rect x="8" y="12" width="24" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="16" x2="14" y2="24" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="16" x2="20" y2="24" stroke="currentColor" strokeWidth="1" />
          <line x1="26" y1="16" x2="26" y2="24" stroke="currentColor" strokeWidth="1" />
          <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1" />
          <circle cx="20" cy="8" r="2" fill="currentColor" />
          <line x1="20" y1="10" x2="20" y2="12" stroke="currentColor" strokeWidth="1" />
        </svg>
      )
    }
  ]

  return (
    <section
      ref={sectionRef}
      id="engineering"
      className="story-section relative min-h-screen w-full py-32 px-6"
      data-color="purple"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 60%)"
          }}
        />
      </div>

      {/* Content Container - Right aligned */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 md:ml-auto md:pl-16">
          
          {/* Section Label */}
          <div className="mb-4 font-mono text-sm text-purple-400/70 tracking-widest">
            // CHAPTER 02
          </div>

          {/* Heading */}
          <h2 className="engineering-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Engineering
            <span className="block text-purple-400">in Motion</span>
          </h2>

          {/* Body Text */}
          <p className="engineering-body text-lg text-gray-400 leading-relaxed mb-10 border-l-2 border-purple-500/30 pl-6">
            From robotics arenas to embedded systems labs, TechSummit highlights hardware-driven innovation. Teams design, build, test, and compete using real components, real constraints, and real engineering skills.
          </p>

        </div>

        {/* Feature Cards - Full Width */}
        <div className="feature-cards grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group relative p-6 bg-white/[0.02] border border-purple-500/20 rounded-lg backdrop-blur-sm transition-all duration-500 hover:border-purple-500/50 hover:bg-purple-500/5"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 30px rgba(168,85,247,0.1)" }} />
              
              <div className="relative z-10">
                <div className="text-purple-400 mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-purple-500/30 rounded-tr-lg" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center md:text-right">
          <button className="engineering-cta px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium tracking-wide rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
            Register Your Team
          </button>
        </div>
      </div>

      {/* Abstract Shape - Left Side Decoration */}
      <div className="hidden md:block absolute left-[10%] top-1/3 w-48 h-48 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-pulse">
          <rect x="40" y="40" width="120" height="120" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="1" transform="rotate(45 100 100)" />
          <rect x="60" y="60" width="80" height="80" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1" transform="rotate(45 100 100)" />
        </svg>
      </div>
    </section>
  )
}
