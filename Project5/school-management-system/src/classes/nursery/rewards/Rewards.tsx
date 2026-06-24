// Rewards - Achievement overview for nursery
// Shows badges, total stars, and level using the shared RewardSystem component
import { motion } from 'framer-motion'
import { RewardSystem } from '../../../shared/games/reward-system/RewardSystem'
import { nurseryModules, calculateLevel } from '../../../shared/learning-engine/LearningEngine'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Nursery-specific badges
const nurseryBadges = [
  { id: 'first-letter', title: 'First Letter', emoji: '🔤', description: 'Learn your first letter', unlocked: true },
  { id: 'abc-star', title: 'ABC Star', emoji: '⭐', description: 'Complete all alphabets', unlocked: false },
  { id: 'number-ninja', title: 'Number Ninja', emoji: '🔢', description: 'Count to 20', unlocked: false },
  { id: 'fruit-fan', title: 'Fruit Fan', emoji: '🍎', description: 'Identify all fruits', unlocked: false },
  { id: 'veggie-lover', title: 'Veggie Lover', emoji: '🥕', description: 'Learn all vegetables', unlocked: false },
  { id: 'transport-whiz', title: 'Transport Whiz', emoji: '🚗', description: 'Know all vehicles', unlocked: false },
  { id: 'story-time', title: 'Story Time', emoji: '📚', description: 'Read your first story', unlocked: false },
  { id: 'memory-champ', title: 'Memory Champ', emoji: '🧠', description: 'Win memory game', unlocked: false },
  { id: 'puzzle-pro', title: 'Puzzle Pro', emoji: '🧩', description: 'Solve all puzzles', unlocked: false },
]

export function Rewards() {
  const navigate = useNavigate()
  const totalStars = nurseryModules.reduce((sum, m) => sum + m.activities.reduce((s, a) => s + a.stars, 0), 0)
  const level = calculateLevel(totalStars)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 md:p-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back navigation */}
        <button
          onClick={() => navigate('/nursery')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Rewards card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-kid-yellow to-kid-orange p-6 text-center">
            <h1 className="text-3xl font-bold font-fredoka text-white">🏆 Rewards</h1>
            <p className="text-white/80 mt-1">Your achievements and progress!</p>
          </div>

          <RewardSystem
            badges={nurseryBadges}
            totalStars={totalStars}
            level={level}
          />
        </div>
      </motion.div>
    </div>
  )
}
