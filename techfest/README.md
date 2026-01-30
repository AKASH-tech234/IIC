# MNNIT TechSummit 2026 - Official Website

Modern, immersive single-page application for MNNIT TechSummit 2026 featuring scroll-driven animations and cinematic parallax effects.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit: http://localhost:5173/

## 📚 Documentation

- **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** - 📖 **Complete codebase documentation for AI assistants**
  - Full architecture explanation
  - Component library reference
  - Animation system details
  - Known issues and solutions
  - Design system reference
  
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation notes and deliverables

- **[src/journey/ARCHITECTURE.md](./src/journey/ARCHITECTURE.md)** - Journey system technical architecture

## 🎨 Two Design Versions

Switch between versions in `src/App.jsx`:

```javascript
const VERSION = "journey" // "core" or "journey"
```

### Journey Version (Default)
- Vertical scroll → Horizontal parallax
- Fixed car with subtle animations
- Multi-layer environment transitions
- Cinematic, modern aesthetic

### Core Version
- Fixed innovation orb
- Vertical timeline
- Abstract, technical aesthetic

## ⚠️ Known Issues

**World Map Import Error** - `src/components/ui/world-map.jsx` has DottedMap constructor issue. See PROJECT_CONTEXT.md for details.

## 🛠️ Tech Stack

- React 19 + Vite (Rolldown)
- GSAP 3 + ScrollTrigger
- Framer Motion
- Tailwind CSS 4
- Three.js (optional 3D)

## 📱 Features

✅ Scroll-driven parallax animations  
✅ Mobile responsive  
✅ Accessibility support (reduced motion)  
✅ GPU-accelerated performance  
✅ Glass morphism UI  
✅ Dynamic environment transitions  


## Assets & Attributions

- Car Model by **Ignition Labs**  
  License: **CC-BY 3.0**  
  Source: https://poly.pizza/m/5zUWP5UsLg-  
  License details: https://creativecommons.org/licenses/by/3.0/

---

*Built with ❤️ for MNNIT TechSummit 2026*
