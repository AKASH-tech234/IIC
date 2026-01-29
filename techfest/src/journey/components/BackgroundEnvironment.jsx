import BackgroundLayer from "./BackgroundLayer"

/**
 * BackgroundEnvironment System
 * 
 * Multi-layer parallax background that changes with scroll.
 * Represents the journey through different environments.
 * 
 * Environments:
 * 1. Open Road (0-20%)
 * 2. Suburbs (20-40%)
 * 3. City Approach (40-60%)
 * 4. City Core (60-80%)
 * 5. Future (80-100%)
 */
export default function BackgroundEnvironment() {
  return (
    <div 
      id="background-container" 
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ willChange: "transform" }}
    >
      
      {/* Layer 1: Sky (Slowest) */}
      <BackgroundLayer speed={0.3} zIndex={1}>
        <div className="w-full h-full bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#2a2f4a]" />
        
        {/* Stars/atmospheric elements */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animation: `twinkle ${2 + Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>
      </BackgroundLayer>

      {/* Layer 2: Mountains/Buildings Silhouette (Mid) */}
      <BackgroundLayer speed={0.6} zIndex={2}>
        <div className="absolute bottom-0 left-0 w-[300%] h-[40%]">
          {/* Environment 1: Mountains */}
          <svg 
            className="absolute left-0 w-1/3 h-full" 
            viewBox="0 0 1000 400" 
            preserveAspectRatio="none"
          >
            <polygon 
              points="0,400 0,200 150,100 300,180 450,120 600,200 750,150 900,220 1000,180 1000,400" 
              fill="rgba(30,35,50,0.6)"
            />
          </svg>

          {/* Environment 2: Suburbs silhouette */}
          <div className="absolute left-[33%] w-1/3 h-full flex items-end justify-around px-10">
            {[40, 60, 50, 70, 55, 65].map((height, i) => (
              <div
                key={i}
                className="w-12 bg-gradient-to-t from-[#1a1f35] to-[#2a2f45] opacity-50"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* Environment 3: City skyline */}
          <div className="absolute left-[66%] w-1/3 h-full flex items-end justify-around px-8">
            {[60, 85, 70, 90, 75, 95, 80].map((height, i) => (
              <div
                key={i}
                className="w-16 bg-gradient-to-t from-[#1a2530] to-[#2a3540] opacity-60"
                style={{ height: `${height}%` }}
              >
                {/* Building windows (small lights) */}
                <div className="grid grid-cols-2 gap-1 p-1">
                  {[...Array(Math.floor(height / 15))].map((_, j) => (
                    <div
                      key={j}
                      className="w-1 h-1 bg-cyan-400/40"
                      style={{
                        opacity: Math.random() > 0.3 ? 0.6 : 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BackgroundLayer>

      {/* Layer 3: Near Objects (Fast) - Hidden on mobile */}
      <BackgroundLayer speed={1.0} zIndex={3}>
        <div className="hidden md:block absolute bottom-0 left-0 w-[300%] h-[25%] opacity-40">
          {/* Trees, signs, near elements */}
          <div className="absolute left-[5%] bottom-0 w-8 h-20 bg-gradient-to-t from-[#2a4a2a] to-transparent opacity-50" />
          <div className="absolute left-[15%] bottom-0 w-6 h-16 bg-gradient-to-t from-[#2a4a2a] to-transparent opacity-50" />
          <div className="absolute left-[40%] bottom-0 w-10 h-24 bg-gradient-to-t from-[#2a4a2a] to-transparent opacity-50" />
        </div>
      </BackgroundLayer>

      {/* Layer 4: Road (Fastest) */}
      <BackgroundLayer speed={1.2} zIndex={4}>
        <div className="absolute bottom-0 left-0 w-[300%] h-[15vh]">
          {/* Road surface */}
          <div className="w-full h-full bg-gradient-to-b from-[#2a2a35] to-[#1a1a25]">
            {/* Road lines */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] flex gap-12">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="w-16 h-full bg-white/20" />
              ))}
            </div>
          </div>
          
          {/* Road edge glow */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0" />
        </div>
      </BackgroundLayer>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050510]/60 z-5 pointer-events-none" />
    </div>
  )
}
