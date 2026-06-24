import { motion } from 'framer-motion'
import { Bus, MapPin, Users, Shield, Clock, Plus, Search } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const routes = [
  { id: 1, name: 'Route A - Downtown', driver: 'Mr. Sharma', busNo: 'KA-01-1234', capacity: 40, students: 38, status: 'active' as const, stops: 8, time: '7:30 AM - 4:00 PM', color: 'from-blue-400 to-blue-600' },
  { id: 2, name: 'Route B - Suburbs', driver: 'Mr. Patel', busNo: 'KA-01-5678', capacity: 35, students: 32, status: 'active' as const, stops: 6, time: '7:00 AM - 4:30 PM', color: 'from-green-400 to-green-600' },
  { id: 3, name: 'Route C - Riverside', driver: 'Mr. Singh', busNo: 'KA-01-9012', capacity: 30, students: 22, status: 'maintenance' as const, stops: 5, time: '7:45 AM - 3:45 PM', color: 'from-orange-400 to-orange-600' },
  { id: 4, name: 'Route D - Hillside', driver: 'Mr. Kumar', busNo: 'KA-01-3456', capacity: 45, students: 44, status: 'active' as const, stops: 10, time: '6:45 AM - 4:15 PM', color: 'from-purple-400 to-purple-600' },
  { id: 5, name: 'Route E - Lakeview', driver: 'Mr. Joseph', busNo: 'KA-01-7890', capacity: 35, students: 30, status: 'active' as const, stops: 7, time: '7:15 AM - 4:00 PM', color: 'from-teal-400 to-teal-600' },
  { id: 6, name: 'Route F - Eastside', driver: 'Mr. Thomas', busNo: 'KA-01-2468', capacity: 30, students: 15, status: 'inactive' as const, stops: 4, time: '7:30 AM - 3:30 PM', color: 'from-pink-400 to-pink-600' },
]

const drivers = [
  { name: 'Mr. Sharma', experience: '8 years', phone: '+1 234 567 901', route: 'Route A' },
  { name: 'Mr. Patel', experience: '5 years', phone: '+1 234 567 902', route: 'Route B' },
  { name: 'Mr. Singh', experience: '12 years', phone: '+1 234 567 903', route: 'Route C' },
  { name: 'Mr. Kumar', experience: '6 years', phone: '+1 234 567 904', route: 'Route D' },
]

export default function TransportManagement() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8">
      <motion.div variants={container} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <Bus className="w-7 h-7 text-kid-teal" /> Transport Management
          </h1>
          <p className="text-gray-500 font-nunito">School Bus Fleet Management</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-teal to-kid-blue text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" /> Add Route
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Buses" value="10" icon={<Bus className="w-4 h-4" />} color="teal" />
        <StatsCard title="Active Routes" value="6" icon={<MapPin className="w-4 h-4" />} color="blue" />
        <StatsCard title="Students Transported" value="181" icon={<Users className="w-4 h-4" />} color="green" trend="+5" trendUp />
        <StatsCard title="Drivers" value="8" icon={<Shield className="w-4 h-4" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={container} className="lg:col-span-2 space-y-4">
          <h2 className="font-fredoka text-gray-700">Bus Routes</h2>
          {routes.map((route) => (
            <motion.div
              key={route.id}
              variants={container}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${route.color} flex items-center justify-center text-white`}>
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 text-sm">{route.name}</h3>
                    <p className="text-xs text-gray-400">{route.busNo} · {route.driver}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  route.status === 'active' ? 'bg-green-50 text-kid-green' :
                  route.status === 'maintenance' ? 'bg-orange-50 text-kid-orange' : 'bg-gray-100 text-gray-500'
                }`}>
                  {route.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {route.students}/{route.capacity}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {route.stops} stops</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.time}</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(route.students / route.capacity) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full bg-gradient-to-r ${route.color}`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={container} className="space-y-4">
          <h2 className="font-fredoka text-gray-700">Drivers</h2>
          {drivers.map((driver, i) => (
            <motion.div
              key={i}
              variants={container}
              className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kid-teal to-kid-blue flex items-center justify-center text-white font-bold">
                  {driver.name.charAt(4)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">{driver.name}</p>
                  <p className="text-xs text-gray-400">{driver.route}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Exp: {driver.experience}</span>
                <span>{driver.phone}</span>
              </div>
            </motion.div>
          ))}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Track bus by route..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kid-teal/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
