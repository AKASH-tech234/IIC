# MNNIT TechSummit 2026 - Complete Project Context

> **Purpose**: This document provides comprehensive context for AI assistants (ChatGPT, Claude, etc.) to understand the entire codebase and suggest design solutions.

---

## ðŸ“‹ Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design Philosophy](#architecture--design-philosophy)
3. [Tech Stack](#tech-stack)
4. [File Structure](#file-structure)
5. [Two Design Versions](#two-design-versions)
6. [Core Systems Explained](#core-systems-explained)
7. [Component Library](#component-library)
8. [Animation System](#animation-system)
9. [Current Issues & Known Bugs](#current-issues--known-bugs)
10. [Performance & Optimization](#performance--optimization)
11. [Mobile Responsiveness](#mobile-responsiveness)
12. [Accessibility](#accessibility)
13. [Content & Data](#content--data)
14. [How to Suggest New Designs](#how-to-suggest-new-designs)

---

## ðŸŽ¯ Project Overview

**Project Name**: MNNIT TechSummit 2026 Website  
**Type**: Single-page application (SPA) for a technical festival/summit  
**Target**: Engineering students, tech enthusiasts, innovators  
**Theme**: Innovation, collaboration, technology journey

**Key Requirements**:
- Immersive, modern web experience
- Showcase events, schedule, workshops
- Registration CTAs throughout
- High-performance animations
- Mobile-first responsive design
- Accessibility compliant

**Current Status**: Two complete design implementations ready for production

---

## ðŸ—ï¸ Architecture & Design Philosophy

### Dual Architecture System

The project has **TWO complete implementations** that can be toggled:

```javascript
// src/App.jsx - Version Switcher
const VERSION = "journey" // Toggle: "core" or "journey"
```

**Why Two Versions?**
- Exploring different creative directions
- A/B testing potential
- Client can choose preferred aesthetic
- Educational: Shows different approaches to same content

### Design Philosophy

**Journey Version (Current Default)**:
- **Metaphor**: Horizontal journey/road trip through innovation
- **Interaction**: Vertical scroll drives horizontal parallax
- **Aesthetic**: Cinematic, modern, neon-tech without cyberpunk excess
- **Narrative**: User travels through environments as they scroll

**Core Version (Original)**:
- **Metaphor**: Abstract innovation orb with vertical timeline
- **Interaction**: Scroll activates timeline nodes sequentially
- **Aesthetic**: Symbolic, technical, engineering-focused
- **Narrative**: Linear progression through foundation â†’ engineering â†’ software

---


## ?? Tech Stack

### Core Framework
- **React 19.2.0** - Latest React with concurrent features
- **Vite** (Rolldown 7.2.5) - Ultra-fast build tool
- **JavaScript** (ES6+) - No TypeScript (pure JS)

### Animation & Motion
- **GSAP 3.14.2** + ScrollTrigger - Professional scroll-driven animations
- **Framer Motion 12.29.2** - Declarative React animations
- **Lenis 1.0.42** - Smooth scroll library

### 3D Graphics
- **Three.js 0.182.0** - WebGL 3D rendering
- **@react-three/fiber 9.5.0** - React renderer for Three.js
- **@react-three/drei 10.7.7** - Three.js helpers

### Styling
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Custom CSS Variables** - Dynamic theming
- **CSS Animations** - Keyframe animations for particles

### UI Components
- **Lucide React** - Icon library
- **Tabler Icons** - Additional icons
- **Custom UI Components** - Handcrafted components

### Utilities
- **clsx** - Conditional classNames
- **tailwind-merge** - Merge Tailwind classes intelligently

### Build Tools
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## ?? File Structure

```
techfest/
+-- public/                          # Static assets
¦   +-- images/
¦   ¦   +-- about/                   # About section images
¦   ¦   +-- events/                  # Event images
¦   ¦   +-- hero/                    # Hero section images
¦   ¦   +-- speakers/                # Speaker images
¦   +-- fonts/                       # Custom fonts (empty currently)
¦   +-- model/
¦       +-- CAR Model.glb            # 3D car model (not used in current implementation)
¦
+-- src/
¦   +-- App.jsx                      # ?? VERSION SWITCHER (core/journey)
¦   +-- AppCore.jsx                  # Innovation Core version entry
¦   +-- AppJourney.jsx               # Journey version entry (default)
¦   +-- main.jsx                     # React entry point
¦   +-- index.css                    # Global styles + CSS variables
¦   ¦
¦   +-- components/                  # Core version components
¦   ¦   +-- InnovationCore.jsx       # Orb with vertical timeline
¦   ¦   +-- cursor/
¦   ¦   ¦   +-- CustomCursor.jsx     # Custom cursor component
¦   ¦   ¦   +-- cursor.css           # Cursor styles
¦   ¦   +-- ui/                      # Shared UI components
¦   ¦       +-- 3d-marquee.jsx       # 3D marquee effect
¦   ¦       +-- 3d-pin.jsx           # 3D pin/card effect
¦   ¦       +-- AnimatedShaderBackground.jsx  # WebGL shader background
¦   ¦       +-- apple-cards-carousel.jsx      # Apple-style carousel
¦   ¦       +-- Button.jsx           # Button component
¦   ¦       +-- Card.jsx             # Card component
¦   ¦       +-- expandable-cards.jsx # Expandable card grid
¦   ¦       +-- GlassNavbar.jsx      # Glassmorphism navbar
¦   ¦       +-- hero-highlight.jsx   # Text highlight effect
¦   ¦       +-- noise-background.jsx # Noise texture background
¦   ¦       +-- SectionTitle.jsx     # Section title component
¦   ¦       +-- world-map.jsx        # ?? World map (has import issue)
¦   ¦
¦   +-- journey/                     # Journey version (NEW)
¦   ¦   +-- ARCHITECTURE.md          # Journey system architecture doc
¦   ¦   +-- components/
¦   ¦   ¦   +-- Car.jsx              # Fixed car with subtle animations
¦   ¦   ¦   +-- SportsCar.jsx        # SVG sports car design
¦   ¦   ¦   +-- BackgroundLayer.jsx  # Reusable parallax layer
¦   ¦   ¦   +-- BackgroundEnvironment.jsx  # Multi-layer parallax system
¦   ¦   +-- sections/
¦   ¦   ¦   +-- JourneyHero.jsx      # Hero section
¦   ¦   ¦   +-- JourneyAbout.jsx     # About section
¦   ¦   ¦   +-- JourneyEvents.jsx    # Events section
¦   ¦   ¦   +-- JourneySchedule.jsx  # Schedule timeline
¦   ¦   ¦   +-- JourneyWorkshops.jsx # Workshops section
¦   ¦   ¦   +-- JourneyFinalCTA.jsx  # Final call-to-action
¦   ¦   ¦   +-- JourneyFooter.jsx    # Footer with world map
¦   ¦   +-- utils/
¦   ¦       +-- environmentConfig.js # Environment color definitions
¦   ¦
¦   +-- sections/                    # Core version sections
¦   ¦   +-- Hero/, About/, Events/, Schedule/, Speakers/
¦   ¦   +-- Foundation.jsx, Engineering.jsx, Software.jsx
¦   ¦
¦   +-- layout/ hooks/ animations/ styles/ three/ lib/ assets/
¦   ¦
```

---

## ?? Two Design Versions

### Version 1: Innovation Core (Original)
**File**: src/AppCore.jsx
- Fixed orb at top-center with vertical timeline
- Sections: Foundation ? Engineering ? Software
- Status: ? Complete

### Version 2: Journey Through Innovation (Default)
**File**: src/AppJourney.jsx

**Core Mechanic**: Vertical scroll ? Horizontal parallax
- Car fixed at bottom-center
- 4-layer parallax background (speeds: 0.3, 0.6, 1.0, 1.2)
- Environment transitions via CSS variables
- Status: ? Complete (except world-map import bug)

**Sections**:
1. JourneyHero (0%)
2. JourneyAbout (15%)
3. JourneyEvents (35%)
4. JourneySchedule (55%)
5. JourneyWorkshops (75%) - Car speeds up
6. JourneyFinalCTA (95%)
7. JourneyFooter

---

## ?? Core Systems Explained

### 1. Parallax System (Journey Version)

**Location**: `src/journey/components/BackgroundEnvironment.jsx`

**How it works**:
```javascript
// AppJourney.jsx - Parallax setup
const layers = document.querySelectorAll('.bg-layer')
layers.forEach(layer => {
  const speed = parseFloat(layer.dataset.speed) || 1
  const distance = 100 * speed
  
  gsap.to(layer, {
    x: `-${distance}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5 // Smooth following
    }
  })
})
```

**4 Layers**:
- Layer 1 (Sky): speed=0.3, moves slowest
- Layer 2 (Buildings): speed=0.6, mid speed  
- Layer 3 (Objects): speed=1.0, fast
- Layer 4 (Road): speed=1.2, fastest

**Mobile Optimization**:
- Layer 3 hidden on mobile
- Reduced parallax intensity (50%)

---

### 2. Environment Color System

**Location**: `src/journey/utils/environmentConfig.js`

**CSS Variables** (dynamic):
```css
:root {
  --accent-color: #22D3EE;      /* Changes with scroll */
  --accent-purple: #A855F7;
  --accent-green: #10B981;
  --bg-base: #070617;
  --bg-deep-navy: #0a0e1a;
  --window-light: #FDE047;
}
```

**Transition Logic** (AppJourney.jsx):
```javascript
ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const progress = self.progress
    
    // Map progress to environment colors
    if (progress < 0.2) {
      setAccentColor('#22D3EE') // Cyan - Dawn
    } else if (progress < 0.4) {
      setAccentColor('#3B82F6') // Blue - Morning
    } else if (progress < 0.6) {
      setAccentColor('#A855F7') // Purple - Evening
    } else if (progress < 0.8) {
      setAccentColor('#10B981') // Green - Night
    } else {
      setAccentColor('#8B5CF6') // Violet - Future
    }
  }
})
```

---

### 3. Car Animation System

**Location**: `src/journey/components/Car.jsx`

**Key Features**:
1. **Fixed Position**: `bottom: 10vh, left: 50%, translateX(-50%)`
2. **Subtle Vibration**: 2px vertical movement, 2s loop
3. **Underglow Pulse**: Opacity 0.6-0.8, scale 1.0-1.1
4. **Speed Lines**: Triggered in Workshops section (75% scroll)
5. **Forward Tilt**: Slight x-translation with scroll

**NOT Cartoonish**:
- No spinning wheels
- No excessive bounce
- No smoke/exhaust
- Minimal, refined motion

**Mobile**: Scale 75% on mobile

---

### 4. Smooth Scroll System

**Location**: `src/hooks/useLenis.js`

```javascript
import Lenis from '@studio-freight/lenis'

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    })
    
    // Connect to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    
    // Animation loop
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])
}
```

**Accessibility**: Disabled when `prefers-reduced-motion: reduce`

---

### 5. GSAP ScrollTrigger Architecture

**Master Timeline Pattern**:
```javascript
const ctx = gsap.context(() => {
  // 1. Parallax layers
  gsap.to('.bg-layer', { x: '-100%', scrollTrigger: {...} })
  
  // 2. Environment color transitions
  ScrollTrigger.create({ onUpdate: changeColors })
  
  // 3. Car reactions
  ScrollTrigger.create({ 
    trigger: '#workshops',
    onEnter: () => speedUpCar(),
    onLeave: () => normalSpeed()
  })
  
  // 4. Section-specific animations
  gsap.from('.section-title', { opacity: 0, scrollTrigger: {...} })
})

