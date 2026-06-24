// MemoryGames - Card matching game for nursery
// Wraps the shared MemoryCard game component with a new-game button and reward screen
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MemoryCard } from '../../../shared/games/memory-card/MemoryCard'
import { RewardScreen } from '../../../shared/components/RewardScreen'

export function MemoryGames() {
  // gameKey forces MemoryCard to remount for a fresh game
  const [gameKey, setGameKey] = useState(0)
  const [showReward, setShowReward] = useState(false)

  const handleComplete = (score: number) => {
    setShowReward(true)
  }

  const handleNewGame = () => {
    setGameKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-4 md:p-6">
      {/* Page header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
          🧠 Memory Games
        </h1>
        <p className="text-gray-500 mt-2">Flip the cards and find matching pairs!</p>
      </motion.div>

      {/* Game wrapper card */}
      <motion.div
        className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <MemoryCard key={gameKey} onComplete={handleComplete} />

        {/* New game button */}
        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <motion.button
            onClick={handleNewGame}
            className="bg-gradient-to-r from-kid-pink to-kid-purple text-white px-6 py-2 rounded-full font-bold shadow-md inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 New Game
          </motion.button>
        </div>
      </motion.div>

      {/* Reward overlay on completion */}
      <RewardScreen
        show={showReward}
        message="Memory Master!"
        emoji="🧠"
        onClose={() => setShowReward(false)}
      />
    </div>
  )
}
