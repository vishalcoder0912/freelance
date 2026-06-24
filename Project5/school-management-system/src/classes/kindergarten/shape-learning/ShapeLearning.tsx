import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShapeSorter } from '../../../shared/games/shape-sorter/ShapeSorter'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ArrowLeft, Shapes, Search } from 'lucide-react'

const shapes = [
  { name: 'Circle', icon: '⬤', color: '#FF6B6B', bg: 'bg-red-50', description: 'Round like a ball!' },
  { name: 'Square', icon: '■', color: '#4A90D9', bg: 'bg-blue-50', description: 'Four equal sides!' },
  { name: 'Triangle', icon: '▲', color: '#4CAF50', bg: 'bg-green-50', description: 'Three sharp corners!' },
  { name: 'Star', icon: '★', color: '#FFD700', bg: 'bg-yellow-50', description: 'Shining bright!' },
  { name: 'Diamond', icon: '◆', color: '#9C27B0', bg: 'bg-purple-50', description: 'Like a kite!' },
  { name: 'Heart', icon: '♥', color: '#E91E63', bg: 'bg-pink-50', description: 'Full of love!' },
  { name: 'Oval', icon: '⬮', color: '#FF9800', bg: 'bg-orange-50', description: 'Like an egg!' },
  { name: 'Rectangle', icon: '▬', color: '#009688', bg: 'bg-teal-50', description: 'Long and flat!' },
]

const shapeObjects: Record<string, string[]> = {
  Circle: ['⚽', '🔴', '🌞', '🍩', '🎯'],
  Square: ['📦', '🧊', '⬜', '🎲', '🪟'],
  Triangle: ['🔺', '🎄', '📐', '⚠️', '🏔️'],
  Star: ['⭐', '🌟', '✨', '💫', '🎇'],
  Diamond: ['💎', '🔷', '🪁', '◆', '🔶'],
  Heart: ['❤️', '💕', '💗', '💖', '💘'],
  Oval: ['🥚', '🏉', '🫒', '👁️', '🪐'],
  Rectangle: ['📱', '📺', '🪪', '📄', '🚪'],
}

type View = 'menu' | 'game' | 'explore'

function ShapeCard({ shape, onClick }: { shape: typeof shapes[0]; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={`${shape.bg} rounded-2xl p-5 shadow-md hover:shadow-lg text-center cursor-pointer`}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <motion.span
        className="text-6xl block mb-2"
        style={{ color: shape.color }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {shape.icon}
      </motion.span>
      <p className="text-sm font-bold font-fredoka text-gray-700">{shape.name}</p>
      <p className="text-xs text-gray-400 mt-1">{shape.description}</p>
    </motion.button>
  )
}

export function ShapeLearning() {
  const [view, setView] = useState<View>('menu')
  const [selectedShape, setSelectedShape] = useState<typeof shapes[0] | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            {view !== 'menu' && (
              <motion.button
                onClick={() => setView('menu')}
                className="p-2 rounded-xl bg-white shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Shape Learning</h1>
          </div>
          <AnimatedCharacter name="Shapes" emoji="⭐" size="sm" />
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <GameCard
                  title="Shape Sorter"
                  icon={<span className="text-4xl">🎯</span>}
                  color="orange"
                  description="Find the shapes!"
                  onClick={() => setView('game')}
                />
                <GameCard
                  title="Shape Explorer"
                  icon={<span className="text-4xl">🔍</span>}
                  color="yellow"
                  description="Explore all shapes"
                  onClick={() => setView('explore')}
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md">
                <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                  <Shapes className="w-5 h-5 text-kid-orange" />
                  All Shapes
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {shapes.map((shape) => (
                    <ShapeCard key={shape.name} shape={shape} onClick={() => { setSelectedShape(shape); setView('explore') }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4 text-center">Shape Sorter Game</h2>
              <ShapeSorter />
            </motion.div>
          )}

          {view === 'explore' && selectedShape && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md text-center"
            >
              <AnimatedCharacter name={selectedShape.name} emoji={selectedShape.icon} size="lg" />

              <motion.span
                className="text-8xl block my-6"
                style={{ color: selectedShape.color }}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedShape.icon}
              </motion.span>

              <p className="text-2xl font-bold font-fredoka text-gray-800 mb-2">{selectedShape.name}</p>
              <p className="text-gray-500 mb-3">{selectedShape.description}</p>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center justify-center gap-2">
                  <Search className="w-4 h-4 text-kid-orange" />
                  Things shaped like {selectedShape.name}
                </h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {(shapeObjects[selectedShape.name] || []).map((obj, i) => (
                    <motion.span
                      key={i}
                      className="text-3xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      {obj}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-center mt-6 flex-wrap">
                {shapes.map(s => (
                  <motion.button
                    key={s.name}
                    onClick={() => setSelectedShape(s)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${s.name === selectedShape.name ? 'ring-2 ring-offset-2 scale-110 shadow-md' : 'opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: s.color + '20' }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={s.name}
                  >
                    {s.icon}
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
