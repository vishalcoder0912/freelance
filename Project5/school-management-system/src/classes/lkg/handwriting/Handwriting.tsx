import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { TracingGame } from '../../../shared/games/tracing-game/TracingGame'

export function Handwriting() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/lkg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to LKG
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-purple to-kid-pink rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>✍️</span><span>✏️</span><span>📝</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Handwriting Practice</h1>
          <p className="text-white/80 text-sm">Trace letters and learn to write!</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TracingGame onComplete={(score) => console.log('Tracing score:', score)} />
        </motion.div>

        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-purple to-kid-pink rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Practice makes perfect!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
