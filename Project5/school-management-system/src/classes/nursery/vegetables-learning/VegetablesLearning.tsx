// VegetablesLearning - Vegetable identification for nursery
// Grid of vegetable cards with emoji; tapping opens a detail modal with health message
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Vegetable data with emoji, color name, and gradient/border classes
const vegetables = [
  { name: 'Carrot', emoji: '🥕', color: 'Orange', bg: 'from-orange-100 to-orange-200', border: 'border-orange-300' },
  { name: 'Broccoli', emoji: '🥦', color: 'Green', bg: 'from-green-100 to-green-200', border: 'border-green-300' },
  { name: 'Tomato', emoji: '🍅', color: 'Red', bg: 'from-red-100 to-red-200', border: 'border-red-300' },
  { name: 'Corn', emoji: '🌽', color: 'Yellow', bg: 'from-yellow-100 to-yellow-200', border: 'border-yellow-300' },
  { name: 'Cucumber', emoji: '🥒', color: 'Green', bg: 'from-green-100 to-lime-200', border: 'border-lime-300' },
  { name: 'Eggplant', emoji: '🍆', color: 'Purple', bg: 'from-purple-100 to-purple-200', border: 'border-purple-300' },
  { name: 'Pepper', emoji: '🫑', color: 'Red', bg: 'from-red-100 to-rose-200', border: 'border-rose-300' },
  { name: 'Potato', emoji: '🥔', color: 'Brown', bg: 'from-amber-100 to-amber-200', border: 'border-amber-300' },
  { name: 'Lettuce', emoji: '🥬', color: 'Green', bg: 'from-green-100 to-teal-200', border: 'border-teal-300' },
  { name: 'Onion', emoji: '🧅', color: 'Yellow', bg: 'from-yellow-100 to-amber-200', border: 'border-amber-300' },
  { name: 'Mushroom', emoji: '🍄', color: 'Brown', bg: 'from-stone-100 to-stone-200', border: 'border-stone-300' },
  { name: 'Peas', emoji: '🫛', color: 'Green', bg: 'from-green-100 to-green-200', border: 'border-green-300' },
  { name: 'Garlic', emoji: '🧄', color: 'White', bg: 'from-gray-100 to-gray-200', border: 'border-gray-300' },
  { name: 'Chili', emoji: '🌶️', color: 'Red', bg: 'from-red-100 to-red-200', border: 'border-red-300' },
  { name: 'Pumpkin', emoji: '🎃', color: 'Orange', bg: 'from-orange-100 to-orange-200', border: 'border-orange-300' },
]

export function VegetablesLearning() {
  const [selected, setSelected] = useState<typeof vegetables[0] | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-4 md:p-6">
      {/* Page header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
          🥕 Vegetables Learning
        </h1>
        <p className="text-gray-500 mt-2">Learn about healthy vegetables!</p>
      </motion.div>

      {/* Vegetable grid with staggered entrance */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {vegetables.map((veg) => (
          <motion.button
            key={veg.name}
            onClick={() => setSelected(veg)}
            className={`bg-gradient-to-br ${veg.bg} rounded-2xl p-5 shadow-md cursor-pointer hover:shadow-lg border-2 ${veg.border} transition-all`}
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-5xl mb-2">{veg.emoji}</div>
            <h3 className="font-bold font-fredoka text-sm text-gray-700">{veg.name}</h3>
          </motion.button>
        ))}
      </motion.div>

      {/* Vegetable detail modal */}
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
              {/* Bouncing vegetable emoji */}
              <motion.div
                className="text-8xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {selected.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold font-fredoka text-gray-800">{selected.name}</h2>
              {/* Health badge */}
              <div className="inline-block mt-3 px-4 py-1 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-bold text-sm">
                Healthy & Yummy! 💪
              </div>
              <p className="text-gray-500 mt-4 text-sm">
                {selected.name}s are {selected.color.toLowerCase()} vegetables! Eat healthy, stay strong!
              </p>
              <motion.button
                onClick={() => setSelected(null)}
                className="mt-6 bg-gradient-to-r from-kid-green to-kid-teal text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
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
