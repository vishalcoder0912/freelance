import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, RotateCcw, Play, ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react'
import { RewardScreen } from '../../../shared/components/RewardScreen'

type Direction = 'up' | 'down' | 'left' | 'right'

interface Puzzle {
  grid: number[][]
  start: [number, number]
  end: [number, number]
  solution: Direction[]
  title: string
}

const puzzles: Puzzle[] = [
  {
    title: 'Reach the Star!',
    grid: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
    ],
    start: [0, 0],
    end: [3, 2],
    solution: ['down', 'down', 'down', 'right', 'right'],
  },
  {
    title: 'Collect the Flower!',
    grid: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    start: [0, 0],
    end: [1, 1],
    solution: ['down', 'right'],
  },
  {
    title: 'Find the Treasure!',
    grid: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
    ],
    start: [0, 0],
    end: [3, 3],
    solution: ['down', 'down', 'down', 'right', 'right', 'right'],
  },
  {
    title: 'Help the Robot!',
    grid: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    start: [3, 0],
    end: [0, 3],
    solution: ['up', 'up', 'up', 'right', 'right', 'right'],
  },
]

const directionIcons: Record<Direction, React.ReactNode> = {
  up: <ChevronUp className="w-5 h-5" />,
  down: <ChevronDown className="w-5 h-5" />,
  left: <ChevronLeft className="w-5 h-5" />,
  right: <ChevronRight className="w-5 h-5" />,
}

const directionLabels: Record<Direction, string> = {
  up: 'Up', down: 'Down', left: 'Left', right: 'Right',
}

