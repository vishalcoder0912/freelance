import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, FolderKanban, Award, Briefcase, 
  Users, MessageSquare, Bell, Search, ChevronDown, LogOut, 
  Menu, X, Brain, User, GraduationCap, Sparkles, Settings,
  BarChart3, FileText, Video, Calendar
} from 'lucide-react';
import { logout, getCurrentUser } from '@/lib/auth';

const sidebarLinks = {
  student: [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'My Learning', icon: BookOpen, href: '/my-learning' },
    { label: 'My Projects', icon: FolderKanban, href: '/my-projects' },
    { label: 'My Certificates', icon: Award, href: '/my-certificates' },
    { label: 'My Placement', icon: Briefcase, href: '/my-placement' },
    { label: 'My Mentor', icon: Users, href: '/my-mentor' },
    { label: 'AI Copilot', icon: Brain, href: '/ai-copilot' },
  ],
  mentor: [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/mentor' },
    { label: 'My Students', icon: Users, href: '/mentor/students' },
    { label: 'Sessions', icon: Video, href: '/mentor/sessions' },
    { label: 'Assignments', icon: FileText, href: '/mentor/assignments' },
    { label: 'Feedback', icon: MessageSquare, href: '/mentor/feedback' },
    { label: 'Reports', icon: BarChart3, href: '/mentor/reports' },
  ],
  recruiter: [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/recruiter' },
    { label: 'Post Jobs', icon: Briefcase, href: '/recruiter/jobs' },
    { label: 'Candidates', icon: Users, href: '/recruiter/candidates' },
    { label: 'Interviews', icon: Calendar, href: '/recruiter/interviews' },
    { label: 'Shortlist', icon: Award, href: '/recruiter/shortlist' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Programs', icon: BookOpen, href: '/admin/programs' },
    { label: 'Faculty', icon: GraduationCap, href: '/admin/faculty' },
    { label: 'Blogs', icon: FileText, href: '/admin/blogs' },
    { label: 'Placements', icon: Briefcase, href: '/admin/placements' },
    { label: 'Applications', icon: FileText, href: '/admin/applications' },
    { label: 'Payments', icon: Sparkles, href: '/admin/payments' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  ],
};

type PortalType = 'student' | 'mentor' | 'recruiter' | 'admin';

function getPortalType(pathname: string): PortalType {
  if (pathname.startsWith('/mentor')) return 'mentor';
  if (pathname.startsWith('/recruiter')) return 'recruiter';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'student';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const portalType = getPortalType(location.pathname);
  const links = sidebarLinks[portalType];

  const storedUser = getCurrentUser();
  const displayName = storedUser?.name || 'User';
  const displayEmail = storedUser?.email || 'user@email.com';
  const displayRole = storedUser?.role || portalType;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Brain size={16} />
              </div>
              <span className="font-bold text-sm text-slate-800">
                Career<span className="text-indigo-600">Veda</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-slate-100">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <LogOut size={18} />
              <span>Back to Website</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-64 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800">{displayName}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{displayRole}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-20 p-2">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-800">{displayName}</p>
                      <p className="text-[10px] text-slate-400">{displayEmail}</p>
                    </div>
                    <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                      <Settings size={14} /> Settings
                    </Link>
                    <button
                      onClick={() => { logout(); navigate('/login'); }}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}