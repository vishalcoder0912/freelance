import { motion } from 'framer-motion'
import { AchievementBadge } from '../../components/AchievementBadge'

interface Badge {
  id: string
  title: string
  emoji: string
  description: string
  unlocked: boolean
}

interface Props {
  badges: Badge[]
  totalStars: number
  level: number
}

const levelColors = ['from-gray-400 to-gray-300', 'from-yellow-400 to-yellow-600', 'from-blue-400 to-purple-500', 'from-orange-400 to-red-500', 'from-green-400 to-teal-500']
const levelNames = ['Beginner', 'Bronze', 'Silver', 'Gold', 'Platinum']

export function RewardSystem({ badges, totalStars, level }: Props) {
  return (
    <div className="p-4">
      <motion.div
        className={`bg-gradient-to-r ${levelColors[level] || levelColors[0]} rounded-2xl p-6 text-white text-center shadow-lg mb-6`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-4xl mb-2">
          {level === 0 ? '🌱' : level === 1 ? '⭐' : level === 2 ? '🌙' : level === 3 ? '👑' : '💎'}
        </div>
        <h2 className="text-2xl font-bold font-fredoka">{levelNames[level] || 'Beginner'} Level</h2>
        <div className="flex justify-center items-center gap-1 mt-2">
          <span className="text-2xl">⭐</span>
          <span className="text-lg font-bold">{totalStars} Stars</span>
        </div>
      </motion.div>

      <h3 className="font-bold text-gray-700 mb-4 text-lg">Achievements</h3>
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <AchievementBadge key={badge.id} {...badge} />
        ))}
      </div>

      <div className="mt-6 bg-white rounded-2xl p-4 shadow-md">
        <h3 className="font-bold text-gray-700 mb-3">Next Reward</h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{level < 4 ? ['🌱', '⭐', '🌙', '👑', '💎'][level + 1] || '🏆' : '🏆'}</span>
          <div>
            <p className="font-bold text-sm">{level < 4 ? levelNames[level + 1] : 'Max Level'} Level</p>
            <p className="text-xs text-gray-500">
              {level === 0 ? 'Get 10 stars' : level === 1 ? 'Get 25 stars' : level === 2 ? 'Get 50 stars' : 'Get 100 stars'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
