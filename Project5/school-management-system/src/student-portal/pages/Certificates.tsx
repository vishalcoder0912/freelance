// File: Certificates — Displays earned achievement certificates with download and share actions.
import { motion } from 'framer-motion'
import { Award, Download, Share2, Sparkles } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const card = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
}

const certificates = [
  { id: 1, title: 'Math Excellence', description: 'For outstanding performance in Mathematics', date: '2025-05-15', icon: '🏆', color: 'from-yellow-300 to-yellow-500' },
  { id: 2, title: 'Perfect Attendance', description: '100% attendance for the month of April', date: '2025-04-30', icon: '⭐', color: 'from-blue-300 to-blue-500' },
  { id: 3, title: 'Star Reader', description: 'Read 20 books in the reading challenge', date: '2025-03-20', icon: '📚', color: 'from-green-300 to-green-500' },
  { id: 4, title: 'Art Champion', description: 'Won first place in the art competition', date: '2025-02-10', icon: '🎨', color: 'from-pink-300 to-pink-500' },
  { id: 5, title: 'Science Explorer', description: 'Completed all science experiments', date: '2025-01-25', icon: '🔬', color: 'from-purple-300 to-purple-500' },
  { id: 6, title: 'Good Behavior', description: 'For being a role model in class', date: '2024-12-15', icon: '🌟', color: 'from-orange-300 to-orange-500' },
]

export default function Certificates() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header with total earned count */}
      <motion.div variants={card} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
          <Award className="w-7 h-7 text-kid-yellow" /> My Certificates
          <Sparkles className="w-5 h-5 text-kid-yellow" />
        </h1>
        <p className="text-gray-500 font-nunito">{certificates.length} certificates earned</p>
      </motion.div>

      {/* Certificate cards grid — each has a colored header with animated icon, description, award date, Download and Share buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            variants={card}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
          >
            <div className={`bg-gradient-to-br ${cert.color} p-6 text-center relative`}>
              <div className="absolute inset-0 bg-white/10" />
              <motion.span
                className="text-5xl relative z-10 inline-block"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                {cert.icon}
              </motion.span>
              <h3 className="text-white font-fredoka text-lg mt-2 relative z-10">{cert.title}</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">{cert.description}</p>
              <p className="text-xs text-gray-400 mt-2">Awarded: {cert.date}</p>
              <div className="flex gap-2 mt-3">
                <motion.button
                  className="flex-1 bg-gradient-to-r from-kid-blue to-kid-purple text-white text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Download className="w-3 h-3" /> Download
                </motion.button>
                <motion.button
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Share2 className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
