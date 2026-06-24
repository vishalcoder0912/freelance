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

const examData: Question[] = [
  { question: 'What is the plural of "child"?', emoji: '👶', options: ['Childs', 'Children', 'Childes', 'Children'], correct: 1 },
  { question: 'What is 15 + 8?', emoji: '➕', options: ['21', '22', '23', '24'], correct: 2 },
  { question: 'Which planet is closest to the Sun?', emoji: '🪐', options: ['Earth', 'Venus', 'Mercury', 'Mars'], correct: 2 },
  { question: 'What do you call a baby dog?', emoji: '🐶', options: ['Kitten', 'Cub', 'Puppy', 'Foal'], correct: 2 },
  { question: 'Which is the largest ocean?', emoji: '🌊', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
  { question: 'What is 7 x 6?', emoji: '✖️', options: ['36', '42', '48', '56'], correct: 1 },
  { question: 'Which sense do you use to smell?', emoji: '👃', options: ['Eyes', 'Ears', 'Nose', 'Tongue'], correct: 2 },
  { question: 'What color do you get mixing red and blue?', emoji: '🎨', options: ['Green', 'Purple', 'Orange', 'Yellow'], correct: 1 },
  { question: 'How many sides does a hexagon have?', emoji: '⬡', options: ['5', '6', '7', '8'], correct: 1 },
  { question: 'Which animal lives in a den?', emoji: '🦊', options: ['Fish', 'Bird', 'Fox', 'Frog'], correct: 2 },
  { question: 'What is the opposite of "hot"?', emoji: '🌡️', options: ['Warm', 'Cold', 'Cool', 'Mild'], correct: 1 },
  { question: 'What is 20 - 7?', emoji: '➖', options: ['11', '12', '13', '14'], correct: 2 },
]

export function Exams() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState(false)
  const [showReward, setShowReward] = useState(false)

  const question = examData[current]
  const isLast = current === examData.length - 1

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === question.correct
    setAnswers(prev => [...prev, correct])

    setTimeout(() => {
      if (isLast) {
        setShowResult(true)
        const totalCorrect = [...answers, correct].filter(Boolean).length
        if (totalCorrect >= 9) {
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
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
              {score >= 9 ? '🎉' : score >= 6 ? '👍' : '💪'}
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 font-fredoka mb-2">
              {score >= 9 ? 'Excellent!' : score >= 6 ? 'Good Job!' : 'Keep Trying!'}
            </h2>
            <div className="flex justify-center items-center gap-2 mb-4">
              <Star className="w-6 h-6 fill-kid-yellow text-kid-yellow" />
              <span className="text-4xl font-bold text-gray-800">{score}</span>
              <span className="text-xl text-gray-500">/ {examData.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-kid-red to-kid-orange rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(score / examData.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="space-y-2 mb-6 text-left max-w-xs mx-auto">
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
              className="bg-gradient-to-r from-kid-red to-kid-orange text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
          <RewardScreen show={showReward} message="Exam Topper!" emoji="🏆" onClose={() => setShowReward(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-red to-kid-orange rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>📋</span><span>✏️</span><span>🏆</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Interactive Exams</h1>
          <p className="text-white/80 text-sm">Show what you've learned!</p>
        </motion.div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-500">Question {current + 1}/{examData.length}</span>
            <div className="flex gap-1">
              {examData.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < current ? 'bg-kid-green' : i === current ? 'bg-kid-red' : 'bg-gray-200'}`} />
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
                  ${selected === null ? 'bg-white hover:bg-kid-red hover:text-white text-gray-700' : ''}
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
          className="mt-6 bg-gradient-to-r from-kid-red to-kid-orange rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Read carefully and do your best!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