// Cleanup
return () => ctx.revert()
```

---

## ?? Component Library

### Shared UI Components (`src/components/ui/`)

| Component | Purpose | Used In |
|-----------|---------|---------|
| `GlassNavbar.jsx` | Glassmorphism navbar | Journey version |
| `world-map.jsx` | Interactive world map | Journey footer (?? bug) |
| `AnimatedShaderBackground.jsx` | WebGL shader background | Core version |
| `3d-pin.jsx` | 3D pin card effect | Events |
| `apple-cards-carousel.jsx` | Apple-style carousel | Unused currently |
| `expandable-cards.jsx` | Expandable card grid | Unused currently |
| `hero-highlight.jsx` | Text highlight effect | Hero sections |
| `noise-background.jsx` | Noise texture overlay | Backgrounds |

### Journey-Specific Components

**Car.jsx**:
- Fixed position car with subtle animations
- Uses SportsCar.jsx for SVG design
- Glow effect synced with environment colors

**BackgroundEnvironment.jsx**:
- Multi-layer parallax system
- 4 layers: sky, buildings, objects, road
- Animated stars, windows, particles

**BackgroundLayer.jsx**:
- Reusable parallax layer wrapper
- Props: speed, zIndex, children

**SportsCar.jsx**:
- SVG sports car design
- Sleek, modern, minimalist
- Colors sync with CSS variables

---

## ?? Animation System

### Animation Libraries Usage

**GSAP (Primary)**:
- Parallax scrolling
- Timeline animations
- ScrollTrigger interactions
- Environment transitions

**Framer Motion**:
- Component mount/unmount
- Text character animations
- Button hover effects
- Modal animations

**CSS Keyframes**:
- Particle floating
- Star twinkling
- Window flicker
- Glow pulsing

### Performance Patterns

? **Good (GPU-accelerated)**:
```css
transform: translateX(-50%);
transform: translateY(10px);
opacity: 0.5;
```

? **Bad (CPU-bound)**:
```css
left: 50%;
top: 10px;
background-position: 100px 50px;
```

**will-change Usage**:
```css
.car, .bg-layer {
  will-change: transform;
}
```

---

## ?? Current Issues & Known Bugs

### 1. World Map Import Error (CRITICAL)

**File**: `src/components/ui/world-map.jsx`  
**Error**: `DottedMap is not a constructor`  
**Line**: 9

**Current Code**:
```javascript
import DottedMap from "dotted-map"
const map = useMemo(() => {
  const Map = DottedMap.default || DottedMap
  return new Map({ height: 100, grid: "diagonal" })
}, [])
```

**Issue**: The `dotted-map` package export structure doesn't match import
**Impact**: JourneyFooter crashes
**Status**: ?? Needs fix

**Attempted Fixes**:
- `import DottedMap from "dotted-map/without-countries"` ?
- `import { DottedMap } from "dotted-map"` ?
- `import DottedMap from "dotted-map"` with `.default` fallback ?

**Possible Solutions**:
1. Check actual package exports structure
2. Use alternative map library (react-simple-maps, svg-world-map)
3. Create custom static SVG world map
4. Remove world map feature temporarily

---

### 2. Three.js Scene Unused

**Location**: `src/three/`  
**Status**: Components exist but not integrated in Journey version

**Files**:
- Scene.jsx, Camera.jsx, City.jsx, Road.jsx, Lights.jsx
- Car.jsx (different from journey/components/Car.jsx)

**Note**: Could be used for future 3D enhancements

---

### 3. Empty Data Files

**Files**:
- `src/data/events.js` - Empty
- `src/data/schedule.js` - May have data
- `src/data/speakers.js` - May have data

**Impact**: Event and speaker sections may show placeholder content

---

## ?? Performance & Optimization

### Build Stats

**Journey Version**:
```
dist/index.html       0.45 kB ¦ gzip:   0.29 kB
dist/assets/index.css 72.21 kB ¦ gzip:  10.43 kB
dist/assets/index.js  380.28 kB ¦ gzip: 119.39 kB
```

**Build Time**: ~215ms  
**Status**: No errors, no warnings

### Optimization Techniques

**1. GPU Acceleration**:
```css
.bg-layer {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}
```

**2. Code Splitting**:
- GSAP plugins loaded only when needed
- Three.js components lazy-loaded

**3. Image Optimization**:
- Use WebP where supported
- Lazy load off-screen images
- Responsive image sizes

**4. Animation Optimization**:
- `scrub: 0.5` for smooth ScrollTrigger
- `ease: 'none'` for parallax (no calculations)
- Limit simultaneous animations

**5. Mobile Performance**:
- Reduced parallax layers
- Smaller car scale
- Disabled heavy effects
- Simplified backgrounds

---

## ?? Mobile Responsiveness

### Breakpoints

```javascript
// Tailwind breakpoints
sm: 640px   // Small devices
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large screens
```

### Mobile Adaptations

**Car Component**:
```jsx
<div className="scale-75 md:scale-100">
  <SportsCar />
