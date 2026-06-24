/*
 * ProgressBar.tsx - Animated progress bar component.
 * Renders a labeled, color-coded progress bar with an optional
 * percentage display. Uses framer-motion for a spring-loaded
 * fill animation on mount.
 */

import { motion } from 'framer-motion'

interface Props {
  value: number
  max?: number
  label?: string
  color?: string
  showPercent?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/** Height classes for each size variant */
const sizes = { sm: 'h-2', md: 'h-4', lg: 'h-6' }

/**
 * ProgressBar - Displays a horizontal progress bar with label.
 * The fill bar animates from 0 to the calculated percentage on mount.
 */
export function ProgressBar({ value, max = 100, label, color = 'bg-gradient-to-r from-kid-orange to-kid-pink', showPercent, size = 'md' }: Props) {
  // Clamp percentage between 0 and 100
  const percent = Math.min((value / max) * 100, 100)

  return (
    <div className="w-full">
      {/* Label and/or percentage row */}
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-semibold text-gray-600">{label}</span>}
          {showPercent && <span className="text-sm font-bold text-gray-500">{Math.round(percent)}%</span>}
        </div>
      )}
      {/* Track */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        {/* Animated fill bar */}
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut', type: 'spring', stiffness: 50 }}
        />
      </div>
    </div>
  )
}
