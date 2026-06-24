import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Volume2, Sparkles, Star, ChevronRight } from 'lucide-react'
import { RewardScreen } from '../../../shared/components/RewardScreen'

const sentences = [
  { sentence: 'The sun is bright today.', words: ['The', 'sun', 'is', 'bright', 'today'], emoji: '☀️' },
  { sentence: 'I love to read books.', words: ['I', 'love', 'to', 'read', 'books'], emoji: '📚' },
  { sentence: 'The cat is sleeping.', words: ['The', 'cat', 'is', 'sleeping'], emoji: '🐱' },
  { sentence: 'We play in the park.', words: ['We', 'play', 'in', 'the', 'park'], emoji: '🌳' },
  { sentence: 'Birds can fly high.', words: ['Birds', 'can', 'fly', 'high'], emoji: '🐦' },
  { sentence: 'I have a red ball.', words: ['I', 'have', 'a', 'red', 'ball'], emoji: '⚽' },
  { sentence: 'The fish swims fast.', words: ['The', 'fish', 'swims', 'fast'], emoji: '🐟' },
  { sentence: 'She likes to sing songs.', words: ['She', 'likes', 'to', 'sing', 'songs'], emoji: '🎵' },
]

const comprehension = [
  { title: 'The Cat and the Mat', text: 'A cat sat on a mat. The mat was red. The cat was happy.', questions: [
    { q: 'What sat on the mat?', options: ['A dog', 'A cat', 'A bird', 'A fish'], correct: 1 },
    { q: 'What color was the mat?', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 2 },
    { q: 'How did the cat feel?', options: ['Sad', 'Angry', 'Happy', 'Sleepy'], correct: 2 },
  ]},
  { title: 'The Big Ball', text: 'Ben has a big ball. The ball is blue. Ben plays with it in the garden.', questions: [
    { q: 'Who has a ball?', options: ['Sam', 'Ben', 'Tom', 'Ann'], correct: 1 },
    { q: 'What color is the ball?', options: ['Red', 'Green', 'Blue', 'Yellow'], correct: 2 },
    { q: 'Where does Ben play?', options: ['House', 'School', 'Garden', 'Park'], correct: 2 },
  ]},
]

export function English() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'sentences' | 'comprehension'>('sentences')
  const [currentSentence, setCurrentSentence] = useState(0)
  const [currentComp, setCurrentComp] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [compScore, setCompScore] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [readWords, setReadWords] = useState<Set<number>>(new Set())

  const sentence = sentences[currentSentence]
  const comp = comprehension[currentComp]
  const question = comp?.questions[currentQ]

  const markSentenceRead = () => {
    setReadWords(prev => new Set([...prev, currentSentence]))
    if (currentSentence < sentences.length - 1) {
      setTimeout(() => setCurrentSentence(i => i + 1), 600)
    }
  }

  const handleComprehensionAnswer = (idx: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(idx)
    if (idx === question.correct) {
      setCompScore(s => s + 1)
    }
    setTimeout(() => {
      if (currentQ < comp.questions.length - 1) {
        setCurrentQ(i => i + 1)
        setSelectedAnswer(null)
      } else if (currentComp < comprehension.length - 1) {
        setCurrentComp(i => i + 1)
        setCurrentQ(0)
        setSelectedAnswer(null)
      } else {
        setShowReward(true)
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-blue to-kid-indigo rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>📚</span><span>✏️</span><span>📖</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">English Reading</h1>
          <p className="text-white/80 text-sm">Practice reading sentences and comprehension!</p>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <motion.button
            onClick={() => { setMode('sentences'); setCurrentSentence(0) }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'sentences' ? 'bg-gradient-to-r from-kid-blue to-kid-indigo text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sentence Reading
          </motion.button>
          <motion.button
            onClick={() => { setMode('comprehension'); setCurrentComp(0); setCurrentQ(0); setSelectedAnswer(null) }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'comprehension' ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Comprehension
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'sentences' ? (
            <motion.div
              key="sentences"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={currentSentence}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex justify-center gap-1 mb-4">
                  {sentences.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= currentSentence ? 'bg-kid-blue' : 'bg-gray-200'}`} />
                  ))}
                </div>

                <motion.span className="text-5xl block mb-4" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  {sentence.emoji}
                </motion.span>

                <div className="flex justify-center gap-2 flex-wrap mb-4">
                  {sentence.words.map((word, i) => (
                    <motion.span
                      key={i}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl font-bold text-gray-700 shadow-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>

                <p className="text-xl font-bold text-gray-800 mb-4">{sentence.sentence}</p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <Volume2 className="w-4 h-4" />
                  <span>Read the sentence aloud!</span>
                </div>

                <motion.button
                  onClick={markSentenceRead}
                  className="bg-gradient-to-r from-kid-blue to-kid-indigo text-white px-6 py-3 rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {readWords.has(currentSentence) ? 'Read ✓' : 'I read it!'}
                </motion.button>
              </motion.div>

              <div className="flex items-center justify-between">
                <motion.button
                  onClick={() => currentSentence > 0 && setCurrentSentence(i => i - 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Previous
                </motion.button>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-kid-yellow text-kid-yellow" />
                  <span className="font-bold text-gray-600">{readWords.size}/{sentences.length}</span>
                </div>
                <motion.button
                  onClick={() => currentSentence < sentences.length - 1 && setCurrentSentence(i => i + 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next →
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="comprehension"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {question && (
                <motion.div
                  className="bg-white rounded-3xl p-6 shadow-lg"
                  key={`${currentComp}-${currentQ}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-500">Story {currentComp + 1}/{comprehension.length}</span>
                    <span className="text-sm font-bold text-gray-500">Question {currentQ + 1}/{comp.questions.length}</span>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-gray-700 font-fredoka mb-2">{comp.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{comp.text}</p>
                  </div>

                  <p className="text-lg font-bold text-gray-800 mb-4">{question.q}</p>

                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleComprehensionAnswer(idx)}
                        className={`w-full p-4 rounded-2xl text-left font-bold shadow-md transition-all
                          ${selectedAnswer === idx && idx === question.correct ? 'bg-green-100 ring-4 ring-green-400 text-green-700' : ''}
                          ${selectedAnswer === idx && idx !== question.correct ? 'bg-red-100 ring-4 ring-red-400 text-red-700' : ''}
                          ${selectedAnswer !== null && idx === question.correct && selectedAnswer !== idx ? 'bg-green-50 ring-2 ring-green-300 text-green-600' : ''}
                          ${selectedAnswer === null ? 'bg-white hover:bg-kid-blue hover:text-white text-gray-700' : ''}
                          ${selectedAnswer !== null && selectedAnswer !== idx && idx !== question.correct ? 'opacity-50' : ''}
                        `}
                        whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        disabled={selectedAnswer !== null}
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
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-blue to-kid-indigo rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Practice reading every day!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>

        <RewardScreen show={showReward} message="Reading Star!" emoji="📖" onClose={() => setShowReward(false)} />
      </div>
    </div>
  )
}
