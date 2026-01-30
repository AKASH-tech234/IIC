MNNIT TechSummit 2026
Cinematic single-page web experience for TechSummit 2026 featuring a 3D car journey, scroll-driven storytelling, and a Tron-inspired UI.

Design Inspiration
Tron-like neon-on-dark aesthetic with strong silhouettes and a hero vehicle as the narrative anchor.
Calm, cinematic motion that prioritizes readability and spatial grounding.
Scroll as a “journey” through milestones rather than a standard section stack.
Libraries & Tools Used
React 19 + Vite
GSAP + ScrollTrigger
Framer Motion
Tailwind CSS
Three.js + React Three Fiber
Frontend Concept & Flow
The user enters a hero scene where the car is centered and the road anchors the frame.
Scroll transitions drive the car through milestones (About, Events arc, Schedule timeline).
Events moment: all tracks appear together with connector lines while the car slows.
Schedule includes interactive day cards, plus speaker micro-interactions for each day.
The experience ends at “Reach the Future,” followed by a global reach footer.
Key Architecture
AppJourney orchestrates scroll phases and passes refs to the 3D scene.
Scene (React Three Fiber) renders car, road, lights, and environment layers.
A shared spline curve drives the road, car, and camera alignment.
Journey sections are layered above the 3D scene and timed with GSAP triggers.
Key Components
src/three/Scene.jsx – 3D scene composition (car, road, city, sky, fog).
src/three/Road.jsx – TubeGeometry road + center line synced to spline.
src/three/Car.jsx – car motion aligned to spline + phase pacing.
src/journey/sections/JourneyEvents.jsx – arc track layout with connector lines.
src/journey/sections/JourneySchedule.jsx – timeline + speakers + carousel cards.
src/components/ui/apple-cards-carousel.jsx – interactive flip cards.
Simulated Experience
A virtual “drive” through innovation milestones with a physically grounded road.
Cinematic pacing: car slows at key sections while text and cards settle.
Micro-interactions (hover lift, flip, blur fades) reinforce depth and focus.
Current Frontend Features
3D journey scene: car, road spline, camera alignment, phase-based motion
Scroll-driven sections: Hero, About timeline, Events arc, Schedule timeline
Speakers cards with micro-interactions (hover lift + image zoom)
Carousel cards with hover flip details
Custom cursor
Glass navigation and subtle UI micro-interactions
How to Run
npm install
npm run dev
