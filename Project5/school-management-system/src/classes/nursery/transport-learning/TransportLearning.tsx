import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const vehicles = [
  { name: 'Car', emoji: '🚗', category: 'Road', bg: 'from-blue-100 to-blue-200', border: 'border-blue-300' },
  { name: 'Bus', emoji: '🚌', category: 'Road', bg: 'from-yellow-100 to-yellow-200', border: 'border-yellow-300' },
  { name: 'Bicycle', emoji: '🚲', category: 'Road', bg: 'from-green-100 to-green-200', border: 'border-green-300' },
  { name: 'Train', emoji: '🚂', category: 'Rail', bg: 'from-red-100 to-red-200', border: 'border-red-300' },
  { name: 'Airplane', emoji: '✈️', category: 'Air', bg: 'from-blue-100 to-indigo-200', border: 'border-indigo-300' },
  { name: 'Helicopter', emoji: '🚁', category: 'Air', bg: 'from-cyan-100 to-cyan-200', border: 'border-cyan-300' },
  { name: 'Ship', emoji: '🚢', category: 'Water', bg: 'from-teal-100 to-teal-200', border: 'border-teal-300' },
  { name: 'Boat', emoji: '⛵', category: 'Water', bg: 'from-sky-100 to-sky-200', border: 'border-sky-300' },
  { name: 'Motorcycle', emoji: '🏍️', category: 'Road', bg: 'from-orange-100 to-orange-200', border: 'border-orange-300' },
  { name: 'Truck', emoji: '🚛', category: 'Road', bg: 'from-amber-100 to-amber-200', border: 'border-amber-300' },
  { name: 'Rocket', emoji: '🚀', category: 'Space', bg: 'from-purple-100 to-purple-200', border: 'border-purple-300' },
  { name: 'Submarine', emoji: '🛸', category: 'Water', bg: 'from-gray-100 to-gray-200', border: 'border-gray-300' },
  { name: 'Scooter', emoji: '🛴', category: 'Road', bg: 'from-pink-100 to-pink-200', border: 'border-pink-300' },
  { name: 'Ambulance', emoji: '🚑', category: 'Road', bg: 'from-red-100 to-rose-200', border: 'border-rose-300' },
  { name: 'Fire Truck', emoji: '🚒', category: 'Road', bg: 'from-red-100 to-orange-200', border: 'border-orange-300' },
]

const categoryColors: Record<string, string> = {
  Road: 'bg-blue-500',
  Rail: 'bg-red-500',
  Air: 'bg-cyan-500',
  Water: 'bg-teal-500',
  Space: 'bg-purple-500',
}

export function TransportLearning() {
  const [selected, setSelected] = useState<typeof vehicles[0] | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  const filtered = filter ? vehicles.filter(v => v.category === filter) : vehicles
  const categories = [...new Set(vehicles.map(v => v.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
          🚗 Transport Learning
        </h1>
        <p className="text-gray-500 mt-2">Explore different vehicles and how they move!</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <motion.button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!filter ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 shadow-md'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All
        </motion.button>
        {categories.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === cat ? `${categoryColors[cat]} text-white` : 'bg-white text-gray-600 shadow-md'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {filtered.map((vehicle) => (
          <motion.button
            key={vehicle.name}
            onClick={() => setSelected(vehicle)}
            className={`bg-gradient-to-br ${vehicle.bg} rounded-2xl p-5 shadow-md cursor-pointer hover:shadow-lg border-2 ${vehicle.border} transition-all`}
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <div className="text-5xl mb-2">{vehicle.emoji}</div>
            <h3 className="font-bold font-fredoka text-sm text-gray-700">{vehicle.name}</h3>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${categoryColors[vehicle.category]}`}>
              {vehicle.category}
            </span>
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
                animate={{ x: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {selected.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold font-fredoka text-gray-800">{selected.name}</h2>
              <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-bold text-white ${categoryColors[selected.category]}`}>
                {selected.category}
              </span>
              <p className="text-gray-500 mt-4 text-sm">
                The {selected.name} travels by {selected.category.toLowerCase()}! Vroom vroom! 🏎️
              </p>
              <motion.button
                onClick={() => setSelected(null)}
                className="mt-6 bg-gradient-to-r from-kid-blue to-kid-teal text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Vroom! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