export function CodingForKids() {
  const navigate = useNavigate()
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [commands, setCommands] = useState<Direction[]>([])
  const [executing, setExecuting] = useState(false)
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [stepIndex, setStepIndex] = useState(-1)
  const [showReward, setShowReward] = useState(false)

  const puzzle = puzzles[currentPuzzle]
  const gridSize = puzzle.grid.length

  const addCommand = (dir: Direction) => {
    if (executing) return
    setCommands(prev => [...prev, dir])
  }

  const removeLastCommand = () => {
    if (executing) return
    setCommands(prev => prev.slice(0, -1))
  }

  const clearCommands = () => {
    if (executing) return
    setCommands([])
  }

  const executeCommands = async () => {
    if (commands.length === 0 || executing) return
    setExecuting(true)
    setPosition(puzzle.start)
    setStepIndex(0)

    let pos = [...puzzle.start] as [number, number]

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i]
      const newPos: [number, number] = [...pos]
      if (cmd === 'up') newPos[0] = Math.max(0, newPos[0] - 1)
      else if (cmd === 'down') newPos[0] = Math.min(gridSize - 1, newPos[0] + 1)
      else if (cmd === 'left') newPos[1] = Math.max(0, newPos[1] - 1)
      else if (cmd === 'right') newPos[1] = Math.min(gridSize - 1, newPos[1] + 1)

      if (puzzle.grid[newPos[0]]?.[newPos[1]] === 1) {
        setStepIndex(-1)
        setExecuting(false)
        return
      }

      pos = newPos
      setPosition([...pos])
      setStepIndex(i + 1)
      await new Promise(r => setTimeout(r, 500))
    }

    if (pos[0] === puzzle.end[0] && pos[1] === puzzle.end[1]) {
      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(i => i + 1)
          setCommands([])
          setPosition(puzzles[currentPuzzle + 1].start)
        } else {
          setShowReward(true)
        }
        setExecuting(false)
        setStepIndex(-1)
      }, 500)
    } else {
      setExecuting(false)
      setStepIndex(-1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto">
        <motion.button
          onClick={() => navigate('/ukg')}
          className="mb-4 flex items-center gap-2 text-gray-600 font-semibold"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to UKG
        </motion.button>

        <motion.div
          className="bg-gradient-to-r from-kid-purple to-kid-indigo rounded-3xl p-5 text-white text-center shadow-lg mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>💻</span><span>🧩</span><span>🤖</span>
          </div>
          <h1 className="text-2xl font-bold font-fredoka">Coding for Kids</h1>
          <p className="text-white/80 text-sm">Use directional commands to solve puzzles!</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-6 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-500">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
            <h3 className="font-bold text-gray-800 font-fredoka">{puzzle.title}</h3>
          </div>

          <div className="flex justify-center gap-1 mb-4">
            {puzzles.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= currentPuzzle ? 'bg-kid-purple' : 'bg-gray-200'}`} />
            ))}
          </div>

          <div className="grid gap-1 max-w-[240px] mx-auto mb-6" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
            {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
              const row = Math.floor(idx / gridSize)
              const col = idx % gridSize
              const isStart = row === puzzle.start[0] && col === puzzle.start[1]
              const isEnd = row === puzzle.end[0] && col === puzzle.end[1]
              const isPlayer = row === position[0] && col === position[1]
              const isBlocked = puzzle.grid[row]?.[col] === 1

              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all
                    ${isBlocked ? 'bg-gray-800' : isPlayer ? 'bg-gradient-to-br from-kid-purple to-kid-pink text-white scale-110 shadow-lg z-10' : isStart ? 'bg-green-100' : isEnd ? 'bg-yellow-100' : 'bg-gray-100'}
                  `}
                >
                  {isPlayer ? '🤖' : isBlocked ? '🧱' : isStart ? '🏁' : isEnd ? '⭐' : ''}
                </div>
              )
            })}
          </div>

          <div className="mb-4">
            <p className="text-sm font-bold text-gray-700 mb-2">Your Commands ({commands.length}):</p>
            <div className="flex gap-1 flex-wrap min-h-[40px] bg-gray-50 rounded-xl p-2">
              {commands.length === 0 ? (
                <span className="text-xs text-gray-400 italic">Press buttons below to add commands</span>
              ) : (
                commands.map((cmd, i) => (
                  <motion.span
                    key={i}
                    className={`px-2 py-1 bg-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 ${i < stepIndex ? 'opacity-50' : ''}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {directionIcons[cmd]}
                    {directionLabels[cmd]}
                  </motion.span>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {(['up', 'down', 'left', 'right'] as Direction[]).map((dir) => (
              <motion.button
                key={dir}
                onClick={() => addCommand(dir)}
                className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={executing}
              >
                {directionIcons[dir]}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center gap-3 mb-4">
            <motion.button
              onClick={removeLastCommand}
              className="bg-white px-4 py-2 rounded-full shadow font-bold text-sm text-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={executing || commands.length === 0}
            >
              Undo
            </motion.button>
            <motion.button
              onClick={clearCommands}
              className="bg-white px-4 py-2 rounded-full shadow font-bold text-sm text-red-500 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={executing || commands.length === 0}
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </motion.button>
            <motion.button
              onClick={executeCommands}
              className="bg-gradient-to-r from-kid-green to-kid-teal text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={executing || commands.length === 0}
            >
              <Play className="w-4 h-4" /> Run
            </motion.button>
          </div>

          {position[0] !== puzzle.start[0] || position[1] !== puzzle.start[1] ? (
            !executing && (position[0] !== puzzle.end[0] || position[1] !== puzzle.end[1]) && (
              <p className="text-center text-sm text-red-500 font-bold">Not quite! Try again!</p>
            )
          ) : null}
        </motion.div>

        <motion.div
          className="mt-4 bg-gradient-to-r from-kid-purple to-kid-indigo rounded-2xl p-4 text-center shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Think step by step like a programmer!
            <Sparkles className="w-5 h-5" />
          </p>
        </motion.div>

        <RewardScreen show={showReward} message="Coding Wizard!" emoji="🧙‍♂️" onClose={() => setShowReward(false)} />
      </div>
    </div>
  )
}
