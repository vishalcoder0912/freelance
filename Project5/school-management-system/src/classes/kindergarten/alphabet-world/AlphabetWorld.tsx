import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlphabetMatch } from '../../../shared/games/alphabet-match/AlphabetMatch'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { ArrowLeft, BookOpen, Pencil, Volume2, Info } from 'lucide-react'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const letterPhonics: Record<string, { word: string; emoji: string; sound: string }> = {
  A: { word: 'Apple', emoji: '🍎', sound: 'Ah' },
  B: { word: 'Ball', emoji: '⚽', sound: 'Buh' },
  C: { word: 'Cat', emoji: '🐱', sound: 'Cuh' },
  D: { word: 'Dog', emoji: '🐕', sound: 'Duh' },
  E: { word: 'Elephant', emoji: '🐘', sound: 'Eh' },
  F: { word: 'Fish', emoji: '🐟', sound: 'Ff' },
  G: { word: 'Grapes', emoji: '🍇', sound: 'Guh' },
  H: { word: 'House', emoji: '🏠', sound: 'Huh' },
  I: { word: 'Ice cream', emoji: '🍦', sound: 'Ih' },
  J: { word: 'Jug', emoji: '🏺', sound: 'Juh' },
  K: { word: 'Kite', emoji: '🪁', sound: 'Kuh' },
  L: { word: 'Lemon', emoji: '🍋', sound: 'Ll' },
  M: { word: 'Monkey', emoji: '🐵', sound: 'Mm' },
  N: { word: 'Nest', emoji: '🪺', sound: 'Nn' },
  O: { word: 'Orange', emoji: '🍊', sound: 'Oh' },
  P: { word: 'Penguin', emoji: '🐧', sound: 'Puh' },
  Q: { word: 'Queen', emoji: '👑', sound: 'Kw' },
  R: { word: 'Rainbow', emoji: '🌈', sound: 'Rr' },
  S: { word: 'Sun', emoji: '☀️', sound: 'Ss' },
  T: { word: 'Tiger', emoji: '🐯', sound: 'Tuh' },
  U: { word: 'Umbrella', emoji: '☂️', sound: 'Uh' },
  V: { word: 'Violin', emoji: '🎻', sound: 'Vv' },
  W: { word: 'Watermelon', emoji: '🍉', sound: 'Ww' },
  X: { word: 'Xylophone', emoji: '🎵', sound: 'Ks' },
  Y: { word: 'Yarn', emoji: '🧶', sound: 'Yy' },
  Z: { word: 'Zebra', emoji: '🦓', sound: 'Zz' },
}

type View = 'menu' | 'game' | 'explore' | 'trace'

const tracingPaths: Record<string, string[]> = {
  A: ['M 10 80 L 50 20 L 90 80', 'M 25 60 L 75 60'],
  B: ['M 20 20 L 20 80', 'M 20 20 Q 60 20 60 50 Q 60 80 20 80'],
  C: ['M 70 20 Q 20 20 20 50 Q 20 80 70 80'],
  D: ['M 20 20 L 20 80', 'M 20 20 Q 70 20 70 50 Q 70 80 20 80'],
  E: ['M 70 20 L 20 20 L 20 80 L 70 80', 'M 20 50 L 55 50'],
  F: ['M 70 20 L 20 20 L 20 80', 'M 20 50 L 55 50'],
  G: ['M 70 20 Q 20 20 20 50 Q 20 80 55 80 L 70 65 L 45 65'],
  H: ['M 20 20 L 20 80', 'M 80 20 L 80 80', 'M 20 50 L 80 50'],
  I: ['M 20 20 L 80 20', 'M 50 20 L 50 80', 'M 20 80 L 80 80'],
  J: ['M 80 20 L 80 65 Q 80 80 50 80 L 40 75'],
  K: ['M 20 20 L 20 80', 'M 70 20 L 40 50 L 70 80'],
  L: ['M 20 20 L 20 80 L 75 80'],
  M: ['M 15 80 L 15 20 L 50 65 L 85 20 L 85 80'],
  N: ['M 15 80 L 15 20 L 75 80 L 75 20'],
  O: ['M 50 15 Q 15 15 15 50 Q 15 85 50 85 Q 85 85 85 50 Q 85 15 50 15'],
  P: ['M 20 20 L 20 80', 'M 20 20 Q 65 20 65 50 Q 65 80 20 80'],
  Q: ['M 50 15 Q 15 15 15 50 Q 15 85 50 85 Q 85 85 85 50 Q 85 15 50 15', 'M 65 65 L 80 80'],
  R: ['M 20 20 L 20 80', 'M 20 20 Q 65 20 65 50 Q 65 80 20 80', 'M 50 50 L 75 80'],
  S: ['M 65 20 Q 20 20 20 45 Q 20 70 65 70 Q 80 70 80 80 L 20 80'],
  T: ['M 20 20 L 80 20', 'M 50 20 L 50 80'],
  U: ['M 15 20 L 15 60 Q 15 85 50 85 Q 85 85 85 60 L 85 20'],
  V: ['M 15 20 L 50 80 L 85 20'],
  W: ['M 10 20 L 30 80 L 50 40 L 70 80 L 90 20'],
  X: ['M 15 20 L 85 80', 'M 85 20 L 15 80'],
  Y: ['M 15 20 L 50 50 L 85 20', 'M 50 50 L 50 80'],
  Z: ['M 15 20 L 85 20 L 15 80 L 85 80'],
}

