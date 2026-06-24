// File: AnimalSounds — Listen to an animal sound and pick the matching animal from four image options.
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

const animals = [
  { name: 'Dog', emoji: '🐶', sound: 'Woof! Woof!' },
  { name: 'Cat', emoji: '🐱', sound: 'Meow! Meow!' },
  { name: 'Cow', emoji: '🐄', sound: 'Moo! Moo!' },
  { name: 'Lion', emoji: '🦁', sound: 'Roar!' },
  { name: 'Duck', emoji: '🦆', sound: 'Quack! Quack!' },
  { name: 'Sheep', emoji: '🐑', sound: 'Baa! Baa!' },
  { name: 'Horse', emoji: '🐴', sound: 'Neigh!' },
  { name: 'Chicken', emoji: '🐔', sound: 'Cluck! Cluck!' },
  { name: 'Frog', emoji: '🐸', sound: 'Ribbit! Ribbit!' },
  { name: 'Elephant', emoji: '🐘', sound: 'Toot!' },
]

interface Props { onComplete?: (score: number) => void }

export function AnimalSounds({ onComplete }: Props) {
  const [currentAnimal, setCurrentAnimal] = useState<typeof animals[0] | null>(null)
  const [options, setOptions] = useState<typeof animals>([])
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const generateQuestion = () => {
    const correct = animals[Math.floor(Math.random() * animals.length)]
    const wrongOptions = animals.filter(a => a.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3)
    setCurrentAnimal(correct)
    setOptions([correct, ...wrongOptions].sort(() => Math.random() - 0.5))
  }

  useEffect(() => { generateQuestion() }, [])

  const handleAnswer = (animal: typeof animals[0]) => {
    if (feedback) return
    if (animal.name === currentAnimal?.name) {
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

  if (!currentAnimal) return null

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 font-bold">Score: {score}/{total}</p>
      </div>

      <motion.div className="text-center mb-8" key={currentAnimal.name}>
        <p className="text-lg text-gray-600 font-bold mb-3">Who says this?</p>
        <motion.div
          className="text-6xl bg-gradient-to-r from-kid-yellow to-kid-orange w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🔊
        </motion.div>
        <p className="text-2xl font-bold text-gray-700 mt-4 italic">"{currentAnimal.sound}"</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {options.map((animal) => (
          <motion.button
            key={animal.name}
            onClick={() => handleAnswer(animal)}
            className={`p-4 rounded-2xl flex items-center gap-3 shadow-lg transition-all
              ${feedback === 'correct' && animal.name === currentAnimal.name ? 'bg-green-100 ring-4 ring-green-400' : ''}
              ${feedback === 'wrong' && animal.name === currentAnimal.name ? 'bg-red-100 ring-4 ring-red-400' : ''}
              ${!feedback ? 'bg-white hover:scale-105' : ''}
              ${feedback && animal.name !== currentAnimal.name ? 'opacity-40' : ''}
            `}
            whileHover={!feedback ? { scale: 1.05 } : {}}
            whileTap={!feedback ? { scale: 0.95 } : {}}
            disabled={!!feedback}
          >
            <span className="text-3xl">{animal.emoji}</span>
            <span className="text-sm font-bold text-gray-600">{animal.name}</span>
          </motion.button>
        ))}
      </div>

      <RewardScreen show={showReward} message="Animal Expert!" emoji="🦁" onClose={() => { setShowReward(false); onComplete?.(score) }} />
    </div>
  )
}
