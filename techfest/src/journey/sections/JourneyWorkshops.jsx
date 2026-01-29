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
        
        {/* Section marker with motion */}
        <div className="mb-6 flex items-center gap-4">
          <div 
            className="w-12 h-[2px]"
            style={{
              background: "linear-gradient(to right, var(--accent-color), transparent)"
            }}
          />
          <span 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: "var(--accent-color)" }}
          >
            Milestone 04 • ACCELERATING
          </span>
          <div className="flex gap-1">
            <div 
              className="w-1 h-4 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <div 
              className="w-1 h-6 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.1s" }}
            />
            <div 
              className="w-1 h-8 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.2s" }}
            />
          </div>
        </div>

        {/* Heading with speed emphasis */}
        <h2 
          className="workshops-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Build Along
          <span 
            className="block mt-2"
            style={{ 
              color: "var(--accent-color)",
              filter: "drop-shadow(0 0 20px var(--accent-color))"
            }}
          >
            the Way
          </span>
        </h2>

        {/* Content with speed lines in background */}
        <div className="workshops-content relative space-y-6">
          {/* Speed lines background effect */}
          <div className="absolute -left-20 top-0 bottom-0 w-40 opacity-20 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-[2px] w-full"
                style={{
                  top: `${i * 15}%`,
                  background: `linear-gradient(to right, transparent, var(--accent-color), transparent)`,
                  animation: `speed-line ${0.8 + i * 0.1}s linear infinite`
                }}
              />
            ))}
          </div>

          <p 
            className="text-xl leading-relaxed border-l-4 pl-6"
            style={{ 
              color: "var(--text-secondary)",
              borderColor: "var(--accent-color)"
            }}
          >
            Hands-on workshops and high-energy hackathons encourage participants to build real solutions, 
            collaborate in teams, and learn from mentors.
          </p>
          
          <p 
            className="text-lg leading-relaxed pl-6"
            style={{ color: "var(--text-tertiary)" }}
          >
            From ideation to implementation, every step of the journey is designed to push boundaries 
            and accelerate learning through practical application.
          </p>

          {/* Feature list with enhanced styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pl-6">
            {["Hands-on Workshops", "24-Hour Hackathon", "Mentor Support", "Real-World Projects"].map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-4 rounded-lg group hover:scale-105 transition-transform duration-300"
                style={{
                  background: "rgba(236, 72, 153, 0.05)",
                  border: "1px solid rgba(236, 72, 153, 0.2)",
                  boxShadow: "0 0 20px rgba(236, 72, 153, 0.1)"
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: "var(--accent-color)",
                    boxShadow: `0 0 10px var(--accent-color)`
                  }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced speed indicator */}
        <div 
          className="mt-12 flex items-center gap-4 pl-6"
          style={{ color: "var(--accent-color)" }}
        >
          <div className="flex gap-1">
            <div 
              className="w-1 h-4 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <div 
              className="w-1 h-6 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.1s" }}
            />
            <div 
              className="w-1 h-8 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.2s" }}
            />
            <div 
              className="w-1 h-10 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.3s" }}
            />
          </div>
          <span className="text-xs font-mono tracking-wider uppercase font-bold">
            HIGH VELOCITY MODE
          </span>
          <div className="flex-1 h-[2px] relative overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, var(--accent-color), transparent)`,
                animation: "slide-right 1s linear infinite"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
