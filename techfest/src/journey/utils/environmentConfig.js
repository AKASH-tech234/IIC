/**
 * Environment Configuration
 * 
 * Defines visual states for different journey stages
 * Triggered by scroll progress
 */

export const environments = [
  {
    id: "hero",
    scrollStart: 0,
    scrollEnd: 0.15,
    name: "Dawn - Beginning",
    skyGradient: "from-[#0a0e27] via-[#1a1f3a] to-[#2a2f4a]",
    ambientLight: "rgba(56, 189, 248, 0.1)",
    roadColor: "from-[#2a2a35] to-[#1a1a25]"
  },
  {
    id: "about",
    scrollStart: 0.15,
    scrollEnd: 0.35,
    name: "Morning - Open Road",
    skyGradient: "from-[#1a1e37] via-[#2a2f4a] to-[#3a3f5a]",
    ambientLight: "rgba(56, 189, 248, 0.15)",
    roadColor: "from-[#2a2a35] to-[#1a1a25]"
  },
  {
    id: "events",
    scrollStart: 0.35,
    scrollEnd: 0.55,
    name: "Midday - Suburbs",
    skyGradient: "from-[#1a2537] via-[#2a3547] to-[#3a4557]",
    ambientLight: "rgba(59, 130, 246, 0.2)",
    roadColor: "from-[#2a2a38] to-[#1a1a28]"
  },
  {
    id: "schedule",
    scrollStart: 0.55,
    scrollEnd: 0.75,
    name: "Evening - City Approach",
    skyGradient: "from-[#1a1e37] via-[#2a2e47] to-[#3a3e57]",
    ambientLight: "rgba(168, 85, 247, 0.2)",
    roadColor: "from-[#2a2a40] to-[#1a1a30]"
  },
  {
    id: "workshops",
    scrollStart: 0.75,
    scrollEnd: 0.9,
    name: "Night - City Core",
    skyGradient: "from-[#0a0e27] via-[#1a1e37] to-[#2a2e47]",
    ambientLight: "rgba(34, 197, 94, 0.2)",
    roadColor: "from-[#2a3a2a] to-[#1a2a1a]"
  },
  {
    id: "final",
    scrollStart: 0.9,
    scrollEnd: 1.0,
    name: "Future - Arrival",
    skyGradient: "from-[#1a1e3a] via-[#2a2e4a] to-[#3a3e5a]",
    ambientLight: "rgba(139, 92, 246, 0.3)",
    roadColor: "from-[#3a3a45] to-[#2a2a35]"
  }
]

export function getEnvironmentByScroll(progress) {
  return environments.find(env => 
    progress >= env.scrollStart && progress <= env.scrollEnd
  ) || environments[0]
}
