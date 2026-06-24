import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { AchievementBadge } from '../../../shared/components/AchievementBadge'
import { kindergartenModules, calculateLevel } from '../../../shared/learning-engine/LearningEngine'
import { Trophy, Star, BarChart3, TrendingUp, Target, Sparkles, BookOpen, Gamepad2, Pencil, Music, Palette, Shapes } from 'lucide-react'

const moduleIcons: Record<string, React.ReactNode> = {
  'alphabet-world': <BookOpen className="w-4 h-4" />,
  'number-world': <Gamepad2 className="w-4 h-4" />,
  'color-learning': <Palette className="w-4 h-4" />,
  'shape-learning': <Shapes className="w-4 h-4" />,
  'animal-kingdom': <Gamepad2 className="w-4 h-4" />,
  'rhymes-zone': <Music className="w-4 h-4" />,
  'drawing-board': <Pencil className="w-4 h-4" />,
}

const activityTypeBreakdown = [
  { type: 'Games', count: 4, icon: '🎮', color: 'from-blue-400 to-blue-600' },
  { type: 'Lessons', count: 2, icon: '📖', color: 'from-green-400 to-green-600' },
  { type: 'Drawing', count: 1, icon: '✏️', color: 'from-pink-400 to-pink-600' },
  { type: 'Stories', count: 1, icon: '📚', color: 'from-purple-400 to-purple-600' },
]

const weekData = [
  { day: 'Mon', completed: 3 },
  { day: 'Tue', completed: 2 },
  { day: 'Wed', completed: 4 },
  { day: 'Thu', completed: 1 },
  { day: 'Fri', completed: 3 },
  { day: 'Sat', completed: 5 },
  { day: 'Sun', completed: 2 },
]

const recentAchievements = [
  { id: 'first-game', title: 'First Game', emoji: '🎮', description: 'Played your first learning game', unlocked: true },
  { id: 'star-5', title: 'Star Collector', emoji: '⭐', description: 'Collected 5 stars', unlocked: true },
  { id: 'module-complete', title: 'Module Complete', emoji: '✅', description: 'Finished a full module', unlocked: false },
]

export function ProgressTracker() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week')

  const totalActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.length, 0)
  const completedActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.filter(a => a.completed).length, 0)
  const totalStars = kindergartenModules.reduce((sum, m) => sum + m.activities.reduce((s, a) => s + a.stars, 0), 0)
  const level = calculateLevel(totalStars)

  const levelNames = ['Beginner', 'Bronze', 'Silver', 'Gold', 'Platinum']
  const levelEmojis = ['🌱', '⭐', '🌙', '👑', '💎']
  const overallPercent = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0

  const maxWeekValue = Math.max(...weekData.map(d => d.completed))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Progress Tracker</h1>
          </div>
          <AnimatedCharacter name="Progress" emoji="📈" size="sm" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            className="bg-gradient-to-br from-kid-blue to-kid-indigo rounded-2xl p-5 text-white shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70">Overall Progress</p>
                <p className="text-lg font-bold font-fredoka">{overallPercent}% Complete</p>
              </div>
            </div>
            <ProgressBar value={completedActivities} max={totalActivities} color="bg-white" size="md" />
            <p className="text-xs text-white/60 mt-2">{completedActivities} of {totalActivities} activities done</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-kid-orange to-kid-pink rounded-2xl p-5 text-white shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70">Total Stars</p>
                <p className="text-lg font-bold font-fredoka">{totalStars} Stars</p>
              </div>
            </div>
            <ProgressBar value={totalStars} max={100} color="bg-white" size="md" />
            <p className="text-xs text-white/60 mt-2">Level: {levelNames[level]} {levelEmojis[level]}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-kid-purple to-kid-pink rounded-2xl p-5 text-white shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70">Completion Rate</p>
                <p className="text-lg font-bold font-fredoka">{completedActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0}%</p>
              </div>
            </div>
            <ProgressBar value={completedActivities} max={totalActivities} color="bg-white" size="md" />
            <p className="text-xs text-white/60 mt-2">{totalActivities - completedActivities} activities remaining</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-md"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 font-fredoka flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-kid-blue" />
                Module Progress
              </h2>
            </div>
            <div className="space-y-4">
              {kindergartenModules.map((module) => {
                const completed = module.activities.filter(a => a.completed).length
                const total = module.activities.length
                const stars = module.activities.reduce((s, a) => s + a.stars, 0)
                return (
                  <div key={module.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{module.icon}</span>
                        <span className="text-sm font-bold text-gray-700 truncate">{module.title}</span>
                        {moduleIcons[module.id]}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {stars > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-kid-yellow text-kid-yellow" />
                            <span className="text-xs font-bold text-kid-yellow">{stars}</span>
                          </div>
                        )}
                        <span className="text-xs font-bold text-gray-400">{completed}/{total}</span>
                      </div>
                    </div>
                    <ProgressBar
                      value={completed}
                      max={total}
                      size="sm"
                      color={`bg-gradient-to-r from-kid-${module.color} to-kid-${module.color}`}
                    />
                  </div>
                )
              })}
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl p-5 shadow-md"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-kid-green" />
                Activity Breakdown
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {activityTypeBreakdown.map((item) => (
                  <motion.div
                    key={item.type}
                    className={`bg-gradient-to-br ${item.color} rounded-xl p-3 text-white`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <p className="text-xs font-bold opacity-90">{item.type}</p>
                    <p className="text-lg font-bold font-fredoka">{item.count}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-5 shadow-md"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 font-fredoka flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-kid-orange" />
                  Weekly Activity
                </h2>
                <div className="flex gap-1">
                  {(['week', 'month', 'all'] as const).map((range) => (
                    <motion.button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        timeRange === range
                          ? 'bg-kid-orange text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'All'}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-32">
                {weekData.map((data) => {
                  const height = data.completed > 0 ? (data.completed / maxWeekValue) * 100 : 5
                  return (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full bg-gradient-to-t from-kid-orange to-kid-pink rounded-t-lg min-h-[4px]"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      <span className="text-[10px] font-bold text-gray-400">{data.day}</span>
                      <span className="text-[10px] font-bold text-gray-600">{data.completed}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-kid-yellow" />
              Recent Achievements
            </h2>
            <div className="space-y-2">
              {recentAchievements.map((badge) => (
                <AchievementBadge key={badge.id} {...badge} />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-kid-green to-kid-teal rounded-2xl p-5 text-white shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-bold font-fredoka mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Learning Streak
            </h2>
            <div className="flex items-center gap-4">
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥
              </motion.div>
              <div>
                <p className="text-3xl font-bold font-fredoka">7</p>
                <p className="text-sm text-white/80">Day Streak!</p>
                <p className="text-xs text-white/60 mt-1">Keep it up! You are doing great!</p>
              </div>
            </div>
            <div className="flex gap-1 mt-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 h-2 rounded-full bg-white/30 overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
