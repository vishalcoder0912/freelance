import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

const colors = [
  { name: 'Red', hex: '#FF6B6B', emoji: '🔴' },
  { name: 'Blue', hex: '#4A90D9', emoji: '🔵' },
  { name: 'Green', hex: '#4CAF50', emoji: '🟢' },
  { name: 'Yellow', hex: '#FFD93D', emoji: '🟡' },
  { name: 'Purple', hex: '#9C27B0', emoji: '🟣' },
  { name: 'Orange', hex: '#FF9800', emoji: '🟠' },
  { name: 'Pink', hex: '#E91E63', emoji: '💗' },
  { name: 'Brown', hex: '#795548', emoji: '🟤' },
]

interface Props { onComplete?: (score: number) => void }

export function ColorMatch({ onComplete }: Props) {
  const [currentColor, setCurrentColor] = useState<typeof colors[0] | null>(null)
  const [options, setOptions] = useState<typeof colors>([])
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const generateQuestion = () => {
    const correct = colors[Math.floor(Math.random() * colors.length)]
    const wrongOptions = colors.filter(c => c.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3)
    setCurrentColor(correct)
    setOptions([correct, ...wrongOptions].sort(() => Math.random() - 0.5))
  }

  useEffect(() => { generateQuestion() }, [])

  const handleAnswer = (color: typeof colors[0]) => {
    if (feedback) return
    if (color.name === currentColor?.name) {
      setFeedback('correct')
      setScore(s => s + 1)
      setTotal(t => t + 1)
      setTimeout(() => { setFeedback(null); generateQuestion() }, 800)
    } else {
      setFeedback('wrong')
      setTotal(t => t + 1)
      setTimeout(() => setFeedback(null), 500)
    }
  }

  if (!currentColor) return null

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 font-bold">Score: {score}/{total}</p>
      </div>

      <motion.div className="text-center mb-8" key={currentColor.name}>
        <p className="text-lg text-gray-600 font-bold mb-4">Find the color!</p>
        <motion.div
          className="w-24 h-24 rounded-2xl mx-auto shadow-lg"
          style={{ backgroundColor: currentColor.hex }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <p className="text-xl font-bold text-gray-700 mt-2">{currentColor.name}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {options.map((color) => (
          <motion.button
            key={color.name}
            onClick={() => handleAnswer(color)}
            className={`p-4 rounded-2xl flex items-center gap-3 shadow-lg transition-all
              ${feedback === 'correct' && color.name === currentColor.name ? 'ring-4 ring-green-400 scale-105' : ''}
              ${feedback === 'wrong' && color.name === currentColor.name ? 'ring-4 ring-red-400' : ''}
              ${!feedback ? 'bg-white hover:scale-105' : ''}
              ${feedback && color.name !== currentColor.name ? 'opacity-40' : ''}
            `}
            whileHover={!feedback ? { scale: 1.05 } : {}}
            whileTap={!feedback ? { scale: 0.95 } : {}}
            disabled={!!feedback}
          >
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: color.hex }} />
            <span className="text-sm font-bold text-gray-600">{color.name}</span>
          </motion.button>
        ))}
      </div>

      <RewardScreen show={showReward} message="Color Wizard!" emoji="🎨" onClose={() => { setShowReward(false); onComplete?.(score) }} />
    </div>
  )
}
