// EnvironmentalScience - Environment and science exploration for UKG
// Grid of topics (Weather & Seasons, Our Environment, Food & Nutrition, Community Helpers, Transport, Our Body)
// Each topic shows items with a carousel navigation and progress dots
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react'

// Environmental science topics with items per topic
const topics = [
  {
    title: 'Weather & Seasons', emoji: '🌈', color: 'orange', items: [
      { name: 'Summer', icon: '☀️', fact: 'Summer is hot and sunny' },
      { name: 'Winter', icon: '❄️', fact: 'Winter is cold and snowy' },
      { name: 'Spring', icon: '🌸', fact: 'Spring has flowers and rain' },
      { name: 'Rainy', icon: '🌧️', fact: 'Rainy season brings water' },
    ]
  },
  {
    title: 'Our Environment', emoji: '🌍', color: 'green', items: [
      { name: 'Trees', icon: '🌳', fact: 'Trees give us oxygen' },
      { name: 'Water', icon: '💧', fact: 'We need water to live' },
      { name: 'Air', icon: '💨', fact: 'Air is all around us' },
      { name: 'Soil', icon: '🏔️', fact: 'Plants grow in soil' },
    ]
  },
  {
    title: 'Food & Nutrition', emoji: '🍎', color: 'red', items: [
      { name: 'Fruits', icon: '🍎', fact: 'Fruits give us vitamins' },
      { name: 'Vegetables', icon: '🥕', fact: 'Vegetables make us strong' },
      { name: 'Milk', icon: '🥛', fact: 'Milk has calcium for bones' },
      { name: 'Grains', icon: '🌾', fact: 'Grains give us energy' },
    ]
  },
  {
    title: 'Community Helpers', emoji: '👨‍🚒', color: 'blue', items: [
      { name: 'Doctor', icon: '👨‍⚕️', fact: 'Doctors help us stay healthy' },
      { name: 'Teacher', icon: '👩‍🏫', fact: 'Teachers help us learn' },
      { name: 'Firefighter', icon: '👨‍🚒', fact: 'Firefighters save people' },
      { name: 'Police', icon: '👮', fact: 'Police keep us safe' },
    ]
  },
  {
    title: 'Transport', emoji: '🚗', color: 'purple', items: [
      { name: 'Car', icon: '🚗', fact: 'Cars travel on roads' },
      { name: 'Train', icon: '🚂', fact: 'Trains run on tracks' },
      { name: 'Aeroplane', icon: '✈️', fact: 'Aeroplanes fly in the sky' },
      { name: 'Ship', icon: '🚢', fact: 'Ships sail on water' },
    ]
  },
  {
    title: 'Our Body', emoji: '🫀', color: 'pink', items: [
      { name: 'Heart', icon: '❤️', fact: 'Your heart pumps blood' },
      { name: 'Brain', icon: '🧠', fact: 'Your brain thinks' },
      { name: 'Lungs', icon: '🫁', fact: 'Your lungs help you breathe' },
      { name: 'Stomach', icon: '🫃', fact: 'Your stomach digests food' },
    ]
  },
]

export function EnvironmentalScience() {
  const navigate = useNavigate()
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [activeItem, setActiveItem] = useState<number>(0)

  const topic = selectedTopic !== null ? topics[selectedTopic] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-teal-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Dynamic back button */}
        <motion.button
          onClick={() => selectedTopic !== null ? setSelectedTopic(null) : navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> {selectedTopic !== null ? 'Back to Topics' : 'Back to UKG'}
        </motion.button>

        {/* Header card */}
        <motion.div
          className="bg-gradient-to-r from-kid-lime to-kid-green rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🌍</span><span>🌳</span><span>🌈</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Environmental Science</h1>
          <p className="text-white/80 text-sm">Learn about our amazing world!</p>
        </motion.div>

        {selectedTopic === null ? (
          // Topic selection grid
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {topics.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => { setSelectedTopic(i); setActiveItem(0) }}
                className="bg-white rounded-3xl p-5 shadow-md text-center"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Bouncing topic emoji */}
                <motion.div
                  className="text-5xl mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                >
                  {t.emoji}
                </motion.div>
                <h3 className="font-bold text-gray-800 font-fredoka text-sm">{t.title}</h3>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          // Topic detail view with item carousel
          <motion.div
            key={selectedTopic}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6">
              {/* Progress dots */}
              <div className="flex justify-center gap-1 mb-4">
                {topic?.items.map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === activeItem ? 'bg-kid-green' : 'bg-gray-200'}`} />
                ))}
              </div>

              {/* Animated icon with spring rotation effect */}
              <motion.div
                key={activeItem}
                className="text-7xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {topic?.items[activeItem].icon}
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 font-fredoka mb-2">{topic?.items[activeItem].name}</h2>
              <p className="text-gray-600 font-medium mb-4">{topic?.items[activeItem].fact}</p>

              {/* Learning prompt */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <Volume2 className="w-4 h-4" />
                <span>Learn about {topic?.items[activeItem].name}!</span>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => activeItem > 0 && setActiveItem(i => i - 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Previous
                </motion.button>
                <motion.button
                  onClick={() => activeItem < (topic?.items.length ?? 1) - 1 && setActiveItem(i => i + 1)}
                  className="bg-gradient-to-r from-kid-lime to-kid-green text-white px-6 py-2 rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next →
                </motion.button>
              </div>
            </div>

            {/* Item selector grid */}
            <div className="grid grid-cols-2 gap-3">
              {topic?.items.map((item, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveItem(i)}
                  className={`bg-white rounded-2xl p-3 text-center shadow-md ${activeItem === i ? 'ring-2 ring-kid-green' : ''}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-2xl block">{item.icon}</span>
                  <span className="text-xs font-bold text-gray-700 mt-1 block">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational footer (only on topic selection view) */}
        {selectedTopic === null && (
          <motion.div
            className="mt-6 bg-gradient-to-r from-kid-lime to-kid-green rounded-2xl p-4 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white font-bold">Explore and learn about our world!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
