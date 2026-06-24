// Achievements - Trophy case for UKG milestones
// Displays all achievements with unlock status, progress, and animated reveal
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number // 0-100
  color: string
}

// UKG achievement definitions
const defaultAchievements: Achievement[] = [
  { id: 'reader', title: 'Super Reader', description: 'Read 10 books', icon: '📖', unlocked: false, progress: 0, color: 'blue' },
  { id: 'mathematician', title: 'Math Whiz', description: 'Complete all math lessons', icon: '🔢', unlocked: false, progress: 0, color: 'purple' },
  { id: 'artist', title: 'Creative Star', description: 'Finish 5 art activities', icon: '🎨', unlocked: false, progress: 0, color: 'pink' },
  { id: 'scientist', title: 'Little Scientist', description: 'Complete science lessons', icon: '🔬', unlocked: false, progress: 0, color: 'green' },
  { id: 'explorer', title: 'Knowledge Explorer', description: 'Finish general knowledge', icon: '🌍', unlocked: false, progress: 0, color: 'orange' },
  { id: 'gamer', title: 'Game Champion', description: 'Play all interactive games', icon: '🎮', unlocked: false, progress: 0, color: 'indigo' },
  { id: 'coder', title: 'Code Master', description: 'Solve all coding puzzles', icon: '💻', unlocked: false, progress: 0, color: 'cyan' },
  { id: 'topper', title: 'Exam Topper', description: 'Score 100% on any exam', icon: '🏆', unlocked: false, progress: 0, color: 'yellow' },
  { id: 'perfect', title: 'All Star', description: 'Unlock all achievements', icon: '🌟', unlocked: false, progress: 0, color: 'rainbow' },
]

// Color mapping for achievement cards
const colorClasses: Record<string, string> = {
  blue: 'from-kid-blue to-blue-400',
  purple: 'from-kid-purple to-kid-indigo',
  pink: 'from-kid-pink to-pink-400',
  green: 'from-kid-green to-kid-teal',
  orange: 'from-kid-orange to-orange-400',
  indigo: 'from-kid-indigo to-indigo-400',
  cyan: 'from-cyan-400 to-teal-400',
  yellow: 'from-kid-yellow to-yellow-400',
  rainbow: 'from-kid-red via-kid-purple to-kid-blue',
}

// Simulate loading achievements (from localStorage or API)
function loadProgress(): Achievement[] {
  try {
    const stored = localStorage.getItem('ukg-achievements')
    if (stored) return JSON.parse(stored)
  } catch { /* use defaults */ }
  return defaultAchievements
}

function saveProgress(achievements: Achievement[]) {
  try {
    localStorage.setItem('ukg-achievements', JSON.stringify(achievements))
  } catch { /* silent */ }
}

export function Achievements() {
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showAll, setShowAll] = useState(false)

  // Load on mount
  useEffect(() => {
    setAchievements(loadProgress())
  }, [])

  // Persist changes
  useEffect(() => {
    if (achievements.length > 0) saveProgress(achievements)
  }, [achievements])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  // Simulate unlocking next achievement (for demo)
  const simulateUnlock = () => {
    setAchievements(prev => {
      const next = prev.find(a => !a.unlocked)
      if (!next) return prev
      return prev.map(a =>
        a.id === next.id
          ? { ...a, unlocked: true, progress: 100 }
          : a.id === 'perfect' && prev.filter(x => x.id !== 'perfect').every(x => x.unlocked || x.id === next.id)
            ? { ...a, unlocked: true, progress: 100 }
            : a.id === 'perfect' && prev.filter(x => x.id !== 'perfect').every(x => x.unlocked)
              ? { ...a, unlocked: true, progress: 100 }
              : a
      )
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back navigation */}
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        {/* Header card */}
        <motion.div
          className="bg-gradient-to-r from-kid-yellow to-kid-orange rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🏆</span><span>🥇</span><span>🎖️</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Achievements</h1>
          <p className="text-white/80 text-sm">Your UKG learning milestones</p>
        </motion.div>

        {/* Overview card */}
        <motion.div
          className="bg-white rounded-3xl p-6 shadow-lg mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-5xl">{unlockedCount === totalCount ? '🌟' : unlockedCount >= totalCount / 2 ? '🏅' : '🎯'}</div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{unlockedCount}/{totalCount}</p>
              <p className="text-sm text-gray-500">Achievements Unlocked</p>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-kid-yellow to-kid-orange rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Achievement list */}
        <div className="space-y-3">
          {(showAll ? achievements : achievements.slice(0, 6)).map((achievement, i) => (
            <motion.div
              key={achievement.id}
              className={`bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 border-2 transition-all ${achievement.unlocked ? 'border-kid-green' : 'border-transparent opacity-70'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Icon with glow when unlocked */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${colorClasses[achievement.color]} ${achievement.unlocked ? 'shadow-lg' : ''}`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{achievement.title}</p>
                <p className="text-xs text-gray-500">{achievement.description}</p>
                {/* Progress bar per achievement */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${colorClasses[achievement.color]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </div>
              {/* Lock/unlock badge */}
              <div className="text-right">
                {achievement.unlocked ? (
                  <span className="text-xs font-bold text-green-500">✓ Done</span>
                ) : (
                  <span className="text-xs font-bold text-gray-400">{achievement.progress}%</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more / less toggle */}
        {achievements.length > 6 && (
          <motion.button
            onClick={() => setShowAll(s => !s)}
            className="w-full mt-4 py-3 text-center font-bold text-gray-500 bg-white rounded-2xl shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showAll ? 'Show Less' : `Show All (${achievements.length})`}
          </motion.button>
        )}

        {/* Demo unlock button (visible only in dev) */}
        {unlockedCount < totalCount && (
          <motion.button
            onClick={simulateUnlock}
            className="w-full mt-4 py-3 bg-gradient-to-r from-kid-yellow to-kid-orange text-white font-bold rounded-full shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎁 Unlock Next Achievement (Demo)
          </motion.button>
        )}

        {/* Motivational footer */}
        {unlockedCount === totalCount && (
          <motion.div
            className="mt-6 bg-gradient-to-r from-kid-yellow to-kid-orange rounded-2xl p-6 text-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-white text-2xl font-bold font-fredoka">All Achievements Unlocked!</p>
            <p className="text-white/80 text-sm">You are a UKG Champion!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
