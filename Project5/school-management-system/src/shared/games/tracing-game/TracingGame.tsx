import { useState } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

const items = [
  { char: 'A', word: 'Apple', emoji: '🍎' },
  { char: 'B', word: 'Ball', emoji: '⚽' },
  { char: 'C', word: 'Cat', emoji: '🐱' },
  { char: 'D', word: 'Dog', emoji: '🐶' },
  { char: 'E', word: 'Elephant', emoji: '🐘' },
  { char: 'F', word: 'Fish', emoji: '🐟' },
]

interface Props { onComplete?: (score: number) => void }

export function TracingGame({ onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [traced, setTraced] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const item = items[index]

  const handleTrace = () => {
    setTraced(t => t + 1)
    if (index < items.length - 1) {
      setTimeout(() => setIndex(i => i + 1), 800)
    } else {
      setTimeout(() => setShowReward(true), 500)
      onComplete?.(items.length)
    }
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 font-bold">Progress: {index + 1}/{items.length}</p>
        <div className="flex justify-center gap-1 mt-2">
          {items.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i <= index ? 'bg-kid-green' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <motion.div className="text-center mb-8" key={index}>
        <div className="text-6xl mb-4">{item.emoji}</div>
        <motion.div
          className="text-8xl font-fredoka text-kid-blue inline-block"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {item.char}
        </motion.div>
        <p className="text-xl font-bold text-gray-600 mt-2">{item.word}</p>

        <div className="max-w-xs mx-auto mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center text-6xl font-fredoka text-gray-300 tracking-[20px] select-none">
            {item.char}
          </div>
          <div className="mt-4 h-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Trace the letter with your finger</span>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center gap-4">
        <motion.button
          onClick={handleTrace}
          className="bg-gradient-to-r from-kid-green to-kid-teal text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✓ I traced it!
        </motion.button>
      </div>

      <RewardScreen show={showReward} message="Tracing Star!" emoji="✍️" onClose={() => setShowReward(false)} />
    </div>
  )
}
