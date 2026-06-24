// File: StudentManagement — Admin view of all enrolled students with search, filters, status badges, and contact actions in a table.
import { motion } from 'framer-motion'
import { Users, Search, Filter, Plus, Mail, Phone, MoreVertical } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const students = [
  { id: 1, name: 'Emma Wilson', class: 'Kindergarten A', rollNo: 'KGA-001', avatar: '👧', gender: 'Female', parent: 'John Wilson', email: 'john@email.com', phone: '+1 234 567 890', status: 'active' as const },
  { id: 2, name: 'Liam Brown', class: 'Kindergarten A', rollNo: 'KGA-002', avatar: '👦', gender: 'Male', parent: 'Sarah Brown', email: 'sarah@email.com', phone: '+1 234 567 891', status: 'active' as const },
  { id: 3, name: 'Sophia Davis', class: 'Kindergarten B', rollNo: 'KGB-001', avatar: '👧', gender: 'Female', parent: 'Mike Davis', email: 'mike@email.com', phone: '+1 234 567 892', status: 'active' as const },
  { id: 4, name: 'Noah Miller', class: 'Nursery A', rollNo: 'NUR-001', avatar: '👦', gender: 'Male', parent: 'Anna Miller', email: 'anna@email.com', phone: '+1 234 567 893', status: 'inactive' as const },
  { id: 5, name: 'Olivia Garcia', class: 'LKG A', rollNo: 'LKG-001', avatar: '👧', gender: 'Female', parent: 'Carlos Garcia', email: 'carlos@email.com', phone: '+1 234 567 894', status: 'active' as const },
  { id: 6, name: 'Ethan Martinez', class: 'UKG A', rollNo: 'UKG-001', avatar: '👦', gender: 'Male', parent: 'Lisa Martinez', email: 'lisa@email.com', phone: '+1 234 567 895', status: 'active' as const },
  { id: 7, name: 'Ava Anderson', class: 'Kindergarten A', rollNo: 'KGA-003', avatar: '👧', gender: 'Female', parent: 'Robert Anderson', email: 'robert@email.com', phone: '+1 234 567 896', status: 'active' as const },
  { id: 8, name: 'Mason Thomas', class: 'Nursery B', rollNo: 'NUR-002', avatar: '👦', gender: 'Male', parent: 'Emily Thomas', email: 'emily@email.com', phone: '+1 234 567 897', status: 'inactive' as const },
]

export default function StudentManagement() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header with total count and Add Student button */}
      <motion.div variants={container} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-kid-blue" /> Student Management
          </h1>
          <p className="text-gray-500 font-nunito">Total 486 students enrolled</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-blue to-kid-purple text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" /> Add Student
        </motion.button>
      </motion.div>

      {/* Stat cards: active, new this month, inactive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Active Students" value="462" icon={<Users className="w-4 h-4" />} color="blue" />
        <StatsCard title="New This Month" value="12" icon={<Users className="w-4 h-4" />} color="green" trend="+8%" trendUp />
        <StatsCard title="Inactive" value="24" icon={<Users className="w-4 h-4" />} color="orange" />
      </div>

      <motion.div variants={container} className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-blue/30 text-sm" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </motion.div>

      {/* Students table — columns: student name, class, roll no, parent, contact actions, status badge, actions menu */}
      <motion.div variants={container} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-gray-500 font-semibold">Student</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Class</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Roll No</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Parent</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Contact</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Status</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <motion.tr
                  key={student.id}
                  variants={container}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{student.avatar}</span>
                      <span className="font-semibold text-gray-700">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{student.class}</td>
                  <td className="p-4 text-gray-500 text-xs">{student.rollNo}</td>
                  <td className="p-4 text-gray-600">{student.parent}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400"><Mail className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400"><Phone className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${student.status === 'active' ? 'bg-green-50 text-kid-green' : 'bg-gray-100 text-gray-500'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
