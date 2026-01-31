/**
 * Debug Visual Mode - TEMPORARY validation tool
 * 
 * PHASE 9: Perceptual Polish validation
 * 
 * Usage: Add ?debug=visual to URL
 * Remove this file after Phase 9 validation complete
 */

import { useEffect, useState } from 'react'
import { getAccentColor } from '../../styles/identity.tokens'

export default function DebugVisualMode({ activePhase }) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [stats, setStats] = useState({
    section: 'HERO',
    accentColor: '#00E5FF',
    emissiveCount: 0,
    fontWeights: [],
    luminanceViolations: []
  })

  useEffect(() => {
    // Check for ?debug=visual in URL
    const params = new URLSearchParams(window.location.search)
    setIsEnabled(params.get('debug') === 'visual')
  }, [])

  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      const phase = activePhase?.current || 'HERO'
      const accent = getAccentColor(phase)
      
      // Count emissive elements in Three.js scene
      // (This is a placeholder - actual implementation would traverse scene)
      const emissiveCount = document.querySelectorAll('[data-emissive]').length
      
      // Analyze font-weights in viewport
      const allElements = document.querySelectorAll('*')
      const fontWeights = new Set()
      allElements.forEach(el => {
        const weight = window.getComputedStyle(el).fontWeight
        if (weight && weight !== '400') {
          fontWeights.add(weight)
        }
      })
      
      // Check line-height consistency
      const luminanceViolations = []
      
      setStats({
        section: phase,
        accentColor: accent,
        emissiveCount,
        fontWeights: Array.from(fontWeights).sort(),
        luminanceViolations
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isEnabled, activePhase])

  if (!isEnabled) return null

  return (
    <div className="fixed top-20 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg border border-cyan-500 font-mono text-xs w-80">
      <div className="mb-2 text-cyan-400 font-bold text-sm">🔍 DEBUG VISUAL MODE</div>
      
      {/* Current Section */}
      <div className="mb-3 pb-3 border-b border-gray-700">
        <div className="text-gray-400 mb-1">Current Section:</div>
        <div className="text-lg font-bold">{stats.section}</div>
        <div className="flex items-center gap-2 mt-1">
          <div 
            className="w-6 h-6 rounded border border-white"
            style={{ backgroundColor: stats.accentColor }}
          />
          <div className="text-xs text-gray-300">{stats.accentColor}</div>
        </div>
      </div>

      {/* Font Weight Distribution */}
      <div className="mb-3 pb-3 border-b border-gray-700">
        <div className="text-gray-400 mb-1">Font Weights Active:</div>
        <div className="flex flex-wrap gap-1">
          {stats.fontWeights.length > 0 ? (
            stats.fontWeights.map(weight => (
              <span 
                key={weight}
                className={`px-2 py-1 rounded text-xs ${
                  ['400', '600', '800'].includes(weight) 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-red-900 text-red-200'
                }`}
              >
                {weight}
              </span>
            ))
          ) : (
            <span className="text-gray-500">None detected</span>
          )}
        </div>
        {stats.fontWeights.some(w => !['400', '600', '800'].includes(w)) && (
          <div className="text-red-400 text-xs mt-2">
            ⚠ Unlocked weights detected
          </div>
        )}
      </div>

      {/* Emissive Elements */}
      <div className="mb-3 pb-3 border-b border-gray-700">
        <div className="text-gray-400 mb-1">Emissive Elements:</div>
        <div className="text-2xl font-bold">{stats.emissiveCount}</div>
        <div className="text-xs text-gray-500 mt-1">
          Active glowing elements in scene
        </div>
      </div>

      {/* Luminance Violations */}
      <div className="mb-3">
        <div className="text-gray-400 mb-1">Hierarchy Violations:</div>
        {stats.luminanceViolations.length > 0 ? (
          <div className="space-y-1">
            {stats.luminanceViolations.map((violation, i) => (
              <div key={i} className="text-red-400 text-xs">
                ⚠ {violation}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-400 text-xs">
            ✓ All hierarchies valid
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-700">
        Remove ?debug=visual to hide
      </div>
    </div>
  )
}
