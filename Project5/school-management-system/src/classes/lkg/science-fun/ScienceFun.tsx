import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Star, Volume2 } from 'lucide-react'

const topics = [
  {
    title: 'Water Cycle', emoji: '💧', color: 'blue', facts: [
      'Water evaporates from lakes and rivers',
      'It forms clouds in the sky',
      'Rain falls from the clouds',
      'The water goes back to rivers',
    ]
  },
  {
    title: 'Plants', emoji: '🌱', color: 'green', facts: [
      'Plants need sunlight to grow',
      'They need water and soil too',
      'Leaves make food for the plant',
      'Flowers turn into fruits!',
    ]
  },
  {
    title: 'Weather', emoji: '🌈', color: 'orange', facts: [
      'Sunny days are warm and bright',
      'Cloudy days might bring rain',
      'Wind blows leaves around',
      'Rainbow appears after rain!',
    ]
  },
  {
    title: 'Animals', emoji: '🐾', color: 'lime', facts: [
      'Animals live in different places',
      'Some animals have fur',
      'Birds have feathers to fly',
      'Fish have scales and fins',
    ]
  },
  {
    title: 'My Body', emoji: '🫀', color: 'pink', facts: [
      'Your heart pumps blood',
      'Your brain helps you think',
      'Your eyes help you see',
      'Your ears help you hear!',
    ]
  },
  {
    title: 'Space', emoji: '🚀', color: 'purple', facts: [
      'The sun is a big star',
      'The moon goes around Earth',
      'There are 8 planets',
      'Astronauts go to space!',
    ]
  },
]

export function ScienceFun() {
  const navigate = useNavigate()
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [unlockedFacts, setUnlockedFacts] = useState<Set<string>>(new Set())

  const topic = selectedTopic !== null ? topics[selectedTopic] : null

  const revealFact = (fact: string) => {
    setUnlockedFacts(prev => new Set([...prev, fact]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => selectedTopic !== null ? setSelectedTopic(null) : navigate('/lkg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> {selectedTopic !== null ? 'Back to Topics' : 'Back to LKG'}
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-teal to-kid-green rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🔬</span><span>🌍</span><span>🧪</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Science Fun</h1>
          <p className="text-white/80 text-sm">Explore amazing science topics!</p>
        </motion.div>

        {selectedTopic === null ? (
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {topics.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedTopic(i)}
                className="bg-white rounded-3xl p-5 shadow-md text-center"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <motion.div
                  className="text-5xl mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                >
                  {t.emoji}
                </motion.div>
                <h3 className="font-bold text-gray-800 font-fredoka text-sm">{t.title}</h3>
                <div className={`w-2 h-2 rounded-full bg-kid-${t.color} mx-auto mt-1`} />
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={selectedTopic}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6">
              <motion.div
                className="text-7xl mb-4"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                {topic?.emoji}
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 font-fredoka mb-2">{topic?.title}</h2>
              <p className="text-gray-500 text-sm mb-4">Tap each fact to reveal!</p>

              <div className="space-y-2 text-left">
                {topic?.facts.map((fact, i) => {
                  const revealed = unlockedFacts.has(fact)
                  return (
                    <motion.div
                      key={i}
                      className={`rounded-xl p-3 cursor-pointer transition-all ${revealed ? 'bg-gradient-to-r from-kid-blue/10 to-kid-purple/10 border border-kid-blue/20' : 'bg-gray-100'}`}
                      onClick={() => !revealed && revealFact(fact)}
                      whileHover={revealed ? {} : { scale: 1.02 }}
                      whileTap={revealed ? {} : { scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        {revealed ? (
                          <>
                            <Sparkles className={`w-4 h-4 text-${topic?.color}-500`} />
                            <span className="text-sm font-medium text-gray-700">{fact}</span>
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Tap to reveal fact {i + 1}</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.button
                onClick={() => {
                  setSelectedTopic(null)
                  setUnlockedFacts(new Set())
                }}
                className="mt-6 bg-gradient-to-r from-kid-teal to-kid-green text-white px-6 py-3 rounded-full font-bold shadow-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Volume2 className="w-4 h-4" /> Done Exploring
              </motion.button>
            </div>
          </motion.div>
        )}

        {selectedTopic === null && (
          <motion.div
            className="mt-6 bg-gradient-to-r from-kid-teal to-kid-blue rounded-2xl p-4 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white font-bold">Pick a topic and start exploring!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
