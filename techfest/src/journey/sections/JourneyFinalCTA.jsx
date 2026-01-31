import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Journey Final CTA Section
 * 
 * Content:
 * - Heading: Reach the Future
 * - Text and CTA: Get Your Pass
 * 
 * Visual State:
 * - Arrival at destination
 * - Background calms
 * - Car comes to rest
 */
export default function JourneyFinalCTA() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slow down car on arrival + update accent
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        onEnter: () => {
          const car = document.querySelector("#car")
          if (car) {
            gsap.to(car, {
              rotateZ: 0,
              duration: 1,
              ease: "power2.out"
            })
          }
          
          // Update to lime accent
          document.documentElement.style.setProperty("--accent-color", "#22C55E") // Lime
        }
      })

      gsap.fromTo(".final-cta-badge",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".final-cta-heading",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "top 35%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".final-cta-text",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".final-cta-button",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            end: "top 25%",
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
      id="journey-final-cta"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-32"
    >
      {/* Content Container */}
      <div className="relative z-10 w-full px-6 md:px-8 text-center">
        
        {/* Badge */}
        <div className="final-cta-badge inline-block mb-8">
          <div className="px-6 py-2 border-2 border-white/30 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="text-white/80 text-sm font-mono tracking-[0.3em] uppercase">
              Destination Reached
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="final-cta-heading text-6xl sm:text-7xl md:text-8xl font-black text-white mb-8 leading-tight">
          Reach the
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Future
          </span>
        </h2>

        {/* Text */}
        <p className="final-cta-text text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Join MNNIT TechSummit 2026 and be part of a journey driven by innovation, collaboration, and impact.
        </p>

        {/* CTA Button */}
        <button className="final-cta-button group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold text-xl tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_60px_rgba(56,189,248,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]">
          <span className="relative z-10">Get Your Pass</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>

        {/* Meta info */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span>March 18–20, 2026</span>
          </div>
          <div className="hidden sm:block w-[1px] h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>MNNIT Allahabad</span>
          </div>
          <div className="hidden sm:block w-[1px] h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>500+ Innovators</span>
          </div>
        </div>
      </div>

      {/* Horizon glow - Open highway feel */}
      <div className="absolute inset-0 z-0">
        {/* Horizon glow */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background: "linear-gradient(to top, rgba(34, 197, 94, 0.2), transparent)"
          }}
        />
        
        {/* Radial center glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)"
          }}
        />

        {/* Fewer building silhouettes (open highway) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex justify-around items-end opacity-10">
          {[20, 30, 25].map((height, i) => (
            <div
              key={i}
              className="w-16"
              style={{
                height: `${height}%`,
                background: "var(--bg-city-shadow)"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
