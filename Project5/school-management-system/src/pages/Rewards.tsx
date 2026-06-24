import { RewardSystem } from '../shared/games/reward-system/RewardSystem'

const sampleBadges = [
  { id: '1', title: 'First Steps', emoji: '👣', description: 'Completed your first lesson', unlocked: true },
  { id: '2', title: 'Alphabet Star', emoji: '⭐', description: 'Mastered all letters', unlocked: true },
  { id: '3', title: 'Number Ninja', emoji: '🔢', description: 'Counted to 20', unlocked: true },
  { id: '4', title: 'Color Wizard', emoji: '🎨', description: 'Identified all colors', unlocked: false },
  { id: '5', title: 'Shape Master', emoji: '⭐', description: 'Sorted all shapes', unlocked: false },
  { id: '6', title: 'Animal Friend', emoji: '🐾', description: 'Learned animal sounds', unlocked: true },
  { id: '7', title: 'Memory Champ', emoji: '🧠', description: 'Won memory game', unlocked: false },
  { id: '8', title: 'Puzzle Pro', emoji: '🧩', description: 'Solved all puzzles', unlocked: false },
]

export function Rewards() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-fredoka text-gray-800">🏆 Your Rewards</h1>
        <p className="text-gray-500">Keep learning to unlock more achievements!</p>
      </div>
      <RewardSystem badges={sampleBadges} totalStars={42} level={2} />
    </div>
  )
}
