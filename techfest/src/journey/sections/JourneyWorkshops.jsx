import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Journey Workshops Section
 * 
 * Content:
 * - Heading: Build Along the Way
 * - Text about workshops and hackathons
 * 
 * Visual State:
 * - Car speed slightly increases
 * - Subtle motion blur effect
 */
export default function JourneyWorkshops() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Speed up effect for car
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          const car = document.querySelector("#car")
          const speedLines = document.querySelector("#speed-lines")
          
          if (car) {
            gsap.to(car, {
              rotateZ: -2,
              duration: 0.8,
              ease: "power2.out"
            })
          }
          
          if (speedLines) {
            gsap.to(speedLines, {
              opacity: 0.8,
              scaleX: 1.5,
              duration: 0.8,
              ease: "power2.out"
            })
          }
        },
        onLeave: () => {
          const car = document.querySelector("#car")
          const speedLines = document.querySelector("#speed-lines")
          
          if (car) {
            gsap.to(car, {
              rotateZ: 0,
              duration: 0.8
            })
          }
          
          if (speedLines) {
            gsap.to(speedLines, {
              opacity: 0,
              scaleX: 1,
              duration: 0.8
            })
          }
        },
        onLeaveBack: () => {
          const car = document.querySelector("#car")
          const speedLines = document.querySelector("#speed-lines")
          
          if (car) {
            gsap.to(car, {
              rotateZ: 0,
              duration: 0.8
            })
          }
          
          if (speedLines) {
            gsap.to(speedLines, {
              opacity: 0,
              scaleX: 1,
              duration: 0.8
            })
          }
        }
      })

      gsap.fromTo(".workshops-heading",
        { opacity: 0, x: 60 },
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

      gsap.fromTo(".workshops-content",
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
      id="journey-workshops"
      className="relative min-h-screen w-full flex items-center px-6 py-32"
    >
      <div className="relative z-10 max-w-4xl mx-auto md:ml-auto">
        
        {/* Section marker */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-12 h-[2px] bg-gradient-to-r from-green-500 to-transparent" />
          <span className="text-green-400 text-sm font-mono tracking-wider uppercase">Milestone 04</span>
        </div>

        {/* Heading */}
        <h2 className="workshops-heading text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Build Along
          <span className="block text-green-400">the Way</span>
        </h2>

        {/* Content */}
        <div className="workshops-content space-y-6">
          <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-green-500/50 pl-6">
            Hands-on workshops and high-energy hackathons encourage participants to build real solutions, 
            collaborate in teams, and learn from mentors.
          </p>
          
          <p className="text-lg text-gray-400 leading-relaxed pl-6">
            From ideation to implementation, every step of the journey is designed to push boundaries 
            and accelerate learning through practical application.
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pl-6">
            {["Hands-on Workshops", "24-Hour Hackathon", "Mentor Support", "Real-World Projects"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Speed indicator */}
        <div className="mt-12 flex items-center gap-3 pl-6 text-green-400">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-green-400 animate-pulse" />
            <div className="w-1 h-6 bg-green-400 animate-pulse" style={{ animationDelay: "0.1s" }} />
            <div className="w-1 h-8 bg-green-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
          </div>
          <span className="text-xs font-mono tracking-wider uppercase">Accelerating</span>
        </div>
      </div>
    </section>
  )
}
