/** Classes - Grid of class-level cards that navigate to the learning dashboard. */
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { ClassLevel } from '../shared/learning-engine/LearningEngine'

/* ---------- Available class levels ---------- */
const classes: { level: ClassLevel; name: string; emoji: string; desc: string; color: string; students: string }[] = [
  { level: 'kindergarten', name: 'Kindergarten', emoji: '🌈', desc: 'ABCs, Colors, Shapes, Animals & Fun!', color: 'from-pink-400 via-orange-400 to-yellow-400', students: 'Ages 3-4' },
  { level: 'nursery', name: 'Nursery', emoji: '🌱', desc: 'A-Z, 1-20, Fruits, Stories & Games', color: 'from-green-400 via-teal-400 to-blue-400', students: 'Ages 3-4' },
  { level: 'lkg', name: 'LKG', emoji: '📚', desc: 'Phonics, Reading, Counting, Science & Math', color: 'from-blue-400 via-indigo-400 to-purple-400', students: 'Ages 4-5' },
  { level: 'ukg', name: 'UKG', emoji: '🎓', desc: 'English, Math, EVS, GK, Coding & Creativity', color: 'from-purple-400 via-pink-400 to-red-400', students: 'Ages 5-6' },
]

export function Classes() {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ---------- Page heading ---------- */}
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-fredoka text-gray-800">Choose Your Class</h1>
        <p className="text-gray-500 mt-2">Select a class to start learning!</p>
      </motion.div>

      {/* ---------- Class-level cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((c, i) => (
          <motion.button key={c.level} onClick={() => navigate(`/${c.level}`)}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${c.color} rounded-3xl p-8 text-white shadow-xl text-left relative overflow-hidden group`}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}>
            {/* Background emoji decoration */}
            <div className="absolute top-4 right-4 text-6xl opacity-30 group-hover:scale-110 transition-transform">{c.emoji}</div>
            <div className="relative z-10">
              <span className="text-5xl mb-4 block">{c.emoji}</span>
              <h2 className="text-3xl font-fredoka mb-2">{c.name}</h2>
              <p className="text-white/90 mb-2">{c.desc}</p>
              {/* Age / student tag */}
              <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-bold">{c.students}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
