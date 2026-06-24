import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Lightbulb, ChevronRight, Star } from 'lucide-react'

const funFacts = [
  { fact: 'Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs!', emoji: '🍯' },
  { fact: 'A group of flamingos is called a "flamboyance"!', emoji: '🦩' },
  { fact: 'Octopuses have three hearts!', emoji: '🐙' },
  { fact: 'Bananas are berries, but strawberries are not!', emoji: '🍌' },
  { fact: 'A day on Venus is longer than a year on Venus!', emoji: '🪐' },
  { fact: 'Butterflies taste with their feet!', emoji: '🦋' },
  { fact: 'The Eiffel Tower grows 6 inches in summer!', emoji: '🗼' },
  { fact: 'Your nose can remember 50,000 different scents!', emoji: '👃' },
  { fact: 'A shrimp\'s heart is in its head!', emoji: '🦐' },
  { fact: 'The Moon is moving away from Earth each year!', emoji: '🌙' },
]

const quizQuestions = [
  { q: 'What is the largest animal in the world?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Shark'], correct: 1 },
  { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2 },
  { q: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2 },
  { q: 'What is the tallest animal?', options: ['Elephant', 'Giraffe', 'Camel', 'Horse'], correct: 1 },
  { q: 'What is the closest star to Earth?', options: ['Moon', 'Sun', 'Mars', 'Venus'], correct: 1 },
  { q: 'Which animal can change its color?', options: ['Dog', 'Cat', 'Chameleon', 'Fish'], correct: 2 },
  { q: 'What do bees produce?', options: ['Milk', 'Honey', 'Sugar', 'Bread'], correct: 1 },
  { q: 'Which gas do plants take in?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2 },
]

export function GeneralKnowledge() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'facts' | 'quiz'>('facts')
  const [currentFact, setCurrentFact] = useState(0)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [likedFacts, setLikedFacts] = useState<Set<number>>(new Set())

  const fact = funFacts[currentFact]
  const question = quizQuestions[currentQuiz]

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === question.correct) {
      setScore(s => s + 1)
    }
    setTimeout(() => {
      if (currentQuiz < quizQuestions.length - 1) {
        setCurrentQuiz(i => i + 1)
        setSelected(null)
      } else {
        setQuizDone(true)
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-orange to-kid-yellow rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>💡</span><span>🧠</span><span>🌟</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">General Knowledge</h1>
          <p className="text-white/80 text-sm">Discover fun facts and test your knowledge!</p>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <motion.button
            onClick={() => { setMode('facts'); setCurrentFact(0) }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'facts' ? 'bg-gradient-to-r from-kid-orange to-kid-yellow text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Fun Facts
          </motion.button>
          <motion.button
            onClick={() => { setMode('quiz'); setCurrentQuiz(0); setSelected(null); setScore(0); setQuizDone(false) }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'quiz' ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            GK Quiz
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'facts' ? (
            <motion.div
              key="facts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={currentFact}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex justify-center gap-1 mb-4">
                  {funFacts.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= currentFact ? 'bg-kid-orange' : 'bg-gray-200'}`} />
                  ))}
                </div>

                <motion.span
                  className="text-6xl block mb-4"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {fact.emoji}
                </motion.span>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-5 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-kid-orange" />
                    <span className="text-sm font-bold text-kid-orange">Did you know?</span>
                  </div>
                  <p className="text-lg font-medium text-gray-700">{fact.fact}</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    onClick={() => currentFact > 0 && setCurrentFact(i => i - 1)}
                    className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Previous
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setLikedFacts(prev => new Set([...prev, currentFact]))
                    }}
                    className="text-2xl"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {likedFacts.has(currentFact) ? '❤️' : '🤍'}
                  </motion.button>
                  <motion.button
                    onClick={() => currentFact < funFacts.length - 1 && setCurrentFact(i => i + 1)}
                    className="bg-gradient-to-r from-kid-orange to-kid-yellow text-white px-4 py-2 rounded-full font-bold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next <ChevronRight className="w-4 h-4 inline" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ) : quizDone ? (
            <motion.div
              key="result"
              className="bg-white rounded-3xl p-6 shadow-lg text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.span
                className="text-7xl block mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {score >= 6 ? '🎉' : '💪'}
              </motion.span>
              <h2 className="text-2xl font-bold text-gray-800 font-fredoka mb-2">
                {score >= 6 ? 'Amazing Knowledge!' : 'Keep Learning!'}
              </h2>
              <div className="flex justify-center items-center gap-2 mb-4">
                <Star className="w-6 h-6 fill-kid-yellow text-kid-yellow" />
                <span className="text-4xl font-bold text-gray-800">{score}</span>
                <span className="text-xl text-gray-500">/ {quizQuestions.length}</span>
              </div>
              <motion.button
                onClick={() => { setCurrentQuiz(0); setSelected(null); setScore(0); setQuizDone(false) }}
                className="bg-gradient-to-r from-kid-orange to-kid-yellow text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg"
                key={currentQuiz}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-500">Question {currentQuiz + 1}/{quizQuestions.length}</span>
                  <span className="text-sm font-bold text-gray-500">Score: {score}</span>
                </div>

                <div className="flex gap-1 justify-center mb-4">
                  {quizQuestions.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < currentQuiz ? 'bg-kid-green' : i === currentQuiz ? 'bg-kid-orange' : 'bg-gray-200'}`} />
                  ))}
                </div>

                <p className="text-lg font-bold text-gray-800 mb-6 text-center">{question.q}</p>

                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-4 rounded-2xl text-left font-bold shadow-md transition-all
                        ${selected === idx && idx === question.correct ? 'bg-green-100 ring-4 ring-green-400 text-green-700' : ''}
                        ${selected === idx && idx !== question.correct ? 'bg-red-100 ring-4 ring-red-400 text-red-700' : ''}
                        ${selected !== null && idx === question.correct && selected !== idx ? 'bg-green-50 ring-2 ring-green-300 text-green-600' : ''}
                        ${selected === null ? 'bg-white hover:bg-kid-orange hover:text-white text-gray-700' : ''}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-orange to-kid-yellow rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Stay curious and keep learning!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
