# Car Journey System Architecture

## Core Concept
User scrolls vertically → Background moves horizontally → Car stays fixed at bottom-center

## Mathematical Foundation

### Scroll → Horizontal Translation
```
scrollProgress = (scrollY / maxScroll) 
horizontalOffset = scrollProgress × totalJourneyDistance
```

### Parallax Layers (3-4 layers)
```
Layer 1 (Far):     translateX(-scrollProgress × 0.3)
Layer 2 (Mid):     translateX(-scrollProgress × 0.6)
Layer 3 (Near):    translateX(-scrollProgress × 1.0)
Road (Ground):     translateX(-scrollProgress × 1.2)
```

## Component Architecture

### 1. Car Component
**Position:** Fixed at bottom-center
```
bottom: 10vh
left: 50%
transform: translateX(-50%)
```

**Subtle Motion:**
- Idle vibration: `y: ±2px` (2s cycle)
- Light glow pulse: `opacity: 0.8-1.0`
- Speed increase effect: slight forward tilt in specific sections

**No:** Spinning wheels, excessive bounce, cartoonish effects

### 2. Background Environment System
**Structure:**
```jsx
<div className="background-container fixed inset-0">
  <Layer className="sky" speed={0.3} />
  <Layer className="mountains" speed={0.6} />
  <Layer className="buildings" speed={1.0} />
  <Layer className="road" speed={1.2} />
</div>
```

**Environments (Progressive):**
1. **Open Road** (0-20% scroll): Desert/minimal, warm tones
2. **Suburbs** (20-40%): Low buildings, trees
3. **City Approach** (40-60%): Buildings get taller
4. **City Core** (60-80%): Urban, lights, energy
5. **Future** (80-100%): Abstract, bright, optimistic

### 3. Section Milestone System
**Sections Map to Journey Progress:**
```
Hero:           0%    (idle)
About:          15%   (starting movement)
Events:         35%   (road splits visual)
Schedule:       55%   (road markers)
Workshops:      75%   (speed increases)
Final CTA:      95%   (arrival)
```

### 4. ScrollTrigger Setup
```javascript
// Master timeline
const masterTL = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5
  }
})

// Background layers
masterTL.to(".bg-layer-1", { x: "-30%" })
masterTL.to(".bg-layer-2", { x: "-60%" }, 0)
masterTL.to(".bg-layer-3", { x: "-100%" }, 0)
masterTL.to(".road", { x: "-120%" }, 0)

// Car reactions (per section)
ScrollTrigger.create({
  trigger: "#workshops",
  start: "top center",
  end: "bottom center",
  onEnter: () => speedUpEffect(),
  onLeave: () => normalSpeed()
})
```

## Mobile Strategy

**Problem:** Horizontal parallax breaks on small screens

**Solution:**
- Reduce parallax intensity (50% of desktop)
- Car smaller and closer to bottom edge
- Simplified background (2 layers instead of 4)
- Environment changes via fade, not parallax

## Performance Constraints

**Only animate:**
- `transform: translateX()` (GPU)
- `opacity` (GPU)

**Never animate:**
- `left`, `top`, `background-position` (CPU-bound)

**will-change:**
- Apply only to `.car` and `.bg-layer-*`
- Remove after section complete

## Accessibility

**prefers-reduced-motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .bg-layer { animation: none !important; }
  .car { transform: none !important; }
  /* Content remains, motion stops */
}
```

## File Structure
```
src/journey/
  components/
    Car.jsx                  # Fixed car with subtle motion
    BackgroundLayer.jsx      # Reusable parallax layer
    RoadMarker.jsx           # Milestone indicators
  sections/
    JourneyHero.jsx
    JourneyAbout.jsx
    JourneyEvents.jsx
    JourneySchedule.jsx
    JourneyWorkshops.jsx
    JourneyFinalCTA.jsx
    JourneyFooter.jsx
  utils/
    scrollMath.js            # Progress calculations
    environmentConfig.js     # Colors, speeds per env
```

## Next Step: Build Car Component First
Minimal, clean, subtle motion. No distractions.
