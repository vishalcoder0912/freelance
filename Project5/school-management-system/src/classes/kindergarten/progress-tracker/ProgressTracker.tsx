// ProgressTracker - Learning progress overview for kindergarten
// Tracks module activity completions, per-day progress chart, and detailed activity list
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, BookOpen, Star, TrendingUp, Calendar, Clock, Target } from 'lucide-react'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { kindergartenModules, calculateLevel } from '../../../shared/learning-engine/LearningEngine'

// Sample 14-day progress history for the line chart
const weeklyData = [
  { day: 'Mon', activities: 4, stars: 8 },
  { day: 'Tue', activities: 3, stars: 6 },
  { day: 'Wed', activities: 5, stars: 15 },
  { day: 'Thu', activities: 2, stars: 4 },
  { day: 'Fri', activities: 6, stars: 12 },
  { day: 'Sat', activities: 4, stars: 10 },
  { day: 'Sun', activities: 3, stars: 7 },
  { day: 'Mon', activities: 5, stars: 11 },
  { day: 'Tue', activities: 4, stars: 9 },
  { day: 'Wed', activities: 6, stars: 14 },
  { day: 'Thu', activities: 3, stars: 6 },
  { day: 'Fri', activities: 5, stars: 13 },
  { day: 'Sat', activities: 4, stars: 8 },
  { day: 'Sun', activities: 3, stars: 7 },
]

