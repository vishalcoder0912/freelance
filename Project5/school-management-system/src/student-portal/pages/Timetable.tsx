import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']

const timetableData: Record<string, { subject: string; teacher: string; room: string; color: string }[]> = {
  Monday: [
    { subject: 'Mathematics', teacher: 'Ms. Sarah', room: 'Room 101', color: 'from-blue-400 to-blue-500' },
    { subject: 'English', teacher: 'Mr. John', room: 'Room 102', color: 'from-green-400 to-green-500' },
    { subject: 'Science', teacher: 'Ms. Priya', room: 'Room 103', color: 'from-purple-400 to-purple-500' },
    { subject: 'Art', teacher: 'Mr. David', room: 'Art Room', color: 'from-pink-400 to-pink-500' },
    { subject: 'Lunch Break', teacher: '', room: '', color: 'from-yellow-400 to-yellow-500' },
    { subject: 'Music', teacher: 'Ms. Lisa', room: 'Music Room', color: 'from-orange-400 to-orange-500' },
  ],
  Tuesday: [
    { subject: 'English', teacher: 'Mr. John', room: 'Room 102', color: 'from-green-400 to-green-500' },
    { subject: 'Mathematics', teacher: 'Ms. Sarah', room: 'Room 101', color: 'from-blue-400 to-blue-500' },
    { subject: 'Music', teacher: 'Ms. Lisa', room: 'Music Room', color: 'from-orange-400 to-orange-500' },
    { subject: 'PE', teacher: 'Mr. Singh', room: 'Playground', color: 'from-red-400 to-red-500' },
    { subject: 'Lunch Break', teacher: '', room: '', color: 'from-yellow-400 to-yellow-500' },
    { subject: 'Craft', teacher: 'Ms. Rita', room: 'Craft Room', color: 'from-teal-400 to-teal-500' },
  ],
  Wednesday: [
    { subject: 'Science', teacher: 'Ms. Priya', room: 'Room 103', color: 'from-purple-400 to-purple-500' },
    { subject: 'Mathematics', teacher: 'Ms. Sarah', room: 'Room 101', color: 'from-blue-400 to-blue-500' },
    { subject: 'English', teacher: 'Mr. John', room: 'Room 102', color: 'from-green-400 to-green-500' },
    { subject: 'Craft', teacher: 'Ms. Rita', room: 'Craft Room', color: 'from-teal-400 to-teal-500' },
    { subject: 'Lunch Break', teacher: '', room: '', color: 'from-yellow-400 to-yellow-500' },
    { subject: 'Library', teacher: 'Ms. Anne', room: 'Library', color: 'from-indigo-400 to-indigo-500' },
  ],
  Thursday: [
    { subject: 'Mathematics', teacher: 'Ms. Sarah', room: 'Room 101', color: 'from-blue-400 to-blue-500' },
    { subject: 'Hindi', teacher: 'Mr. Raj', room: 'Room 104', color: 'from-pink-400 to-pink-500' },
    { subject: 'Science', teacher: 'Ms. Priya', room: 'Room 103', color: 'from-purple-400 to-purple-500' },
    { subject: 'Games', teacher: 'Mr. Singh', room: 'Playground', color: 'from-orange-400 to-orange-500' },
    { subject: 'Lunch Break', teacher: '', room: '', color: 'from-yellow-400 to-yellow-500' },
    { subject: 'Art', teacher: 'Mr. David', room: 'Art Room', color: 'from-pink-400 to-pink-500' },
  ],
  Friday: [
    { subject: 'English', teacher: 'Mr. John', room: 'Room 102', color: 'from-green-400 to-green-500' },
    { subject: 'Mathematics', teacher: 'Ms. Sarah', room: 'Room 101', color: 'from-blue-400 to-blue-500' },
    { subject: 'Art', teacher: 'Mr. David', room: 'Art Room', color: 'from-pink-400 to-pink-500' },
    { subject: 'Library', teacher: 'Ms. Anne', room: 'Library', color: 'from-indigo-400 to-indigo-500' },
    { subject: 'Lunch Break', teacher: '', room: '', color: 'from-yellow-400 to-yellow-500' },
    { subject: 'Show & Tell', teacher: 'Ms. Sarah', room: 'Room 101', color: 'from-purple-400 to-purple-500' },
  ],
}

export default function Timetable() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={container} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-kid-blue" /> Weekly Timetable
        </h1>
        <p className="text-gray-500 font-nunito">Kindergarten - Section A</p>
      </motion.div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="p-3 text-left font-fredoka text-gray-600 w-24">
                <Clock className="w-4 h-4 inline mr-1" /> Time
              </th>
              {days.map((day) => (
                <th key={day} className="p-3 text-center font-fredoka text-gray-600 bg-white/60 rounded-xl">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, rowIdx) => (
              <motion.tr
                key={time}
                variants={container}
                className="group"
              >
                <td className="p-3 text-sm font-semibold text-gray-500 whitespace-nowrap">{time}</td>
                {days.map((day) => {
                  const slot = timetableData[day]?.[rowIdx]
                  if (!slot) return <td key={day} className="p-1" />
                  const isBreak = slot.subject === 'Lunch Break'
                  return (
                    <td key={day} className="p-1">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className={`rounded-xl p-3 text-white bg-gradient-to-br ${slot.color} ${isBreak ? 'opacity-70' : 'shadow-md'} cursor-pointer transition-all`}
                      >
                        <p className="font-bold text-xs md:text-sm font-fredoka">{slot.subject}</p>
                        {!isBreak && (
                          <>
                            <p className="text-[10px] opacity-80 mt-0.5">{slot.teacher}</p>
                            <p className="text-[10px] opacity-60">{slot.room}</p>
                          </>
                        )}
                      </motion.div>
                    </td>
                  )
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
