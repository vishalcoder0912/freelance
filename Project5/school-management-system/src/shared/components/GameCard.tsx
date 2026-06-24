import { motion } from 'framer-motion'
import { Sparkles, Star, Lock } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  title: string
  icon: ReactNode
  color: string
  onClick?: () => void
  locked?: boolean
  completed?: boolean
  stars?: number
  description?: string
  className?: string
}

const colorMap: Record<string, string> = {
  blue: 'from-blue-400 to-blue-600 shadow-blue-200',
  green: 'from-green-400 to-green-600 shadow-green-200',
  orange: 'from-orange-400 to-orange-600 shadow-orange-200',
  pink: 'from-pink-400 to-pink-600 shadow-pink-200',
  purple: 'from-purple-400 to-purple-600 shadow-purple-200',
  yellow: 'from-yellow-400 to-yellow-600 shadow-yellow-200',
  red: 'from-red-400 to-red-600 shadow-red-200',
  teal: 'from-teal-400 to-teal-600 shadow-teal-200',
  indigo: 'from-indigo-400 to-indigo-600 shadow-indigo-200',
  lime: 'from-lime-400 to-lime-600 shadow-lime-200',
}

export function GameCard({ title, icon, color, onClick, locked, completed, stars = 0, description, className = '' }: Props) {
  const gradient = colorMap[color] || 'from-blue-400 to-blue-600 shadow-blue-200'

  return (
    <motion.button
      onClick={locked ? undefined : onClick}
      className={`relative rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white shadow-lg ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'} transition-all ${className}`}
      whileHover={locked ? {} : { scale: 1.03, y: -4 }}
      whileTap={locked ? {} : { scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl z-10">
          <Lock className="w-8 h-8 text-white" />
        </div>
      )}
      {completed && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-400 rounded-full p-1">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl">{icon}</div>
        <h3 className="font-bold text-lg font-fredoka">{title}</h3>
        {description && <p className="text-xs text-white/80">{description}</p>}
        {stars > 0 && (
          <div className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-yellow-300 text-yellow-300' : 'text-white/40'}`} />
            ))}
          </div>
        )}
      </div>
    </motion.button>
  )
}
