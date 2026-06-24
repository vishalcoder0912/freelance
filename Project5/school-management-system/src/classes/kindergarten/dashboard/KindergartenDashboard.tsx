// KindergartenDashboard - Main hub for kindergarten class
// Displays greeting, progress stats, quick-access modules, achievements and mini games
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { AchievementBadge } from '../../../shared/components/AchievementBadge'
import { kindergartenModules, calculateLevel } from '../../../shared/learning-engine/LearningEngine'
import { Sparkles, Star, Music, Palette, Puzzle, Pencil, Activity, Gamepad2, Trophy, TrendingUp, Sun, Cloud, ArrowRight } from 'lucide-react'

const greetings = ['Good Morning!', 'Good Afternoon!', 'Good Evening!']
const motivationalQuotes = [
  'Every day is a great day to learn!',
  'You are a superstar! 🌟',
  'Learning is fun! Let\'s go!',
  'Little hands, big dreams!',
  'Today is full of possibilities!',
]

// Quick-access shortcuts to main learning modules
const quickActions = [
  { title: 'Alphabet', icon: '🔤', path: '/kindergarten/alphabet-world', color: 'blue' },
  { title: 'Numbers', icon: '🔢', path: '/kindergarten/number-world', color: 'green' },
  { title: 'Colors', icon: '🎨', path: '/kindergarten/color-learning', color: 'pink' },
  { title: 'Shapes', icon: '⭐', path: '/kindergarten/shape-learning', color: 'orange' },
  { title: 'Animals', icon: '🐾', path: '/kindergarten/animal-kingdom', color: 'lime' },
  { title: 'Rhymes', icon: '🎵', path: '/kindergarten/rhymes-zone', color: 'purple' },
  { title: 'Drawing', icon: '✏️', path: '/kindergarten/drawing-board', color: 'red' },
  { title: 'Activities', icon: '🎮', path: '/kindergarten/activity-center', color: 'teal' },
]

const floatingElements = ['🌸', '⭐', '🌈', '🦋', '✨', '💫', '🎈', '🌟']

export function KindergartenDashboard() {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = greetings[hour < 12 ? 0 : hour < 17 ? 1 : 2]  // Determine time-of-day greeting
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  const [showQuote, setShowQuote] = useState(true)

  // Aggregate progress data from all kindergarten modules
  const totalActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.length, 0)
  const completedActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.filter(a => a.completed).length, 0)
  const totalStars = kindergartenModules.reduce((sum, m) => sum + m.activities.reduce((s, a) => s + a.stars, 0), 0)
  const level = calculateLevel(totalStars)

  const recentBadges = [
    { id: 'welcome', title: 'Welcome', emoji: '👋', description: 'Started learning!', unlocked: true },
    { id: 'quick-learner', title: 'Quick Learner', emoji: '⚡', description: 'Complete 5 activities', unlocked: completedActivities >= 5 },
    { id: 'star-collector', title: 'Star Collector', emoji: '⭐', description: 'Collect 10 stars', unlocked: totalStars >= 10 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="fixed text-2xl pointer-events-none z-0"
          style={{
            left: `${10 + (i * 11) % 80}%`,
            top: `${5 + (i * 7) % 90}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {el}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Greeting header with animated characters and random motivational quote */}
        <motion.div
          className="bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink rounded-3xl p-6 md:p-8 text-white shadow-xl mb-6 relative overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-bold font-fredoka">
                Kindergarten Class
              </h1>
              <p className="text-white/80 text-lg">Let's learn and play together!</p>

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

            <div className="hidden md:flex items-center gap-4">
              <AnimatedCharacter name="Buddy" emoji="🦊" size="lg" />
              <AnimatedCharacter name="Lily" emoji="🐰" size="lg" />
            </div>
          </div>
        </motion.div>

        {/* Stats cards showing total stars, progress, level and badges */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
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

        <div className="mb-6">
          <ProgressBar
            value={completedActivities}
            max={totalActivities}
            label="Overall Progress"
            color="bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink"
            showPercent
            size="lg"
          />
        </div>

        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 font-fredoka">Quick Access</h2>
            <motion.button
              onClick={() => navigate('/kindergarten/activity-center')}
              className="text-sm text-kid-blue font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              whileHover={{ x: 3 }}
            >
              View All <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
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

        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4">Learning Modules</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kindergartenModules.map((module) => {
              const completed = module.activities.filter(a => a.completed).length
              const total = module.activities.length
              const stars = module.activities.reduce((s, a) => s + a.stars, 0)
              const allDone = completed === total && total > 0

              return (
                <motion.div
                  key={module.id}
                  className={`bg-white rounded-2xl p-5 shadow-md cursor-pointer hover:shadow-lg transition-all ${allDone ? 'ring-2 ring-green-400' : ''}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/kindergarten/${module.id}`)}
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${module.color}-100 rounded-xl flex items-center justify-center text-xl`}>
                      {module.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 font-fredoka truncate">{module.title}</h3>
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
                    {allDone && (
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <ProgressBar value={completed} max={total} size="sm" color={`bg-gradient-to-r from-kid-${module.color} to-kid-${module.color}`} />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

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
              onClick={() => navigate('/kindergarten/rewards')}
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
              Mini Games
            </h2>
            <p className="text-sm text-gray-500 mb-4">Fun games to boost your learning!</p>
            <div className="flex flex-wrap gap-2">
              {['🔤', '🔢', '🎨', '⭐', '🐾', '🧩', '🎵', '✏️'].map((emoji, i) => (
                <motion.button
                  key={i}
                  className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/kindergarten/mini-games')}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={() => navigate('/kindergarten/mini-games')}
              className="mt-4 bg-gradient-to-r from-kid-orange to-kid-pink text-white px-5 py-2 rounded-full text-sm font-bold shadow-md inline-flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Games <Gamepad2 className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-kid-yellow to-kid-orange rounded-2xl p-6 text-center shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center gap-4 mb-4">
            <AnimatedCharacter name="Buddy" emoji="🦊" size="lg" />
            <AnimatedCharacter name="Lily" emoji="🐰" size="lg" />
            <AnimatedCharacter name="Max" emoji="🐻" size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-white font-fredoka mb-2">Ready for an adventure?</h2>
          <p className="text-white/80 mb-4">Pick a module above and start learning!</p>
          <motion.button
            onClick={() => navigate('/kindergarten/alphabet-world')}
            className="bg-white text-kid-orange px-8 py-3 rounded-full font-bold text-lg shadow-lg inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Start! <Sparkles className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
