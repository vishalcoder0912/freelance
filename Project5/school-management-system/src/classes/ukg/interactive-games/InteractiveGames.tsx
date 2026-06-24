import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Gamepad2 } from 'lucide-react'
import { GameCard } from '../../../shared/components/GameCard'
import { AlphabetMatch } from '../../../shared/games/alphabet-match/AlphabetMatch'
import { ColorMatch } from '../../../shared/games/color-match/ColorMatch'
import { ShapeSorter } from '../../../shared/games/shape-sorter/ShapeSorter'
import { MemoryCard } from '../../../shared/games/memory-card/MemoryCard'
import { AnimalSounds } from '../../../shared/games/animal-sounds/AnimalSounds'
import { PuzzleBuilder } from '../../../shared/games/puzzle-builder/PuzzleBuilder'
import { DragDropLearning } from '../../../shared/games/drag-drop-learning/DragDropLearning'

type GameType = 'alphabet' | 'colors' | 'shapes' | 'memory' | 'animals' | 'puzzle' | 'dragdrop' | null

const gameMeta = [
  { id: 'alphabet' as const, title: 'Alphabet Match', icon: '🔤', color: 'blue', desc: 'Match letters with pictures' },
  { id: 'colors' as const, title: 'Color Match', icon: '🎨', color: 'pink', desc: 'Find the matching colors' },
  { id: 'shapes' as const, title: 'Shape Sorter', icon: '⭐', color: 'orange', desc: 'Sort and identify shapes' },
  { id: 'memory' as const, title: 'Memory Cards', icon: '🧠', color: 'purple', desc: 'Flip and match pairs' },
  { id: 'animals' as const, title: 'Animal Sounds', icon: '🐾', color: 'lime', desc: 'Guess the animal sound' },
  { id: 'puzzle' as const, title: 'Puzzle Builder', icon: '🧩', color: 'teal', desc: 'Solve fun puzzles' },
  { id: 'dragdrop' as const, title: 'Drag & Drop', icon: '🎯', color: 'red', desc: 'Match items to targets' },
]

export function InteractiveGames() {
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState<GameType>(null)

  const renderGame = () => {
    switch (activeGame) {
      case 'alphabet': return <AlphabetMatch onComplete={(score) => console.log('Alphabet score:', score)} />
      case 'colors': return <ColorMatch onComplete={(score) => console.log('Color score:', score)} />
      case 'shapes': return <ShapeSorter onComplete={(score) => console.log('Shape score:', score)} />
      case 'memory': return <MemoryCard onComplete={(score) => console.log('Memory score:', score)} />
      case 'animals': return <AnimalSounds onComplete={(score) => console.log('Animal score:', score)} />
      case 'puzzle': return <PuzzleBuilder onComplete={(score) => console.log('Puzzle score:', score)} />
      case 'dragdrop': return <DragDropLearning onComplete={(score) => console.log('Drag & Drop score:', score)} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => activeGame ? setActiveGame(null) : navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> {activeGame ? 'Back to Games' : 'Back to UKG'}
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-purple to-kid-pink rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>🎮</span><span>🎯</span><span>🧩</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Interactive Games</h1>
          <p className="text-white/80 text-sm">Choose a game and have fun learning!</p>
        </motion.div>

        {activeGame ? (
          <motion.div
            key={activeGame}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderGame()}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {gameMeta.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                icon={<span className="text-3xl">{game.icon}</span>}
                color={game.color}
                description={game.desc}
                onClick={() => setActiveGame(game.id)}
              />
            ))}
          </motion.div>
        )}

        {!activeGame && (
          <motion.div
            className="mt-6 bg-gradient-to-r from-kid-purple to-kid-pink rounded-2xl p-4 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white font-bold flex items-center justify-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Pick a game and start playing!
              <Gamepad2 className="w-5 h-5" />
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
