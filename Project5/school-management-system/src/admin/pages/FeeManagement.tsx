// File: FeeManagement — Admin fee tracking with collection stats, progress bar, search, and a table of fee records with payment status.
import { motion } from 'framer-motion'
import { CreditCard, DollarSign, TrendingUp, Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const feeRecords = [
  { id: 1, student: 'Emma Wilson', class: 'Kindergarten A', fee: 15000, paid: 15000, due: '2025-04-10', status: 'paid' as const, method: 'Online' },
  { id: 2, student: 'Liam Brown', class: 'Kindergarten A', fee: 15000, paid: 10000, due: '2025-04-10', status: 'partial' as const, method: 'Cash' },
  { id: 3, student: 'Sophia Davis', class: 'Kindergarten B', fee: 15000, paid: 0, due: '2025-04-10', status: 'unpaid' as const, method: '' },
  { id: 4, student: 'Noah Miller', class: 'Nursery A', fee: 12000, paid: 12000, due: '2025-04-10', status: 'paid' as const, method: 'Online' },
  { id: 5, student: 'Olivia Garcia', class: 'LKG A', fee: 13500, paid: 13500, due: '2025-04-10', status: 'paid' as const, method: 'Card' },
  { id: 6, student: 'Ethan Martinez', class: 'UKG A', fee: 13500, paid: 5000, due: '2025-04-10', status: 'partial' as const, method: 'Online' },
  { id: 7, student: 'Ava Anderson', class: 'Kindergarten A', fee: 15000, paid: 0, due: '2025-04-10', status: 'unpaid' as const, method: '' },
  { id: 8, student: 'Mason Thomas', class: 'Nursery B', fee: 12000, paid: 12000, due: '2025-04-10', status: 'paid' as const, method: 'Cash' },
]

const statusConfig = {
  paid: { label: 'Paid', color: 'text-kid-green bg-green-50', icon: CheckCircle },
  partial: { label: 'Partial', color: 'text-kid-orange bg-orange-50', icon: Clock },
  unpaid: { label: 'Unpaid', color: 'text-kid-red bg-red-50', icon: AlertCircle },
}

export default function FeeManagement() {
  // Compute totals and collection rate from fee records
  const totalFee = feeRecords.reduce((a, b) => a + b.fee, 0)
  const totalPaid = feeRecords.reduce((a, b) => a + b.paid, 0)
  const totalDue = totalFee - totalPaid
  const collectionRate = Math.round((totalPaid / totalFee) * 100)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header with export button */}
      <motion.div variants={container} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-kid-orange" /> Fee Management
          </h1>
          <p className="text-gray-500 font-nunito">Academic Year 2024-2025</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-orange to-kid-pink text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" /> Export Report
        </motion.button>
      </motion.div>

      {/* Summary stat cards: total fee, collected, pending, defaulters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Fee" value={`₹${(totalFee / 100000).toFixed(1)}L`} icon={<DollarSign className="w-4 h-4" />} color="blue" />
        <StatsCard title="Collected" value={`₹${(totalPaid / 100000).toFixed(1)}L`} icon={<TrendingUp className="w-4 h-4" />} color="green" trend={`${collectionRate}%`} trendUp />
        <StatsCard title="Pending" value={`₹${(totalDue / 100000).toFixed(1)}L`} icon={<AlertCircle className="w-4 h-4" />} color="red" />
        <StatsCard title="Defaulters" value={feeRecords.filter(r => r.status === 'unpaid').length.toString()} icon={<AlertCircle className="w-4 h-4" />} color="orange" />
      </div>

      <motion.div variants={container} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-fredoka text-gray-700">Collection Progress</h2>
          <span className="text-sm font-bold text-gray-500">{collectionRate}%</span>
        </div>
        <ProgressBar value={collectionRate} color="bg-gradient-to-r from-kid-orange to-kid-pink" size="md" />
        <p className="text-xs text-gray-400 mt-2">₹{totalPaid.toLocaleString()} collected out of ₹{totalFee.toLocaleString()}</p>
      </motion.div>

      <motion.div variants={container} className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by student name or class..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kid-orange/30 text-sm" />
        </div>
      </motion.div>

      <motion.div variants={container} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-gray-500 font-semibold">Student</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Class</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Fee</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Paid</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Balance</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Due Date</th>
                <th className="text-left p-4 text-gray-500 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((record) => {
                const config = statusConfig[record.status]
                const ConfigIcon = config.icon
                return (
                  <motion.tr key={record.id} variants={container} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-700">{record.student}</td>
                    <td className="p-4 text-gray-600">{record.class}</td>
                    <td className="p-4 text-gray-700">₹{record.fee.toLocaleString()}</td>
                    <td className="p-4 text-gray-700">₹{record.paid.toLocaleString()}</td>
                    <td className="p-4 font-bold text-gray-800">₹{(record.fee - record.paid).toLocaleString()}</td>
                    <td className="p-4 text-gray-500">{record.due}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit ${config.color}`}>
                        <ConfigIcon className="w-3 h-3" /> {config.label}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
