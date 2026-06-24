// File: MemoryCard — Classic memory matching game: flip cards to find pairs of matching emojis with move tracking.
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RewardScreen } from '../../components/RewardScreen'

const emojiCards = ['🐶', '🐱', '🐼', '🐨', '🦁', '🐸', '🐵', '🦊']

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean }

interface Props { onComplete?: (score: number) => void }

export function MemoryCard({ onComplete }: Props) {
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const pairs = [...emojiCards, ...emojiCards].sort(() => Math.random() - 0.5)
    setCards(pairs.map((emoji, id) => ({ id, emoji, flipped: false, matched: false })))
  }, [])

  const handleFlip = (id: number) => {
    if (isChecking || cards[id].flipped || cards[id].matched) return

    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)
    setFlipped(prev => [...prev, id])
  }

  useEffect(() => {
    if (flipped.length === 2) {
      setIsChecking(true)
      setMoves(m => m + 1)
      const [first, second] = flipped
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => {
          const updated = [...prev]
          updated[first].matched = true
          updated[second].matched = true
          updated[first].flipped = true
          updated[second].flipped = true
          return updated
        })
        setMatched(m => m + 1)
        setFlipped([])
        setIsChecking(false)
      } else {
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev]
            updated[first].flipped = false
            updated[second].flipped = false
            return updated
          })
          setFlipped([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }, [flipped, cards])

  useEffect(() => {
    if (matched === emojiCards.length && matched > 0) {
      setTimeout(() => setShowReward(true), 500)
      onComplete?.(moves)
    }
  }, [matched, moves, onComplete])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500 font-bold">Moves: {moves}</p>
        <p className="text-sm text-gray-500 font-bold">Matched: {matched}/{emojiCards.length}</p>
      </div>
      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center shadow-lg font-bold transition-all
              ${card.matched ? 'bg-green-100 opacity-70' : card.flipped ? 'bg-white' : 'bg-gradient-to-br from-kid-blue to-kid-purple cursor-pointer hover:scale-105'}
            `}
            whileTap={{ scale: 0.95 }}
            animate={card.matched ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span key="front" initial={{ rotateY: 180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 180, opacity: 0 }}>
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span key="back" initial={{ rotateY: 0 }} animate={{ rotateY: 0 }} className="text-white text-lg font-bold">
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <RewardScreen show={showReward} message="Memory Master!" emoji="🧠" onClose={() => setShowReward(false)} />
    </div>
  )
}