</div>
```

**Parallax Layers**:
```jsx
<div className="hidden md:block"> {/* Layer 3 */}
  {/* Heavy animations */}
</div>
```

**Navbar**:
- Hamburger menu below 768px
- Full nav above 768px

**Typography**:
```jsx
<h1 className="text-4xl md:text-6xl lg:text-8xl">
  MNNIT TechSummit
</h1>
```

---

## ? Accessibility

### Features Implemented

**1. Reduced Motion Support**:
```javascript
// useLenis.js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
if (prefersReducedMotion.matches) {
  // Disable smooth scroll
  // Disable parallax
  // Disable car animations
}
```

**2. Semantic HTML**:
```jsx
<nav>, <main>, <section>, <article>, <footer>
<h1>, <h2>, <h3> hierarchy
<button>, <a> with proper roles
```

**3. Keyboard Navigation**:
- All CTAs focusable
- Tab order logical
- Visible focus states

**4. Color Contrast**:
- Text: white on dark backgrounds (21:1 ratio)
- CTAs: High contrast buttons
- Links: Underline on focus

**5. Screen Reader Support**:
```jsx
<button aria-label="Register for TechSummit">
  Register Now
</button>
```

---

## ?? Content & Data

### Content Structure

**Hero**:
- Title: "MNNIT TECHSUMMIT 2026"
- Subtitle: "Innovate. Collaborate. Accelerate."
- CTAs: "Register Now", "Explore the Journey"

**About**:
- Heading: "The Journey Begins"
- Content: About MNNIT and TechSummit vision

**Events**:
- Heading: "Paths of Innovation"
- Categories: Hackathons, Robotics, AI/ML, Design Thinking

**Schedule**:
- Heading: "Milestones Ahead"
- 3-day timeline with events

**Workshops**:
- Heading: "Build Along the Way"
- Technical workshops list

**Final CTA**:
- Heading: "Reach the Future"
- CTA: "Get Your Pass"

**Footer**:
- Contact: techsummit@mnnit.ac.in
- Social: Instagram, LinkedIn, Facebook
- Copyright: © 2026 MNNIT TechSummit

---

## ?? How to Suggest New Designs

### For AI Assistants (ChatGPT, Claude, etc.)

When suggesting new design solutions, consider:

#### 1. **Understand Current Architecture**
- Two complete versions exist (Core & Journey)
- Journey version uses scroll ? parallax concept
- All animations use GSAP + Framer Motion
- Mobile-first approach

#### 2. **Design Constraints**
- Must work on mobile (320px+)
- Performance: Target 60fps
- Accessibility: Support reduced motion
- Tech: React, GSAP, Tailwind only
- No TypeScript (pure JS)

#### 3. **Suggest Specific Improvements**
Examples:
- "Replace world-map.jsx with custom SVG map"
- "Add particle system to workshops section"
- "Create loading animation with car driving in"
- "Implement intersection observer for lazy loading"

#### 4. **Provide Code Patterns**
Include:
- Exact file locations
- Component structure
- GSAP/Framer Motion patterns
- Tailwind classes
- Mobile responsive variants

#### 5. **Consider Integration**
- How does it fit with existing parallax?
- Does it require new dependencies?
- What's the performance impact?
- Is it accessible?

---

## ?? Common Enhancement Requests

### UI/UX Enhancements
- [ ] Loading screen with animated car
- [ ] Section transition effects
- [ ] Scroll progress indicator
- [ ] Interactive event cards with modals
- [ ] Registration form modal
- [ ] Speaker cards with hover effects
- [ ] Image gallery/lightbox

### Animation Enhancements
- [ ] Particle effects in hero
- [ ] Mouse parallax on hover
- [ ] Text reveal animations
- [ ] Number counter animations
- [ ] Timeline progress indicators
- [ ] Button ripple effects

### Technical Enhancements
- [ ] Fix world-map import
- [ ] Add route-based navigation
- [ ] Implement backend API integration
- [ ] Add form validation
- [ ] Social media meta tags
- [ ] Analytics integration
- [ ] SEO optimization

### Content Enhancements
- [ ] Populate events.js with real data
- [ ] Add speaker profiles
- [ ] Create workshop detail pages
- [ ] Add sponsor section
- [ ] FAQs section
- [ ] Team/organizers section

---

## ??? Development Commands

```bash
# Start development server
npm run dev
# Visit: http://localhost:5173/

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Switch versions
# Edit src/App.jsx: const VERSION = "core" | "journey"
```

---

## ?? Additional Documentation

- **IMPLEMENTATION_SUMMARY.md**: Detailed implementation notes
- **src/journey/ARCHITECTURE.md**: Journey system architecture
- **README.md**: Asset attributions and licenses

---

## ?? Contributing Design Ideas

When proposing new designs:

1. **Specify the version**: Core or Journey?
2. **Define the section**: Which part are you enhancing?
3. **Provide visual reference**: Describe the effect/interaction
4. **Consider performance**: Will it work on mobile?
5. **Include code structure**: Component hierarchy and logic
6. **Think accessibility**: Keyboard, screen reader, reduced motion

---

## ?? Design System Reference

### Colors (Journey Version)

```css
/* Primary Accents (Dynamic) */
--accent-cyan: #22D3EE     /* Dawn */
--accent-blue: #3B82F6     /* Morning */
--accent-purple: #A855F7   /* Evening */
--accent-green: #10B981    /* Night */
--accent-violet: #8B5CF6   /* Future */

