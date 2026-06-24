import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ColorMatch } from '../../../shared/games/color-match/ColorMatch'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ArrowLeft, Palette, PaintBucket } from 'lucide-react'

const colors = [
  { name: 'Red', hex: '#FF6B6B', emoji: '🔴', bg: 'bg-red-100', text: 'text-red-600' },
  { name: 'Blue', hex: '#4A90D9', emoji: '🔵', bg: 'bg-blue-100', text: 'text-blue-600' },
  { name: 'Green', hex: '#4CAF50', emoji: '🟢', bg: 'bg-green-100', text: 'text-green-600' },
  { name: 'Yellow', hex: '#FFD93D', emoji: '🟡', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { name: 'Purple', hex: '#9C27B0', emoji: '🟣', bg: 'bg-purple-100', text: 'text-purple-600' },
  { name: 'Orange', hex: '#FF9800', emoji: '🟠', bg: 'bg-orange-100', text: 'text-orange-600' },
  { name: 'Pink', hex: '#E91E63', emoji: '💗', bg: 'bg-pink-100', text: 'text-pink-600' },
  { name: 'Brown', hex: '#795548', emoji: '🟤', bg: 'bg-amber-100', text: 'text-amber-700' },
  { name: 'Black', hex: '#333333', emoji: '⚫', bg: 'bg-gray-100', text: 'text-gray-800' },
  { name: 'White', hex: '#F5F5F5', emoji: '⚪', bg: 'bg-gray-50', text: 'text-gray-500' },
]

const colorObjects: Record<string, string[]> = {
  Red: ['🍎', '🚗', '❤️', '🌹', '🍓'],
  Blue: ['🌊', '💧', '🦋', '👖', '🚙'],
  Green: ['🌳', '🍀', '🐸', '🥦', '🌿'],
  Yellow: ['🌞', '🍋', '🌻', '🐤', '⭐'],
  Purple: ['🍇', '💜', '🔮', '👾', '🌂'],
  Orange: ['🍊', '🎃', '🦊', '🧡', '🥕'],
  Pink: ['🌸', '💗', '🦩', '🎀', '🍬'],
  Brown: ['🐻', '🤎', '🧸', '🪵', '🍫'],
  Black: ['🐧', '🎱', '🖤', '🕶️', '🌚'],
  White: ['☁️', '🐇', '⚪', '🧊', '🕊️'],
}

type View = 'menu' | 'game' | 'explore'

function ColorSwatch({ color, onClick }: { color: typeof colors[0]; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative rounded-2xl p-5 shadow-md hover:shadow-lg text-center cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="w-full h-24 rounded-xl mb-3 shadow-inner" style={{ backgroundColor: color.hex }} />
      <p className="text-sm font-bold font-fredoka text-gray-700">{color.name}</p>
      <p className="text-2xl mt-1">{color.emoji}</p>
    </motion.button>
  )
}

export function ColorLearning() {
  const [view, setView] = useState<View>('menu')
  const [selectedColor, setSelectedColor] = useState<typeof colors[0] | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
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
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Color Learning</h1>
          </div>
          <AnimatedCharacter name="Colors" emoji="🎨" size="sm" />
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
                  title="Color Match"
                  icon={<span className="text-4xl">🎯</span>}
                  color="pink"
                  description="Match the colors!"
                  onClick={() => setView('game')}
                />
                <GameCard
                  title="Color Explorer"
                  icon={<span className="text-4xl">🔍</span>}
                  color="red"
                  description="Explore all colors"
                  onClick={() => setView('explore')}
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md">
                <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-kid-pink" />
                  All Colors
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {colors.map((color) => (
                    <ColorSwatch key={color.name} color={color} onClick={() => { setSelectedColor(color); setView('explore') }} />
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
              <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4 text-center">Color Match Game</h2>
              <ColorMatch />
            </motion.div>
          )}

          {view === 'explore' && selectedColor && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md text-center"
            >
              <AnimatedCharacter name={selectedColor.name} emoji={selectedColor.emoji} size="lg" />

              <motion.div
                className="w-32 h-32 rounded-3xl mx-auto my-6 shadow-lg"
                style={{ backgroundColor: selectedColor.hex }}
                animate={{ scale: [1, 1.05, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <p className="text-2xl font-bold font-fredoka text-gray-800 mb-2">{selectedColor.name}</p>
              <p className="text-sm text-gray-400 mb-4">{selectedColor.hex}</p>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center justify-center gap-2">
                  <PaintBucket className="w-4 h-4 text-kid-orange" />
                  Things that are {selectedColor.name}
                </h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {(colorObjects[selectedColor.name] || []).map((obj, i) => (
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
                {colors.map(c => (
                  <motion.button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-xl transition-all ${c.name === selectedColor.name ? 'ring-2 ring-offset-2 scale-110' : 'opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c.hex }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={c.name}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