function LetterCard({ letter, onClick }: { letter: string; onClick: () => void }) {
  const info = letterPhonics[letter]
  return (
    <motion.button
      onClick={onClick}
      className="relative bg-white rounded-2xl p-4 shadow-md hover:shadow-lg text-center cursor-pointer"
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="text-5xl font-bold font-fredoka mb-1" style={{ color: `hsl(${(letter.charCodeAt(0) - 65) * 14}, 70%, 50%)` }}>
        {letter}
      </div>
      <div className="text-2xl mb-1">{info.emoji}</div>
      <p className="text-xs font-semibold text-gray-500">{info.word}</p>
    </motion.button>
  )
}

export function AlphabetWorld() {
  const [view, setView] = useState<View>('menu')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter)
    setView('explore')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
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
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Alphabet World</h1>
          </div>
          <div className="flex gap-2">
            <AnimatedCharacter name="ABC" emoji="🔤" size="sm" />
          </div>
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
                  title="ABC Match"
                  icon={<span className="text-4xl">🎮</span>}
                  color="blue"
                  description="Match letters with pictures"
                  onClick={() => setView('game')}
                />
                <GameCard
                  title="Letter Explorer"
                  icon={<span className="text-4xl">🔍</span>}
                  color="purple"
                  description="Explore each letter"
                  onClick={() => setView('explore')}
                />
                <GameCard
                  title="Tracing Fun"
                  icon={<span className="text-4xl">✍️</span>}
                  color="pink"
                  description="Practice writing letters"
                  onClick={() => setView('trace')}
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md">
                <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-kid-blue" />
                  All Letters
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-13 gap-3">
                  {letters.map((letter) => (
                    <LetterCard key={letter} letter={letter} onClick={() => handleLetterClick(letter)} />
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
              <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4 text-center">ABC Match Game</h2>
              <AlphabetMatch />
            </motion.div>
          )}

          {view === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {selectedLetter && (
                <motion.div
                  className="bg-white rounded-2xl p-6 shadow-md text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <AnimatedCharacter name={letterPhonics[selectedLetter].word} emoji={letterPhonics[selectedLetter].emoji} size="lg" />
                  </div>

                  <motion.div
                    className="text-8xl font-bold font-fredoka mb-4"
                    style={{ color: `hsl(${(selectedLetter.charCodeAt(0) - 65) * 14}, 70%, 50%)` }}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {selectedLetter}
                  </motion.div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-kid-blue" />
                      <span className="font-bold text-gray-700">Sound: <span className="text-kid-purple">&ldquo;{letterPhonics[selectedLetter].sound}&rdquo;</span></span>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 flex items-center gap-3">
                      <Info className="w-5 h-5 text-kid-green" />
                      <span className="font-bold text-gray-700">Word: <span className="text-kid-orange">{letterPhonics[selectedLetter].word}</span></span>
                    </div>
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-2xl">{letterPhonics[selectedLetter].emoji}</span>
                      <span className="font-bold text-gray-700">Starts with: <span className="text-kid-pink text-2xl font-fredoka">{selectedLetter}</span></span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center mt-6">
                    {letters.map(l => (
                      <motion.button
                        key={l}
                        onClick={() => setSelectedLetter(l)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold font-fredoka transition-all ${l === selectedLetter ? 'bg-kid-blue text-white scale-125 shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {l}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === 'trace' && (
            <motion.div
              key="trace"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4 text-center flex items-center justify-center gap-2">
                <Pencil className="w-5 h-5 text-kid-pink" />
                Letter Tracing
              </h2>
              <p className="text-center text-gray-500 mb-6">Trace the letter with your finger or mouse!</p>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {letters.map(l => (
                  <motion.button
                    key={l}
                    onClick={() => setSelectedLetter(l)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold font-fredoka transition-all ${l === selectedLetter ? 'bg-kid-blue text-white shadow-md scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {l}
                  </motion.button>
                ))}
              </div>

              {selectedLetter && (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                    <svg viewBox="0 0 100 100" className="w-full h-48">
                      {tracingPaths[selectedLetter]?.map((path, i) => (
                        <motion.path
                          key={i}
                          d={path}
                          fill="none"
                          stroke={`hsl(${(selectedLetter.charCodeAt(0) - 65) * 14}, 70%, 60%)`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="300"
                          initial={{ strokeDashoffset: 300 }}
                          animate={{ strokeDashoffset: 0 }}
                          transition={{ duration: 2, delay: i * 0.5 }}
                        />
                      ))}
                      {tracingPaths[selectedLetter]?.map((path, i) => (
                        <motion.path
                          key={`guide-${i}`}
                          d={path}
                          fill="none"
                          stroke="rgba(0,0,0,0.08)"
                          strokeWidth="20"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}
                    </svg>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-3">
                    Follow the dotted line to trace &ldquo;{selectedLetter}&rdquo;
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-3 text-center">Practice Writing</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="aspect-square border border-gray-200 rounded-lg flex items-center justify-center text-2xl font-fredoka text-gray-200">
                        {selectedLetter}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
