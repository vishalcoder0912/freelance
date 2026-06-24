import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useConfetti } from '../../hooks/useConfetti'

interface Props {
  show: boolean
  message: string
  emoji?: string
  onClose: () => void
}

const particles = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '❤️', '🌈']

export function RewardScreen({ show, message, emoji = '🏆', onClose }: Props) {
  const { fireConfetti } = useConfetti()

  useEffect(() => {
    if (show) {
      fireConfetti()
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, fireConfetti, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl max-w-sm w-full"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              {emoji}
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-fredoka">{message}</h2>
            <div className="flex justify-center gap-2 mt-4">
              {particles.slice(0, 5).map((p, i) => (
                <motion.span
                  key={i}
                  className="text-xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {p}
                </motion.span>
              ))}
            </div>
            <motion.button
              onClick={onClose}
              className="mt-6 bg-gradient-to-r from-kid-orange to-kid-pink text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Yay! 🎉
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
