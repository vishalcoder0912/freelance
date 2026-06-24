// Counting - Interactive counting practice for LKG
// Wraps the shared CountingGame component with navigation and header
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { CountingGame } from '../../../shared/games/counting-game/CountingGame'

export function Counting() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back navigation */}
        <motion.button
          onClick={() => navigate('/lkg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to LKG
        </motion.button>

        {/* Header card */}
        <motion.div
          className="bg-gradient-to-r from-kid-orange to-kid-yellow rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🔢</span><span>🍎</span><span>⭐</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Counting Fun</h1>
          <p className="text-white/80 text-sm">Learn to count with fun objects!</p>
        </motion.div>

        {/* Counting game wrapper */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CountingGame maxNumber={10} onComplete={(score) => console.log('Counting score:', score)} />
        </motion.div>

        {/* Motivational footer */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-green to-kid-teal rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Counting is fun! Keep going!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
