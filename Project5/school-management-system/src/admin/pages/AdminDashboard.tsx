// File: AdminDashboard — School-wide admin overview with fee collection chart, upcoming events, transport status, attendance, and quick stats.
import { motion } from 'framer-motion'
import { Users, GraduationCap, CreditCard, Bus, Calendar, DollarSign, School } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const feeCollectionData = [
  { month: 'Jan', collected: 450000, pending: 50000 },
  { month: 'Feb', collected: 480000, pending: 35000 },
  { month: 'Mar', collected: 500000, pending: 25000 },
  { month: 'Apr', collected: 420000, pending: 60000 },
  { month: 'May', collected: 510000, pending: 20000 },
  { month: 'Jun', collected: 490000, pending: 30000 },
]

const upcomingEvents = [
  { id: 1, title: 'Parent-Teacher Meeting', date: '2025-06-28', type: 'important' as const },
  { id: 2, title: 'Annual Day Rehearsal', date: '2025-07-10', type: 'upcoming' as const },
  { id: 3, title: 'Summer Camp Starts', date: '2025-07-20', type: 'info' as const },
  { id: 4, title: 'Staff Workshop', date: '2025-06-30', type: 'important' as const },
]

const transportStatus = [
  { route: 'Route A - Downtown', buses: 3, active: 3 },
  { route: 'Route B - Suburbs', buses: 2, active: 2 },
  { route: 'Route C - Riverside', buses: 2, active: 1 },
  { route: 'Route D - Hillside', buses: 3, active: 3 },
]

export default function AdminDashboard() {
  // Aggregate fee collection totals and compute collection percentage
  const totalCollected = feeCollectionData.reduce((a, b) => a + b.collected, 0)
  const totalPending = feeCollectionData.reduce((a, b) => a + b.pending, 0)
  const feePercent = Math.round((totalCollected / (totalCollected + totalPending)) * 100)
  // Maximum monthly collected amount for scaling the bar chart
  const maxFee = Math.max(...feeCollectionData.map(d => d.collected))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Welcome header */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 font-nunito">Welcome back! Here's your school overview.</p>
      </motion.div>

      {/* Top-level stat cards: total students, staff, classes, fee collection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Students" value="486" icon={<Users className="w-5 h-5" />} color="blue" trend="+12%" trendUp />
        <StatsCard title="Staff Members" value="48" icon={<GraduationCap className="w-5 h-5" />} color="green" trend="+2 new" trendUp />
        <StatsCard title="Total Classes" value="18" icon={<School className="w-5 h-5" />} color="orange" trend="" />
        <StatsCard title="Fee Collection" value={`₹${(totalCollected / 100000).toFixed(1)}L`} icon={<CreditCard className="w-5 h-5" />} color="purple" trend={`${feePercent}%`} trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Fee Collection bar chart — shows monthly collected amounts with animated bars */}
        <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-kid-green" /> Fee Collection Summary</h2>
          <div className="flex items-end gap-2 h-48 mb-4">
            {feeCollectionData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center justify-end h-40">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.collected / maxFee) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="w-full rounded-t bg-gradient-to-t from-kid-green to-kid-teal"
                    style={{ minHeight: `${(d.collected / maxFee) * 40}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{d.month}</span>
                <span className="text-[9px] text-gray-400">₹{(d.collected / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Collected: <strong className="text-kid-green">₹{totalCollected.toLocaleString()}</strong></span>
            <span className="text-gray-500">Pending: <strong className="text-kid-red">₹{totalPending.toLocaleString()}</strong></span>
          </div>
        </motion.div>

        {/* Sidebar: upcoming events list and transport status overview */}
        <motion.div variants={item} className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-kid-orange" /> Upcoming Events</h2>
            <div className="space-y-2">
              {upcomingEvents.map((ev) => {
                const colors = {
                  important: 'border-l-4 border-l-kid-red bg-red-50',
                  upcoming: 'border-l-4 border-l-kid-blue bg-blue-50',
                  info: 'border-l-4 border-l-kid-green bg-green-50',
                }
                return (
                  <div key={ev.id} className={`p-3 rounded-xl ${colors[ev.type]}`}>
                    <p className="text-sm font-bold text-gray-700">{ev.title}</p>
                    <p className="text-xs text-gray-500">{ev.date}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h2 className="font-fredoka text-gray-700 mb-3 flex items-center gap-2"><Bus className="w-4 h-4 text-kid-teal" /> Transport Status</h2>
            <div className="space-y-2">
              {transportStatus.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{t.route}</p>
                    <p className="text-xs text-gray-400">{t.buses} buses</p>
                  </div>
                  <span className={`text-xs font-bold ${t.active === t.buses ? 'text-kid-green' : 'text-kid-orange'}`}>
                    {t.active}/{t.buses} Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row: gender distribution quick stats and attendance per class level */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-3">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-xs text-gray-500">Boys</p>
              <p className="text-xl font-bold text-kid-blue">258</p>
              <ProgressBar value={53} color="bg-gradient-to-r from-kid-blue to-kid-indigo" size="sm" />
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50">
              <p className="text-xs text-gray-500">Girls</p>
              <p className="text-xl font-bold text-kid-pink">228</p>
              <ProgressBar value={47} color="bg-gradient-to-r from-kid-pink to-kid-purple" size="sm" />
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-teal-50">
              <p className="text-xs text-gray-500">Teachers</p>
              <p className="text-xl font-bold text-kid-green">32</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
              <p className="text-xs text-gray-500">Staff</p>
              <p className="text-xl font-bold text-kid-orange">16</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h2 className="font-fredoka text-gray-700 mb-3">Attendance Overview</h2>
          <div className="space-y-3">
            {['Kindergarten', 'Nursery', 'LKG', 'UKG'].map((level, i) => {
              const pct = [94, 91, 88, 92][i]
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="font-semibold text-gray-600">{level}</span>
                    <span className="font-bold text-gray-700">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color={['from-kid-pink to-kid-purple', 'from-kid-blue to-kid-green', 'from-kid-orange to-kid-pink', 'from-kid-green to-kid-teal'][i]} size="sm" />
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
