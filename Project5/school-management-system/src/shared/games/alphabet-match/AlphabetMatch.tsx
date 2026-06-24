// File: AlphabetMatch — Interactive quiz where kids match a displayed letter (A-Z) with its correct visual among four options.
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'
import { useConfetti } from '../../../hooks/useConfetti'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const emojis: Record<string, string> = {
  A: '🍎', B: '⚽', C: '🐱', D: '🐬', E: '🐘', F: '🌸',
  G: '🍇', H: '🏠', I: '🍦', J: '🤹', K: '🪁', L: '🍋',
  M: '🐭', N: '🏀', O: '🐙', P: '🐧', Q: '👑', R: '🤖',
  S: '🌞', T: '🐯', U: '☂️', V: '🎻', W: '🐋', X: '❌',
  Y: '🪀', Z: '🦓'
}

interface Props {
  onComplete?: (score: number) => void
}

export function AlphabetMatch({ onComplete }: Props) {
  const [currentLetter, setCurrentLetter] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set())
  const { fireConfetti } = useConfetti()

  const generateQuestion = useCallback(() => {
    const available = letters.filter(l => !usedLetters.has(l))
    if (available.length === 0) {
      setShowReward(true)
      onComplete?.(score)
      return
    }
    const correct = available[Math.floor(Math.random() * available.length)]
    const wrongOptions = letters.filter(l => l !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
    setCurrentLetter(correct)
    setOptions([correct, ...wrongOptions].sort(() => Math.random() - 0.5))
  }, [usedLetters, score, onComplete])

  useEffect(() => { generateQuestion() }, [])

  const handleAnswer = (letter: string) => {
    if (letter === currentLetter) {
      setFeedback('correct')
      setScore(s => s + 1)
      setTotal(t => t + 1)
      setUsedLetters(prev => new Set([...prev, currentLetter]))
      fireConfetti()
      setTimeout(() => { setFeedback(null); generateQuestion() }, 1000)
    } else {
      setFeedback('wrong')
      setTotal(t => t + 1)
      setTimeout(() => setFeedback(null), 500)
    }
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">Score: {score}/{total}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <motion.div
            className="bg-gradient-to-r from-kid-blue to-kid-purple h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(score / 26) * 100}%` }}
          />
        </div>
      </div>

      <motion.div className="text-center mb-8" key={currentLetter}>
        <p className="text-lg text-gray-600 font-bold">Find the letter:</p>
        <motion.span
          className="text-8xl font-fredoka inline-block mt-4"
          style={{ color: `hsl(${Math.random() * 360}, 70%, 50%)` }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentLetter}
        </motion.span>
        <div className="text-4xl mt-2">{emojis[currentLetter]}</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {options.map((letter) => (
          <motion.button
            key={letter}
            onClick={() => handleAnswer(letter)}
            className={`p-6 rounded-2xl text-3xl font-bold font-fredoka shadow-lg transition-colors
              ${feedback === 'correct' && letter === currentLetter ? 'bg-green-400 text-white scale-110' : ''}
              ${feedback === 'wrong' && letter === currentLetter ? 'bg-red-400 text-white' : ''}
              ${feedback === 'wrong' && letter !== currentLetter ? 'bg-white text-gray-800' : ''}
              ${!feedback ? 'bg-white text-gray-800 hover:bg-kid-blue hover:text-white' : ''}
            `}
            whileHover={!feedback ? { scale: 1.05 } : {}}
            whileTap={!feedback ? { scale: 0.95 } : {}}
            disabled={!!feedback}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 justify-center mt-6">
        {letters.map(l => (
          <span key={l} className={`w-6 h-6 flex items-center justify-center text-xs rounded-full font-bold transition-all
            ${usedLetters.has(l) ? 'bg-green-400 text-white scale-110' : 'bg-gray-200 text-gray-400'}`}>
            {l}
          </span>
        ))}
      </div>

      <RewardScreen show={showReward} message="You know all the letters!" emoji="🎓" onClose={() => setShowReward(false)} />
    </div>
  )
}
