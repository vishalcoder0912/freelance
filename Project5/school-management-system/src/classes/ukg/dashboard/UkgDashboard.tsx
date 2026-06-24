// UkgDashboard - Main landing page for UKG class
// Shows greeting, stats cards, progress bar, quick access grid, learning modules, achievements, and fun activities
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { AchievementBadge } from '../../../shared/components/AchievementBadge'
import { ukgModules, calculateLevel } from '../../../shared/learning-engine/LearningEngine'
import { Sparkles, Star, TrendingUp, Trophy, Activity, Sun, ArrowRight, Gamepad2 } from 'lucide-react'

// Greeting messages based on time of day
const greetings = ['Good Morning!', 'Good Afternoon!', 'Good Evening!']
const quotes = [
  'Big learners start here!',
  'You are amazing! Keep going!',
  'Every question makes you smarter!',
  'Learning is an adventure!',
  'Believe in yourself!',
]

// Quick-access navigation cards
const quickActions = [
  { title: 'English', icon: '📚', path: '/ukg/english', color: 'blue' },
  { title: 'Math', icon: '🔢', path: '/ukg/mathematics', color: 'green' },
  { title: 'Science', icon: '🌍', path: '/ukg/environmental-science', color: 'lime' },
  { title: 'GK', icon: '💡', path: '/ukg/general-knowledge', color: 'orange' },
  { title: 'Art', icon: '🎨', path: '/ukg/creative-zone', color: 'pink' },
  { title: 'Coding', icon: '💻', path: '/ukg/coding-for-kids', color: 'purple' },
  { title: 'Games', icon: '🎮', path: '/ukg/interactive-games', color: 'red' },
  { title: 'Exams', icon: '📋', path: '/ukg/exams', color: 'teal' },
]

// Floating decorative background elements
const floatingElements = ['🌟', '📚', '🌈', '🦋', '✨', '💫', '🎓', '🏆', '🔢', '🧠']

