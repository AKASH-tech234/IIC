import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Journey About Section
 * 
 * Content:
 * - Heading: The Journey Begins
 * - Text about MNNIT TechSummit platform
 * 
 * Visual State:
 * - Environment shifts from open road to city lights
 * - Background parallax increases
 */
export default function JourneyAbout() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-heading",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".about-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
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
      id="journey-about"
      className="relative min-h-screen w-full flex items-center px-6 py-32"
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Section marker */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-500 to-transparent" />
          <span className="text-cyan-400 text-sm font-mono tracking-wider uppercase">Milestone 01</span>
        </div>

        {/* Heading */}
        <h2 className="about-heading text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
          The Journey
          <span className="block text-cyan-400">Begins</span>
        </h2>

        {/* Content */}
        <div className="about-content space-y-6">
          <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-cyan-500/50 pl-6">
            MNNIT TechSummit is a platform where students, developers, and innovators come together 
            to explore technology through hands-on experiences, competitions, and collaboration.
          </p>
          
          <p className="text-lg text-gray-400 leading-relaxed pl-6">
            Our journey spans three days of intense learning, building, and connecting with like-minded 
            individuals who share a passion for technology and innovation.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex gap-3 pl-6">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </section>
  )
}
