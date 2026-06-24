import { motion } from 'framer-motion'

interface Props {
  name: string
  emoji: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

const sizes = { sm: 'text-3xl', md: 'text-5xl', lg: 'text-7xl' }

export function AnimatedCharacter({ name, emoji, size = 'md', className = '', onClick }: Props) {
  return (
    <motion.div
      className={`inline-flex flex-col items-center gap-1 cursor-pointer select-none ${className}`}
      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.span
        className={sizes[size]}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.span>
      {name && (
        <span className="text-xs font-bold text-gray-600 bg-white/80 px-2 py-0.5 rounded-full">
          {name}
        </span>
      )}
    </motion.div>
  )
}
