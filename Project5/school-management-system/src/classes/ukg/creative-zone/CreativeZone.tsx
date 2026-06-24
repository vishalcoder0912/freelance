// CreativeZone - Drawing prompts and craft ideas for UKG
// Dual mode: drawing prompts with color palette picker, or craft ideas with materials and step-by-step instructions
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Palette, RotateCcw } from 'lucide-react'
import { RewardScreen } from '../../../shared/components/RewardScreen'

// Drawing prompts with hints
const drawingPrompts = [
  { prompt: 'Draw a rainbow', emoji: '🌈', hint: 'Use red, orange, yellow, green, blue, purple!' },
  { prompt: 'Draw your favorite animal', emoji: '🐾', hint: 'Think about what makes them special!' },
  { prompt: 'Draw a flower garden', emoji: '🌸', hint: 'Add different colors for each flower!' },
  { prompt: 'Draw a space rocket', emoji: '🚀', hint: 'Draw stars and planets around it!' },
  { prompt: 'Draw a happy family', emoji: '👨‍👩‍👧‍👦', hint: 'Draw everyone smiling!' },
  { prompt: 'Draw an underwater scene', emoji: '🐟', hint: 'Add fish, seaweed, and bubbles!' },
  { prompt: 'Draw a castle', emoji: '🏰', hint: 'Add towers, flags, and a big gate!' },
  { prompt: 'Draw your dream playground', emoji: '🎡', hint: 'Slides, swings, and lots of fun!' },
]

// Craft ideas with materials and steps
const craftIdeas = [
  { title: 'Paper Butterfly', emoji: '🦋', items: ['Paper', 'Colors', 'Scissors', 'Glue'], steps: ['Fold paper in half', 'Draw butterfly shape', 'Cut it out', 'Decorate with colors'] },
  { title: 'Handprint Tree', emoji: '🌳', items: ['Paper', 'Paint', 'Markers'], steps: ['Trace your hand', 'Color it brown', 'Add green leaves', 'Draw fruits'] },
  { title: 'Paper Mask', emoji: '🎭', items: ['Paper plate', 'Colors', 'String', 'Glue'], steps: ['Cut eye holes', 'Decorate the plate', 'Attach string', 'Wear your mask!'] },
  { title: 'Origami Boat', emoji: '⛵', items: ['Square paper'], steps: ['Fold in half', 'Fold corners', 'Fold edges up', 'Open and float!'] },
]

