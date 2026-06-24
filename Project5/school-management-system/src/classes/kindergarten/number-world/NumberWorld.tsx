import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CountingGame } from '../../../shared/games/counting-game/CountingGame'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { ArrowLeft, Calculator, Eye, List } from 'lucide-react'

type View = 'menu' | 'game' | 'explore' | 'count'

const numbers = Array.from({ length: 10 }, (_, i) => i + 1)

const numberVisuals: Record<number, { emoji: string; word: string; fingers: string; dots: number[] }> = {
  1: { emoji: '☝️', word: 'One', fingers: '☝️', dots: [1] },
  2: { emoji: '✌️', word: 'Two', fingers: '✌️', dots: [1, 1] },
  3: { emoji: '👌', word: 'Three', fingers: '🤟', dots: [1, 1, 1] },
  4: { emoji: '🍀', word: 'Four', fingers: '🖐️', dots: [1, 1, 1, 1] },
  5: { emoji: '🖐️', word: 'Five', fingers: '🖐️', dots: [1, 1, 1, 1, 1] },
  6: { emoji: '🐝', word: 'Six', fingers: '🖐️☝️', dots: [1, 1, 1, 1, 1, 1] },
  7: { emoji: '🌈', word: 'Seven', fingers: '🖐️✌️', dots: [1, 1, 1, 1, 1, 1, 1] },
  8: { emoji: '🐙', word: 'Eight', fingers: '🖐️👌', dots: [1, 1, 1, 1, 1, 1, 1, 1] },
  9: { emoji: '🌀', word: 'Nine', fingers: '🖐️🖐️', dots: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
  10: { emoji: '🔟', word: 'Ten', fingers: '🖐️🖐️', dots: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
}

const numberColors = [
  'from-red-400 to-orange-500',
  'from-blue-400 to-indigo-500',
  'from-green-400 to-teal-500',
  'from-purple-400 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-pink-400 to-red-500',
  'from-indigo-400 to-purple-500',
  'from-teal-400 to-green-500',
  'from-orange-400 to-red-500',
  'from-cyan-400 to-blue-500',
]

function NumberCard({ num, onClick }: { num: number; onClick: () => void }) {
  const info = numberVisuals[num]
  return (
    <motion.button
      onClick={onClick}
      className="relative bg-white rounded-2xl p-4 shadow-md hover:shadow-lg text-center cursor-pointer"
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="text-5xl font-bold font-fredoka mb-1">{num}</div>
      <div className="flex justify-center gap-0.5 mb-1">
        {info.dots.map((_, i) => (
          <span key={i} className="text-lg">●</span>
        ))}
      </div>
      <p className="text-xs font-semibold text-gray-500">{info.word}</p>
    </motion.button>
  )
}

export function NumberWorld() {
  const [view, setView] = useState<View>('menu')
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  const handleNumberClick = (num: number) => {
    setSelectedNumber(num)
    setView('explore')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
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
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Number World</h1>
          </div>
          <AnimatedCharacter name="123" emoji="🔢" size="sm" />
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <GameCard
                  title="Counting Game"
                  icon={<span className="text-4xl">🎯</span>}
                  color="green"
                  description="Count the objects!"
                  onClick={() => setView('game')}
                />
                <GameCard
                  title="Number Explorer"
                  icon={<span className="text-4xl">🔍</span>}
                  color="teal"
                  description="Explore numbers 1-10"
                  onClick={() => setView('explore')}
                />
                <GameCard
                  title="Let's Count"
                  icon={<span className="text-4xl">👆</span>}
                  color="lime"
                  description="Count with your fingers"
                  onClick={() => setView('count')}
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md">
                <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-kid-green" />
                  Numbers 1 to 10
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3">
                  {numbers.map((num) => (
                    <NumberCard key={num} num={num} onClick={() => handleNumberClick(num)} />
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
              <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4 text-center">Counting Game</h2>
              <CountingGame maxNumber={10} />
            </motion.div>
          )}

          {view === 'explore' && selectedNumber !== null && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md text-center"
            >
              <AnimatedCharacter name={numberVisuals[selectedNumber].word} emoji={numberVisuals[selectedNumber].emoji} size="lg" />

              <motion.div
                className="text-8xl font-bold font-fredoka my-4"
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedNumber}
              </motion.div>

              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {numberVisuals[selectedNumber].dots.map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-3xl"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    🍎
                  </motion.span>
                ))}
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 flex items-center gap-3 justify-center">
                  <Eye className="w-5 h-5 text-kid-green" />
                  <span className="font-bold text-gray-700">Word: <span className="text-kid-orange">{numberVisuals[selectedNumber].word}</span></span>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 flex items-center gap-3 justify-center">
                  <span className="text-2xl">{numberVisuals[selectedNumber].fingers}</span>
                  <span className="font-bold text-gray-700">Show with fingers!</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center mt-6 flex-wrap">
                {numbers.map(n => (
                  <motion.button
                    key={n}
                    onClick={() => setSelectedNumber(n)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold font-fredoka transition-all ${n === selectedNumber ? 'bg-kid-green text-white scale-110 shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'count' && (
            <motion.div
              key="count"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4 text-center flex items-center justify-center gap-2">
                <List className="w-5 h-5 text-kid-teal" />
                Let's Count Together!
              </h2>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {numbers.map(n => (
                  <motion.button
                    key={n}
                    onClick={() => setSelectedNumber(n)}
                    className={`w-12 h-12 rounded-xl text-lg font-bold font-fredoka transition-all ${n === selectedNumber ? 'bg-kid-green text-white scale-110 shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>

              {selectedNumber !== null && (
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-6 mb-4">
                    <p className="text-lg font-bold text-gray-700 mb-4">
                      Let's count to {selectedNumber}!
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {Array.from({ length: selectedNumber }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-14 h-14 bg-gradient-to-br from-kid-green to-kid-teal rounded-xl flex items-center justify-center text-white text-xl font-bold font-fredoka shadow-md"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          {i + 1}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    className="text-6xl font-bold font-fredoka text-kid-green"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {selectedNumber}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
