// File: PhonicsGame — Hear a letter sound (phonics) and pick the matching word/picture from four options.
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

const phonicsItems = [
  { letter: 'A', sound: 'Ah', word: 'Apple', emoji: '🍎' },
  { letter: 'B', sound: 'Buh', word: 'Ball', emoji: '⚽' },
  { letter: 'C', sound: 'Kuh', word: 'Cat', emoji: '🐱' },
  { letter: 'D', sound: 'Duh', word: 'Dog', emoji: '🐶' },
  { letter: 'E', sound: 'Eh', word: 'Elephant', emoji: '🐘' },
  { letter: 'F', sound: 'Ff', word: 'Fish', emoji: '🐟' },
  { letter: 'G', sound: 'Guh', word: 'Goat', emoji: '🐐' },
  { letter: 'H', sound: 'Huh', word: 'Hat', emoji: '🎩' },
]

interface Props { onComplete?: (score: number) => void }

export function PhonicsGame({ onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showReward, setShowReward] = useState(false)
  const item = phonicsItems[current]

  const generateOptions = () => {
    const wrong = phonicsItems.filter((_, i) => i !== current).sort(() => Math.random() - 0.5).slice(0, 3)
    setOptions([item.word, ...wrong.map(w => w.word)].sort(() => Math.random() - 0.5))
  }

  useEffect(() => { generateOptions() }, [current])

  const handleAnswer = (word: string) => {
    if (feedback) return
    if (word === item.word) {
      setFeedback('correct')
      setScore(s => s + 1)
      setTimeout(() => {
        setFeedback(null)
        if (current < phonicsItems.length - 1) {
          setCurrent(i => i + 1)
        } else {
          setShowReward(true)
          onComplete?.(score + 1)
        }
      }, 1000)
    } else {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 500)
    }
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 font-bold">Score: {score}/{phonicsItems.length}</p>
      </div>

      <motion.div className="text-center mb-8" key={current}>
        <p className="text-lg text-gray-600 font-bold mb-2">What starts with "{item.letter}"?</p>
        <motion.div
          className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-5xl font-fredoka text-kid-blue">{item.letter}</span>
          <span className="text-2xl text-gray-400">says</span>
          <span className="text-2xl font-bold text-kid-purple">"{item.sound}"</span>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {options.map((word) => {
          const itemData = phonicsItems.find(p => p.word === word)
          return (
            <motion.button
              key={word}
              onClick={() => handleAnswer(word)}
              className={`p-4 rounded-2xl shadow-lg transition-all
                ${feedback === 'correct' && word === item.word ? 'bg-green-100 ring-4 ring-green-400 scale-105' : ''}
                ${feedback === 'wrong' && word === item.word ? 'bg-red-100 ring-4 ring-red-400' : ''}
                ${!feedback ? 'bg-white hover:bg-kid-blue hover:text-white' : ''}
                ${feedback && word !== item.word ? 'opacity-40' : ''}
              `}
              whileHover={!feedback ? { scale: 1.05 } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              disabled={!!feedback}
            >
              <span className="text-3xl">{itemData?.emoji}</span>
              <span className="block text-sm font-bold mt-1">{word}</span>
            </motion.button>
          )
        })}
      </div>

      <RewardScreen show={showReward} message="Phonics Star!" emoji="🔤" onClose={() => setShowReward(false)} />
    </div>
  )
}