/* Backgrounds */
--bg-base: #070617         /* Main background */
--bg-deep-navy: #0a0e1a    /* Layer backgrounds */
--bg-city-shadow: #0f1729  /* Buildings */

/* UI Elements */
--window-light: #FDE047    /* Building windows */
--road-line: rgba(255,255,255,0.15)
--text-primary: #FFFFFF
--text-secondary: rgba(255,255,255,0.6)
```

### Typography

```css
/* Sans-serif stack (default) */
font-family: system-ui, -apple-system, sans-serif;

/* Mono for labels */
font-family: 'Courier New', monospace;

/* Sizes */
Hero: text-6xl md:text-8xl (4rem - 6rem)
Section Title: text-4xl md:text-6xl
Body: text-base md:text-lg
Label: text-xs uppercase tracking-wider
```

### Spacing

```javascript
Sections: py-32 (8rem vertical padding)
Container: max-w-7xl mx-auto px-6
Gap: gap-8 md:gap-12 (between elements)
```

---

## ?? Future Possibilities

### Advanced Features
- WebGL shader transitions between sections
- Real-time weather integration
- Live countdown timer to event
- Social media feed integration
- Virtual tour of venue
- AR experience for mobile

### Backend Integration
- User authentication
- Event registration system
- Payment gateway
- Email notifications
- Admin dashboard
- Analytics dashboard

### Multi-page Architecture
- Event detail pages
- Speaker profile pages
- Workshop registration pages
- Blog/news section
- Gallery from previous years

---

## ?? Support & Questions

**For Development Issues**:
- Check IMPLEMENTATION_SUMMARY.md
- Review journey/ARCHITECTURE.md
- Inspect browser console for errors

**For Design Questions**:
- Reference this document
- Study existing component patterns
- Test on multiple devices

---

## ? Final Notes for AI Assistants

This project showcases modern web development practices with a focus on:
- **Performance**: GPU-accelerated animations
- **Creativity**: Unique scroll-driven journey concept
- **Accessibility**: Reduced motion support, semantic HTML
- **Responsiveness**: Mobile-first, fluid design
- **Maintainability**: Clean component structure

When suggesting improvements:
1. Stay within the tech stack
2. Maintain performance standards
3. Keep accessibility in mind
4. Provide complete, working code
5. Explain the reasoning behind suggestions

**Current Priority**: Fix world-map.jsx import issue in JourneyFooter

---

*Last Updated: January 30, 2026*  
*Version: 2.0 (Journey Implementation)*  
*Status: Production-ready (except world-map bug)*
