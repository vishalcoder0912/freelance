import { motion } from 'framer-motion'

interface Props {
  title: string
  emoji: string
  unlocked?: boolean
  description?: string
  className?: string
}

export function AchievementBadge({ title, emoji, unlocked = true, description, className = '' }: Props) {
  return (
    <motion.div
      className={`flex items-center gap-3 p-3 rounded-xl ${unlocked ? 'bg-white shadow-md' : 'bg-gray-100 opacity-50'} ${className}`}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <div className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>{emoji}</div>
      <div>
        <p className="font-bold text-sm text-gray-800">{title}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
        {!unlocked && <p className="text-xs text-gray-400">Keep going!</p>}
      </div>
    </motion.div>
  )
}
