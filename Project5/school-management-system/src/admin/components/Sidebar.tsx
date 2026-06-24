import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, CreditCard, Bus, Calendar, ChevronLeft, Menu, LogOut, School,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/staff', icon: GraduationCap, label: 'Staff' },
  { to: '/admin/fees', icon: CreditCard, label: 'Fees' },
  { to: '/admin/transport', icon: Bus, label: 'Transport' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
]

interface Props {
  onClose?: () => void
}

export function Sidebar({ onClose }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <School className="w-7 h-7 text-kid-blue" />
          {!collapsed && <span className="font-fredoka text-lg text-gray-800">SchoolAdmin</span>}
        </div>
        <button
          onClick={() => { setCollapsed(!collapsed); onClose?.() }}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-kid-blue/10 to-kid-purple/10 text-kid-blue font-bold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-5 h-5 min-w-5" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-kid-red transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 min-w-5" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        {sidebarContent}
      </aside>

      <div className="lg:hidden">
        <button
          className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white shadow-lg border border-gray-200"
          onClick={onClose}
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </>
  )
}
