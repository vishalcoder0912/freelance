// File: PuzzleBuilder — Sequential puzzle game: click pieces in the correct order to reveal the hidden emoji.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

const puzzles = [
  { emoji: '🐱', pieces: ['👂', '👀', '👃', '👄'] },
  { emoji: '🌸', pieces: ['🌱', '🌿', '🌺', '🌸'] },
  { emoji: '🚗', pieces: ['🚙', '🚗', '🚕', '🚓'] },
  { emoji: '🏠', pieces: ['🧱', '🪟', '🚪', '🏠'] },
  { emoji: '🌈', pieces: ['🔴', '🟠', '🟡', '🌈'] },
]

interface Props { onComplete?: (score: number) => void }

export function PuzzleBuilder({ onComplete }: Props) {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [placed, setPlaced] = useState<string[]>([])
  const [showReward, setShowReward] = useState(false)
  const [dragItem, setDragItem] = useState<string | null>(null)

  const puzzle = puzzles[puzzleIndex]
  const shuffled = [...puzzle.pieces].sort(() => Math.random() - 0.5)

  const handleDrop = (item: string) => {
    if (placed.includes(item)) return
    const newPlaced = [...placed, item]
    setPlaced(newPlaced)
    if (newPlaced.length === puzzle.pieces.length) {
      if (puzzleIndex < puzzles.length - 1) {
        setTimeout(() => {
          setPuzzleIndex(i => i + 1)
          setPlaced([])
        }, 1500)
      } else {
        setTimeout(() => {
          setShowReward(true)
          onComplete?.(puzzleIndex + 1)
        }, 500)
      }
    }
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-600 font-bold">Solve the Puzzle!</p>
        <div className="flex justify-center gap-1 mt-2">
          {puzzles.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i <= puzzleIndex ? 'bg-kid-green' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <motion.div className="text-center mb-6" key={puzzleIndex}>
        <div className="text-6xl bg-white rounded-2xl shadow-lg p-8 inline-block min-w-[120px]">
          <motion.span
            animate={{ scale: placed.length === puzzle.pieces.length ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            {placed.length === puzzle.pieces.length ? puzzle.emoji : '❓'}
          </motion.span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Pieces: {placed.length}/{puzzle.pieces.length}</p>
      </motion.div>

      <div className="max-w-xs mx-auto">
        <div className="grid grid-cols-2 gap-2 mb-4 min-h-[80px]">
          {placed.map((item, i) => (
            <motion.div key={i} className="bg-green-50 rounded-xl p-3 text-center text-3xl border-2 border-green-300"
              initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {item}
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          {shuffled.filter(p => !placed.includes(p)).map((piece) => (
            <motion.button
              key={piece}
              onClick={() => handleDrop(piece)}
              className="bg-white rounded-xl p-4 text-3xl shadow-md hover:shadow-lg cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              {piece}
            </motion.button>
          ))}
        </div>
      </div>

      <RewardScreen show={showReward} message="Puzzle Master!" emoji="🧩" onClose={() => setShowReward(false)} />
    </div>
  )
}
