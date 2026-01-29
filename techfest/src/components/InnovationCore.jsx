import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * InnovationCore - The central animated orb that acts as the visual narrator
 * 
 * Layers (inside out):
 * 1. Core Nucleus - Bright pulsing center
 * 2. Inner Hexagonal Core - Circuit-like SVG geometry
 * 3. Rotating Rings - Orbital rings around the core
 * 4. Outer Glow/Energy Field - Color-changing bloom
 * 
 * Also includes:
 * - Timeline line that grows with scroll
 * - Nodes that activate per section
 * - Tooltip labels per chapter
 */
export default function InnovationCore() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Core elements
      const orbContainer = document.querySelector("#core-orb-container")
      const orbBloom = document.querySelector("#orb-bloom")
      const orbGlowRing = document.querySelector("#orb-glow-ring")
      const tooltip = document.querySelector("#orb-tooltip")
      const tooltipText = document.querySelector("#tooltip-text")
      const timelineLine = document.querySelector("#timeline-line")
      const nodes = [
        document.querySelector("#node-1"),
        document.querySelector("#node-2"),
        document.querySelector("#node-3")
      ]

      if (!orbContainer || !timelineLine) return

      // ===== IDLE ANIMATIONS (Always running) =====
      gsap.to(".ring-outer", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      })
      
      gsap.to(".ring-inner", {
        rotation: -360,
        duration: 15,
        repeat: -1,
        ease: "none"
      })

      gsap.to(".hexagon-core", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none"
      })

      // Subtle pulse on nucleus
      gsap.to(".core-nucleus", {
        scale: 1.1,
        opacity: 0.9,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // ===== TIMELINE LINE GROWTH (Scroll-driven) =====
      gsap.to(timelineLine, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5
        }
      })

      // ===== SECTION-BASED ORB INTERACTIONS =====
      const sections = [
        {
          trigger: "#hero",
          color: "rgba(56, 189, 248, 0.3)",
          glowColor: "rgba(56, 189, 248, 0.4)",
          scale: 1.0,
          rotationSpeed: 1,
          tooltip: "INNOVATION",
          nodeIndex: null
        },
        {
          trigger: "#foundation",
          color: "rgba(56, 189, 248, 0.4)",
          glowColor: "rgba(56, 189, 248, 0.5)",
          scale: 1.0,
          rotationSpeed: 1.2,
          tooltip: "FOUNDATION",
          nodeIndex: 0
        },
        {
          trigger: "#engineering",
          color: "rgba(168, 85, 247, 0.4)",
          glowColor: "rgba(168, 85, 247, 0.5)",
          scale: 1.2,
          rotationSpeed: 1.5,
          tooltip: "ENGINEERING",
          nodeIndex: 1
        },
        {
          trigger: "#software",
          color: "rgba(34, 197, 94, 0.4)",
          glowColor: "rgba(34, 197, 94, 0.5)",
          scale: 1.1,
          rotationSpeed: 1.3,
          tooltip: "COLLABORATE",
          nodeIndex: 2
        }
      ]

      sections.forEach((section, index) => {
        const sectionEl = document.querySelector(section.trigger)
        if (!sectionEl) return

        ScrollTrigger.create({
          trigger: sectionEl,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            // Update glow
            gsap.to(orbBloom, {
              background: `radial-gradient(circle, ${section.color} 0%, transparent 70%)`,
              duration: 0.8,
              ease: "power2.out"
            })

            gsap.to(orbGlowRing, {
              borderColor: section.glowColor,
              boxShadow: `0 0 60px ${section.glowColor}, inset 0 0 60px ${section.glowColor.replace('0.5', '0.2')}`,
              duration: 0.8,
              ease: "power2.out"
            })

            // Update scale
            gsap.to(orbContainer, {
              scale: section.scale,
              duration: 0.8,
              ease: "back.out(1.2)"
            })

            // Update rotation speed
            gsap.to(".ring-outer", {
              timeScale: section.rotationSpeed,
              duration: 1
            })

            gsap.to(".ring-inner", {
              timeScale: section.rotationSpeed,
              duration: 1
            })

            // Update tooltip
            if (tooltip && tooltipText) {
              tooltipText.textContent = section.tooltip
              gsap.to(tooltip, {
                opacity: 1,
                duration: 0.5
              })
            }

            // Activate node
            if (section.nodeIndex !== null && nodes[section.nodeIndex]) {
              const node = nodes[section.nodeIndex]
              const nodeDot = node.querySelector("div")
              const nodeLabel = node.querySelector(".node-label")
              
              gsap.to(nodeDot, {
                opacity: 1,
                scale: 1.5,
                duration: 0.5,
                ease: "back.out(2)"
              })

              if (nodeLabel) {
                gsap.to(nodeLabel, {
                  opacity: 1,
                  duration: 0.5
                })
              }
            }
          },
          onLeaveBack: () => {
            // Deactivate node when scrolling back
            if (section.nodeIndex !== null && nodes[section.nodeIndex]) {
              const node = nodes[section.nodeIndex]
              const nodeDot = node.querySelector("div")
              const nodeLabel = node.querySelector(".node-label")
              
              gsap.to(nodeDot, {
                opacity: 0.5,
                scale: 1,
                duration: 0.5
              })

              if (nodeLabel) {
                gsap.to(nodeLabel, {
                  opacity: 0,
                  duration: 0.5
                })
              }
            }
          }
        })
      })

      // Special pulsing effect for Software section
      ScrollTrigger.create({
        trigger: "#software",
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(orbBloom, {
            scale: 1.1,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          })
        },
        onLeave: () => {
          gsap.killTweensOf(orbBloom, "scale")
          gsap.to(orbBloom, { scale: 1, duration: 0.5 })
        },
        onLeaveBack: () => {
          gsap.killTweensOf(orbBloom, "scale")
          gsap.to(orbBloom, { scale: 1, duration: 0.5 })
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center"
    >
      {/* ============================================ */}
      {/* THE ORB - Central Innovation Core           */}
      {/* ============================================ */}
      <div 
        id="core-orb-container" 
        className="relative mt-[12vh] w-40 h-40 flex items-center justify-center shrink-0"
      >
        {/* Layer 4: Outer Glow / Energy Field */}
        <div 
          id="orb-bloom" 
          className="absolute inset-[-60px] rounded-full transition-all duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)",
            filter: "blur(40px)"
          }}
        />

        {/* Secondary glow ring */}
        <div 
          id="orb-glow-ring"
          className="absolute inset-[-30px] rounded-full border border-cyan-500/20 transition-all duration-1000"
          style={{
            boxShadow: "0 0 60px rgba(56,189,248,0.2), inset 0 0 60px rgba(56,189,248,0.1)"
          }}
        />

        {/* Layer 3: Rotating Rings */}
        <div className="ring-outer absolute inset-[-15px] rounded-full border border-dashed border-cyan-400/30" />
        <div className="ring-outer absolute inset-[-8px] rounded-full border border-dotted border-cyan-300/20" style={{ animationDelay: "-5s" }} />
        <div className="ring-inner absolute inset-[5px] rounded-full border border-cyan-500/40" />

        {/* Glass Orb Surface */}
        <div 
          id="orb-surface"
          className="absolute inset-0 rounded-full border border-white/30 bg-gradient-to-br from-white/10 via-transparent to-cyan-500/10 backdrop-blur-sm"
          style={{
            boxShadow: "inset 0 0 30px rgba(56,189,248,0.3), 0 0 20px rgba(56,189,248,0.2)"
          }}
        />

        {/* Layer 2: Inner Hexagonal Core (SVG) */}
        <div className="hexagon-core absolute inset-[20%] flex items-center justify-center">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 10px rgba(56,189,248,0.8))" }}
          >
            {/* Outer hexagon */}
            <polygon 
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
              fill="none" 
              stroke="rgba(56,189,248,0.6)" 
              strokeWidth="1"
              className="hexagon-outer"
            />
            {/* Inner hexagon */}
            <polygon 
              points="50,20 75,35 75,65 50,80 25,65 25,35" 
              fill="none" 
              stroke="rgba(56,189,248,0.8)" 
              strokeWidth="1.5"
              className="hexagon-inner"
            />
            {/* Circuit lines */}
            <line x1="50" y1="5" x2="50" y2="20" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
            <line x1="50" y1="80" x2="50" y2="95" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
            <line x1="10" y1="27.5" x2="25" y2="35" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
            <line x1="90" y1="27.5" x2="75" y2="35" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
            <line x1="10" y1="72.5" x2="25" y2="65" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
            <line x1="90" y1="72.5" x2="75" y2="65" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="rgba(56,189,248,0.9)" className="core-center-dot" />
          </svg>
        </div>

        {/* Layer 1: Core Nucleus */}
        <div 
          className="core-nucleus absolute inset-[35%] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.8) 50%, transparent 100%)",
            filter: "blur(3px)",
            boxShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(56,189,248,0.6)"
          }}
        />

        {/* Tooltip Label */}
        <div 
          id="orb-tooltip"
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-500"
        >
          <div className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded text-xs font-mono tracking-wider text-cyan-400">
            <span id="tooltip-text">INNOVATION</span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TIMELINE LINE - Grows with scroll           */}
      {/* ============================================ */}
      <div className="relative flex-1 w-full max-w-[30px] flex flex-col items-center">
        
        {/* Connection from orb to line */}
        <div className="w-[2px] h-[30px] bg-gradient-to-b from-cyan-400/50 to-cyan-400/20" />

        {/* The Track (background) */}
        <div className="relative w-[2px] h-full bg-white/5 flex flex-col items-center">
          
          {/* The Active Growing Line */}
          <div 
            id="timeline-line" 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] rounded-full"
            style={{ 
              height: '0%',
              background: "linear-gradient(to bottom, #38BDF8, #A855F7, #22C55E)",
              boxShadow: "0 0 20px rgba(56,189,248,0.6), 0 0 40px rgba(168,85,247,0.4)"
            }} 
          />

          {/* Node 1 - Foundation (Blue) */}
          <div 
            id="node-1" 
            className="timeline-node absolute top-[20%] -translate-y-1/2 flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full border-2 border-cyan-500/50 bg-[#0B0E14] flex items-center justify-center opacity-0 scale-0 transition-all duration-500">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" style={{ boxShadow: "0 0 10px rgba(56,189,248,1)" }} />
            </div>
            <span className="node-label text-xs font-mono text-cyan-400/0 transition-all duration-500 whitespace-nowrap">FOUNDATION</span>
          </div>

          {/* Node 2 - Engineering (Purple) */}
          <div 
            id="node-2" 
            className="timeline-node absolute top-[50%] -translate-y-1/2 flex items-center gap-3"
          >
            <div className="w-5 h-5 rotate-45 border-2 border-purple-500/50 bg-[#0B0E14] flex items-center justify-center opacity-0 scale-0 transition-all duration-500">
              <div className="w-2 h-2 bg-purple-400" style={{ boxShadow: "0 0 10px rgba(168,85,247,1)" }} />
            </div>
            <span className="node-label text-xs font-mono text-purple-400/0 transition-all duration-500 whitespace-nowrap -rotate-45">ENGINEERING</span>
          </div>

          {/* Node 3 - Software/Collaborate (Green) */}
          <div 
            id="node-3" 
            className="timeline-node absolute top-[80%] -translate-y-1/2 flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-sm border-2 border-green-500/50 bg-[#0B0E14] flex items-center justify-center opacity-0 scale-0 transition-all duration-500">
              <div className="w-2 h-2 bg-green-400 rounded-sm" style={{ boxShadow: "0 0 10px rgba(74,222,128,1)" }} />
            </div>
            <span className="node-label text-xs font-mono text-green-400/0 transition-all duration-500 whitespace-nowrap">COLLABORATE</span>
          </div>

        </div>
      </div>
    </div>
  )
}
