import { motion } from 'framer-motion'
import { Users, Search, MoreVertical, Mail, Phone, UserPlus } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const students = [
  { id: 1, name: 'Emma Wilson', rollNo: 1, avatar: '👧', attendance: 95, parent: 'John Wilson', email: 'john@email.com', phone: '+1 234 567 890', performance: 'Excellent', color: 'from-pink-400 to-pink-500' },
  { id: 2, name: 'Liam Brown', rollNo: 2, avatar: '👦', attendance: 88, parent: 'Sarah Brown', email: 'sarah@email.com', phone: '+1 234 567 891', performance: 'Good', color: 'from-blue-400 to-blue-500' },
  { id: 3, name: 'Sophia Davis', rollNo: 3, avatar: '👧', attendance: 92, parent: 'Mike Davis', email: 'mike@email.com', phone: '+1 234 567 892', performance: 'Excellent', color: 'from-purple-400 to-purple-500' },
  { id: 4, name: 'Noah Miller', rollNo: 4, avatar: '👦', attendance: 78, parent: 'Anna Miller', email: 'anna@email.com', phone: '+1 234 567 893', performance: 'Average', color: 'from-orange-400 to-orange-500' },
  { id: 5, name: 'Olivia Garcia', rollNo: 5, avatar: '👧', attendance: 96, parent: 'Carlos Garcia', email: 'carlos@email.com', phone: '+1 234 567 894', performance: 'Excellent', color: 'from-green-400 to-green-500' },
  { id: 6, name: 'Ethan Martinez', rollNo: 6, avatar: '👦', attendance: 85, parent: 'Lisa Martinez', email: 'lisa@email.com', phone: '+1 234 567 895', performance: 'Good', color: 'from-teal-400 to-teal-500' },
  { id: 7, name: 'Ava Anderson', rollNo: 7, avatar: '👧', attendance: 91, parent: 'Robert Anderson', email: 'robert@email.com', phone: '+1 234 567 896', performance: 'Good', color: 'from-indigo-400 to-indigo-500' },
  { id: 8, name: 'Mason Thomas', rollNo: 8, avatar: '👦', attendance: 82, parent: 'Emily Thomas', email: 'emily@email.com', phone: '+1 234 567 897', performance: 'Average', color: 'from-pink-400 to-pink-500' },
]

const performanceColors: Record<string, string> = {
  Excellent: 'text-kid-green bg-green-50',
  Good: 'text-kid-blue bg-blue-50',
  Average: 'text-kid-orange bg-orange-50',
}

export default function ClassManagement() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={card} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-kid-blue" /> Class Management
          </h1>
          <p className="text-gray-500 font-nunito">Kindergarten - Section A · 28 Students</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-blue to-kid-purple text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserPlus className="w-4 h-4" /> Add Student
        </motion.button>
      </motion.div>

      <motion.div variants={card} className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name or roll number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-blue/30 text-sm"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {students.map((student) => (
          <motion.div
            key={student.id}
            variants={card}
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group"
          >
            <div className={`bg-gradient-to-r ${student.color} p-4 text-white relative`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{student.avatar}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <p className="font-fredoka text-lg mt-1">{student.name}</p>
              <p className="text-xs opacity-80">Roll No: {student.rollNo}</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Attendance</span>
                <span className="text-sm font-bold text-gray-700">{student.attendance}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${student.attendance}%` }}
                  transition={{ duration: 0.8, delay: student.id * 0.05 }}
                  className={`h-full rounded-full bg-gradient-to-r ${student.color}`}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${performanceColors[student.performance]}`}>
                  {student.performance}
                </span>
                <div className="flex gap-1">
                  <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><Mail className="w-3 h-3" /></button>
                  <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><Phone className="w-3 h-3" /></button>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">Parent: {student.parent}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
