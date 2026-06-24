// File: EventManagement — Calendar of school events with cards showing date, time, location, description, type badge, and edit/delete actions.
import { motion } from 'framer-motion'
import { Calendar, Plus, MapPin, Clock, Users, Edit3, Trash2, Sparkles } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const events = [
  { id: 1, title: 'Parent-Teacher Meeting', date: '2025-06-28', time: '10:00 AM - 12:00 PM', location: 'School Auditorium', description: 'Quarterly parent-teacher interaction meeting', type: 'important' as const, icon: '📋', attendees: 'All parents', color: 'from-red-400 to-red-500' },
  { id: 2, title: 'Annual Day Rehearsal', date: '2025-07-10', time: '9:00 AM - 3:00 PM', location: 'Main Hall', description: 'Dress rehearsal for the annual day function', type: 'upcoming' as const, icon: '🎭', attendees: 'All students', color: 'from-blue-400 to-blue-500' },
  { id: 3, title: 'Summer Camp Starts', date: '2025-07-20', time: '8:00 AM - 2:00 PM', location: 'School Campus', description: 'Fun summer activities and learning', type: 'info' as const, icon: '🏕️', attendees: 'Registered students', color: 'from-green-400 to-green-500' },
  { id: 4, title: 'Staff Workshop', date: '2025-06-30', time: '2:00 PM - 5:00 PM', location: 'Conference Room', description: 'Professional development for teaching staff', type: 'important' as const, icon: '👩‍🏫', attendees: 'All staff', color: 'from-purple-400 to-purple-500' },
  { id: 5, title: 'Sports Day', date: '2025-08-15', time: '7:00 AM - 12:00 PM', location: 'Sports Ground', description: 'Annual sports competition', type: 'upcoming' as const, icon: '🏃', attendees: 'All students', color: 'from-orange-400 to-orange-500' },
  { id: 6, title: 'Art Exhibition', date: '2025-08-05', time: '10:00 AM - 4:00 PM', location: 'Art Gallery', description: 'Showcasing student artwork', type: 'upcoming' as const, icon: '🎨', attendees: 'All parents', color: 'from-pink-400 to-pink-500' },
  { id: 7, title: 'Science Fair', date: '2025-07-25', time: '9:00 AM - 2:00 PM', location: 'Science Lab', description: 'Student science projects exhibition', type: 'info' as const, icon: '🔬', attendees: 'Selected students', color: 'from-teal-400 to-teal-500' },
  { id: 8, title: 'Independence Day', date: '2025-08-15', time: '8:00 AM - 10:00 AM', location: 'School Ground', description: 'Flag hoisting and cultural program', type: 'important' as const, icon: '🇮🇳', attendees: 'All students & staff', color: 'from-indigo-400 to-indigo-500' },
]

const typeColors = {
  important: { bg: 'bg-red-50 border-red-200', badge: 'bg-red-500' },
  upcoming: { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-500' },
  info: { bg: 'bg-green-50 border-green-200', badge: 'bg-green-500' },
}

export default function EventManagement() {
  // Format the current month and year for display
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header with Create Event button */}
      <motion.div variants={container} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-kid-pink" /> Event Management
          </h1>
          <p className="text-gray-500 font-nunito">{currentMonth} · {events.length} events</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-pink to-kid-purple text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" /> Create Event
        </motion.button>
      </motion.div>

      {/* Summary stats: total events, this month, upcoming, important */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Events" value={events.length.toString()} icon={<Calendar className="w-4 h-4" />} color="pink" />
        <StatsCard title="This Month" value="4" icon={<Calendar className="w-4 h-4" />} color="blue" />
        <StatsCard title="Upcoming" value={events.filter(e => e.type === 'upcoming').length.toString()} icon={<Sparkles className="w-4 h-4" />} color="purple" />
        <StatsCard title="Important" value={events.filter(e => e.type === 'important').length.toString()} icon={<Calendar className="w-4 h-4" />} color="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => {
          const tc = typeColors[event.type]
          return (
            <motion.div
              key={event.id}
              variants={container}
              whileHover={{ y: -3 }}
              className={`bg-white rounded-2xl overflow-hidden shadow-md border ${tc.bg}`}
            >
              <div className={`bg-gradient-to-r ${event.color} p-3 text-white flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{event.icon}</span>
                  <span className={`${tc.badge} w-2 h-2 rounded-full`} />
                </div>
                <span className="text-[10px] font-bold uppercase opacity-80">{event.type}</span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-fredoka text-gray-800 text-sm">{event.title}</h3>
                <p className="text-xs text-gray-500">{event.description}</p>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.attendees}</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <motion.button className="flex-1 py-1.5 rounded-lg bg-blue-50 text-kid-blue text-[10px] font-bold flex items-center justify-center gap-1" whileHover={{ scale: 1.03 }}>
                    <Edit3 className="w-3 h-3" /> Edit
                  </motion.button>
                  <motion.button className="flex-1 py-1.5 rounded-lg bg-red-50 text-kid-red text-[10px] font-bold flex items-center justify-center gap-1" whileHover={{ scale: 1.03 }}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
