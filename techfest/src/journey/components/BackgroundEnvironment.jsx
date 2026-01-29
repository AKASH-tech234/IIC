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
      
      {/* Layer 1: Sky (Slowest) - Midnight Purple-Blue */}
      <BackgroundLayer speed={0.3} zIndex={1}>
        <div 
          className="w-full h-full" 
          style={{
            background: "linear-gradient(to bottom, var(--bg-deep-navy) 0%, var(--bg-city-shadow) 100%)"
          }}
        />
        
        {/* Neon glow horizon */}
        <div 
          className="absolute bottom-[40vh] left-0 right-0 h-24 opacity-20"
          style={{
            background: "var(--accent-purple)",
            filter: "blur(60px)"
          }}
        />
        
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

          {/* Environment 3: City skyline - Strong silhouettes */}
          <div className="absolute left-[66%] w-1/3 h-full flex items-end justify-around px-8">
            {[60, 85, 70, 90, 75, 95, 80].map((height, i) => (
              <div
                key={i}
                className="w-16 opacity-90"
                style={{ 
                  height: `${height}%`,
                  background: "#000000"
                }}
              >
                {/* Animated building windows */}
                <div className="grid grid-cols-2 gap-1 p-1">
                  {[...Array(Math.floor(height / 15))].map((_, j) => (
                    <div
                      key={j}
                      className="w-1 h-1 window-light"
                      style={{
                        backgroundColor: "var(--window-light)",
                        opacity: Math.random() > 0.3 ? 0.8 : 0.1,
                        animation: Math.random() > 0.7 ? `window-flicker ${2 + Math.random() * 3}s infinite` : "none"
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
          {/* Road surface - Dark asphalt */}
          <div 
            className="w-full h-full"
            style={{
              background: "linear-gradient(to bottom, var(--bg-deep-navy), var(--bg-base))"
            }}
          >
            {/* Road lines */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] flex gap-12">
              {[...Array(50)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-16 h-full"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                />
              ))}
            </div>
          </div>
          
          {/* Road edge neon glow - uses active accent color */}
          <div 
            className="absolute top-0 left-0 w-full h-[2px]"
            style={{
              background: "linear-gradient(to right, transparent 0%, var(--accent-color) 50%, transparent 100%)",
              opacity: 0.3
            }}
          />
        </div>
      </BackgroundLayer>

      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 70%, var(--bg-base) 100%)",
          opacity: 0.6
        }}
      />
      
      {/* Ambient Particles */}
      <div className="absolute inset-0 z-6 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animation: `float-particle ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
