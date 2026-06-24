// Numbers - Number recognition and counting for nursery (1-20)
// Shows a grid of numbers with dot patterns; tapping opens a detail view with apples.
// Includes a separate CountingGame view for interactive play
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CountingGame } from '../../../shared/games/counting-game/CountingGame'
import { RewardScreen } from '../../../shared/components/RewardScreen'

// Generate number data from 1 to 20 with emoji and dot representation
const numberData = Array.from({ length: 20 }, (_, i) => ({
  number: i + 1,
  emoji: (['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '💯', '🔢'])[i] || '🔢',
  dots: '●'.repeat(Math.min(i + 1, 10)),
}))

export function Numbers() {
  const [showGame, setShowGame] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [selectedNum, setSelectedNum] = useState<number | null>(null)

  // Show reward when counting game score reaches 5
  const handleComplete = (score: number) => {
    if (score >= 5) {
      setShowReward(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4 md:p-6">
      {!showGame ? (
        <>
          {/* Page header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
              Numbers 1 to 20
            </h1>
            <p className="text-gray-500 mt-2">Learn to count and recognize numbers!</p>
          </motion.div>

          {/* Number grid with dot patterns */}
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-8"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {numberData.map((item) => (
              <motion.button
                key={item.number}
                onClick={() => setSelectedNum(item.number)}
                className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg border-2 border-transparent hover:border-kid-green transition-all"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl font-bold font-fredoka text-kid-green">{item.number}</div>
                <div className="text-xs text-gray-400 mt-1">{item.dots}</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Number detail modal with apple count */}
          <AnimatePresence>
            {selectedNum && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNum(null)}
              >
                <motion.div
                  className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-kid-green to-kid-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl font-bold font-fredoka text-white">{selectedNum}</span>
                  </div>
                  {/* Apples representing the count */}
                  <div className="flex justify-center gap-2 flex-wrap mb-4">
                    {Array.from({ length: selectedNum }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        🍎
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-gray-500">Number <strong>{selectedNum}</strong></p>
                  <motion.button
                    onClick={() => setSelectedNum(null)}
                    className="mt-6 bg-gradient-to-r from-kid-green to-kid-teal text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close ✨
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Launch counting game button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => setShowGame(true)}
              className="bg-gradient-to-r from-kid-green to-kid-teal text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg inline-flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Play Counting Game
            </motion.button>
          </motion.div>
        </>
      ) : (
        // Interactive counting game view
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-fredoka text-gray-800">Counting Game</h2>
            <motion.button
              onClick={() => setShowGame(false)}
              className="text-sm text-gray-500 font-semibold underline"
              whileHover={{ scale: 1.05 }}
            >
              Back to Numbers
            </motion.button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <CountingGame maxNumber={20} onComplete={handleComplete} />
          </div>
        </motion.div>
      )}

      {/* Reward screen on game completion */}
      <RewardScreen
        show={showReward}
        message="Number Champion!"
        emoji="🔢"
        onClose={() => setShowReward(false)}
      />
    </div>
  )
}
