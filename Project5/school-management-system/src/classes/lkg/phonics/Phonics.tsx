// Phonics - Letter sounds and word building for LKG
// Wraps the shared PhonicsGame component with navigation and header
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { PhonicsGame } from '../../../shared/games/phonics-game/PhonicsGame'

export function Phonics() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
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
          className="bg-gradient-to-r from-kid-blue to-kid-purple rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🔤</span><span>📖</span><span>✨</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Phonics Fun</h1>
          <p className="text-white/80 text-sm">Learn letter sounds and words!</p>
        </motion.div>

        {/* Phonics game wrapper */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PhonicsGame onComplete={(score) => console.log('Phonics score:', score)} />
        </motion.div>

        {/* Motivational footer */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-yellow to-kid-orange rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Keep practicing your sounds!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
