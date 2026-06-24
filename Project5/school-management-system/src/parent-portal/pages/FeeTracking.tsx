import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Printer } from 'lucide-react'
import { ProgressBar } from '../../shared/components/ProgressBar'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const feeSummary = {
  totalFee: 45000,
  paid: 35000,
  due: 10000,
  nextDue: '2025-07-15',
  status: 'partial' as const,
}

const paymentHistory = [
  { id: 1, date: '2025-04-10', description: 'Tuition Fee (Q2)', amount: 15000, status: 'completed' as const, method: 'Online Transfer' },
  { id: 2, date: '2025-01-15', description: 'Tuition Fee (Q1)', amount: 15000, status: 'completed' as const, method: 'Credit Card' },
  { id: 3, date: '2024-10-10', description: 'Tuition Fee (Q4)', amount: 15000, status: 'completed' as const, method: 'Online Transfer' },
  { id: 4, date: '2024-07-10', description: 'Tuition Fee (Q3)', amount: 15000, status: 'completed' as const, method: 'Cash' },
  { id: 5, date: '2025-06-01', description: 'Activity Fee', amount: 5000, status: 'pending' as const, method: '' },
  { id: 6, date: '2025-06-15', description: 'Transport Fee (Jun)', amount: 5000, status: 'overdue' as const, method: '' },
]

const statusColors = {
  completed: 'text-kid-green bg-green-50 border-green-200',
  pending: 'text-kid-orange bg-orange-50 border-orange-200',
  overdue: 'text-kid-red bg-red-50 border-red-200',
}

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  overdue: AlertCircle,
}

export default function FeeTracking() {
  const paidPercent = Math.round((feeSummary.paid / feeSummary.totalFee) * 100)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={card} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-kid-green" /> Fee Tracking
          </h1>
          <p className="text-gray-500 font-nunito">Academic Year 2024-2025</p>
        </div>
        <div className="flex gap-2">
          <motion.button className="p-2 rounded-xl border border-gray-200 text-gray-500" whileHover={{ scale: 1.05 }}><Printer className="w-4 h-4" /></motion.button>
          <motion.button className="p-2 rounded-xl border border-gray-200 text-gray-500" whileHover={{ scale: 1.05 }}><Download className="w-4 h-4" /></motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500 font-semibold">Total Fee</p>
          <p className="text-3xl font-bold text-gray-800 font-fredoka">₹{feeSummary.totalFee.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500 font-semibold">Paid Amount</p>
          <p className="text-3xl font-bold text-kid-green font-fredoka">₹{feeSummary.paid.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500 font-semibold">Balance Due</p>
          <p className="text-3xl font-bold text-kid-red font-fredoka">₹{feeSummary.due.toLocaleString()}</p>
        </motion.div>
      </div>

      <motion.div variants={card} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-fredoka text-gray-700">Payment Progress</h2>
          <span className="text-sm font-bold text-gray-500">{paidPercent}%</span>
        </div>
        <ProgressBar value={paidPercent} color="bg-gradient-to-r from-kid-green to-kid-teal" size="md" />
        <p className="text-xs text-gray-400 mt-2">Next payment due: {feeSummary.nextDue}</p>
      </motion.div>

      <motion.div variants={card} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <h2 className="font-fredoka text-gray-700 p-5 pb-3">Payment History</h2>
        <div className="divide-y divide-gray-100">
          {paymentHistory.map((payment) => {
            const StatusIcon = statusIcons[payment.status]
            return (
              <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${statusColors[payment.status]}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{payment.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{payment.date}</span>
                      {payment.method && <span>· {payment.method}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${payment.status === 'overdue' ? 'text-kid-red' : 'text-gray-800'}`}>₹{payment.amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-semibold capitalize ${payment.status === 'completed' ? 'text-kid-green' : payment.status === 'pending' ? 'text-kid-orange' : 'text-kid-red'}`}>{payment.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
