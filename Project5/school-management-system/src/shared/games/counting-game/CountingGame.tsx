// File: CountingGame — See a set of objects (apples), count them, and select the correct number from options.
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

interface Props { maxNumber?: number; onComplete?: (score: number) => void }

export function CountingGame({ maxNumber = 10, onComplete }: Props) {
  const [count, setCount] = useState(0)
  const [targetNumber, setTargetNumber] = useState(0)
  const [options, setOptions] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const generateQuestion = () => {
    const target = Math.floor(Math.random() * maxNumber) + 1
    setTargetNumber(target)
    setCount(target)
    const wrongOptions = Array.from({ length: 3 }, () => Math.floor(Math.random() * maxNumber) + 1)
      .filter(n => n !== target)
    const allOptions = [target, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
  }

  useEffect(() => { generateQuestion() }, [])

  const handleAnswer = (num: number) => {
    if (feedback) return
    if (num === targetNumber) {
      setFeedback('correct')
      setScore(s => s + 1)
      setTotal(t => t + 1)
      setTimeout(() => { setFeedback(null); generateQuestion() }, 1000)
    } else {
      setFeedback('wrong')
      setTotal(t => t + 1)
      setTimeout(() => setFeedback(null), 500)
    }
  }

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 font-bold">Score: {score}/{total}</p>
      </div>

      <motion.div className="text-center mb-6" key={targetNumber}>
        <p className="text-lg text-gray-600 font-bold mb-3">How many?</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: count }).map((_, i) => (
            <motion.span
              key={i}
              className="text-4xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              🍎
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {options.map((num) => (
          <motion.button
            key={num}
            onClick={() => handleAnswer(num)}
            className={`p-5 rounded-2xl text-2xl font-bold font-fredoka shadow-lg transition-all
              ${feedback === 'correct' && num === targetNumber ? 'bg-green-400 text-white' : ''}
              ${feedback === 'wrong' && num === targetNumber ? 'bg-red-400 text-white' : ''}
              ${!feedback ? 'bg-white text-gray-800 hover:bg-kid-orange hover:text-white' : ''}
              ${feedback && num !== targetNumber ? 'opacity-40' : ''}
            `}
            whileHover={!feedback ? { scale: 1.05 } : {}}
            whileTap={!feedback ? { scale: 0.95 } : {}}
            disabled={!!feedback}
          >
            {num}
          </motion.button>
        ))}
      </div>

      {score >= 5 && <RewardScreen show={showReward} message="Counting Champ!" emoji="🔢" onClose={() => { setShowReward(false); onComplete?.(score) }} />}
    </div>
  )
}
