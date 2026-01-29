import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function Hero() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
        const slides = document.querySelectorAll(".hero-slide")
        
        // Initial set
        gsap.set(slides, { opacity: 0, scale: 1.2 })
        gsap.set(slides[0], { opacity: 1, scale: 1 })

        // Animation loop
        const tl = gsap.timeline({ repeat: -1 })
        
        slides.forEach((slide, i) => {
            const nextSlide = slides[(i + 1) % slides.length]
            
            tl.to(slide, {
                opacity: 0,
                scale: 1.1,
                duration: 2,
                ease: "power2.inOut",
                delay: 4
            }, `slide-${i}`)
            .to(nextSlide, {
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "power2.inOut"
            }, `slide-${i}-start-=1.5`)
        })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Carousel Images */}
      <div className="absolute inset-0 z-0">
          <div className="hero-slide absolute inset-0 will-change-transform">
            <img src="/images/hero/mnnit.jpg" className="w-full h-full object-cover opacity-60" alt="MNNIT Campus" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
          </div>
          <div className="hero-slide absolute inset-0 will-change-transform">
            <img src="/images/hero/robotics.jpg" className="w-full h-full object-cover opacity-60" alt="Robotics" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
          </div>
          <div className="hero-slide absolute inset-0 will-change-transform">
            <img src="/images/hero/hackathon.jpg" className="w-full h-full object-cover opacity-60" alt="Hackathon" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
          </div>
      </div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* Text Content */}
      <div className="relative z-10 text-center px-4 mt-[15vh]"> {/* Pushed down to leave room for Orb */}
        <div className="inline-block mb-4 px-4 py-1 border border-blue-500/50 rounded-full bg-blue-500/10 backdrop-blur-md">
            <span className="text-blue-400 text-xs font-mono tracking-[0.2em] uppercase">MNNIT Allahabad</span>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter mix-blend-screen drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">
            TECHFEST
            <span className="block text-4xl md:text-6xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white mt-[-10px]">
                2026
            </span>
        </h1>
        
        <div className="mt-8 flex gap-4 justify-center">
            <div className="h-[1px] w-12 bg-white/30 my-auto" />
            <p className="text-gray-400 font-mono text-sm tracking-wider">
                INNOVATE • ADAPT • EVOLVE
            </p>
            <div className="h-[1px] w-12 bg-white/30 my-auto" />
        </div>
      </div>
    </section>
  )
}
