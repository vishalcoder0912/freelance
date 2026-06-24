// ActivityCenter - Central hub for browsing all kindergarten activities
// Supports filtering by type (game/lesson/quiz/drawing/story/assessment), search, and grid/list view
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { kindergartenModules, type Activity } from '../../../shared/learning-engine/LearningEngine'
import { ArrowLeft, Filter, Grid3X3, List, Search, Sparkles, Star, Clock, Gamepad2, BookOpen, Pencil, Music, Puzzle } from 'lucide-react'

const typeIcons: Record<string, string> = {
  game: '🎮',
  lesson: '📖',
  quiz: '❓',
  drawing: '✏️',
  story: '📚',
  assessment: '📝',
}

const typeColors: Record<string, string> = {
  game: 'blue',
  lesson: 'green',
  quiz: 'orange',
  drawing: 'pink',
  story: 'purple',
  assessment: 'red',
}

export function ActivityCenter() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Flatten all modules into a single activity list
  const allActivities = kindergartenModules.flatMap((module) =>
    module.activities.map((activity) => ({
      ...activity,
      moduleTitle: module.title,
      moduleIcon: module.icon,
      moduleColor: module.color,
      moduleId: module.id,
    }))
  )

  // Filter activities by type and search term
  const filteredActivities = allActivities.filter((activity) => {
    if (filter !== 'all' && activity.type !== filter) return false
    if (search && !activity.title.toLowerCase().includes(search.toLowerCase()) && !activity.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const filterTypes = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'game', label: 'Games', icon: '🎮' },
    { id: 'lesson', label: 'Lessons', icon: '📖' },
    { id: 'quiz', label: 'Quizzes', icon: '❓' },
    { id: 'drawing', label: 'Drawing', icon: '✏️' },
    { id: 'story', label: 'Stories', icon: '📚' },
    { id: 'assessment', label: 'Assessments', icon: '📝' },
  ]

  const completedCount = allActivities.filter(a => a.completed).length
  const totalCount = allActivities.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Activity Center</h1>
          </div>
          <AnimatedCharacter name="Activities" emoji="🎮" size="sm" />
        </motion.div>

        {/* Progress summary card */}
        <motion.div
          className="bg-gradient-to-r from-kid-teal to-kid-blue rounded-2xl p-5 text-white shadow-lg mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-fredoka">Your Activities</h2>
              <p className="text-white/80 text-sm mt-1">Explore and learn through fun activities!</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-fredoka">{completedCount}/{totalCount}</p>
              <p className="text-xs text-white/70">Completed</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={completedCount} max={totalCount} size="sm" color="bg-white" />
          </div>
        </motion.div>

        {/* Filter bar: search, type filter, and view toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-kid-teal/50"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {filterTypes.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filter === t.id
                    ? 'bg-kid-teal text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">{t.icon}</span>
                {t.label}
              </motion.button>
            ))}
          </div>

          {/* Grid/list view toggle */}
          <div className="flex items-center bg-white rounded-xl shadow-sm p-1 ml-auto">
            <motion.button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-kid-teal text-white' : 'text-gray-400'}`}
              whileTap={{ scale: 0.9 }}
            >
              <Grid3X3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-kid-teal text-white' : 'text-gray-400'}`}
              whileTap={{ scale: 0.9 }}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Activity grid/list view */}
        <AnimatePresence mode="wait">
          {filteredActivities.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <span className="text-6xl block mb-4">🔍</span>
              <p className="text-gray-500 font-bold text-lg">No activities found</p>
              <p className="text-gray-400 text-sm">Try a different filter or search term</p>
            </motion.div>
          ) : viewMode === 'grid' ? (
            // Grid view: shows activities as cards
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <GameCard
                    title={activity.title}
                    icon={<span className="text-3xl">{typeIcons[activity.type] || '📚'}</span>}
                    color={activity.moduleColor}
                    description={activity.description}
                    completed={activity.completed}
                    stars={activity.stars}
                    onClick={() => navigate(activity.path)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // List view: shows activities in a vertical list
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-4"
                  whileHover={{ scale: 1.01, x: 3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(activity.path)}
                >
                  <div className={`w-10 h-10 bg-${activity.moduleColor}-100 rounded-xl flex items-center justify-center text-lg`}>
                    {typeIcons[activity.type] || '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 font-fredoka text-sm">{activity.title}</h3>
                    <p className="text-xs text-gray-400">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-semibold uppercase">
                        {activity.type}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        {activity.moduleIcon} {activity.moduleTitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.completed && (
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {activity.stars > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Star className="w-4 h-4 fill-kid-yellow text-kid-yellow" />
                        <span className="text-xs font-bold text-kid-yellow">{activity.stars}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
