import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

interface Shape { name: string; icon: string; color: string }

const shapes: Shape[] = [
  { name: 'Circle', icon: '⬤', color: '#FF6B6B' },
  { name: 'Square', icon: '■', color: '#4A90D9' },
  { name: 'Triangle', icon: '▲', color: '#4CAF50' },
  { name: 'Star', icon: '★', color: '#FFD700' },
  { name: 'Diamond', icon: '◆', color: '#9C27B0' },
  { name: 'Heart', icon: '♥', color: '#E91E63' },
]

interface Props { onComplete?: (score: number) => void }

export function ShapeSorter({ onComplete }: Props) {
  const [currentShape, setCurrentShape] = useState<Shape | null>(null)
  const [options, setOptions] = useState<Shape[]>([])
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const generateQuestion = () => {
    const correct = shapes[Math.floor(Math.random() * shapes.length)]
    const wrongOptions = shapes.filter(s => s.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3)
    setCurrentShape(correct)
    setOptions([correct, ...wrongOptions].sort(() => Math.random() - 0.5))
  }

  useEffect(() => { generateQuestion() }, [])

  const handleAnswer = (shape: Shape) => {
    if (feedback) return
    if (shape.name === currentShape?.name) {
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

  if (!currentShape) return null

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 font-bold">Score: {score}/{total}</p>
      </div>

      <motion.div className="text-center mb-8" key={currentShape.name}>
        <p className="text-lg text-gray-600 font-bold mb-4">Find this shape!</p>
        <motion.span
          className="text-7xl inline-block"
          style={{ color: currentShape.color }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentShape.icon}
        </motion.span>
        <p className="text-xl font-bold text-gray-700 mt-2">{currentShape.name}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {options.map((shape) => (
          <motion.button
            key={shape.name}
            onClick={() => handleAnswer(shape)}
            className={`p-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg transition-all
              ${feedback === 'correct' && shape.name === currentShape.name ? 'bg-green-100 ring-4 ring-green-400' : ''}
              ${feedback === 'wrong' && shape.name === currentShape.name ? 'bg-red-100 ring-4 ring-red-400' : ''}
              ${!feedback ? 'bg-white hover:scale-105' : ''}
              ${feedback && shape.name !== currentShape.name ? 'opacity-50' : ''}
            `}
            whileHover={!feedback ? { scale: 1.05 } : {}}
            whileTap={!feedback ? { scale: 0.95 } : {}}
            disabled={!!feedback}
          >
            <span className="text-4xl" style={{ color: shape.color }}>{shape.icon}</span>
            <span className="text-sm font-bold text-gray-600">{shape.name}</span>
          </motion.button>
        ))}
      </div>

      {score >= 5 && <RewardScreen show={showReward} message="Shape Star!" emoji="⭐" onClose={() => { setShowReward(false); onComplete?.(score) }} />}
    </div>
  )
}
