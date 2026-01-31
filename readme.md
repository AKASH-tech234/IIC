# MNNIT TechSummit 2026

Cinematic single-page web experience for TechSummit 2026 featuring a 3D car journey through innovation milestones, scroll-driven storytelling, and a Tron-inspired UI aesthetic.

## 🎨 Design Philosophy

**Tron-Inspired Aesthetic**
- Neon-on-dark color palette with cyan accent highlights
- Strong silhouettes and geometric precision
- Hero vehicle as narrative anchor throughout the journey
- Calm, cinematic motion prioritizing readability over flashiness

**Scroll as Journey**
- User "drives" through milestones rather than browsing sections
- Spatially grounded 3D environment with physically-based camera
- Motion scales intelligently across device sizes (mobile, tablet, desktop)

## 🛠️ Tech Stack

**Frontend Core**
- React 18.2 + Vite (Rolldown)
- GSAP 3.14 + ScrollTrigger (cinematic timeline orchestration)
- Framer Motion 12.29 (micro-interactions)
- Tailwind CSS 4.1 (utility-first styling)

**3D Graphics**
- Three.js 0.182
- React Three Fiber 8.15 (declarative Three.js)
- React Three Drei 9.88 (3D helpers and loaders)

**Smooth Scrolling & Auth**
- Lenis 1.0 (smooth scroll physics)
- Auth0 2.2 (secure authentication)

## 🏗️ Architecture Overview

### Core Orchestration Layer
```
src/
├── App.jsx                    # Route controller (/, /register, /dashboard)
├── AppJourney.jsx             # Main journey orchestrator
├── main.jsx                   # React root + Auth0 provider
└── index.css                  # Global styles + Tailwind directives
```

### Director Pattern (Phase 10-11)
**Single Sources of Truth for Behavior**

```
src/journey/
├── SceneDirector.js           # 3D scene phases, camera modes, motion density
├── UIDirector.js              # GSAP timeline beats, timing constants, animation rules
└── DeviceDirector.js          # Device classification, motion scaling, camera permissions
```

**Key Principles:**
- No component decides its own animation speed
- All GSAP timelines pass through `applyDeviceMotionScaling()`
- Camera breathing/FOV shifts respect device capabilities
- Desktop: 1.0x motion | Tablet: 0.6x motion | Mobile: 0.3x motion

### 3D Scene Composition (Three.js)
```
src/three/
├── Scene.jsx                  # Canvas + fog + lighting coordination
├── Camera.jsx                 # Chase camera with device-aware breathing
├── Car.jsx                    # 3D car with spline-aligned motion
├── Road.jsx                   # TubeGeometry road following spline curve
├── City.jsx                   # Parallax city layers
├── Sky.jsx                    # Gradient sky with horizon glow
├── Ground.jsx                 # Ground plane with grid
├── Lights.jsx                 # Directional + ambient lighting
└── curveUtils.js              # Spline curve utilities
```

**3D Pipeline:**
1. `curveUtils.js` defines the journey spline (CatmullRomCurve3)
2. `Road.jsx` generates TubeGeometry from spline
3. `Car.jsx` follows spline position based on scroll progress
4. `Camera.jsx` chases car with local offset (always behind)
5. `City.jsx` + `Ground.jsx` create depth parallax

### Journey Sections (UI Layer)
```
src/journey/sections/
├── JourneyHero.jsx            # Hero title + tagline + CTA (letter-spacing compression)
├── JourneyAbout.jsx           # About points with alternating side entry
├── JourneyEvents.jsx          # Event cards with left/right cinematic entry
├── JourneySchedule.jsx        # Day carousel with horizontal reveal
├── JourneyWorkshops.jsx       # Workshop cards with 3D pin hover effect
├── JourneyFinalCTA.jsx        # Final destination with camera tilt
└── JourneyFooter.jsx          # World map + social links
```

**GSAP Timeline Pattern (Enforced):**
```javascript
const tl = gsap.timeline({ paused: true })
applyDeviceMotionScaling(tl)  // MANDATORY device scaling

// Build animation timeline...
tl.to(element, { opacity: 1, duration: 0.5 })

// ScrollTrigger integration
ScrollTrigger.create({
  trigger: sectionRef.current,
  onEnter: () => resetTimelineForEntry(tl).play(),
  onLeave: () => applyExitBehavior(tl)
})
```

### UI Components
```
src/components/
├── cursor/
│   ├── CustomCursor.jsx       # Custom cursor with hover effects
│   └── cursor.css             # Cursor-specific styles
└── ui/
    ├── GlassNavbar.jsx        # Glassmorphic navigation
    ├── apple-cards-carousel.jsx # Interactive flip cards
    ├── 3d-pin.jsx             # Hover 3D lift effect
    ├── world-map.jsx          # Dotted world map visualization
    └── [other UI components]
```

### Layout & Pages
```
src/layout/
├── Navbar.jsx                 # Main navigation wrapper
└── Footer.jsx                 # (Legacy - replaced by JourneyFooter)

src/pages/
├── Register.jsx               # Auth0 registration page
├── Dashboard.jsx              # User dashboard (coming soon)
└── WIP.jsx                    # Work-in-progress placeholder
```

### Design System
```
src/styles/
├── identity.tokens.js         # Brand colors, accent system, CSS variable injection
└── typography.css             # Typography scale, font variables
```

