// Rewards - Achievement overview for LKG
// Shows LKG-specific badges, total stars, and level using the shared RewardSystem component
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { RewardSystem } from '../../../shared/games/reward-system/RewardSystem'

// LKG-specific badges
const lkgBadges = [
  { id: 'first-phonics', title: 'First Phonics', emoji: '🔤', description: 'Completed a phonics lesson', unlocked: true },
  { id: 'counting-star', title: 'Counting Star', emoji: '🔢', description: 'Counted up to 10', unlocked: true },
  { id: 'letter-writer', title: 'Letter Writer', emoji: '✍️', description: 'Traced your first letter', unlocked: true },
  { id: 'math-whiz', title: 'Math Whiz', emoji: '➕', description: 'Solved 5 math problems', unlocked: false },
  { id: 'science-explorer', title: 'Science Explorer', emoji: '🔬', description: 'Explored 3 science topics', unlocked: false },
  { id: 'reading-buddy', title: 'Reading Buddy', emoji: '📖', description: 'Read 5 words', unlocked: true },
  { id: 'quiz-master', title: 'Quiz Master', emoji: '📝', description: 'Passed an assessment', unlocked: false },
  { id: 'game-champion', title: 'Game Champion', emoji: '🎮', description: 'Played all mini games', unlocked: false },
]

export function Rewards() {
  const navigate = useNavigate()
  const totalStars = lkgBadges.filter(b => b.unlocked).length * 3
  const level = totalStars >= 50 ? 3 : totalStars >= 25 ? 2 : totalStars >= 10 ? 1 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back navigation */}
        <motion.button
          onClick={() => navigate('/lkg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to LKG
        </motion.button>

        {/* Header card */}
        <motion.div
          className="bg-gradient-to-r from-kid-yellow to-kid-orange rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🏆</span><span>⭐</span><span>🎖️</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Rewards</h1>
          <p className="text-white/80 text-sm">Your achievements and progress!</p>
        </motion.div>

        {/* Rewards card with badge grid and star/level display */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <RewardSystem badges={lkgBadges} totalStars={totalStars} level={level} />
        </motion.div>

        {/* Motivational footer */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-yellow to-kid-orange rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Keep learning to unlock more rewards!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
