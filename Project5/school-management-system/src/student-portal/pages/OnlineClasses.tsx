import { motion } from 'framer-motion'
import { Video, Clock, Calendar, ArrowRight, Bell } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const onlineClasses = [
  {
    id: 1,
    subject: 'Mathematics',
    topic: 'Addition & Subtraction',
    teacher: 'Ms. Sarah',
    date: '2025-06-24',
    time: '10:00 AM',
    duration: '45 min',
    meetingLink: '#',
    status: 'upcoming' as const,
    color: 'from-blue-400 to-blue-600',
    icon: '📐',
  },
  {
    id: 2,
    subject: 'English',
    topic: 'Story Reading',
    teacher: 'Mr. John',
    date: '2025-06-25',
    time: '11:00 AM',
    duration: '40 min',
    meetingLink: '#',
    status: 'upcoming' as const,
    color: 'from-green-400 to-green-600',
    icon: '📖',
  },
  {
    id: 3,
    subject: 'Science',
    topic: 'Plant Life Cycle',
    teacher: 'Ms. Priya',
    date: '2025-06-23',
    time: '9:00 AM',
    duration: '45 min',
    meetingLink: '#',
    status: 'live' as const,
    color: 'from-purple-400 to-purple-600',
    icon: '🔬',
  },
  {
    id: 4,
    subject: 'Music',
    topic: 'Rhythm & Beats',
    teacher: 'Ms. Lisa',
    date: '2025-06-26',
    time: '2:00 PM',
    duration: '30 min',
    meetingLink: '#',
    status: 'completed' as const,
    color: 'from-pink-400 to-pink-600',
    icon: '🎵',
  },
  {
    id: 5,
    subject: 'Art',
    topic: 'Rainbow Painting',
    teacher: 'Mr. David',
    date: '2025-06-27',
    time: '1:00 PM',
    duration: '50 min',
    meetingLink: '#',
    status: 'upcoming' as const,
    color: 'from-orange-400 to-orange-600',
    icon: '🎨',
  },
  {
    id: 6,
    subject: 'PE',
    topic: 'Fun Exercises',
    teacher: 'Mr. Singh',
    date: '2025-06-28',
    time: '8:00 AM',
    duration: '35 min',
    meetingLink: '#',
    status: 'upcoming' as const,
    color: 'from-teal-400 to-teal-600',
    icon: '🏃',
  },
]

const statusBadge = {
  live: 'bg-red-500 text-white animate-pulse',
  upcoming: 'bg-kid-blue text-white',
  completed: 'bg-gray-300 text-gray-600',
}

export default function OnlineClasses() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={card} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <Video className="w-7 h-7 text-kid-purple" /> Online Classes
          </h1>
          <p className="text-gray-500 font-nunito">{onlineClasses.filter(c => c.status === 'live').length} class live now</p>
        </div>
        <motion.button
          className="relative bg-gradient-to-r from-kid-purple to-kid-pink text-white px-4 py-2 rounded-full text-sm font-bold shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-4 h-4 inline mr-1" /> Notifications
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {onlineClasses.map((cls) => (
          <motion.div
            key={cls.id}
            variants={card}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
          >
            <div className={`bg-gradient-to-r ${cls.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{cls.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusBadge[cls.status]}`}>
                  {cls.status === 'live' ? '🔴 Live' : cls.status}
                </span>
              </div>
              <h3 className="font-fredoka text-lg mt-2">{cls.subject}</h3>
              <p className="text-xs opacity-80">{cls.topic}</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" /> {cls.date}
                <Clock className="w-3 h-3 ml-2" /> {cls.time}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{cls.teacher} &middot; {cls.duration}</span>
              </div>
              {cls.status === 'live' && (
                <motion.a
                  href={cls.meetingLink}
                  className="block mt-3 bg-gradient-to-r from-kid-green to-kid-teal text-white text-center py-2 rounded-xl text-sm font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Now <ArrowRight className="w-3 h-3 inline" />
                </motion.a>
              )}
              {cls.status === 'upcoming' && (
                <button className="block mt-3 w-full bg-gray-100 text-gray-500 text-center py-2 rounded-xl text-sm font-semibold cursor-not-allowed">
                  Not Yet Started
                </button>
              )}
              {cls.status === 'completed' && (
                <button className="block mt-3 w-full bg-green-50 text-kid-green text-center py-2 rounded-xl text-sm font-semibold">
                  Recording Available
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
