// File: AttendanceReports — Shows monthly attendance stats with present/absent/late breakdowns and subject-wise attendance bars.
import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const monthlyData = [
  { month: 'January', present: 20, absent: 1, late: 1, total: 22 },
  { month: 'February', present: 19, absent: 0, late: 1, total: 20 },
  { month: 'March', present: 21, absent: 0, late: 0, total: 21 },
  { month: 'April', present: 18, absent: 2, late: 0, total: 20 },
  { month: 'May', present: 22, absent: 0, late: 0, total: 22 },
  { month: 'June', present: 15, absent: 1, late: 1, total: 17 },
]

const subjects = [
  { name: 'Mathematics', attended: 22, total: 24 },
  { name: 'English', attended: 21, total: 24 },
  { name: 'Science', attended: 20, total: 23 },
  { name: 'Hindi', attended: 19, total: 22 },
  { name: 'Art', attended: 18, total: 18 },
]

export default function AttendanceReports() {
  // Aggregate attendance totals across all months
  const totalPresent = monthlyData.reduce((a, b) => a + b.present, 0)
  const totalAbsent = monthlyData.reduce((a, b) => a + b.absent, 0)
  const totalLate = monthlyData.reduce((a, b) => a + b.late, 0)
  const totalAll = monthlyData.reduce((a, b) => a + b.total, 0)
  const overallPercent = Math.round((totalPresent / totalAll) * 100)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div variants={card} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-kid-blue" /> Attendance Reports
        </h1>
        <p className="text-gray-500 font-nunito">Academic Year 2024-2025</p>
      </motion.div>

      {/* Summary stat cards: total present, absent, late, and overall percentage */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <CheckCircle2 className="w-6 h-6 text-kid-green mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{totalPresent}</p>
          <p className="text-xs text-gray-500">Present</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <XCircle className="w-6 h-6 text-kid-red mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{totalAbsent}</p>
          <p className="text-xs text-gray-500">Absent</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Clock className="w-6 h-6 text-kid-orange mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{totalLate}</p>
          <p className="text-xs text-gray-500">Late</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <TrendingUp className="w-6 h-6 text-kid-purple mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{overallPercent}%</p>
          <p className="text-xs text-gray-500">Overall</p>
        </motion.div>
      </div>

      {/* Two-column layout: monthly breakdown and subject-wise attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4">Monthly Attendance</h2>
          <div className="space-y-4">
            {monthlyData.map((m, i) => {
              const pct = Math.round((m.present / m.total) * 100)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600">{m.month}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-kid-green">{m.present}P</span>
                      <span className="text-kid-red">{m.absent}A</span>
                      <span className="text-kid-orange">{m.late}L</span>
                      <span className="font-bold text-gray-700">{pct}%</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(m.present / m.total) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="bg-gradient-to-r from-kid-green to-kid-teal h-full"
                    />
                    {m.absent > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.absent / m.total) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="bg-kid-red h-full"
                      />
                    )}
                    {m.late > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.late / m.total) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="bg-kid-orange h-full"
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Subject-wise Attendance — shows attendance counts per subject with progress bars */}
        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4">Subject-wise Attendance</h2>
          <div className="space-y-4">
            {subjects.map((sub, i) => {
              const pct = Math.round((sub.attended / sub.total) * 100)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-600">{sub.name}</span>
                    <span className="text-xs text-gray-500">{sub.attended}/{sub.total} ({pct}%)</span>
                  </div>
                  <ProgressBar value={pct} color="bg-gradient-to-r from-kid-blue to-kid-purple" size="sm" />
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
