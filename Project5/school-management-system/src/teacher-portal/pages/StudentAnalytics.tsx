// File: StudentAnalytics — Class-level analytics with subject averages, performance distribution bars, and top-performing student rankings.
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Award, Download } from 'lucide-react'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const classPerformance = {
  averageScore: 85,
  highestScore: 97,
  lowestScore: 62,
  totalStudents: 28,
  aboveAverage: 20,
  needsImprovement: 8,
}

const subjectAverages = [
  { name: 'Mathematics', average: 82, highest: 98, lowest: 55, color: 'from-blue-400 to-blue-600' },
  { name: 'English', average: 86, highest: 95, lowest: 60, color: 'from-green-400 to-green-600' },
  { name: 'Science', average: 78, highest: 92, lowest: 50, color: 'from-purple-400 to-purple-600' },
  { name: 'Hindi', average: 88, highest: 96, lowest: 65, color: 'from-orange-400 to-orange-600' },
  { name: 'Art', average: 92, highest: 100, lowest: 75, color: 'from-pink-400 to-pink-600' },
]

const performanceDistribution = [
  { range: 'A (90-100%)', count: 8, color: 'from-green-400 to-green-500' },
  { range: 'B (80-89%)', count: 10, color: 'from-blue-400 to-blue-500' },
  { range: 'C (70-79%)', count: 6, color: 'from-orange-400 to-orange-500' },
  { range: 'D (60-69%)', count: 3, color: 'from-pink-400 to-pink-500' },
  { range: 'F (<60%)', count: 1, color: 'from-red-400 to-red-500' },
]

const topStudents = [
  { rank: 1, name: 'Olivia Garcia', score: 97, avatar: '👧', trend: '+5%' },
  { rank: 2, name: 'Emma Wilson', score: 95, avatar: '👧', trend: '+3%' },
  { rank: 3, name: 'Sophia Davis', score: 93, avatar: '👧', trend: '+8%' },
  { rank: 4, name: 'Ava Anderson', score: 91, avatar: '👧', trend: '+2%' },
  { rank: 5, name: 'Liam Brown', score: 89, avatar: '👦', trend: '+6%' },
]

export default function StudentAnalytics() {
  // Maximum count used for scaling the distribution bars
  const maxDistCount = Math.max(...performanceDistribution.map(d => d.count))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header with Export Report button */}
      <motion.div variants={card} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-kid-teal" /> Student Analytics
          </h1>
          <p className="text-gray-500 font-nunito">Kindergarten - Section A</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-teal to-kid-blue text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" /> Export Report
        </motion.button>
      </motion.div>

      {/* Key metrics row: class average, highest score, above/below average counts, total students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <TrendingUp className="w-5 h-5 text-kid-blue mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{classPerformance.averageScore}%</p>
          <p className="text-xs text-gray-500">Class Average</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Award className="w-5 h-5 text-kid-green mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{classPerformance.highestScore}%</p>
          <p className="text-xs text-gray-500">Highest Score</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Users className="w-5 h-5 text-kid-orange mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{classPerformance.aboveAverage}</p>
          <p className="text-xs text-gray-500">Above Average</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Users className="w-5 h-5 text-kid-red mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{classPerformance.needsImprovement}</p>
          <p className="text-xs text-gray-500">Needs Work</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Users className="w-5 h-5 text-kid-purple mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{classPerformance.totalStudents}</p>
          <p className="text-xs text-gray-500">Total Students</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4">Subject-wise Average</h2>
          <div className="space-y-4">
            {subjectAverages.map((sub, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-600">{sub.name}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">H:{sub.highest}%</span>
                    <span className="text-gray-400">L:{sub.lowest}%</span>
                    <span className="font-bold text-gray-700">{sub.average}%</span>
                  </div>
                </div>
                <ProgressBar value={sub.average} color={`bg-gradient-to-r ${sub.color}`} size="md" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4">Performance Distribution</h2>
          <div className="space-y-3">
            {performanceDistribution.map((dist, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-600">{dist.range}</span>
                  <span className="text-xs font-bold text-gray-700">{dist.count} students</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dist.count / maxDistCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${dist.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <h2 className="font-fredoka text-gray-700 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-kid-yellow" /> Top Performing Students</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {topStudents.map((student) => (
            <motion.div
              key={student.rank}
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 text-center border border-orange-100"
            >
              <div className="relative inline-block">
                <span className="text-3xl">{student.avatar}</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-kid-yellow rounded-full flex items-center justify-center text-[10px] font-bold text-gray-700">
                  {student.rank}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-700 mt-1">{student.name}</p>
              <p className="text-lg font-bold text-kid-orange">{student.score}%</p>
              <span className="text-[10px] text-kid-green">{student.trend}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
