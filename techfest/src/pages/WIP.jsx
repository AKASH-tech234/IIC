import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function WIP() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wip-content",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="wip"
      className="relative min-h-[80vh] w-full flex items-center justify-center px-6 py-24"
    >
      <div className="wip-content text-center section-stack">
        <p className="text-xs tracking-[0.35em] uppercase text-cyan-300">Work In Progress</p>
        <h2 className="text-4xl md:text-5xl uppercase section-title" style={{ fontFamily: "var(--font-display)" }}>
          This section is currently under development.
        </h2>
        <p className="text-base md:text-lg text-slate-300 section-body">
          Please check back soon.
        </p>
      </div>
    </section>
  )
}
