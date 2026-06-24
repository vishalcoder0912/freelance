/** Games - Game selection grid. Click a tile to load and play the active game. */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlphabetMatch } from '../shared/games/alphabet-match/AlphabetMatch'
import { ColorMatch } from '../shared/games/color-match/ColorMatch'
import { ShapeSorter } from '../shared/games/shape-sorter/ShapeSorter'
import { MemoryCard } from '../shared/games/memory-card/MemoryCard'
import { AnimalSounds } from '../shared/games/animal-sounds/AnimalSounds'
import { PuzzleBuilder } from '../shared/games/puzzle-builder/PuzzleBuilder'
import { DragDropLearning } from '../shared/games/drag-drop-learning/DragDropLearning'
import { CountingGame } from '../shared/games/counting-game/CountingGame'
import { TracingGame } from '../shared/games/tracing-game/TracingGame'
import { PhonicsGame } from '../shared/games/phonics-game/PhonicsGame'

/* ---------- Available games ---------- */
const games = [
  { id: 'alphabet', title: 'Alphabet Match', icon: '🔤', color: 'blue', component: AlphabetMatch },
  { id: 'color', title: 'Color Match', icon: '🎨', color: 'pink', component: ColorMatch },
  { id: 'shape', title: 'Shape Sorter', icon: '⭐', color: 'orange', component: ShapeSorter },
  { id: 'memory', title: 'Memory Cards', icon: '🧠', color: 'purple', component: MemoryCard },
  { id: 'animals', title: 'Animal Sounds', icon: '🐾', color: 'lime', component: AnimalSounds },
  { id: 'puzzle', title: 'Puzzle Builder', icon: '🧩', color: 'teal', component: PuzzleBuilder },
  { id: 'dragdrop', title: 'Drag & Drop', icon: '🎯', color: 'green', component: DragDropLearning },
  { id: 'counting', title: 'Counting Game', icon: '🔢', color: 'red', component: CountingGame },
  { id: 'tracing', title: 'Tracing Game', icon: '✍️', color: 'indigo', component: TracingGame },
  { id: 'phonics', title: 'Phonics Fun', icon: '🔤', color: 'yellow', component: PhonicsGame },
]

export function Games() {
  const [activeGame, setActiveGame] = useState<string | null>(null)

  const ActiveComponent = games.find(g => g.id === activeGame)?.component

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-fredoka text-gray-800">🎮 Learning Games</h1>
        <p className="text-gray-500">Play and learn at the same time!</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeGame && ActiveComponent ? (
          <motion.div key="game" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setActiveGame(null)}
              className="mb-4 text-gray-600 hover:text-gray-800 font-bold flex items-center gap-2">
              ← Back to Games
            </button>
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <ActiveComponent />
            </div>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {games.map((game) => (
              <motion.button key={game.id} onClick={() => setActiveGame(game.id)}
                className={`bg-gradient-to-br from-${game.color}-400 to-${game.color}-600 rounded-2xl p-6 text-white shadow-lg text-center`}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}>
                <span className="text-4xl block mb-2">{game.icon}</span>
                <span className="font-bold font-fredoka text-sm">{game.title}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
