import { useState } from 'react'
import { motion } from 'framer-motion'
import { PuzzleBuilder } from '../../../shared/games/puzzle-builder/PuzzleBuilder'
import { RewardScreen } from '../../../shared/components/RewardScreen'

export function Puzzles() {
  const [gameKey, setGameKey] = useState(0)
  const [showReward, setShowReward] = useState(false)

  const handleComplete = (score: number) => {
    setShowReward(true)
  }

  const handleNewGame = () => {
    setGameKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 md:p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
          🧩 Puzzles
        </h1>
        <p className="text-gray-500 mt-2">Solve the puzzles and reveal the picture!</p>
      </motion.div>

      <motion.div
        className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <PuzzleBuilder key={gameKey} onComplete={handleComplete} />

        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <motion.button
            onClick={handleNewGame}
            className="bg-gradient-to-r from-kid-orange to-kid-red text-white px-6 py-2 rounded-full font-bold shadow-md inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 New Puzzle
          </motion.button>
        </div>
      </motion.div>

      <RewardScreen
        show={showReward}
        message="Puzzle Master!"
        emoji="🧩"
        onClose={() => setShowReward(false)}
      />
    </div>
  )
}
