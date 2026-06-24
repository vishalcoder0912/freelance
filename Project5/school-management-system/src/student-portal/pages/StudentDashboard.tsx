// StudentDashboard: Kid-friendly overview showing attendance, homework, achievements, schedule, learning activities, and quick-access class links.
// File: StudentDashboard — Kid-friendly dashboard with attendance, homework, achievements, schedule, learning activities, and quick-access class links.
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Clock, Trophy, ArrowRight, Sparkles, GraduationCap, Gamepad2, Star } from 'lucide-react'
import { AnimatedCharacter } from '../../shared/components/AnimatedCharacter'
import { AchievementBadge } from '../../shared/components/AchievementBadge'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const attendanceData = [
  { month: 'Jan', days: 22, present: 20 },
  { month: 'Feb', days: 20, present: 19 },
  { month: 'Mar', days: 22, present: 21 },
]

const homeworkList = [
  { id: 1, subject: 'Mathematics', task: 'Complete page 45-48', due: '2025-06-25', status: 'pending' as const },
  { id: 2, subject: 'English', task: 'Write a short story', due: '2025-06-26', status: 'completed' as const },
  { id: 3, subject: 'Science', task: 'Draw plant life cycle', due: '2025-06-27', status: 'pending' as const },
  { id: 4, subject: 'Art', task: 'Color the rainbow', due: '2025-06-24', status: 'completed' as const },
]

const learningActivities = [
  { name: 'Phonics Mastery', progress: 75, color: 'bg-gradient-to-r from-kid-blue to-kid-purple' },
  { name: 'Number Sense', progress: 60, color: 'bg-gradient-to-r from-kid-green to-kid-teal' },
  { name: 'Reading Comprehension', progress: 45, color: 'bg-gradient-to-r from-kid-orange to-kid-pink' },
  { name: 'Science Explorer', progress: 90, color: 'bg-gradient-to-r from-kid-purple to-kid-pink' },
]

const timetable = [
  { day: 'Mon', subjects: ['Math', 'English', 'Science', 'Art'] },
  { day: 'Tue', subjects: ['English', 'Math', 'Music', 'PE'] },
  { day: 'Wed', subjects: ['Science', 'Math', 'English', 'Craft'] },
  { day: 'Thu', subjects: ['Math', 'Hindi', 'Science', 'Games'] },
  { day: 'Fri', subjects: ['English', 'Math', 'Art', 'Library'] },
]

const achievements = [
  { title: 'Math Whiz', emoji: '🧮', unlocked: true, description: 'Completed all math tasks' },
  { title: 'Star Reader', emoji: '📚', unlocked: true, description: 'Read 10 books' },
  { title: 'Science Genius', emoji: '🔬', unlocked: false, description: 'Complete science module' },
  { title: 'Perfect Attendance', emoji: '⭐', unlocked: true, description: 'No absences this month' },
]

const classLinks = [
  { name: 'Kindergarten', icon: '🎨', color: 'from-kid-pink to-kid-purple', path: '/classes/kindergarten' },
  { name: 'Nursery', icon: '🧸', color: 'from-kid-blue to-kid-green', path: '/classes/nursery' },
  { name: 'LKG', icon: '📖', color: 'from-kid-orange to-kid-yellow', path: '/classes/lkg' },
  { name: 'UKG', icon: '✏️', color: 'from-kid-green to-kid-teal', path: '/classes/ukg' },
]

