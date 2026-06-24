/*
 * Layout.tsx - Shared layout wrapper for the main app shell.
 * Renders a sticky header on class pages, a page-transition animation
 * wrapper around child routes, and a bottom navigation bar on mobile.
 * Login, admin, teacher, and parent portals bypass this layout.
 */

import { motion } from 'framer-motion'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, BookOpen, Gamepad2, Award, User, GraduationCap, ChevronLeft, Sparkles } from 'lucide-react'
import { useState } from 'react'

/** Bottom navigation items shown on mobile */
const navItems = [
  { to: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
  { to: '/classes', icon: <BookOpen className="w-5 h-5" />, label: 'Classes' },
  { to: '/games', icon: <Gamepad2 className="w-5 h-5" />, label: 'Games' },
  { to: '/rewards', icon: <Award className="w-5 h-5" />, label: 'Rewards' },
  { to: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
]

/** Routes that trigger the class-level header styling */
const classRoutes = ['/kindergarten', '/nursery', '/lkg', '/ukg']

/**
 * Layout - Root layout component that conditionally renders
 * headers, page transitions, and mobile navigation.
 */
export function Layout() {
  const location = useLocation()
  const isClassPage = classRoutes.some(r => location.pathname.startsWith(r))
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Derive a human-readable page title from the URL path
  const pageTitle = location.pathname.split('/').filter(Boolean).pop() || 'Home'
  const displayTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1).replace(/-/g, ' ')

  // Bypass layout shell for login and portal pages (admin, teacher, parent)
  if (location.pathname === '/login' || location.pathname.startsWith('/admin') || location.pathname.startsWith('/teacher') || location.pathname.startsWith('/parent')) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Class page header with back button and title */}
      {isClassPage && (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavLink to="/classes" className="text-gray-500 hover:text-gray-700">
                <ChevronLeft className="w-6 h-6" />
              </NavLink>
              <GraduationCap className="w-6 h-6 text-kid-blue" />
              <h1 className="text-lg font-bold text-gray-800 font-fredoka">{displayTitle}</h1>
            </div>
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Sparkles className="w-5 h-5 text-kid-orange" />
            </button>
          </div>
        </header>
      )}

      {/* Page content with fade/slide transition */}
      <main className="pb-20 md:pb-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Bottom mobile navigation (hidden on admin/teacher/parent portals) */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/teacher') && !location.pathname.startsWith('/parent') && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-30 md:hidden">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${isActive ? 'text-kid-blue' : 'text-gray-400'}`
                }
              >
                {item.icon}
                <span className="text-[10px] font-semibold">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
