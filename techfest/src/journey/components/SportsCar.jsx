/**
 * Sports Car SVG Component
 * 
 * Minimal, clean sports car silhouette
 * Designed for neon underglow effect
 */
export default function SportsCar() {
  return (
    <svg
      width="160"
      height="60"
      viewBox="0 0 320 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="car-svg"
    >
      {/* Body */}
      <path
        d="M30 80 L70 40 H200 L260 80 Z"
        fill="url(#bodyGradient)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />

      {/* Roof */}
      <path
        d="M90 40 L130 20 H190 L210 40 Z"
        fill="#0EA5E9"
        opacity="0.3"
      />

      {/* Wheels */}
      <circle cx="90" cy="85" r="14" fill="#020617" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <circle cx="90" cy="85" r="8" fill="#0F172A" />
      
      <circle cx="220" cy="85" r="14" fill="#020617" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <circle cx="220" cy="85" r="8" fill="#0F172A" />

      {/* Headlights - LED strips */}
      <rect x="250" y="60" width="20" height="6" rx="2" fill="var(--accent-color)" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </rect>

      {/* Underglow - uses accent color */}
      <ellipse
        cx="160"
        cy="92"
        rx="110"
        ry="10"
        fill="var(--accent-color)"
        opacity="0.35"
        style={{ filter: "blur(8px)" }}
      />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
    </svg>
  )
}
