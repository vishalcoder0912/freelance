import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Mail, Lock, LogIn, Sparkles } from 'lucide-react'

const demoAccounts = [
  { email: 'student@school.com', role: 'Student', color: 'from-green-400 to-teal-500' },
  { email: 'parent@school.com', role: 'Parent', color: 'from-blue-400 to-indigo-500' },
  { email: 'teacher@school.com', role: 'Teacher', color: 'from-orange-400 to-red-500' },
  { email: 'admin@school.com', role: 'Admin', color: 'from-purple-400 to-pink-500' },
]

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    const role = email.includes('admin') ? 'admin' : email.includes('teacher') ? 'teacher' : email.includes('parent') ? 'parent' : 'student'
    const paths: Record<string, string> = { admin: '/admin', teacher: '/teacher', parent: '/parent', student: '/' }
    navigate(paths[role])
  }

  const quickLogin = async (e: string) => {
    setEmail(e)
    setPassword('demo123')
    await login(e, 'demo123')
    const role = e.includes('admin') ? 'admin' : e.includes('teacher') ? 'teacher' : e.includes('parent') ? 'parent' : 'student'
    const paths: Record<string, string> = { admin: '/admin', teacher: '/teacher', parent: '/parent', student: '/' }
    navigate(paths[role])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <GraduationCap className="w-16 h-16 text-kid-blue mx-auto" />
          </motion.div>
          <h1 className="text-3xl font-fredoka text-gray-800 mt-4">Welcome Back!</h1>
          <p className="text-gray-500">Sign in to continue learning</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-600 mb-1 block">Email</label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-kid-blue transition-all">
                <Mail className="w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                  placeholder="Enter your email" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600 mb-1 block">Password</label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-kid-blue transition-all">
                <Lock className="w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                  placeholder="Enter your password" required />
              </div>
            </div>
            <motion.button type="submit"
              className="w-full bg-gradient-to-r from-kid-blue to-kid-purple text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <LogIn className="w-5 h-5" /> Sign In
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-kid-yellow" />
              <span className="text-xs font-bold text-gray-500">QUICK DEMO LOGIN</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <motion.button key={acc.email} onClick={() => quickLogin(acc.email)}
                  className={`bg-gradient-to-r ${acc.color} text-white p-3 rounded-xl text-xs font-bold shadow-md`}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {acc.role}
                  <div className="text-[10px] opacity-80 mt-0.5">{acc.email}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
