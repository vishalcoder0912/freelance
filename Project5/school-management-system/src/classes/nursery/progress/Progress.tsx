import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { AchievementBadge } from '../../../shared/components/AchievementBadge'
import { nurseryModules, calculateLevel } from '../../../shared/learning-engine/LearningEngine'
import { ArrowLeft, Star, Trophy, TrendingUp } from 'lucide-react'

const progressBadges = [
  { id: 'welcome', title: 'Welcome', emoji: '👋', description: 'Started learning!', unlocked: true },
  { id: 'abc-star', title: 'ABC Star', emoji: '⭐', description: 'Complete all alphabets', unlocked: false },
  { id: 'number-ninja', title: 'Number Ninja', emoji: '🔢', description: 'Count to 20', unlocked: false },
  { id: 'fruit-fan', title: 'Fruit Fan', emoji: '🍎', description: 'Identify all fruits', unlocked: false },
  { id: 'veggie-lover', title: 'Veggie Lover', emoji: '🥕', description: 'Learn all vegetables', unlocked: false },
  { id: 'transport-whiz', title: 'Transport Whiz', emoji: '🚗', description: 'Know all vehicles', unlocked: false },
  { id: 'story-time', title: 'Story Time', emoji: '📚', description: 'Read your first story', unlocked: false },
  { id: 'memory-champ', title: 'Memory Champ', emoji: '🧠', description: 'Win memory game', unlocked: false },
  { id: 'puzzle-pro', title: 'Puzzle Pro', emoji: '🧩', description: 'Solve all puzzles', unlocked: false },
]

export function Progress() {
  const navigate = useNavigate()

  const totalActivities = nurseryModules.reduce((sum, m) => sum + m.activities.length, 0)
  const completedActivities = nurseryModules.reduce((sum, m) => sum + m.activities.filter(a => a.completed).length, 0)
  const totalStars = nurseryModules.reduce((sum, m) => sum + m.activities.reduce((s, a) => s + a.stars, 0), 0)
  const level = calculateLevel(totalStars)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const levelNames = ['Beginner', 'Bronze', 'Silver', 'Gold', 'Platinum']
  const levelEmojis = ['🌱', '⭐', '🌙', '👑', '💎']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/nursery')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-kid-blue to-kid-purple p-6 text-center">
            <h1 className="text-3xl font-bold font-fredoka text-white">📊 My Progress</h1>
            <p className="text-white/80 mt-1">Track your learning journey!</p>
          </div>

          <div className="p-6 space-y-6">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 text-center border border-yellow-200">
                <Star className="w-8 h-8 text-kid-yellow mx-auto mb-2 fill-kid-yellow" />
                <p className="text-2xl font-bold font-fredoka text-gray-800">{totalStars}</p>
                <p className="text-xs text-gray-500 font-semibold">Total Stars</p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-4 text-center border border-green-200">
                <TrendingUp className="w-8 h-8 text-kid-green mx-auto mb-2" />
                <p className="text-2xl font-bold font-fredoka text-gray-800">{completedActivities}/{totalActivities}</p>
                <p className="text-xs text-gray-500 font-semibold">Activities Done</p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-200">
                <Trophy className="w-8 h-8 text-kid-purple mx-auto mb-2" />
                <p className="text-2xl font-bold font-fredoka text-gray-800">{levelNames[level]}</p>
                <p className="text-xs text-gray-500 font-semibold">Current Level</p>
              </motion.div>
            </motion.div>

            <div>
              <h2 className="text-lg font-bold font-fredoka text-gray-800 mb-3">Overall Progress</h2>
              <ProgressBar
                value={completedActivities}
                max={totalActivities}
                color="bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink"
                showPercent
                size="lg"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold font-fredoka text-gray-800 mb-3">Level Progress</h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{levelEmojis[level]}</span>
                <span className="font-bold text-gray-700">{levelNames[level]} Level</span>
              </div>
              <ProgressBar
                value={totalStars}
                max={(level + 1) * 25}
                color="bg-gradient-to-r from-kid-yellow to-kid-orange"
                showPercent
                size="md"
              />
              {level < 4 && (
                <p className="text-xs text-gray-400 mt-1">
                  {((level + 1) * 25)} stars needed for {levelNames[level + 1]} level
                </p>
              )}
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-bold font-fredoka text-gray-800 mb-3">Module Progress</h2>
              <div className="space-y-3">
                {nurseryModules.map((module) => {
                  const completed = module.activities.filter(a => a.completed).length
                  const total = module.activities.length
                  const stars = module.activities.reduce((s, a) => s + a.stars, 0)

                  return (
                    <motion.div
                      key={module.id}
                      variants={itemVariants}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{module.icon}</span>
                          <span className="font-bold font-fredoka text-gray-700">{module.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {stars > 0 && (
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-kid-yellow text-kid-yellow" />
                              <span className="text-xs font-bold text-kid-yellow">{stars}</span>
                            </div>
                          )}
                          <span className="text-xs font-bold text-gray-500">{completed}/{total}</span>
                        </div>
                      </div>
                      <ProgressBar
                        value={completed}
                        max={total}
                        size="sm"
                        color={`bg-gradient-to-r from-kid-${module.color} to-kid-${module.color}`}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-bold font-fredoka text-gray-800 mb-3">Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {progressBadges.map((badge) => (
                  <AchievementBadge key={badge.id} {...badge} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
