import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const fruits = [
  { name: 'Apple', emoji: '🍎', color: 'Red', bg: 'from-red-100 to-red-200', border: 'border-red-300', textColor: 'text-red-600' },
  { name: 'Banana', emoji: '🍌', color: 'Yellow', bg: 'from-yellow-100 to-yellow-200', border: 'border-yellow-300', textColor: 'text-yellow-600' },
  { name: 'Orange', emoji: '🍊', color: 'Orange', bg: 'from-orange-100 to-orange-200', border: 'border-orange-300', textColor: 'text-orange-600' },
  { name: 'Grapes', emoji: '🍇', color: 'Purple', bg: 'from-purple-100 to-purple-200', border: 'border-purple-300', textColor: 'text-purple-600' },
  { name: 'Watermelon', emoji: '🍉', color: 'Green', bg: 'from-green-100 to-green-200', border: 'border-green-300', textColor: 'text-green-600' },
  { name: 'Strawberry', emoji: '🍓', color: 'Red', bg: 'from-red-100 to-pink-200', border: 'border-pink-300', textColor: 'text-pink-600' },
  { name: 'Mango', emoji: '🥭', color: 'Yellow', bg: 'from-yellow-100 to-orange-200', border: 'border-orange-300', textColor: 'text-orange-600' },
  { name: 'Cherry', emoji: '🍒', color: 'Red', bg: 'from-red-100 to-rose-200', border: 'border-rose-300', textColor: 'text-rose-600' },
  { name: 'Pineapple', emoji: '🍍', color: 'Yellow', bg: 'from-yellow-100 to-amber-200', border: 'border-amber-300', textColor: 'text-amber-600' },
  { name: 'Kiwi', emoji: '🥝', color: 'Green', bg: 'from-green-100 to-lime-200', border: 'border-lime-300', textColor: 'text-lime-600' },
  { name: 'Lemon', emoji: '🍋', color: 'Yellow', bg: 'from-yellow-100 to-yellow-200', border: 'border-yellow-300', textColor: 'text-yellow-600' },
  { name: 'Peach', emoji: '🍑', color: 'Orange', bg: 'from-orange-100 to-pink-200', border: 'border-pink-300', textColor: 'text-pink-600' },
  { name: 'Blueberry', emoji: '🫐', color: 'Blue', bg: 'from-blue-100 to-blue-200', border: 'border-blue-300', textColor: 'text-blue-600' },
  { name: 'Papaya', emoji: '🍈', color: 'Green', bg: 'from-green-100 to-teal-200', border: 'border-teal-300', textColor: 'text-teal-600' },
  { name: 'Pomegranate', emoji: '🍑', color: 'Red', bg: 'from-red-100 to-red-200', border: 'border-red-300', textColor: 'text-red-600' },
]

export function FruitsLearning() {
  const [selected, setSelected] = useState<typeof fruits[0] | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 md:p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
          🍎 Fruits Learning
        </h1>
        <p className="text-gray-500 mt-2">Learn about different fruits!</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {fruits.map((fruit) => (
          <motion.button
            key={fruit.name}
            onClick={() => setSelected(fruit)}
            className={`bg-gradient-to-br ${fruit.bg} rounded-2xl p-5 shadow-md cursor-pointer hover:shadow-lg border-2 ${fruit.border} transition-all`}
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-5xl mb-2">{fruit.emoji}</div>
            <h3 className={`font-bold font-fredoka text-sm ${fruit.textColor}`}>{fruit.name}</h3>
          </motion.button>
        ))}
      </motion.div>

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
              <motion.div
                className="text-8xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {selected.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold font-fredoka text-gray-800">{selected.name}</h2>
              <div className={`inline-block mt-3 px-4 py-1 rounded-full bg-gradient-to-r ${selected.bg} ${selected.textColor} font-bold text-sm`}>
                Color: {selected.color}
              </div>
              <p className="text-gray-500 mt-4 text-sm">
                {selected.name}s are {selected.color.toLowerCase()} and delicious! 🍭
              </p>
              <motion.button
                onClick={() => setSelected(null)}
                className="mt-6 bg-gradient-to-r from-kid-orange to-kid-red text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Yummy! 🎉
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
