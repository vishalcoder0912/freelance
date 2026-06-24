// File: TeacherDashboard — Teacher overview showing class stats, today's schedule, recent assignment submissions, and quick actions.
import { motion } from 'framer-motion'
import { Users, BookOpen, ClipboardCheck, Clock, FileEdit, HelpCircle, Bell } from 'lucide-react'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const classStats = [
  { label: 'Total Students', value: '28', icon: Users, color: 'text-kid-blue', bg: 'from-blue-50 to-indigo-50' },
  { label: 'Present Today', value: '26', icon: ClipboardCheck, color: 'text-kid-green', bg: 'from-green-50 to-emerald-50' },
  { label: 'Assignments Due', value: '3', icon: BookOpen, color: 'text-kid-orange', bg: 'from-orange-50 to-yellow-50' },
  { label: 'Pending Reviews', value: '12', icon: Clock, color: 'text-kid-purple', bg: 'from-purple-50 to-pink-50' },
]

const todaysSchedule = [
  { time: '09:00 - 09:45', subject: 'Mathematics', room: 'Room 101', students: 28 },
  { time: '10:00 - 10:40', subject: 'English', room: 'Room 102', students: 26 },
  { time: '11:00 - 11:45', subject: 'Science', room: 'Room 103', students: 27 },
  { time: '12:00 - 12:30', subject: 'Lunch Break', room: '-', students: 0, break: true },
  { time: '01:00 - 01:45', subject: 'Art', room: 'Art Room', students: 25 },
]

const recentAssignments = [
  { id: 1, title: 'Math Worksheet 5', subject: 'Mathematics', submitted: 22, total: 28, due: '2025-06-25' },
  { id: 2, title: 'Story Writing', subject: 'English', submitted: 18, total: 26, due: '2025-06-26' },
  { id: 3, title: 'Plant Diagram', subject: 'Science', submitted: 15, total: 27, due: '2025-06-27' },
]

const quickActions = [
  { label: 'Create Assignment', icon: FileEdit, color: 'from-kid-blue to-kid-indigo' },
  { label: 'New Quiz', icon: HelpCircle, color: 'from-kid-green to-kid-teal' },
  { label: 'Take Attendance', icon: ClipboardCheck, color: 'from-kid-orange to-kid-pink' },
  { label: 'Send Notice', icon: Bell, color: 'from-kid-purple to-kid-pink' },
]

export default function TeacherDashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Greeting header with class info */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800">Good Morning, Ms. Sarah! 👋</h1>
        <p className="text-gray-500 font-nunito">Kindergarten - Section A</p>
      </motion.div>

      {/* Class stats row: total students, present today, assignments due, pending reviews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {classStats.map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-4 shadow-sm border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main content: schedule, assignments, and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={item} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-kid-blue" /> Today's Schedule</h2>
            <div className="space-y-2">
              {todaysSchedule.map((slot, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${slot.break ? 'bg-yellow-50' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className={`w-2 h-2 rounded-full ${slot.break ? 'bg-kid-yellow' : 'bg-kid-blue'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${slot.break ? 'text-yellow-700' : 'text-gray-700'}`}>{slot.subject}</p>
                      {!slot.break && <span className="text-xs text-gray-400">{slot.room}</span>}
                    </div>
                    <p className="text-xs text-gray-400">{slot.time} {!slot.break && `· ${slot.students} students`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Assignments — shows submission progress per assignment */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-kid-orange" /> Recent Assignments</h2>
            <div className="space-y-3">
              {recentAssignments.map((as) => (
                <div key={as.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-bold text-gray-700">{as.title}</p>
                      <p className="text-xs text-gray-400">{as.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-600">{as.submitted}/{as.total}</p>
                      <p className="text-[10px] text-gray-400">Due {as.due}</p>
                    </div>
                  </div>
                  <ProgressBar value={(as.submitted / as.total) * 100} color="bg-gradient-to-r from-kid-orange to-kid-pink" size="sm" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions panel — buttons for common tasks: create assignment, quiz, attendance, notice */}
        <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-white text-center`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="w-6 h-6 mx-auto mb-1" />
                <p className="text-[10px] font-bold">{action.label}</p>
              </motion.button>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="text-xs font-bold text-kid-purple">📝 Reminder</p>
            <p className="text-xs text-gray-500 mt-0.5">Parent-Teacher meeting next Friday</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
