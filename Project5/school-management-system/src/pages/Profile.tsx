import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Settings, Bell, Award, Clock, BookOpen } from 'lucide-react'

export function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-kid-blue to-kid-purple mx-auto flex items-center justify-center text-4xl mb-4 shadow-lg">
          {user?.name?.charAt(0) || '👤'}
        </div>
        <h1 className="text-3xl font-fredoka text-gray-800">{user?.name || 'Guest'}</h1>
        <p className="text-gray-500 capitalize">{user?.role || 'Student'}</p>
        {user?.classLevel && <p className="text-sm text-kid-blue font-bold capitalize">{user.classLevel}</p>}
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Award className="w-5 h-5" />, label: 'Badges', value: '8', color: 'from-yellow-400 to-orange-500' },
          { icon: <Clock className="w-5 h-5" />, label: 'Hours', value: '12', color: 'from-green-400 to-teal-500' },
          { icon: <BookOpen className="w-5 h-5" />, label: 'Lessons', value: '24', color: 'from-blue-400 to-indigo-500' },
          { icon: <Star className="w-5 h-5" />, label: 'Stars', value: '42', color: 'from-purple-400 to-pink-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white text-center shadow-lg`}
            whileHover={{ y: -4 }}>
            <div className="flex justify-center mb-2">{s.icon}</div>
            <p className="text-2xl font-bold font-fredoka">{s.value}</p>
            <p className="text-xs text-white/80">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {[
          { icon: <User className="w-5 h-5" />, label: 'Edit Profile', onClick: () => {} },
          { icon: <Settings className="w-5 h-5" />, label: 'Settings', onClick: () => {} },
          { icon: <Bell className="w-5 h-5" />, label: 'Notifications', onClick: () => {} },
          { icon: <LogOut className="w-5 h-5" />, label: 'Sign Out', onClick: handleLogout, danger: true },
        ].map((item, i) => (
          <motion.button key={i} onClick={item.onClick}
            className={`w-full flex items-center gap-3 p-4 ${i < 3 ? 'border-b border-gray-100' : ''} ${item.danger ? 'text-red-500' : 'text-gray-700'} hover:bg-gray-50 transition-colors`}
            whileHover={{ x: 4 }}>
            {item.icon}
            <span className="font-semibold">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
}
