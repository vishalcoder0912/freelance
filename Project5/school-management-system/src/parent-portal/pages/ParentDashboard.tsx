import { motion } from 'framer-motion'
import { TrendingUp, CreditCard, Calendar, MessageSquare, Bell, User, BarChart3, Activity, ArrowRight } from 'lucide-react'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const attendanceData = [
  { month: 'Jan', present: 20, total: 22 },
  { month: 'Feb', present: 19, total: 20 },
  { month: 'Mar', present: 21, total: 22 },
]

const subjectScores = [
  { name: 'Mathematics', score: 92, color: 'from-blue-400 to-blue-600' },
  { name: 'English', score: 88, color: 'from-green-400 to-green-600' },
  { name: 'Science', score: 82, color: 'from-purple-400 to-purple-600' },
  { name: 'Hindi', score: 90, color: 'from-orange-400 to-orange-600' },
]

const recentActivities = [
  { id: 1, activity: 'Completed Math homework', time: '2 hours ago', icon: '📐' },
  { id: 2, activity: 'Attended Science online class', time: 'Yesterday', icon: '🔬' },
  { id: 3, activity: 'Earned Star Reader badge', time: '2 days ago', icon: '⭐' },
  { id: 4, activity: 'Submitted Art project', time: '3 days ago', icon: '🎨' },
]

const events = [
  { id: 1, title: 'Parent-Teacher Meeting', date: '2025-06-28', type: 'important' as const },
  { id: 2, title: 'Annual Day Function', date: '2025-07-15', type: 'upcoming' as const },
  { id: 3, title: 'Summer Break Starts', date: '2025-07-20', type: 'info' as const },
]

export default function ParentDashboard() {
  const totalPresent = attendanceData.reduce((a, b) => a + b.present, 0)
  const totalDays = attendanceData.reduce((a, b) => a + b.total, 0)
  const attendancePercent = Math.round((totalPresent / totalDays) * 100)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={item} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800">Parent Dashboard</h1>
          <p className="text-gray-500 font-nunito">Welcome back, John! Here's Emma's progress.</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-blue to-kid-purple text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-4 h-4" /> Contact Teacher
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-kid-green" />
            <span className="text-xs text-gray-400">Overall</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">88%</p>
          <p className="text-xs text-gray-500">Average Score</p>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-5 h-5 text-kid-orange" />
            <span className="text-xs text-gray-400">Status</span>
          </div>
          <p className="text-xl font-bold text-kid-green">Paid</p>
          <p className="text-xs text-gray-500">Fee due: Jul 15</p>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-kid-blue" />
            <span className="text-xs text-gray-400">This Term</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{attendancePercent}%</p>
          <p className="text-xs text-gray-500">Attendance Rate</p>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-kid-purple" />
            <span className="text-xs text-gray-400">Activities</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{recentActivities.length}</p>
          <p className="text-xs text-gray-500">Recent Activities</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={item} className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-kid-blue" /> Performance</h2>
            <div className="space-y-3">
              {subjectScores.map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="font-semibold text-gray-600">{sub.name}</span>
                    <span className="font-bold text-gray-700">{sub.score}%</span>
                  </div>
                  <ProgressBar value={sub.score} color={`bg-gradient-to-r ${sub.color}`} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-kid-purple" /> Recent Activities</h2>
            <div className="space-y-2">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-lg">{act.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{act.activity}</p>
                    <p className="text-[10px] text-gray-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-kid-orange" /> Events & Notifications</h2>
          <div className="space-y-3">
            {events.map((ev) => {
              const colors = {
                important: 'border-l-4 border-l-kid-red bg-red-50',
                upcoming: 'border-l-4 border-l-kid-blue bg-blue-50',
                info: 'border-l-4 border-l-kid-green bg-green-50',
              }
              return (
                <div key={ev.id} className={`p-3 rounded-xl ${colors[ev.type]}`}>
                  <p className="text-sm font-bold text-gray-700">{ev.title}</p>
                  <p className="text-xs text-gray-500">{ev.date}</p>
                </div>
              )
            })}
          </div>
          <motion.button
            className="mt-3 w-full text-center text-sm text-kid-blue font-semibold py-2 rounded-xl hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            View All Events <ArrowRight className="w-3 h-3 inline" />
          </motion.button>
        </motion.div>
      </div>

      <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-kid-teal" /> Child's Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
            <span className="text-2xl">👧</span>
            <div>
              <p className="text-sm font-bold text-gray-700">Emma</p>
              <p className="text-xs text-gray-500">Kindergarten A</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-teal-50">
            <span className="text-2xl">👩‍🏫</span>
            <div>
              <p className="text-sm font-bold text-gray-700">Ms. Sarah</p>
              <p className="text-xs text-gray-500">Class Teacher</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50">
            <span className="text-2xl">🏫</span>
            <div>
              <p className="text-sm font-bold text-gray-700">Section A</p>
              <p className="text-xs text-gray-500">Roll No: 12</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
