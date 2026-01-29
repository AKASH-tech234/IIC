import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useLenis from "./hooks/useLenis"
import Hero from "./sections/Hero/Hero"
import Foundation from "./sections/Foundation"
import Engineering from "./sections/Engineering"
import Software from "./sections/Software"
import InnovationCore from "./components/InnovationCore"
import Footer from "./layout/Footer"

gsap.registerPlugin(ScrollTrigger)

/**
 * MNNIT TechSummit 2026 - Innovation Core Version
 * 
 * Original implementation with orb-based visual narrator
 */
export default function AppCore() {
  useLenis()
  const mainRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh()
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef} className="bg-[#050510] min-h-screen text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
        
        {/* Innovation Core - Fixed visual narrator */}
        <InnovationCore />

        {/* Hero Section */}
        <div className="relative z-10 w-full">
            <Hero />
        </div>

        {/* Main Content Sections */}
        <div className="relative z-10 w-full">
            
            {/* Chapter 1: Foundation */}
            <Foundation />

            {/* Chapter 2: Engineering */}
            <Engineering />

            {/* Chapter 3: Software */}
            <Software />

            {/* Final CTA Section */}
            <section 
              id="final-cta" 
              className="relative min-h-screen w-full flex items-center justify-center py-32 px-6"
            >
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-block mb-6">
                  <div className="px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
                    <span className="text-white/60 text-xs font-mono tracking-[0.25em] uppercase">
                      The Future Awaits
                    </span>
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                  Be a Part of the
                  <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                    Future
                  </span>
                </h2>

                {/* Body */}
                <p className="text-lg sm:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                  Join hundreds of innovators, engineers, and developers at MNNIT TechSummit 2026. 
                  Three days of workshops, competitions, and collaboration await you.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 text-white font-bold text-lg tracking-wide rounded overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]">
                    <span className="relative z-10">Register Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  
                  <button className="px-10 py-5 border-2 border-white/30 text-white font-semibold text-lg tracking-wide rounded backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]">
                    View Schedule
                  </button>
                </div>

                {/* Meta Info */}
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span>March 18–20, 2026</span>
                  </div>
                  <div className="hidden sm:block w-[1px] h-4 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                    <span>MNNIT Allahabad</span>
                  </div>
                  <div className="hidden sm:block w-[1px] h-4 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
                    <span>500+ Participants</span>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
                  style={{
                    background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(168,85,247,0.2) 50%, rgba(34,197,94,0.2) 100%)"
                  }}
                />
              </div>
            </section>
        </div>

        {/* Footer */}
        <Footer />

    </main>
  )
}