**Identity System Features:**
- Brand colors (cyan primary, accent palette)
- Semantic colors (road, fog, city, glass)
- Runtime accent color injection (`--accent-color`)
- Device-aware typography limits (via DeviceDirector)

## 🎬 How GSAP is Used

**Timeline Orchestration**
- Every journey section has a master timeline (paused by default)
- ScrollTrigger controls play/reverse based on scroll position
- Device scaling automatically adjusts animation speed
- Exit animations run 30% faster than entries (cinematic cut)

**Animation Patterns:**
- **Hero:** Letter-spacing compression (3.5em → 0.15em)
- **About:** Alternating side entry (left/right with opacity fade)
- **Events:** Cards enter from left (0,1) and right (2,3,4)
- **Schedule:** Horizontal reveal from right with stagger
- **Workshops:** Standard fade-in with 3D hover lift
- **Final:** Arrival stillness (no directional motion)

**Performance:**
- `willChange: transform` on animated elements
- `frameloop: demand` for Three.js canvas (only renders on change)
- Motion reduced on mobile devices (30% speed)

## 🎮 Scroll Physics

**Lenis Integration**
- Smooth scroll with custom damping
- Synced with GSAP ScrollTrigger
- Respects `prefers-reduced-motion`
- Scroll velocity tracked for camera dampening

## 📱 Device-Aware Behavior

**Breakpoints (DeviceDirector):**
- Desktop: ≥1280px (full experience)
- Tablet: 768-1279px (calmer motion)
- Mobile: <768px (minimal motion, stable camera)

**Adaptive Features:**
- **Motion Scaling:** Desktop 1.0x | Tablet 0.6x | Mobile 0.3x
- **Camera Breathing:** Desktop full | Tablet 0.5x | Mobile off
- **FOV Shifts:** Desktop/Tablet yes | Mobile no (stable FOV)
- **Typography Limits:** Max font sizes per device

## 📂 Key Files Deep Dive

### `AppJourney.jsx`
**Responsibilities:**
- Initialize DeviceDirector on mount
- Manage scroll progress refs (shared with 3D scene)
- Coordinate Scene component props (scroll, phase, velocity)
- Render journey sections in DOM order

### `SceneDirector.js`
**Responsibilities:**
- Define scene phases (HERO, TURN_1, EVENTS, TURN_2, FINAL)
- Map scroll progress to phase transitions
- Provide motion density per phase (0.3 = calm, 1.0 = active)
- Define camera modes per segment

### `UIDirector.js`
**Responsibilities:**
- Define UI animation beats per section
- Timing constants (fast: 0.2s, normal: 0.35s, slow: 0.5s)
- Exit multiplier (0.7x for faster exits)
- Validation helpers for timeline patterns

### `DeviceDirector.js` (Phase 11)
**Responsibilities:**
- Device classification (getDeviceType)
- Motion scaling for GSAP (applyDeviceMotionScaling)
- Camera permission checks (canCameraBreathe, canShiftFov)
- Typography limit helpers (getTypographyLimits)
- Dev-mode resize warnings

### `Camera.jsx` (Device-Aware)
**Features:**
- Chase camera (always follows car with local offset)
- Micro-breathing effect (FOV ±0.5° + Z ±0.06)
- Device scaling: mobile gets no breathing, tablet gets 50%
- FOV shifts disabled on mobile for stability
- Dampening during final CTA (slower lerp, vertical tilt)

## 🚀 Running the Project

**Development:**
```bash
cd techfest
npm install
npm run dev
```
Navigate to `http://localhost:5173`

**Production Build:**
```bash
npm run build
npm run preview
```

**Environment Variables:**
Create `.env` file in `techfest/` directory:
```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
```

## 🎯 Current Features

**Journey Experience:**
- ✅ 3D car journey with spline-aligned motion
- ✅ Scroll-driven narrative through 7 sections
- ✅ Device-aware motion scaling (mobile/tablet/desktop)
- ✅ Cinematic camera with micro-breathing
- ✅ Phase-based fog, lighting, and environment transitions

**UI & Interactions:**
- ✅ GSAP-orchestrated section animations
- ✅ Custom cursor with hover effects
- ✅ Apple-style flip cards (schedule carousel)
- ✅ 3D pin hover effects (workshops)
- ✅ World map visualization (footer)
- ✅ Glassmorphic navigation

**Pages & Auth:**
- ✅ Main journey page (/)
- ✅ Registration page with Auth0 (/register)
- ✅ Dashboard placeholder (/dashboard)

## 📐 Design Patterns

**Director Pattern:**
- Centralized behavior definitions
- No component decides its own rules
- Single source of truth for timing, motion, and device behavior

**Timeline-First Animation:**
- GSAP timelines as first-class citizens
- ScrollTrigger controls playback direction
- Components are animation targets, not animation authors

**Device-First Responsive:**
- Motion scales by device capability
- Camera behavior respects hardware limits
- Typography and layout adapt to viewport

## 🔮 Future Enhancements

**Potential Additions:**
- Speaker spotlight modals
- Interactive workshop registration
- Real-time event countdown
- User profile dashboard features
- Newsletter signup integration
- Social media share functionality

## 📄 License

MNNIT TechSummit 2026 - Educational Project
