import AppCore from "./AppCore"
import AppJourney from "./AppJourney"

/**
 * Version Switcher
 * 
 * Toggle between two design directions:
 * - AppCore: Innovation Core (orb-based) - COMPLETE
 * - AppJourney: Car Journey (cinematic scroll) - IN PROGRESS
 * 
 * Change VERSION to switch between implementations
 */

const VERSION = "journey" // "core" or "journey"

export default function App() {
  if (VERSION === "journey") {
    return <AppJourney />
  }
  
  return <AppCore />
}
