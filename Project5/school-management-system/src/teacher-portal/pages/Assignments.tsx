// File: Assignments — Manages assignments with cards showing title, subject, description, due date, submission progress, and edit/delete actions.
import { motion } from 'framer-motion'
import { BookOpen, Plus, Calendar, FileText, Trash2, Edit3 } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const assignments = [
  { id: 1, title: 'Math Worksheet 5', subject: 'Mathematics', description: 'Complete problems 1-20 from chapter 5', dueDate: '2025-06-25', totalPoints: 20, submittedCount: 22, totalStudents: 28, status: 'active' as const, icon: '📐' },
  { id: 2, title: 'Story Writing', subject: 'English', description: 'Write a 5-sentence story about your pet', dueDate: '2025-06-26', totalPoints: 15, submittedCount: 18, totalStudents: 26, status: 'active' as const, icon: '📝' },
  { id: 3, title: 'Plant Life Cycle Diagram', subject: 'Science', description: 'Draw and label the plant life cycle', dueDate: '2025-06-27', totalPoints: 25, submittedCount: 15, totalStudents: 27, status: 'active' as const, icon: '🌱' },
  { id: 4, title: 'Rainbow Coloring', subject: 'Art', description: 'Color the rainbow using all 7 colors', dueDate: '2025-06-20', totalPoints: 10, submittedCount: 25, totalStudents: 25, status: 'completed' as const, icon: '🎨' },
  { id: 5, title: 'Letter Practice', subject: 'Hindi', description: 'Practice writing Hindi letters अ to अः', dueDate: '2025-06-22', totalPoints: 15, submittedCount: 23, totalStudents: 24, status: 'completed' as const, icon: '🔤' },
  { id: 6, title: 'Nursery Rhyme Practice', subject: 'Music', description: 'Practice Twinkle Twinkle Little Star', dueDate: '2025-06-28', totalPoints: 10, submittedCount: 0, totalStudents: 26, status: 'draft' as const, icon: '🎵' },
]

export default function Assignments() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header with Create Assignment button */}
      <motion.div variants={card} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-kid-orange" /> Assignments
          </h1>
          <p className="text-gray-500 font-nunito">Manage and create assignments</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-orange to-kid-pink text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </motion.button>
      </motion.div>

      {/* Assignment cards grid — displays title, description, due date, points, submission progress bar, and edit/delete buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((as) => {
          const submitPercent = Math.round((as.submittedCount / as.totalStudents) * 100)
          return (
            <motion.div
              key={as.id}
              variants={card}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
            >
              <div className={`p-4 ${as.status === 'active' ? 'bg-gradient-to-r from-orange-400 to-pink-500' : as.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-teal-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'} text-white`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{as.icon}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${as.status === 'active' ? 'bg-white/30' : as.status === 'completed' ? 'bg-white/30' : 'bg-white/20'}`}>
                    {as.status}
                  </span>
                </div>
                <h3 className="font-fredoka text-lg mt-1">{as.title}</h3>
                <p className="text-[11px] opacity-80">{as.subject}</p>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-600">{as.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {as.dueDate}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {as.totalPoints} pts</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Submissions</span>
                    <span className="font-bold text-gray-700">{as.submittedCount}/{as.totalStudents}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${submitPercent}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${as.status === 'active' ? 'bg-gradient-to-r from-kid-orange to-kid-pink' : as.status === 'completed' ? 'bg-gradient-to-r from-kid-green to-kid-teal' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button className="flex-1 py-2 rounded-lg bg-blue-50 text-kid-blue text-xs font-bold flex items-center justify-center gap-1" whileHover={{ scale: 1.03 }}>
                    <Edit3 className="w-3 h-3" /> Edit
                  </motion.button>
                  <motion.button className="flex-1 py-2 rounded-lg bg-red-50 text-kid-red text-xs font-bold flex items-center justify-center gap-1" whileHover={{ scale: 1.03 }}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
