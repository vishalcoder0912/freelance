import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  title: string
  value: string | number
  icon: ReactNode
  color: string
  trend?: string
  trendUp?: boolean
  onClick?: () => void
}

const colorMap: Record<string, string> = {
  blue: 'from-kid-blue to-blue-600 shadow-blue-100',
  green: 'from-kid-green to-green-600 shadow-green-100',
  orange: 'from-kid-orange to-orange-600 shadow-orange-100',
  pink: 'from-kid-pink to-pink-600 shadow-pink-100',
  purple: 'from-kid-purple to-purple-600 shadow-purple-100',
  teal: 'from-kid-teal to-teal-600 shadow-teal-100',
  indigo: 'from-kid-indigo to-indigo-600 shadow-indigo-100',
  red: 'from-kid-red to-red-600 shadow-red-100',
}

export function StatsCard({ title, value, icon, color, trend, trendUp, onClick }: Props) {
  const gradient = colorMap[color] || colorMap.blue

  return (
    <motion.div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={onClick ? { scale: 1.03, y: -3 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full bg-white/10" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          {trend && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-300/30 text-green-100' : 'bg-red-300/30 text-red-100'}`}>
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl md:text-3xl font-bold font-fredoka">{value}</p>
        <p className="text-sm opacity-80 mt-1 font-medium">{title}</p>
      </div>
    </motion.div>
  )
}
