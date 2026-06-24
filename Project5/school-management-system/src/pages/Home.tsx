/** Home - Landing page hero, feature cards, class selector, and footer. */
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Gamepad2, Users, BookOpen, Sparkles, ArrowRight, Star, School, Trophy } from 'lucide-react'
import { AnimatedCharacter } from '../shared/components/AnimatedCharacter'

/* ---------- Feature cards data ---------- */
const features = [
  { icon: <School className="w-6 h-6" />, title: 'Smart Classes', desc: 'Pre-Primary to K-12', color: 'from-blue-400 to-blue-600' },
  { icon: <Gamepad2 className="w-6 h-6" />, title: 'Interactive Games', desc: 'Learn while playing', color: 'from-green-400 to-green-600' },
  { icon: <Trophy className="w-6 h-6" />, title: 'Achievements', desc: 'Earn rewards & badges', color: 'from-orange-400 to-orange-600' },
  { icon: <Users className="w-6 h-6" />, title: 'Portals', desc: 'Admin, Teacher, Parent', color: 'from-purple-400 to-purple-600' },
]

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['⭐', '🌟', '✨', '🌈', '🎈', '🎉'].map((e, i) => (
            <motion.span key={i} className="absolute text-2xl" style={{ top: `${10 + i * 15}%`, left: `${5 + i * 15}%` }}
              animate={{ y: [-20, 20, -20], opacity: [0.3, 1, 0.3] }} transition={{ duration: 3 + i, repeat: Infinity }}>
              {e}
            </motion.span>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-kid-yellow" />
              <span className="text-sm font-bold text-kid-purple">K-12 School Management Platform</span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl font-fredoka text-gray-800 mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Where Learning
              <span className="bg-gradient-to-r from-kid-orange to-kid-pink bg-clip-text text-transparent"> Becomes Fun!</span>
            </motion.h1>

            <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              An engaging, interactive school management platform for Kindergarten through Class 12.
              Designed for curious minds and modern education.
            </motion.p>

            <motion.div className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <button onClick={() => navigate('/classes')}
                className="bg-gradient-to-r from-kid-orange to-kid-pink text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2">
                Start Learning <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/login')}
                className="bg-white text-gray-700 px-8 py-3 rounded-full font-bold text-lg shadow-md border border-gray-200">
                Teacher / Parent Login
              </button>
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <AnimatedCharacter name="Buddy" emoji="🦊" size="lg" />
            <AnimatedCharacter name="Luna" emoji="🦉" size="lg" />
            <AnimatedCharacter name="Max" emoji="🐶" size="lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.h2 className="text-3xl font-fredoka text-center text-gray-800 mb-8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          Explore Features
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${f.color} rounded-2xl p-6 text-white shadow-lg`}
              whileHover={{ y: -4, scale: 1.02 }}>
              <div className="bg-white/20 rounded-xl w-12 h-12 flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg font-fredoka">{f.title}</h3>
              <p className="text-sm text-white/80">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-kid-blue to-kid-indigo py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 className="text-3xl font-fredoka text-white mb-6"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            Choose Your Class
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Kindergarten', emoji: '🌈', color: 'from-pink-400 to-orange-400', path: '/kindergarten' },
              { name: 'Nursery', emoji: '🌱', color: 'from-green-400 to-teal-400', path: '/nursery' },
              { name: 'LKG', emoji: '📚', color: 'from-blue-400 to-purple-400', path: '/lkg' },
              { name: 'UKG', emoji: '🎓', color: 'from-purple-400 to-pink-400', path: '/ukg' },
            ].map((c, i) => (
              <motion.button key={i} onClick={() => navigate(c.path)}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${c.color} rounded-2xl p-6 shadow-lg text-white`}
                whileHover={{ scale: 1.05, y: -4 }}>
                <span className="text-4xl block mb-2">{c.emoji}</span>
                <span className="font-bold font-fredoka">{c.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 KidoSchool. Making learning fun for every child.</p>
        </div>
      </footer>
    </div>
  )
}
