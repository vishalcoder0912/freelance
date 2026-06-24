// File: Communication — Parent-teacher messaging interface with teacher contact cards, chat bubble history, and quick reply suggestions.
import { motion } from 'framer-motion'
import { MessageSquare, Send, Phone, Mail, User } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const teachers = [
  { id: 1, name: 'Ms. Sarah', subject: 'Class Teacher', avatar: '👩‍🏫', status: 'online', email: 'sarah@school.com', phone: '+1 234 567 890', color: 'from-blue-400 to-blue-600' },
  { id: 2, name: 'Mr. John', subject: 'English', avatar: '👨‍🏫', status: 'offline', email: 'john@school.com', phone: '+1 234 567 891', color: 'from-green-400 to-green-600' },
  { id: 3, name: 'Ms. Priya', subject: 'Science', avatar: '👩‍🔬', status: 'online', email: 'priya@school.com', phone: '+1 234 567 892', color: 'from-purple-400 to-purple-600' },
  { id: 4, name: 'Mr. David', subject: 'Art', avatar: '👨‍🎨', status: 'online', email: 'david@school.com', phone: '+1 234 567 893', color: 'from-pink-400 to-pink-600' },
]

const chatMessages = [
  { id: 1, from: 'Ms. Sarah', message: 'Emma is doing great in class! She积极参与 all activities.', time: '10:30 AM', isTeacher: true },
  { id: 2, from: 'You', message: 'Thank you! She loves coming to school.', time: '10:35 AM', isTeacher: false },
  { id: 3, from: 'Ms. Sarah', message: 'She has improved a lot in Mathematics this term.', time: '10:36 AM', isTeacher: true },
  { id: 4, from: 'You', message: 'That is wonderful to hear. We practice at home too.', time: '10:38 AM', isTeacher: false },
]

const quickReplies = [
  'Thank you for the update!',
  'I will work on that at home.',
  'Can we schedule a meeting?',
  'Noted, thanks!',
  'Emma has been practicing.',
]

export default function Communication() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div variants={card} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-kid-blue" /> Teacher Communication
        </h1>
        <p className="text-gray-500 font-nunito">Stay connected with your child's teachers</p>
      </motion.div>

      {/* Left: teacher contact list with email/call buttons; Right: chat interface with message history and input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={card} className="lg:col-span-1 space-y-3">
          <h2 className="font-fredoka text-gray-700 mb-2 text-sm">Teachers</h2>
          {teachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${teacher.color} rounded-2xl p-4 text-white cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{teacher.avatar}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">{teacher.name}</p>
                  <p className="text-xs opacity-80">{teacher.subject}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${teacher.status === 'online' ? 'bg-green-300' : 'bg-gray-400'}`} />
              </div>
              <div className="flex gap-2 mt-3">
                <motion.button className="flex-1 bg-white/20 rounded-lg py-1 text-xs font-semibold flex items-center justify-center gap-1" whileHover={{ scale: 1.05 }}><Mail className="w-3 h-3" /> Email</motion.button>
                <motion.button className="flex-1 bg-white/20 rounded-lg py-1 text-xs font-semibold flex items-center justify-center gap-1" whileHover={{ scale: 1.05 }}><Phone className="w-3 h-3" /> Call</motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={card} className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-fredoka text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-kid-blue" /> Chat with Ms. Sarah
            </h2>
          </div>

          <div className="flex-1 p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.isTeacher ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.isTeacher ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 ${msg.isTeacher ? 'bg-gradient-to-r from-blue-50 to-purple-50 rounded-tl-none' : 'bg-gradient-to-r from-kid-blue to-kid-purple text-white rounded-tr-none'}`}>
                  {msg.isTeacher && <p className="text-[10px] font-bold text-kid-blue mb-0.5">{msg.from}</p>}
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${msg.isTeacher ? 'text-gray-400' : 'text-white/70'}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply, i) => (
                <motion.button
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {reply}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-blue/30 text-sm"
              />
              <motion.button
                className="bg-gradient-to-r from-kid-blue to-kid-purple text-white px-4 py-2.5 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
