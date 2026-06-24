// Alphabets - A-Z letter learning for nursery
// Displays a grid of alphabet cards with emojis; tapping opens a detail modal with word association
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Alphabet data with letter, word association, emoji, and gradient color
const alphabetData = [
  { letter: 'A', word: 'Apple', emoji: '🍎', color: 'from-red-400 to-red-500' },
  { letter: 'B', word: 'Ball', emoji: '⚽', color: 'from-blue-400 to-blue-500' },
  { letter: 'C', word: 'Cat', emoji: '🐱', color: 'from-orange-400 to-orange-500' },
  { letter: 'D', word: 'Dog', emoji: '🐶', color: 'from-yellow-400 to-yellow-500' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', color: 'from-purple-400 to-purple-500' },
  { letter: 'F', word: 'Fish', emoji: '🐟', color: 'from-cyan-400 to-cyan-500' },
  { letter: 'G', word: 'Grapes', emoji: '🍇', color: 'from-green-400 to-green-500' },
  { letter: 'H', word: 'Hat', emoji: '🎩', color: 'from-pink-400 to-pink-500' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', color: 'from-teal-400 to-teal-500' },
  { letter: 'J', word: 'Juice', emoji: '🧃', color: 'from-orange-400 to-orange-500' },
  { letter: 'K', word: 'Kite', emoji: '🪁', color: 'from-kid-blue to-blue-600' },
  { letter: 'L', word: 'Lion', emoji: '🦁', color: 'from-yellow-400 to-yellow-600' },
  { letter: 'M', word: 'Mango', emoji: '🥭', color: 'from-green-400 to-green-600' },
  { letter: 'N', word: 'Nest', emoji: '🪺', color: 'from-brown-400 to-brown-500' },
  { letter: 'O', word: 'Orange', emoji: '🍊', color: 'from-orange-400 to-kid-orange' },
  { letter: 'P', word: 'Parrot', emoji: '🦜', color: 'from-green-400 to-teal-500' },
  { letter: 'Q', word: 'Queen', emoji: '👑', color: 'from-purple-400 to-purple-600' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰', color: 'from-pink-300 to-pink-500' },
  { letter: 'S', word: 'Sun', emoji: '☀️', color: 'from-yellow-300 to-yellow-500' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', color: 'from-orange-400 to-red-500' },
  { letter: 'U', word: 'Umbrella', emoji: '🌂', color: 'from-kid-blue to-blue-600' },
  { letter: 'V', word: 'Violin', emoji: '🎻', color: 'from-amber-400 to-amber-600' },
  { letter: 'W', word: 'Watermelon', emoji: '🍉', color: 'from-green-400 to-green-600' },
  { letter: 'X', word: 'Xylophone', emoji: '🔔', color: 'from-rose-400 to-rose-500' },
  { letter: 'Y', word: 'Yak', emoji: '🐂', color: 'from-stone-400 to-stone-500' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', color: 'from-gray-400 to-gray-600' },
]

export function Alphabets() {
  const [selected, setSelected] = useState<typeof alphabetData[0] | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      {/* Page header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
          Learn Alphabets A-Z
        </h1>
        <p className="text-gray-500 mt-2">Tap any letter to learn more!</p>
      </motion.div>

      {/* Alphabet grid with staggered entrance animation */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
      >
        {alphabetData.map((item) => (
          <motion.button
            key={item.letter}
            onClick={() => setSelected(item)}
            className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-white shadow-lg cursor-pointer`}
            variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-2xl font-bold font-fredoka">{item.letter}</div>
            <div className="text-2xl mt-1">{item.emoji}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Letter detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouncing emoji */}
              <motion.div
                className="text-8xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {selected.emoji}
              </motion.div>
              {/* Letter circle badge */}
              <div className="w-20 h-20 bg-gradient-to-br from-kid-orange to-kid-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold font-fredoka text-white">{selected.letter}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-fredoka">{selected.word}</h2>
              <p className="text-gray-500 mt-2">Letter <strong>{selected.letter}</strong> for <strong>{selected.word}</strong></p>
              <motion.button
                onClick={() => setSelected(null)}
                className="mt-6 bg-gradient-to-r from-kid-blue to-kid-purple text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close ✨
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
