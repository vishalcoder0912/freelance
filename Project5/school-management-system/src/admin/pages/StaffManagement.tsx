import { motion } from 'framer-motion'
import { GraduationCap, Search, Plus, Mail, Phone, MoreVertical } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const staffMembers = [
  { id: 1, name: 'Ms. Sarah Johnson', role: 'Class Teacher', department: 'Kindergarten', avatar: '👩‍🏫', email: 'sarah@school.com', phone: '+1 234 567 801', status: 'active' as const, color: 'from-pink-400 to-pink-500' },
  { id: 2, name: 'Mr. John Smith', role: 'English Teacher', department: 'Language Arts', avatar: '👨‍🏫', email: 'john@school.com', phone: '+1 234 567 802', status: 'active' as const, color: 'from-blue-400 to-blue-500' },
  { id: 3, name: 'Ms. Priya Sharma', role: 'Science Teacher', department: 'Science', avatar: '👩‍🔬', email: 'priya@school.com', phone: '+1 234 567 803', status: 'active' as const, color: 'from-purple-400 to-purple-500' },
  { id: 4, name: 'Mr. David Wilson', role: 'Art Teacher', department: 'Creative Arts', avatar: '👨‍🎨', email: 'david@school.com', phone: '+1 234 567 804', status: 'active' as const, color: 'from-orange-400 to-orange-500' },
  { id: 5, name: 'Ms. Lisa Brown', role: 'Music Teacher', department: 'Performing Arts', avatar: '👩‍🎤', email: 'lisa@school.com', phone: '+1 234 567 805', status: 'active' as const, color: 'from-green-400 to-green-500' },
  { id: 6, name: 'Mr. Raj Kumar', role: 'Hindi Teacher', department: 'Languages', avatar: '👨‍🏫', email: 'raj@school.com', phone: '+1 234 567 806', status: 'inactive' as const, color: 'from-teal-400 to-teal-500' },
  { id: 7, name: 'Ms. Anne Parker', role: 'Librarian', department: 'Library', avatar: '👩‍📚', email: 'anne@school.com', phone: '+1 234 567 807', status: 'active' as const, color: 'from-indigo-400 to-indigo-500' },
  { id: 8, name: 'Mr. Singh', role: 'PE Teacher', department: 'Physical Education', avatar: '👨‍🏃', email: 'singh@school.com', phone: '+1 234 567 808', status: 'active' as const, color: 'from-red-400 to-red-500' },
  { id: 9, name: 'Ms. Rita Patel', role: 'Craft Teacher', department: 'Creative Arts', avatar: '👩‍🎨', email: 'rita@school.com', phone: '+1 234 567 809', status: 'active' as const, color: 'from-pink-400 to-pink-500' },
  { id: 10, name: 'Mr. David Lee', role: 'Math Teacher', department: 'Mathematics', avatar: '👨‍🏫', email: 'david.lee@school.com', phone: '+1 234 567 810', status: 'inactive' as const, color: 'from-blue-400 to-blue-500' },
]

export default function StaffManagement() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8">
      <motion.div variants={container} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-kid-green" /> Staff Management
          </h1>
          <p className="text-gray-500 font-nunito">Total 48 staff members</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-green to-kid-teal text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" /> Add Staff
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Teachers" value="32" icon={<GraduationCap className="w-4 h-4" />} color="blue" />
        <StatsCard title="Admin Staff" value="8" icon={<GraduationCap className="w-4 h-4" />} color="purple" />
        <StatsCard title="Support Staff" value="8" icon={<GraduationCap className="w-4 h-4" />} color="orange" />
        <StatsCard title="Active Today" value="45" icon={<GraduationCap className="w-4 h-4" />} color="green" trend="94%" trendUp />
      </div>

      <motion.div variants={container} className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search staff by name, role, or department..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-green/30 text-sm" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {staffMembers.map((staff) => (
          <motion.div
            key={staff.id}
            variants={container}
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
          >
            <div className={`bg-gradient-to-r ${staff.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{staff.avatar}</span>
                <button className="text-white/70 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
              </div>
              <p className="font-fredoka text-lg mt-1">{staff.name}</p>
              <p className="text-xs opacity-80">{staff.role}</p>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-500">{staff.department}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${staff.status === 'active' ? 'bg-green-50 text-kid-green' : 'bg-gray-100 text-gray-500'}`}>
                {staff.status}
              </span>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button className="flex-1 py-2 rounded-lg bg-blue-50 text-kid-blue text-xs font-bold flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> Email</button>
                <button className="flex-1 py-2 rounded-lg bg-green-50 text-kid-green text-xs font-bold flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> Call</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
