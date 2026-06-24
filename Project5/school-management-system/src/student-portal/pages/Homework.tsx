// File: Homework — Displays all homework tasks grouped by status (completed/pending/overdue) with subject icons and due dates.
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, BookOpen } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const homeworkData = [
  { id: 1, subject: 'Mathematics', task: 'Complete page 45-48', due: '2025-06-25', status: 'completed', description: 'Addition and subtraction practice', icon: '📐' },
  { id: 2, subject: 'English', task: 'Write a short story', due: '2025-06-26', status: 'pending', description: 'Write 5 sentences about your pet', icon: '📝' },
  { id: 3, subject: 'Science', task: 'Draw plant life cycle', due: '2025-06-27', status: 'pending', description: 'Label all parts of the plant', icon: '🌱' },
  { id: 4, subject: 'Art', task: 'Color the rainbow', due: '2025-06-24', status: 'completed', description: 'Use all 7 colors', icon: '🎨' },
  { id: 5, subject: 'Hindi', task: 'Practice letters', due: '2025-06-28', status: 'pending', description: 'Write अ to अः 3 times', icon: '🔤' },
  { id: 6, subject: 'Music', task: 'Learn nursery rhyme', due: '2025-06-29', status: 'overdue', description: 'Practice Twinkle Twinkle', icon: '🎵' },
]

// Status-based styling config mapping status to colors, backgrounds, and icons
const statusConfig = {
  completed: { color: 'text-kid-green', bg: 'from-green-50 to-emerald-50', border: 'border-green-200', icon: CheckCircle },
  pending: { color: 'text-kid-orange', bg: 'from-orange-50 to-yellow-50', border: 'border-orange-200', icon: Clock },
  overdue: { color: 'text-kid-red', bg: 'from-red-50 to-pink-50', border: 'border-red-200', icon: AlertCircle },
}

export default function Homework() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header with remaining task count */}
      <motion.div variants={card} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-kid-blue" /> My Homework
        </h1>
        <p className="text-gray-500 font-nunito">{homeworkData.filter(h => h.status === 'pending').length} tasks remaining</p>
      </motion.div>

      {/* Homework task cards grid — each card shows subject, task, description, status, and due date */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homeworkData.map((hw) => {
          const config = statusConfig[hw.status as keyof typeof statusConfig]
          const StatusIcon = config.icon
          return (
            <motion.div
              key={hw.id}
              variants={card}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`bg-gradient-to-br ${config.bg} rounded-2xl p-5 border ${config.border} shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{hw.icon}</span>
                <StatusIcon className={`w-5 h-5 ${config.color}`} />
              </div>
              <h3 className="font-fredoka text-gray-800 text-lg">{hw.subject}</h3>
              <p className="text-sm text-gray-600 font-semibold mt-1">{hw.task}</p>
              <p className="text-xs text-gray-500 mt-1">{hw.description}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50">
                <span className={`text-xs font-bold capitalize ${config.color}`}>{hw.status}</span>
                <span className="text-xs text-gray-400">Due: {hw.due}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
