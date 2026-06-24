import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Award, Download } from 'lucide-react'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const subjects = [
  { name: 'Mathematics', grade: 'A', score: 92, color: 'from-blue-400 to-blue-600', trend: '+5%' },
  { name: 'English', grade: 'A-', score: 88, color: 'from-green-400 to-green-600', trend: '+3%' },
  { name: 'Science', grade: 'B+', score: 82, color: 'from-purple-400 to-purple-600', trend: '+8%' },
  { name: 'Hindi', grade: 'A', score: 90, color: 'from-orange-400 to-orange-600', trend: '+2%' },
  { name: 'Art', grade: 'A+', score: 97, color: 'from-pink-400 to-pink-600', trend: '+10%' },
  { name: 'Music', grade: 'A', score: 93, color: 'from-teal-400 to-teal-600', trend: '+4%' },
]

const monthlyData = [
  { month: 'Jan', score: 78 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 85 },
  { month: 'Apr', score: 80 },
  { month: 'May', score: 88 },
  { month: 'Jun', score: 90 },
]

const gradePoints = subjects.reduce((sum, s) => {
  const map: Record<string, number> = { 'A+': 4, 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7 }
  return sum + (map[s.grade] || 0)
}, 0)
const gpa = (gradePoints / subjects.length).toFixed(1)

export default function Reports() {
  const maxScore = Math.max(...monthlyData.map(d => d.score))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={card} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-kid-blue" /> Progress Reports
          </h1>
          <p className="text-gray-500 font-nunito">Academic Year 2024-2025</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-blue to-kid-purple text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" /> Download
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
          <Award className="w-10 h-10 text-kid-yellow mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800 font-fredoka">{gpa}</p>
          <p className="text-sm text-gray-500">Overall GPA</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
          <TrendingUp className="w-10 h-10 text-kid-green mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800 font-fredoka">{Math.round(subjects.reduce((a, b) => a + b.score, 0) / subjects.length)}%</p>
          <p className="text-sm text-gray-500">Average Score</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
          <Award className="w-10 h-10 text-kid-orange mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800 font-fredoka">{subjects.filter(s => s.grade.startsWith('A')).length}/{subjects.length}</p>
          <p className="text-sm text-gray-500">A Grades</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4">Subject Performance</h2>
          <div className="space-y-4">
            {subjects.map((sub, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-700">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${sub.trend.startsWith('+') ? 'text-kid-green' : 'text-kid-red'}`}>{sub.trend}</span>
                    <span className="text-sm font-bold text-gray-800">{sub.grade}</span>
                    <span className="text-xs text-gray-400">{sub.score}%</span>
                  </div>
                </div>
                <ProgressBar value={sub.score} color={`bg-gradient-to-r ${sub.color}`} size="sm" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={card} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4">Monthly Progress</h2>
          <div className="flex items-end gap-3 h-48">
            {monthlyData.map((d, i) => {
              const height = (d.score / maxScore) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    className={`w-full rounded-t-lg bg-gradient-to-t from-kid-blue to-kid-purple max-h-full`}
                    style={{ minHeight: `${height}%` }}
                  />
                  <span className="text-[10px] text-gray-500 font-semibold">{d.month}</span>
                  <span className="text-[10px] text-gray-400">{d.score}%</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
