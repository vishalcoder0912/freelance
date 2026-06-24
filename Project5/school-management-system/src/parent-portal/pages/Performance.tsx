import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Target } from 'lucide-react'
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
  { name: 'Mathematics', score: 92, grade: 'A', color: 'from-blue-400 to-blue-600', trend: [75, 80, 85, 88, 90, 92] },
  { name: 'English', score: 88, grade: 'A-', color: 'from-green-400 to-green-600', trend: [70, 75, 80, 82, 86, 88] },
  { name: 'Science', score: 82, grade: 'B+', color: 'from-purple-400 to-purple-600', trend: [65, 70, 72, 78, 80, 82] },
  { name: 'Hindi', score: 90, grade: 'A', color: 'from-orange-400 to-orange-600', trend: [80, 82, 85, 87, 89, 90] },
  { name: 'Art', score: 97, grade: 'A+', color: 'from-pink-400 to-pink-600', trend: [85, 88, 90, 93, 95, 97] },
  { name: 'Music', score: 93, grade: 'A', color: 'from-teal-400 to-teal-600', trend: [78, 82, 85, 88, 91, 93] },
]

const performanceInsights = [
  { label: 'Strongest Subject', value: 'Art (97%)', icon: '🎨', color: 'from-pink-100 to-pink-200 text-pink-700' },
  { label: 'Needs Improvement', value: 'Science (82%)', icon: '🔬', color: 'from-orange-100 to-orange-200 text-orange-700' },
  { label: 'Overall Trend', value: 'Improving', icon: '📈', color: 'from-green-100 to-green-200 text-green-700' },
]

const maxScore = 100

export default function Performance() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={card} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-kid-purple" /> Performance Analytics
        </h1>
        <p className="text-gray-500 font-nunito">Detailed academic performance analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {performanceInsights.map((insight, i) => (
          <motion.div
            key={i}
            variants={card}
            className={`rounded-2xl p-4 bg-gradient-to-br ${insight.color}`}
          >
            <span className="text-2xl">{insight.icon}</span>
            <p className="text-xs font-semibold opacity-70 mt-1">{insight.label}</p>
            <p className="text-lg font-bold">{insight.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-kid-blue" /> Subject Scores</h2>
          <div className="space-y-5">
            {subjects.map((sub, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">{sub.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${sub.color} text-white`}>{sub.grade}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{sub.score}%</span>
                </div>
                <ProgressBar value={sub.score} color={`bg-gradient-to-r ${sub.color}`} size="md" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={card} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-kid-green" /> Performance Trend</h2>
          {subjects.slice(0, 3).map((sub, i) => (
            <div key={i} className="mb-6 last:mb-0">
              <h3 className="text-sm font-bold text-gray-600 mb-2">{sub.name}</h3>
              <div className="flex items-end gap-1 h-16">
                {sub.trend.map((val, j) => (
                  <div key={j} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / maxScore) * 100}%` }}
                      transition={{ duration: 0.5, delay: j * 0.1 }}
                      className={`w-full rounded-t bg-gradient-to-t ${sub.color}`}
                      style={{ minHeight: `${(val / maxScore) * 100}%` }}
                    />
                    <span className="text-[8px] text-gray-400 mt-0.5">W{j + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
