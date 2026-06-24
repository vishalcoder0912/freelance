import { motion } from 'framer-motion'
import { Activity, Clock, BookOpen, Gamepad2, Award, Eye } from 'lucide-react'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const dailyActivities = [
  { id: 1, activity: 'Mathematics Practice', time: '09:00 - 09:45', duration: '45 min', type: 'academic' as const, completed: true, icon: '📐' },
  { id: 2, activity: 'English Reading', time: '10:00 - 10:40', duration: '40 min', type: 'academic' as const, completed: true, icon: '📖' },
  { id: 3, activity: 'Science Experiment', time: '11:00 - 11:45', duration: '45 min', type: 'academic' as const, completed: true, icon: '🔬' },
  { id: 4, activity: 'Outdoor Play', time: '12:00 - 12:30', duration: '30 min', type: 'play' as const, completed: true, icon: '🏃' },
  { id: 5, activity: 'Art & Craft', time: '01:00 - 01:45', duration: '45 min', type: 'creative' as const, completed: false, icon: '🎨' },
  { id: 6, activity: 'Music Class', time: '02:00 - 02:30', duration: '30 min', type: 'creative' as const, completed: false, icon: '🎵' },
]

const weeklySummary = [
  { day: 'Mon', academic: 180, play: 60, creative: 90 },
  { day: 'Tue', academic: 170, play: 45, creative: 75 },
  { day: 'Wed', academic: 190, play: 30, creative: 60 },
  { day: 'Thu', academic: 160, play: 60, creative: 85 },
  { day: 'Fri', academic: 175, play: 45, creative: 70 },
]

const typeConfig = {
  academic: { color: 'text-kid-blue', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', label: 'Academic' },
  play: { color: 'text-kid-green', bg: 'from-green-50 to-emerald-50', border: 'border-green-200', label: 'Play' },
  creative: { color: 'text-kid-purple', bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', label: 'Creative' },
}

const maxMinutes = Math.max(...weeklySummary.map(d => d.academic + d.play + d.creative))

export default function ActivityMonitoring() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={card} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
          <Activity className="w-7 h-7 text-kid-green" /> Activity Monitoring
        </h1>
        <p className="text-gray-500 font-nunito">Track Emma's daily school activities</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <BookOpen className="w-5 h-5 text-kid-blue mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">3</p>
          <p className="text-xs text-gray-500">Today's Classes</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Gamepad2 className="w-5 h-5 text-kid-green mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">45 min</p>
          <p className="text-xs text-gray-500">Play Time</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Award className="w-5 h-5 text-kid-purple mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">75 min</p>
          <p className="text-xs text-gray-500">Creative Time</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center">
          <Eye className="w-5 h-5 text-kid-orange mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">4/6</p>
          <p className="text-xs text-gray-500">Activities Done</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-3">Today's Activities</h2>
          <div className="space-y-2">
            {dailyActivities.map((act) => {
              const config = typeConfig[act.type]
              return (
                <motion.div
                  key={act.id}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} ${!act.completed ? 'opacity-60' : ''}`}
                  whileHover={{ x: 2 }}
                >
                  <span className="text-lg">{act.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-700">{act.activity}</p>
                      <span className={`text-[10px] font-semibold ${config.color}`}>{config.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.time}</span>
                      <span>{act.duration}</span>
                    </div>
                  </div>
                  <span className={`text-lg ${act.completed ? '' : 'text-gray-300'}`}>
                    {act.completed ? '✅' : '⏳'}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4">Weekly Activity Distribution</h2>
          <div className="space-y-4">
            {weeklySummary.map((day, i) => {
              const total = day.academic + day.play + day.creative
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-600 w-10">{day.day}</span>
                    <span className="text-xs text-gray-400">{total} min</span>
                  </div>
                  <div className="flex gap-0.5 h-5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.academic / maxMinutes) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="bg-gradient-to-r from-kid-blue to-kid-indigo h-full"
                      title={`Academic: ${day.academic}min`}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.play / maxMinutes) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="bg-gradient-to-r from-kid-green to-kid-teal h-full"
                      title={`Play: ${day.play}min`}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.creative / maxMinutes) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="bg-gradient-to-r from-kid-purple to-kid-pink h-full"
                      title={`Creative: ${day.creative}min`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-kid-blue" /> Academic</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-kid-green" /> Play</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-kid-purple" /> Creative</span>
          </div>
        </motion.div>
      </div>

      <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <h2 className="font-fredoka text-gray-700 mb-3">Screen Time & Device Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <p className="text-xs text-gray-500 font-semibold">Learning Apps</p>
            <p className="text-xl font-bold text-kid-blue">1h 30m</p>
            <ProgressBar value={60} color="bg-gradient-to-r from-kid-blue to-kid-indigo" size="sm" />
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
            <p className="text-xs text-gray-500 font-semibold">Creative Tools</p>
            <p className="text-xl font-bold text-kid-orange">45m</p>
            <ProgressBar value={30} color="bg-gradient-to-r from-kid-orange to-kid-pink" size="sm" />
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-teal-50">
            <p className="text-xs text-gray-500 font-semibold">Total Screen Time</p>
            <p className="text-xl font-bold text-kid-green">2h 15m</p>
            <ProgressBar value={45} color="bg-gradient-to-r from-kid-green to-kid-teal" size="sm" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Screen time is within healthy limits for this age group. ✅</p>
      </motion.div>
    </motion.div>
  )
}
