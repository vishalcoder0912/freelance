import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Volume2, ChevronRight, Star } from 'lucide-react'

const wordSets = [
  { word: 'CAT', emoji: '🐱', letters: 'C-A-T', sound: 'Cat' },
  { word: 'DOG', emoji: '🐶', letters: 'D-O-G', sound: 'Dog' },
  { word: 'SUN', emoji: '☀️', letters: 'S-U-N', sound: 'Sun' },
  { word: 'BALL', emoji: '⚽', letters: 'B-A-L-L', sound: 'Ball' },
  { word: 'FISH', emoji: '🐟', letters: 'F-I-S-H', sound: 'Fish' },
  { word: 'BOOK', emoji: '📖', letters: 'B-O-O-K', sound: 'Book' },
  { word: 'STAR', emoji: '⭐', letters: 'S-T-A-R', sound: 'Star' },
  { word: 'TREE', emoji: '🌳', letters: 'T-R-E-E', sound: 'Tree' },
  { word: 'BIRD', emoji: '🐦', letters: 'B-I-R-D', sound: 'Bird' },
  { word: 'FROG', emoji: '🐸', letters: 'F-R-O-G', sound: 'Frog' },
]

const readAlongSections = [
  { title: 'The Cat', text: 'The cat sat on a mat. The cat is fat. The cat likes to nap.' },
  { title: 'My Dog', text: 'I have a dog. My dog can run. My dog is fun.' },
  { title: 'The Sun', text: 'The sun is hot. The sun is bright. The sun gives light.' },
  { title: 'A Big Ball', text: 'Look at the ball. It is big. I like to play ball.' },
  { title: 'Little Fish', text: 'Fish can swim. Fish are fast. Fish live in water.' },
]

export function ReadingZone() {
  const navigate = useNavigate()
  const [currentSet, setCurrentSet] = useState(0)
  const [currentRead, setCurrentRead] = useState<number | null>(null)
  const [showPhonics, setShowPhonics] = useState(true)
  const [readWords, setReadWords] = useState<Set<string>>(new Set())

  const item = wordSets[currentSet]
  const readItem = currentRead !== null ? readAlongSections[currentRead] : null

  const markRead = () => {
    setReadWords(prev => new Set([...prev, item.word]))
    if (currentSet < wordSets.length - 1) {
      setTimeout(() => setCurrentSet(i => i + 1), 600)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/lkg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to LKG
        </motion.button>

        <div className="flex gap-2 mb-6">
          <motion.button
            onClick={() => { setShowPhonics(true); setCurrentRead(null) }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${showPhonics ? 'bg-gradient-to-r from-kid-green to-kid-teal text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Word Builder
          </motion.button>
          <motion.button
            onClick={() => { setShowPhonics(false); setCurrentRead(0) }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!showPhonics ? 'bg-gradient-to-r from-kid-blue to-kid-purple text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Read Along
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {showPhonics ? (
            <motion.div
              key="phonics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={currentSet}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="flex justify-center gap-1 mb-4">
                  {wordSets.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= currentSet ? 'bg-kid-green' : 'bg-gray-200'}`} />
                  ))}
                </div>

                <motion.div
                  className="text-7xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {item.emoji}
                </motion.div>

                <div className="flex justify-center gap-2 mb-4">
                  {item.word.split('').map((letter, i) => (
                    <motion.span
                      key={i}
                      className="w-10 h-12 bg-gradient-to-b from-kid-blue to-kid-purple text-white rounded-xl flex items-center justify-center font-fredoka text-xl font-bold shadow-md"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-bold mb-4">
                  <Volume2 className="w-4 h-4" />
                  <span>{item.letters}</span>
                </div>

                <p className="text-lg font-bold text-kid-green mb-4">Sound: "{item.sound}"</p>

                <motion.button
                  onClick={markRead}
                  className="bg-gradient-to-r from-kid-green to-kid-teal text-white px-6 py-3 rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {readWords.has(item.word) ? 'Read ✓' : 'I read it!'}
                </motion.button>
              </motion.div>

              <div className="flex items-center justify-between">
                <motion.button
                  onClick={() => currentSet > 0 && setCurrentSet(i => i - 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Previous
                </motion.button>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-kid-yellow text-kid-yellow" />
                  <span className="font-bold text-gray-600">{readWords.size}/{wordSets.length}</span>
                </div>
                <motion.button
                  onClick={() => currentSet < wordSets.length - 1 && setCurrentSet(i => i + 1)}
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
              key="readalong"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {readItem && (
                <motion.div
                  className="bg-white rounded-3xl p-6 shadow-lg mb-6"
                  key={currentRead}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-center gap-1 mb-4">
                    {readAlongSections.map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= (currentRead ?? 0) ? 'bg-kid-blue' : 'bg-gray-200'}`} />
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 font-fredoka text-center mb-4">{readItem.title}</h3>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-4">
                    <p className="text-lg leading-relaxed text-gray-700 font-medium text-center">
                      {readItem.text.split('. ').map((sentence, i) => (
                        <motion.span
                          key={i}
                          className="inline-block mr-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.5 }}
                        >
                          {sentence}.
                        </motion.span>
                      ))}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <Volume2 className="w-4 h-4" />
                    <span>Read along with the teacher!</span>
                  </div>

                  <div className="flex justify-center gap-3">
                    <motion.button
                      onClick={() => { if (currentRead !== null && currentRead > 0) setCurrentRead(prev => (prev ?? 0) - 1) }}
                      className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ← Previous
                    </motion.button>
                    <motion.button
                      onClick={() => { if (currentRead !== null && currentRead < readAlongSections.length - 1) setCurrentRead(prev => (prev ?? 0) + 1) }}
                      className="bg-gradient-to-r from-kid-blue to-kid-purple text-white px-6 py-2 rounded-full font-bold shadow-lg inline-flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {readAlongSections.map((section, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentRead(i)}
                    className={`bg-white rounded-2xl p-4 shadow-md text-left ${currentRead === i ? 'ring-2 ring-kid-blue' : ''}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <h4 className="font-bold text-gray-800 font-fredoka">{section.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{section.text}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