export default function StudentDashboard() {
  // Aggregate attendance percentage across all months
  const attendancePercent = Math.round((attendanceData.reduce((a, b) => a + b.present, 0) / attendanceData.reduce((a, b) => a + b.days, 0)) * 100)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Greeting section with animated character mascot */}
      <motion.div variants={item} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            Hey Emma! <Sparkles className="w-6 h-6 text-kid-yellow" />
          </h1>
          <p className="text-gray-500 font-nunito">Ready to learn something new today?</p>
        </div>
        <AnimatedCharacter name="Buddy" emoji="🦊" size="md" />
      </motion.div>

      {/* Stats row: attendance rate, pending homework, unlocked achievements, class info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={item} className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-fredoka text-gray-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-kid-blue" /> Attendance</h2>
              <span className="text-2xl font-bold text-kid-green">{attendancePercent}%</span>
            </div>
            <ProgressBar value={attendancePercent} color="bg-gradient-to-r from-kid-green to-kid-teal" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Great job this month!</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-fredoka text-gray-700 flex items-center gap-2"><Clock className="w-4 h-4 text-kid-orange" /> Homework</h2>
            </div>
            <p className="text-2xl font-bold text-kid-orange">{homeworkList.filter(h => h.status === 'pending').length} pending</p>
            <p className="text-xs text-gray-400 mt-1">{homeworkList.length} tasks this week</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-fredoka text-gray-700 flex items-center gap-2"><Trophy className="w-4 h-4 text-kid-purple" /> Achievements</h2>
            </div>
            <p className="text-2xl font-bold text-kid-purple">{achievements.filter(a => a.unlocked).length}/{achievements.length}</p>
            <p className="text-xs text-gray-400 mt-1">Badges earned</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-fredoka text-gray-700 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-kid-teal" /> Class Level</h2>
            </div>
            <p className="text-lg font-bold text-kid-teal">Kindergarten</p>
            <p className="text-xs text-gray-400 mt-1">Section A</p>
          </div>
        </motion.div>

        {/* Today's schedule sidebar — lists Monday's subjects with order badges */}
        <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-kid-blue" /> Today's Schedule</h2>
          <div className="space-y-2">
            {timetable[0].subjects.map((subject, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-kid-blue shadow-sm">{i + 1}</div>
                <span className="text-sm font-semibold text-gray-700">{subject}</span>
              </div>
            ))}
          </div>
          <motion.button
            className="mt-3 w-full text-center text-sm text-kid-blue font-semibold py-2 rounded-xl hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            View Full Timetable <ArrowRight className="w-3 h-3 inline" />
          </motion.button>
        </motion.div>
      </div>

      {/* Learning Activities progress cards — shows per-subject completion bars */}
      <motion.div variants={item} className="mb-6">
        <h2 className="font-fredoka text-gray-700 mb-3 text-lg">Learning Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningActivities.map((activity, i) => (
            <motion.div key={i} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100" whileHover={{ y: -2 }}>
              <h3 className="text-sm font-bold text-gray-700 mb-2">{activity.name}</h3>
              <ProgressBar value={activity.progress} color={activity.color} size="sm" showPercent />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Achievement Badges grid — lists unlocked/locked badges earned through activities */}
        <motion.div variants={item}>
          <h2 className="font-fredoka text-gray-700 mb-3 text-lg flex items-center gap-2"><Trophy className="w-4 h-4 text-kid-yellow" /> Achievement Badges</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((badge, i) => (
              <AchievementBadge key={i} {...badge} />
            ))}
          </div>
        </motion.div>

        {/* Quick Access class cards — color-coded buttons to navigate to different class levels */}
        <motion.div variants={item}>
          <h2 className="font-fredoka text-gray-700 mb-3 text-lg flex items-center gap-2"><Gamepad2 className="w-4 h-4 text-kid-orange" /> Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {classLinks.map((link, i) => (
              <motion.button
                key={i}
                className={`bg-gradient-to-br ${link.color} rounded-2xl p-4 text-white shadow-md`}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-2xl">{link.icon}</span>
                <p className="text-sm font-bold font-fredoka mt-1">{link.name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Homework Due Soon list — shows all pending homework items with due dates */}
      <motion.div variants={item} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-kid-orange" /> Homework Due Soon</h2>
        <div className="space-y-2">
          {homeworkList.filter(h => h.status === 'pending').map(hw => (
            <div key={hw.id} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50">
              <div>
                <p className="font-bold text-sm text-gray-700">{hw.subject}</p>
                <p className="text-xs text-gray-500">{hw.task}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Due {hw.due}</p>
                <span className="text-xs font-bold text-kid-orange">Pending</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
