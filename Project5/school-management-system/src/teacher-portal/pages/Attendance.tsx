// File: Attendance — Interactive attendance marking page with per-student toggle (present/absent/late), quick-mark all, summary counts, and save.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCheck, Calendar, CheckCircle, XCircle, Clock, Save } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
}

const students = [
  { id: 1, name: 'Emma Wilson', rollNo: 1, avatar: '👧' },
  { id: 2, name: 'Liam Brown', rollNo: 2, avatar: '👦' },
  { id: 3, name: 'Sophia Davis', rollNo: 3, avatar: '👧' },
  { id: 4, name: 'Noah Miller', rollNo: 4, avatar: '👦' },
  { id: 5, name: 'Olivia Garcia', rollNo: 5, avatar: '👧' },
  { id: 6, name: 'Ethan Martinez', rollNo: 6, avatar: '👦' },
  { id: 7, name: 'Ava Anderson', rollNo: 7, avatar: '👧' },
  { id: 8, name: 'Mason Thomas', rollNo: 8, avatar: '👦' },
  { id: 9, name: 'Isabella Jackson', rollNo: 9, avatar: '👧' },
  { id: 10, name: 'James White', rollNo: 10, avatar: '👦' },
  { id: 11, name: 'Mia Harris', rollNo: 11, avatar: '👧' },
  { id: 12, name: 'Benjamin Clark', rollNo: 12, avatar: '👦' },
]

type AttendanceStatus = 'present' | 'absent' | 'late'

export default function Attendance() {
  // Attendance state: student ID -> attendance status; subject selector; saved confirmation flag
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({})
  const [subject, setSubject] = useState('Mathematics')
  const [saved, setSaved] = useState(false)

  const subjects = ['Mathematics', 'English', 'Science', 'Hindi', 'Art', 'Music']

  // Mark all students with a single status
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: Record<number, AttendanceStatus> = {}
    students.forEach(s => { newAttendance[s.id] = status })
    setAttendance(newAttendance)
  }

  // Cycle status: present -> absent -> late -> present on each tap
  const toggleStatus = (id: number) => {
    setAttendance(prev => {
      const current = prev[id]
      const next: AttendanceStatus = current === 'present' ? 'absent' : current === 'absent' ? 'late' : 'present'
      return { ...prev, [id]: next }
    })
  }

  // Simulate save action with temporary confirmation feedback
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Compute summary counts from current attendance state
  const counts = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    total: students.length,
    marked: Object.keys(attendance).length,
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header with subject selector and current date */}
      <motion.div variants={container} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-kid-green" /> Attendance
          </h1>
          <p className="text-gray-500 font-nunito">Kindergarten - Section A</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kid-green/30"
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString()}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div variants={container} className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">Quick Mark:</span>
                <motion.button
                  className="px-3 py-1.5 rounded-lg bg-green-50 text-kid-green text-xs font-bold"
                  whileHover={{ scale: 1.05 }} onClick={() => markAll('present')}
                >
                  All Present
                </motion.button>
                <motion.button
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-kid-red text-xs font-bold"
                  whileHover={{ scale: 1.05 }} onClick={() => markAll('absent')}
                >
                  All Absent
                </motion.button>
                <motion.button
                  className="px-3 py-1.5 rounded-lg bg-orange-50 text-kid-orange text-xs font-bold"
                  whileHover={{ scale: 1.05 }} onClick={() => markAll('late')}
                >
                  All Late
                </motion.button>
              </div>
              <motion.button
                className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1 ${saved ? 'bg-kid-green text-white' : 'bg-gradient-to-r from-kid-green to-kid-teal text-white'}`}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleSave}
              >
                <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Attendance'}
              </motion.button>
            </div>

            <div className="divide-y divide-gray-50">
              {students.map((student) => {
                const status: string = attendance[student.id] || 'unmarked'
                return (
                  <motion.div
                    key={student.id}
                    variants={container}
                    className={`flex items-center justify-between p-3 px-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      status === 'present' ? 'bg-green-50/30' : status === 'absent' ? 'bg-red-50/30' : status === 'late' ? 'bg-orange-50/30' : ''
                    }`}
                    onClick={() => toggleStatus(student.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{student.avatar}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-700">{student.name}</p>
                        <p className="text-xs text-gray-400">Roll No: {student.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === 'present' && <CheckCircle className="w-5 h-5 text-kid-green" />}
                      {status === 'absent' && <XCircle className="w-5 h-5 text-kid-red" />}
                      {status === 'late' && <Clock className="w-5 h-5 text-kid-orange" />}
                      {status === 'unmarked' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                      <span className={`text-xs font-semibold w-14 text-right ${
                        status === 'present' ? 'text-kid-green' : status === 'absent' ? 'text-kid-red' : status === 'late' ? 'text-kid-orange' : 'text-gray-400'
                      }`}>
                        {status === 'unmarked' ? 'Tap' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div variants={container} className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-fredoka text-gray-700 mb-3">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-xl bg-green-50">
                <span className="text-sm text-gray-600">Present</span>
                <span className="text-lg font-bold text-kid-green">{counts.present}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-red-50">
                <span className="text-sm text-gray-600">Absent</span>
                <span className="text-lg font-bold text-kid-red">{counts.absent}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50">
                <span className="text-sm text-gray-600">Late</span>
                <span className="text-lg font-bold text-kid-orange">{counts.late}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Marked</span>
                  <span className="text-lg font-bold text-gray-800">{counts.marked}/{counts.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-fredoka text-gray-700 mb-2">Subject</h3>
            <p className="text-lg font-bold text-kid-blue">{subject}</p>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
