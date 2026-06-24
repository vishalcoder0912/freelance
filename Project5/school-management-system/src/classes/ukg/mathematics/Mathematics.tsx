// Mathematics - Addition and subtraction practice for UKG (1-9 range)
// Generates random problems with emoji visualization, multiple-choice answers, streak tracking, and reward
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Star } from 'lucide-react'
import { RewardScreen } from '../../../shared/components/RewardScreen'

// Emojis used to visually represent quantities
const emojis = ['🍎', '🐱', '⭐', '🌸', '🦋', '🌈', '🎈', '🍭', '🐶', '🌻']

interface Question {
  a: number
  b: number
  op: '+' | '-'
  answer: number
  emoji: string
}

// Generate a random addition or subtraction question (numbers 1-9)
function generateQuestion(): Question {
  const op = Math.random() > 0.5 ? '+' : '-'
  let a: number, b: number, answer: number
  if (op === '+') {
    a = Math.floor(Math.random() * 9) + 1
    b = Math.floor(Math.random() * 9) + 1
    answer = a + b
  } else {
    a = Math.floor(Math.random() * 9) + 5
    b = Math.floor(Math.random() * (a - 1)) + 1
    answer = a - b
  }
  return { a, b, op, answer, emoji: emojis[Math.floor(Math.random() * emojis.length)] }
}

// Generate 4 options including the correct answer
function generateOptions(correct: number): number[] {
  const opts = new Set<number>([correct])
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1
    opts.add(Math.random() > 0.5 ? correct + offset : Math.max(0, correct - offset))
  }
  return [...opts].sort(() => Math.random() - 0.5)
}

export function Mathematics() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState(generateQuestion)
  const [options, setOptions] = useState(() => generateOptions(question.answer))
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [streak, setStreak] = useState(0)

  // Advance to next question
  const next = useCallback(() => {
    const q = generateQuestion()
    setQuestion(q)
    setOptions(generateOptions(q.answer))
    setFeedback(null)
  }, [])

  // Handle answer with visual feedback and auto-advance
  const handleAnswer = (num: number) => {
    if (feedback) return
    if (num === question.answer) {
      setFeedback('correct')
      setScore(s => s + 1)
      setTotal(t => t + 1)
      setStreak(s => s + 1)
      if ((score + 1) >= 8) {
        setTimeout(() => setShowReward(true), 500)
      }
      setTimeout(() => next(), 1000)
    } else {
      setFeedback('wrong')
      setTotal(t => t + 1)
      setStreak(0)
      setTimeout(() => setFeedback(null), 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back navigation */}
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        {/* Header card */}
        <motion.div
          className="bg-gradient-to-r from-kid-green to-kid-teal rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🔢</span><span>➕</span><span>➖</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Mathematics</h1>
          <p className="text-white/80 text-sm">Practice addition and subtraction!</p>
        </motion.div>

        {/* Quiz card */}
        <motion.div className="bg-white rounded-3xl p-6 shadow-lg">
          {/* Score display */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500">Score: {score}/{total}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-kid-yellow text-kid-yellow" />
              <span className="text-sm font-bold text-gray-500">{score} stars</span>
            </div>
          </div>

          {/* Streak indicator */}
          {streak >= 3 && (
            <motion.div
              className="text-center text-sm text-kid-orange font-bold mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              🔥 {streak} streak! Amazing!
            </motion.div>
          )}

          {/* Question display with animated numbers and emoji visualization */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${question.a}-${question.b}`}
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.span
                  className="text-6xl font-fredoka text-kid-blue"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {question.a}
                </motion.span>
                <span className="text-5xl font-bold text-gray-400">{question.op}</span>
                <motion.span
                  className="text-6xl font-fredoka text-kid-purple"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                >
                  {question.b}
                </motion.span>
                <span className="text-5xl font-bold text-gray-400">=</span>
                <span className="text-6xl font-fredoka text-kid-orange">?</span>
              </div>

              {/* Emoji quantity representation */}
              <div className="flex justify-center gap-2 flex-wrap">
                {Array.from({ length: question.op === '+' ? question.a : question.a }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {question.emoji}
                  </motion.span>
                ))}
                <span className="text-2xl mx-2 font-bold text-gray-400">{question.op === '+' ? '+' : '-'}</span>
                {Array.from({ length: question.op === '+' ? question.b : question.b }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (question.op === '+' ? question.a : question.a) * 0.05 + i * 0.05 }}
                  >
                    {question.emoji}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Multiple-choice answer options */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((num) => (
              <motion.button
                key={num}
                onClick={() => handleAnswer(num)}
                className={`p-5 rounded-2xl text-3xl font-bold font-fredoka shadow-lg transition-all
                  ${feedback === 'correct' && num === question.answer ? 'bg-green-400 text-white scale-105' : ''}
                  ${feedback === 'wrong' && num === question.answer ? 'bg-red-400 text-white' : ''}
                  ${!feedback ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 hover:from-kid-green hover:to-kid-teal hover:text-white' : ''}
                  ${feedback && num !== question.answer ? 'opacity-40' : ''}
                `}
                whileHover={!feedback ? { scale: 1.05 } : {}}
                whileTap={!feedback ? { scale: 0.95 } : {}}
                disabled={!!feedback}
              >
                {num}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Motivational footer */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-green to-kid-teal rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Math makes your brain stronger!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>

        <RewardScreen show={showReward} message="Math Genius!" emoji="🧮" onClose={() => setShowReward(false)} />
      </div>
    </div>
  )
}
