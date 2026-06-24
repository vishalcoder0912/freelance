import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

interface MatchItem { id: string; label: string; emoji: string; pairId: string }

const categories = [
  { name: 'Fruits', items: [
    { id: 'apple', label: 'Apple', emoji: '🍎', pairId: 'red' },
    { id: 'banana', label: 'Banana', emoji: '🍌', pairId: 'yellow' },
    { id: 'grape', label: 'Grape', emoji: '🍇', pairId: 'purple' },
    { id: 'orange', label: 'Orange', emoji: '🍊', pairId: 'orange' },
  ]},
  { name: 'Animals', items: [
    { id: 'dog', label: 'Dog', emoji: '🐶', pairId: 'bone' },
    { id: 'cat', label: 'Cat', emoji: '🐱', pairId: 'milk' },
    { id: 'rabbit', label: 'Rabbit', emoji: '🐰', pairId: 'carrot' },
    { id: 'mouse', label: 'Mouse', emoji: '🐭', pairId: 'cheese' },
  ]},
]

interface Props { onComplete?: (score: number) => void }

export function DragDropLearning({ onComplete }: Props) {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [showReward, setShowReward] = useState(false)

  const category = categories[categoryIndex]
  const items = category.items
  const targets = [...new Set(items.map(i => i.pairId))].sort(() => Math.random() - 0.5)

  const handleDragStart = (id: string) => setDraggedItem(id)
  const handleDrop = useCallback((targetId: string) => {
    if (!draggedItem || matched.includes(draggedItem)) return
    const item = items.find(i => i.id === draggedItem)
    if (item && item.pairId === targetId) {
      const newMatched = [...matched, draggedItem]
      setMatched(newMatched)
      if (newMatched.length === items.length) {
        if (categoryIndex < categories.length - 1) {
          setTimeout(() => { setCategoryIndex(i => i + 1); setMatched([]) }, 1500)
        } else {
          setTimeout(() => setShowReward(true), 500)
        }
      }
    }
    setDraggedItem(null)
  }, [draggedItem, matched, items, categoryIndex])

  const targetLabels: Record<string, string> = {
    red: 'Red things', yellow: 'Yellow things', purple: 'Purple things', orange: 'Orange things',
    bone: 'Loves bones', milk: 'Loves milk', carrot: 'Loves carrots', cheese: 'Loves cheese'
  }
  const targetIcons: Record<string, string> = {
    red: '🔴', yellow: '🟡', purple: '🟣', orange: '🟠',
    bone: '🦴', milk: '🥛', carrot: '🥕', cheese: '🧀'
  }

  return (
    <div className="p-4">
      <p className="text-center font-bold text-gray-600 mb-4">{category.name} - Match each item!</p>

      <div className="flex gap-4 justify-center mb-6 flex-wrap">
        {items.map((item) => (
          <motion.div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-md cursor-grab active:cursor-grabbing
              ${matched.includes(item.id) ? 'bg-green-100 opacity-50' : 'bg-white hover:shadow-lg'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {targets.map((targetId) => {
          const isCorrectTarget = draggedItem ? items.find(i => i.id === draggedItem)?.pairId === targetId : false
          return (
            <div
              key={targetId}
              onDrop={() => handleDrop(targetId)}
              onDragOver={(e) => e.preventDefault()}
              className={`p-4 rounded-2xl border-2 border-dashed min-h-[80px] flex flex-col items-center justify-center gap-1 transition-all
                ${isCorrectTarget ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}
                ${draggedItem ? 'scale-105' : ''}`}
            >
              <span className="text-2xl">{targetIcons[targetId]}</span>
              <span className="text-xs font-bold text-gray-500">{targetLabels[targetId]}</span>
            </div>
          )
        })}
      </div>

      <RewardScreen show={showReward} message="Matching Master!" emoji="🎯" onClose={() => { setShowReward(false); onComplete?.(categoryIndex + 1) }} />
    </div>
  )
}