// Color palette for drawing reference
const colors = [
  { name: 'Red', hex: '#FF6B6B' },
  { name: 'Blue', hex: '#4A90D9' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Yellow', hex: '#FFD93D' },
  { name: 'Purple', hex: '#9C27B0' },
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Teal', hex: '#009688' },
]

export function CreativeZone() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'drawing' | 'craft'>('drawing')
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [currentCraft, setCurrentCraft] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const prompt = drawingPrompts[currentPrompt]
  const craft = craftIdeas[currentCraft]

  // Mark current activity as complete and advance
  const markComplete = () => {
    if (mode === 'drawing') {
      setCompleted(prev => new Set([...prev, currentPrompt]))
      if (currentPrompt < drawingPrompts.length - 1) {
        setTimeout(() => setCurrentPrompt(i => i + 1), 500)
      } else {
        setShowReward(true)
      }
    } else {
      setCompleted(prev => new Set([...prev, currentCraft]))
      if (currentCraft < craftIdeas.length - 1) {
        setTimeout(() => setCurrentCraft(i => i + 1), 500)
      } else {
        setShowReward(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Back navigation */}
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        {/* Header card */}
        <motion.div
          className="bg-gradient-to-r from-kid-pink to-kid-orange rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🎨</span><span>✂️</span><span>🖌️</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Creative Zone</h1>
          <p className="text-white/80 text-sm">Draw, create, and let your imagination fly!</p>
        </motion.div>

        {/* Mode toggle: Drawing Prompts / Craft Ideas */}
        <div className="flex gap-2 mb-6">
          <motion.button
            onClick={() => setMode('drawing')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'drawing' ? 'bg-gradient-to-r from-kid-pink to-kid-orange text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Drawing Prompts
          </motion.button>
          <motion.button
            onClick={() => setMode('craft')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'craft' ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Craft Ideas
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'drawing' ? (
            // Drawing prompts mode
            <motion.div
              key="drawing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={currentPrompt}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {/* Progress dots */}
                <div className="flex justify-center gap-1 mb-4">
                  {drawingPrompts.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= currentPrompt ? 'bg-kid-pink' : 'bg-gray-200'}`} />
                  ))}
                </div>

                {/* Bouncing emoji */}
                <motion.span
                  className="text-7xl block mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {prompt.emoji}
                </motion.span>

                <h2 className="text-2xl font-bold text-gray-800 font-fredoka mb-3">{prompt.prompt}</h2>

                {/* Hint */}
                <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-3 mb-4">
                  <p className="text-sm text-gray-600 italic">💡 {prompt.hint}</p>
                </div>

                {/* Color palette selector */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 mb-2">Choose your colors:</p>
                  <div className="flex justify-center gap-2">
                    {colors.map((c) => (
                      <motion.button
                        key={c.name}
                        onClick={() => setSelectedColor(c.hex)}
                        className={`w-8 h-8 rounded-full shadow-md ${selectedColor === c.hex ? 'ring-2 ring-offset-2 ring-gray-400 scale-125' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Drawing area placeholder */}
                <div className="bg-gray-50 rounded-2xl h-48 flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                  <div className="text-center">
                    <Palette className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Draw on paper and show your teacher!</p>
                  </div>
                </div>

                {/* Mark as complete button */}
                <motion.button
                  onClick={markComplete}
                  className="bg-gradient-to-r from-kid-pink to-kid-orange text-white px-6 py-3 rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {completed.has(currentPrompt) ? 'Done ✓' : 'I drew it!'}
                </motion.button>
              </motion.div>

              {/* Navigation controls */}
              <div className="flex justify-between">
                <motion.button
                  onClick={() => currentPrompt > 0 && setCurrentPrompt(i => i - 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Previous
                </motion.button>
                <motion.button
                  onClick={() => currentPrompt < drawingPrompts.length - 1 && setCurrentPrompt(i => i + 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next →
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Craft ideas mode
            <motion.div
              key="craft"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg mb-6"
                key={currentCraft}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Progress dots */}
                <div className="flex justify-center gap-1 mb-4">
                  {craftIdeas.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= currentCraft ? 'bg-kid-purple' : 'bg-gray-200'}`} />
                  ))}
                </div>

                {/* Wobbling emoji */}
                <motion.span
                  className="text-6xl block text-center mb-4"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {craft.emoji}
                </motion.span>

                <h2 className="text-2xl font-bold text-gray-800 font-fredoka text-center mb-4">{craft.title}</h2>

                {/* Materials list */}
                <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">You need:</p>
                  <div className="flex flex-wrap gap-2">
                    {craft.items.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-600 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-by-step instructions */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-bold text-gray-700">Steps:</p>
                  {craft.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                      <span className="w-6 h-6 bg-gradient-to-r from-kid-purple to-kid-pink text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>

                {/* Mark as complete button */}
                <motion.button
                  onClick={markComplete}
                  className="w-full bg-gradient-to-r from-kid-purple to-kid-pink text-white py-3 rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {completed.has(currentCraft) ? 'Done ✓' : 'I made it!'}
                </motion.button>
              </motion.div>

              {/* Navigation controls */}
              <div className="flex justify-between">
                <motion.button
                  onClick={() => currentCraft > 0 && setCurrentCraft(i => i - 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Previous
                </motion.button>
                <motion.button
                  onClick={() => currentCraft < craftIdeas.length - 1 && setCurrentCraft(i => i + 1)}
                  className="bg-white px-4 py-2 rounded-full shadow font-bold text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motivational footer */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-kid-pink to-kid-orange rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            There are no mistakes in art!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>

        <RewardScreen show={showReward} message="Creative Star!" emoji="🎨" onClose={() => setShowReward(false)} />
      </div>
    </div>
  )
}
