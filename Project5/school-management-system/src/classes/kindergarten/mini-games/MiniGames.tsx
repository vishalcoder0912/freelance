// MiniGames - Game selection hub for kindergarten
// Launches alphabet match, counting, color match, shape sorter, animal sounds, and rewards
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { AlphabetMatch } from '../../../shared/games/alphabet-match/AlphabetMatch'
import { CountingGame } from '../../../shared/games/counting-game/CountingGame'
import { ColorMatch } from '../../../shared/games/color-match/ColorMatch'
import { ShapeSorter } from '../../../shared/games/shape-sorter/ShapeSorter'
import { AnimalSounds } from '../../../shared/games/animal-sounds/AnimalSounds'
import { RewardSystem } from '../../../shared/games/reward-system/RewardSystem'
import { ArrowLeft, Gamepad2, Sparkles, Star, Trophy } from 'lucide-react'

interface GameData {
  id: string
  title: string
  icon: string
  description: string
  color: string
  component: React.ReactNode
}

const games: GameData[] = [
  {
    id: 'alphabet-match',
    title: 'Alphabet Match',
    icon: '🔤',
    description: 'Match letters with pictures!',
    color: 'blue',
    component: <AlphabetMatch />,
  },
  {
    id: 'counting-game',
    title: 'Counting Game',
    icon: '🔢',
    description: 'Count the objects!',
    color: 'green',
    component: <CountingGame maxNumber={10} />,
  },
  {
    id: 'color-match',
    title: 'Color Match',
    icon: '🎨',
    description: 'Find the right color!',
    color: 'pink',
    component: <ColorMatch />,
  },
  {
    id: 'shape-sorter',
    title: 'Shape Sorter',
    icon: '⭐',
    description: 'Sort the shapes!',
    color: 'orange',
    component: <ShapeSorter />,
  },
  {
    id: 'animal-sounds',
    title: 'Animal Sounds',
    icon: '🐾',
    description: 'Match animal sounds!',
    color: 'lime',
    component: <AnimalSounds />,
  },
  {
    id: 'reward-system',
    title: 'Rewards',
    icon: '🏆',
    description: 'Check your achievements!',
    color: 'purple',
    component: (
      <RewardSystem
        totalStars={15}
        level={1}
        badges={[
          { id: '1', title: 'First Game', emoji: '🎮', description: 'Played your first game', unlocked: true },
          { id: '2', title: 'Star Collector', emoji: '⭐', description: 'Collected 5 stars', unlocked: true },
          { id: '3', title: 'Quick Learner', emoji: '⚡', description: 'Complete 3 games', unlocked: true },
          { id: '4', title: 'Super Star', emoji: '🌟', description: 'Collected 20 stars', unlocked: false },
          { id: '5', title: 'Game Master', emoji: '👑', description: 'Play all games', unlocked: false },
          { id: '6', title: 'Perfect Score', emoji: '💯', description: 'Get perfect in any game', unlocked: false },
        ]}
      />
    ),
  },
]

const starCounts: Record<string, number> = {
  'alphabet-match': 0,
  'counting-game': 0,
  'color-match': 0,
  'shape-sorter': 0,
  'animal-sounds': 0,
}

export function MiniGames() {
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null)

  const totalStars = Object.values(starCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Header with total stars display */}
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            {selectedGame && (
              <motion.button
                onClick={() => setSelectedGame(null)}
                className="p-2 rounded-xl bg-white shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Mini Games</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-sm">
              <Star className="w-4 h-4 fill-kid-yellow text-kid-yellow" />
              <span className="text-sm font-bold text-gray-700">{totalStars}</span>
            </div>
            <AnimatedCharacter name="Games" emoji="🎮" size="sm" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedGame ? (
            // Game selection grid
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="bg-gradient-to-r from-kid-indigo via-kid-purple to-kid-pink rounded-2xl p-6 text-white text-center shadow-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold font-fredoka mb-2">🎮 Game Zone!</h2>
                <p className="text-white/80 text-sm">Pick a game and have fun while learning!</p>
                <div className="flex justify-center gap-2 mt-4">
                  {['⭐', '🌟', '✨', '💫', '🎯'].map((s, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    title={game.title}
                    icon={<span className="text-4xl">{game.icon}</span>}
                    color={game.color}
                    description={game.description}
                    onClick={() => setSelectedGame(game)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            // Active game view
            <motion.div
              key={selectedGame.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200 flex items-center gap-3">
                  <span className="text-2xl">{selectedGame.icon}</span>
                  <h2 className="text-lg font-bold text-gray-800 font-fredoka">{selectedGame.title}</h2>
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full ml-auto">Game</span>
                </div>
                <div className="p-4">
                  {selectedGame.component}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
