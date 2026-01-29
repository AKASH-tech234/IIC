/**
 * BackgroundLayer Component
 * 
 * Reusable parallax layer that moves horizontally based on scroll.
 * Used to build multi-layer environment system.
 * 
 * Props:
 * - speed: Parallax multiplier (0.3 = slow, 1.2 = fast)
 * - children: Visual content (shapes, gradients, etc.)
 * - className: Additional styling
 */
export default function BackgroundLayer({ speed = 1, children, className = "", zIndex = 0 }) {
  return (
    <div 
      className={`bg-layer absolute inset-0 ${className}`}
      data-speed={speed}
      style={{ 
        zIndex,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    >
      {children}
    </div>
  )
}