export function UkgDashboard() {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = greetings[hour < 12 ? 0 : hour < 17 ? 1 : 2]
  const quote = quotes[Math.floor(Math.random() * quotes.length)]
  const [showQuote, setShowQuote] = useState(true)

  // Progress stats derived from UKG learning modules
  const totalActivities = ukgModules.reduce((sum, m) => sum + m.activities.length, 0)
  const completedActivities = ukgModules.reduce((sum, m) => sum + m.activities.filter(a => a.completed).length, 0)
  const totalStars = ukgModules.reduce((sum, m) => sum + m.activities.reduce((s, a) => s + a.stars, 0), 0)
  const level = calculateLevel(totalStars)

  // Recent badges relevant for UKG
  const recentBadges = [
    { id: 'welcome', title: 'Welcome', emoji: '👋', description: 'Started UKG!', unlocked: true },
    { id: 'quick-learner', title: 'Quick Learner', emoji: '⚡', description: 'Complete 5 activities', unlocked: completedActivities >= 5 },
    { id: 'star-collector', title: 'Star Collector', emoji: '⭐', description: 'Collect 10 stars', unlocked: totalStars >= 10 },
  ]

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Floating background decorations */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="fixed text-2xl pointer-events-none z-0"
          style={{ left: `${10 + (i * 11) % 80}%`, top: `${5 + (i * 7) % 90}%` }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 360], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          {el}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Greeting header hero card */}
        <motion.div
          className="bg-gradient-to-r from-kid-indigo via-kid-purple to-kid-pink rounded-3xl p-6 md:p-8 text-white shadow-xl mb-6 relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sun className="w-6 h-6 text-kid-yellow" />
                <span className="text-lg opacity-90">{greeting}</span>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold font-fredoka">UKG Class</h1>
              <p className="text-white/80 text-lg">Learn, explore, and grow every day!</p>

              {/* Dismissible motivational quote */}
              <AnimatePresence mode="wait">
                {showQuote && (
                  <motion.div
                    key={quote}
                    className="bg-white/20 rounded-xl px-4 py-2 inline-flex items-center gap-2 mt-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setShowQuote(false)}
                  >
                    <Sparkles className="w-4 h-4 text-kid-yellow" />
                    <span className="text-sm font-medium">{quote}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Character mascots */}
            <div className="hidden md:flex items-center gap-4">
              <AnimatedCharacter name="Ollie" emoji="🦉" size="lg" />
              <AnimatedCharacter name="Bella" emoji="🐰" size="lg" />
            </div>
          </div>
        </motion.div>

        {/* Stats cards row: stars, progress, level, badges */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-kid-yellow to-kid-orange rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Total Stars</p>
              <p className="text-xl font-bold text-gray-800 font-fredoka">{totalStars}</p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-kid-green to-kid-teal rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Progress</p>
              <p className="text-xl font-bold text-gray-800 font-fredoka">{completedActivities}/{totalActivities}</p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-kid-purple to-kid-pink rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Level</p>
              <p className="text-xl font-bold text-gray-800 font-fredoka">{['Beginner', 'Bronze', 'Silver', 'Gold', 'Platinum'][level]}</p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-kid-blue to-kid-indigo rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Badges</p>
              <p className="text-xl font-bold text-gray-800 font-fredoka">{recentBadges.filter(b => b.unlocked).length}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Overall progress bar */}
        <div className="mb-6">
          <ProgressBar
            value={completedActivities}
            max={totalActivities}
            label="Overall Progress"
            color="bg-gradient-to-r from-kid-indigo via-kid-purple to-kid-pink"
            showPercent
            size="lg"
          />
        </div>

        {/* Quick access navigation grid */}
        <motion.div className="mb-8" variants={containerVariants} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 font-fredoka">Quick Access</h2>
            <motion.button
              onClick={() => navigate('/ukg/interactive-games')}
              className="text-sm text-kid-indigo font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              whileHover={{ x: 3 }}
            >
              View All <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <GameCard
                key={action.title}
                title={action.title}
                icon={<span className="text-3xl">{action.icon}</span>}
                color={action.color}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </motion.div>

        {/* Learning modules section */}
        <motion.div className="mb-8" variants={containerVariants} initial="hidden" animate="visible">
          <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ukgModules.map((mod) => {
              const completed = mod.activities.filter(a => a.completed).length
              const total = mod.activities.length
              const stars = mod.activities.reduce((s, a) => s + a.stars, 0)
              const allDone = completed === total && total > 0

              return (
                <motion.div
                  key={mod.id}
                  className={`bg-white rounded-2xl p-5 shadow-md cursor-pointer hover:shadow-lg transition-all ${allDone ? 'ring-2 ring-green-400' : ''}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/ukg/${mod.id}`)}
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                      {mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 font-fredoka truncate">{mod.title}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{completed}/{total} done</span>
                        {stars > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-kid-yellow text-kid-yellow" />
                            <span className="text-xs text-kid-yellow font-bold">{stars}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Completion sparkle indicator */}
                    {allDone && (
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <ProgressBar value={completed} max={total} size="sm" color="bg-gradient-to-r from-kid-indigo to-kid-purple" />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Achievements and fun activities side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-kid-yellow" />
              Recent Achievements
            </h2>
            <div className="space-y-2">
              {recentBadges.map((badge) => (
                <AchievementBadge key={badge.id} {...badge} />
              ))}
            </div>
            <motion.button
              onClick={() => navigate('/ukg/achievements')}
              className="mt-3 text-sm text-kid-purple font-semibold flex items-center gap-1"
              whileHover={{ x: 3 }}
            >
              See all rewards <ArrowRight className="w-3 h-3" />
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-5 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-kid-orange" />
              Fun Activities
            </h2>
            <p className="text-sm text-gray-500 mb-4">Explore and learn through play!</p>
            <div className="flex flex-wrap gap-2">
              {['📚', '🔢', '🌍', '💡', '🎨', '💻', '🧩', '🎯'].map((emoji, i) => (
                <motion.button
                  key={i}
                  className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/ukg/interactive-games')}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={() => navigate('/ukg/interactive-games')}
              className="mt-4 bg-gradient-to-r from-kid-orange to-kid-pink text-white px-5 py-2 rounded-full text-sm font-bold shadow-md inline-flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now <Gamepad2 className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Call-to-action footer with mascots */}
        <motion.div
          className="bg-gradient-to-r from-kid-indigo to-kid-purple rounded-2xl p-6 text-center shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center gap-4 mb-4">
            <AnimatedCharacter name="Ollie" emoji="🦉" size="lg" />
            <AnimatedCharacter name="Bella" emoji="🐰" size="lg" />
            <AnimatedCharacter name="Rocky" emoji="🐻" size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-white font-fredoka mb-2">Excited to learn?</h2>
          <p className="text-white/80 mb-4">Choose a module and start your journey!</p>
          <motion.button
            onClick={() => navigate('/ukg/english')}
            className="bg-white text-kid-indigo px-8 py-3 rounded-full font-bold text-lg shadow-lg inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Begin! <Sparkles className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