export function ProgressTracker() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [selectedChart, setSelectedChart] = useState<'activities' | 'stars'>('activities')

  const totalActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.length, 0)
  const completedActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.filter(a => a.completed).length, 0)
  const totalStars = kindergartenModules.reduce((sum, m) => sum + m.activities.reduce((s, a) => s + a.stars, 0), 0)
  const level = calculateLevel(totalStars)
  const overallPercent = Math.round((completedActivities / totalActivities) * 100) || 0

  const levelNames = ['Beginner', 'Bronze', 'Silver', 'Gold', 'Platinum']
  const levelEmojis = ['🌱', '⭐', '🌙', '👑', '💎']

  const toggleModule = (id: string) => setExpandedModule(expandedModule === id ? null : id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {/* Header with level display */}
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-800 font-fredoka flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-kid-blue" />
            Progress Tracker
          </h1>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
            <span>{levelEmojis[level]}</span>
            <span className="text-sm font-bold text-gray-700">{levelNames[level]}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left + center: stats cards and chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Completed */}
              <motion.div className="bg-white rounded-xl p-4 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Completed</p>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800 font-fredoka mt-1">{completedActivities}/{totalActivities}</p>
              </motion.div>
              {/* Stars earned */}
              <motion.div className="bg-white rounded-xl p-4 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Stars</p>
                  <Star className="w-4 h-4 text-kid-yellow" />
                </div>
                <p className="text-2xl font-bold text-gray-800 font-fredoka mt-1">{totalStars}</p>
              </motion.div>
              {/* Overall progress percentage */}
              <motion.div className="bg-white rounded-xl p-4 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Progress</p>
                  <TrendingUp className="w-4 h-4 text-kid-blue" />
                </div>
                <p className="text-2xl font-bold text-gray-800 font-fredoka mt-1">{overallPercent}%</p>
              </motion.div>
              {/* Level */}
              <motion.div className="bg-white rounded-xl p-4 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Level</p>
                  <Target className="w-4 h-4 text-kid-purple" />
                </div>
                <p className="text-2xl font-bold text-gray-800 font-fredoka mt-1">{level + 1}</p>
              </motion.div>
            </div>

            {/* Progress chart section */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-md" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 font-fredoka flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-kid-blue" />
                  Weekly Progress
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setSelectedChart('activities')}
                    className={`px-3 py-1 text-xs rounded-md transition ${selectedChart === 'activities' ? 'bg-white shadow-sm font-bold text-gray-800' : 'text-gray-500'}`}
                  >
                    Activities
                  </button>
                  <button
                    onClick={() => setSelectedChart('stars')}
                    className={`px-3 py-1 text-xs rounded-md transition ${selectedChart === 'stars' ? 'bg-white shadow-sm font-bold text-gray-800' : 'text-gray-500'}`}
                  >
                    Stars
                  </button>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey={selectedChart}
                      stroke={selectedChart === 'activities' ? '#3b82f6' : '#f59e0b'}
                      strokeWidth={2}
                      dot={{ fill: selectedChart === 'activities' ? '#3b82f6' : '#f59e0b', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Module activity list with expand/collapse details */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-md" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-kid-indigo" />
                Learning Modules
              </h2>
              <div className="space-y-2">
                {kindergartenModules.map((module) => {
                  const moduleCompleted = module.activities.filter(a => a.completed).length
                  const moduleStars = module.activities.reduce((s, a) => s + a.stars, 0)
                  const isExpanded = expandedModule === module.id

                  return (
                    <motion.div key={module.id} className="border border-gray-100 rounded-xl overflow-hidden" layout>
                      {/* Module header (clickable to expand) */}
                      <motion.button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{module.emoji}</span>
                          <div className="text-left">
                            <p className="font-bold text-gray-800">{module.title}</p>
                            <p className="text-xs text-gray-400">{moduleCompleted}/{module.activities.length} activities</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-kid-yellow" />
                              <span className="text-sm font-bold text-gray-600">{moduleStars}</span>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </motion.button>

                      {/* Expanded activity list for this module */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-1">
                              {module.activities.map((activity, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center justify-between p-2 rounded-lg ${activity.completed ? 'bg-green-50' : 'bg-gray-50'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={activity.completed ? 'text-green-600' : 'text-gray-400'}>
                                      {activity.completed ? '✅' : '⭕'}
                                    </span>
                                    <span className={`text-sm ${activity.completed ? 'text-green-700' : 'text-gray-500'}`}>
                                      {activity.name}
                                    </span>
                                  </div>
                                  {activity.completed && (
                                    <div className="flex items-center gap-0.5">
                                      {Array.from({ length: activity.stars }).map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Right sidebar: level progress and stats */}
          <div className="space-y-6">
            {/* Overall level progress bar */}
            <motion.div className="bg-gradient-to-br from-kid-blue to-kid-cyan rounded-2xl p-5 text-white shadow-md" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <h3 className="font-bold font-fredoka mb-1">Overall Progress</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{levelEmojis[level]}</span>
                <div>
                  <p className="text-lg font-bold font-fredoka">{levelNames[level]}</p>
                  <p className="text-xs text-white/70">Level {level + 1}</p>
                </div>
              </div>
              <ProgressBar
                value={completedActivities}
                max={totalActivities}
                color="bg-white"
                showPercent
                size="md"
              />
              <p className="text-xs text-white/60 mt-2">{completedActivities} of {totalActivities} activities completed</p>
            </motion.div>

            {/* Quick stats */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-md" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="font-bold text-gray-800 font-fredoka mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-kid-purple" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Daily Average</span>
                  <span className="font-bold text-gray-800">4 activities</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Best Day</span>
                  <span className="font-bold text-gray-800">6 activities</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Streak</span>
                  <span className="font-bold text-gray-800">5 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Stars Today</span>
                  <span className="font-bold text-gray-800">7 ⭐</span>
                </div>
              </div>
            </motion.div>

            {/* Learning tips */}
            <motion.div className="bg-gradient-to-br from-kid-orange to-kid-pink rounded-2xl p-5 text-white shadow-md" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <h3 className="font-bold font-fredoka mb-2">💡 Tip</h3>
              <p className="text-sm text-white/90">
                {level === 0
                  ? 'Start with Alphabet World and Number World to build a strong foundation!'
                  : level === 1
                  ? 'Great start! Try exploring Color Learning and Shape Learning next.'
                  : level === 2
                  ? 'You\'re doing amazing! Check out Animal Kingdom and Rhymes Zone.'
                  : level === 3
                  ? 'Almost there! Complete all activities to reach Platinum level!'
                  : 'You\'re a superstar! Keep practicing to stay sharp!'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
