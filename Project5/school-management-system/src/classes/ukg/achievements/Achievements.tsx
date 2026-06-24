import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Star } from 'lucide-react'
import { AchievementBadge } from '../../../shared/components/AchievementBadge'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { RewardSystem } from '../../../shared/games/reward-system/RewardSystem'

const ukgBadges = [
  { id: 'first-english', title: 'First English', emoji: '📚', description: 'Completed English reading', unlocked: true },
  { id: 'math-master', title: 'Math Master', emoji: '🔢', description: 'Solved math problems', unlocked: true },
  { id: 'eco-explorer', title: 'Eco Explorer', emoji: '🌍', description: 'Explored EVS topics', unlocked: true },
  { id: 'gk-genius', title: 'GK Genius', emoji: '💡', description: 'Answered GK questions', unlocked: true },
  { id: 'creative-soul', title: 'Creative Soul', emoji: '🎨', description: 'Finished creative activities', unlocked: false },
  { id: 'coding-ninja', title: 'Coding Ninja', emoji: '💻', description: 'Solved coding puzzles', unlocked: true },
  { id: 'exam-champion', title: 'Exam Champion', emoji: '🏆', description: 'Passed with high score', unlocked: false },
  { id: 'perfect-attendance', title: 'Perfect Attendance', emoji: '📅', description: 'Never missed a day', unlocked: false },
  { id: 'super-star', title: 'Super Star', emoji: '⭐', description: 'Collected 50 stars', unlocked: false },
  { id: 'all-rounder', title: 'All Rounder', emoji: '👑', description: 'Completed all modules', unlocked: false },
]

export function Achievements() {
  const navigate = useNavigate()
  const totalStars = ukgBadges.filter(b => b.unlocked).length * 4
  const unlockedCount = ukgBadges.filter(b => b.unlocked).length
  const level = totalStars >= 50 ? 3 : totalStars >= 25 ? 2 : totalStars >= 10 ? 1 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-yellow to-kid-orange rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🏆</span><span>⭐</span><span>👑</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Achievements</h1>
          <p className="text-white/80 text-sm">Track your progress and earned rewards!</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <RewardSystem badges={ukgBadges} totalStars={totalStars} level={level} />
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-6 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 fill-kid-yellow text-kid-yellow" />
            Overall Progress
          </h2>
          <ProgressBar
            value={unlockedCount}
            max={ukgBadges.length}
            label="Badges Unlocked"
            color="bg-gradient-to-r from-kid-yellow to-kid-orange"
            showPercent
            size="lg"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 font-fredoka">{totalStars}</p>
              <p className="text-xs text-gray-500">Total Stars</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 font-fredoka">{['🌱', '⭐', '🌙', '👑', '💎'][level]}</p>
              <p className="text-xs text-gray-500">Current Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 font-fredoka">{unlockedCount}/{ukgBadges.length}</p>
              <p className="text-xs text-gray-500">Badges</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4">All Badges</h2>
          <div className="grid grid-cols-2 gap-3">
            {ukgBadges.map((badge) => (
              <AchievementBadge key={badge.id} {...badge} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-yellow to-kid-orange rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Keep learning to unlock more badges!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
