import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Star, CheckCircle2, XCircle } from 'lucide-react'
import { RewardScreen } from '../../../shared/components/RewardScreen'

interface Question {
  question: string
  emoji: string
  options: string[]
  correct: number
}

const quizData: Question[] = [
  { question: 'Which letter comes after A?', emoji: '🔤', options: ['B', 'C', 'D', 'E'], correct: 0 },
  { question: 'How many fingers do you have on one hand?', emoji: '✋', options: ['3', '5', '10', '2'], correct: 1 },
  { question: 'What color is the sky?', emoji: '☀️', options: ['Red', 'Green', 'Blue', 'Yellow'], correct: 2 },
  { question: 'Which animal says "Moo"?', emoji: '🐄', options: ['Dog', 'Cat', 'Cow', 'Duck'], correct: 2 },
  { question: 'What shape has 3 sides?', emoji: '🔺', options: ['Square', 'Circle', 'Triangle', 'Star'], correct: 2 },
  { question: 'What is 2 + 3?', emoji: '➕', options: ['4', '5', '6', '7'], correct: 1 },
  { question: 'Which fruit is red?', emoji: '🍎', options: ['Banana', 'Apple', 'Grape', 'Orange'], correct: 1 },
  { question: 'What do plants need to grow?', emoji: '🌱', options: ['Milk', 'Sunlight', 'Books', 'Toys'], correct: 1 },
  { question: 'Which is a day of the week?', emoji: '📅', options: ['January', 'Monday', 'Summer', 'Rain'], correct: 1 },
  { question: 'What comes after 9?', emoji: '🔢', options: ['8', '7', '10', '11'], correct: 2 },
]

export function Assessments() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState(false)
  const [showReward, setShowReward] = useState(false)

  const question = quizData[current]
  const isLast = current === quizData.length - 1

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === question.correct
    setAnswers(prev => [...prev, correct])

    setTimeout(() => {
      if (isLast) {
        setShowResult(true)
        const totalCorrect = [...answers, correct].filter(Boolean).length
        if (totalCorrect >= 7) {
          setTimeout(() => setShowReward(true), 500)
        }
      } else {
        setCurrent(i => i + 1)
        setSelected(null)
      }
    }, 1200)
  }

  const restart = useCallback(() => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setShowResult(false)
  }, [])

  const score = answers.filter(Boolean).length

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4">
        <div className="max-w-lg mx-auto pt-10">
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-lg text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {score >= 7 ? '🎉' : '💪'}
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 font-fredoka mb-2">
              {score >= 7 ? 'Great Job!' : 'Keep Trying!'}
            </h2>
            <div className="flex justify-center items-center gap-2 mb-4">
              <Star className="w-6 h-6 fill-kid-yellow text-kid-yellow" />
              <span className="text-4xl font-bold text-gray-800">{score}</span>
              <span className="text-xl text-gray-500">/ {quizData.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-kid-orange to-kid-pink rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(score / quizData.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="space-y-2 mb-6">
              {answers.map((correct, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {correct ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={correct ? 'text-green-600' : 'text-red-600'}>
                    Q{i + 1}: {correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              ))}
            </div>
            <motion.button
              onClick={restart}
              className="bg-gradient-to-r from-kid-orange to-kid-pink text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
          <RewardScreen show={showReward} message="Assessment Star!" emoji="🏆" onClose={() => setShowReward(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/lkg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to LKG
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-yellow to-kid-orange rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>📝</span><span>🤔</span><span>⭐</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Assessment</h1>
          <p className="text-white/80 text-sm">Test what you've learned!</p>
        </motion.div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-500">Question {current + 1}/{quizData.length}</span>
            <div className="flex gap-1">
              {quizData.map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < current ? 'bg-kid-green' : i === current ? 'bg-kid-orange' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="text-center mb-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.span
                className="text-6xl block mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {question.emoji}
              </motion.span>
              <p className="text-xl font-bold text-gray-800 mb-2">{question.question}</p>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <motion.button
                key={`${current}-${idx}`}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 rounded-2xl text-left font-bold text-lg shadow-md transition-all
                  ${selected === idx && idx === question.correct ? 'bg-green-100 ring-4 ring-green-400 text-green-700' : ''}
                  ${selected === idx && idx !== question.correct ? 'bg-red-100 ring-4 ring-red-400 text-red-700' : ''}
                  ${selected !== null && idx === question.correct && selected !== idx ? 'bg-green-50 ring-2 ring-green-300 text-green-600' : ''}
                  ${selected === null ? 'bg-white hover:bg-kid-blue hover:text-white text-gray-700' : ''}
                  ${selected !== null && selected !== idx && idx !== question.correct ? 'opacity-50' : ''}
                `}
                whileHover={selected === null ? { scale: 1.02 } : {}}
                whileTap={selected === null ? { scale: 0.98 } : {}}
                disabled={selected !== null}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-yellow to-kid-orange rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Read each question carefully!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
