import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, BookOpen, GraduationCap, FileText, Briefcase, Sparkles, BarChart3, TrendingUp, Shield, DollarSign, Plus, MoreHorizontal } from 'lucide-react';

const RECENT_USERS = [
  { name: 'Rohan Sharma', email: 'rohan@email.com', role: 'Student', status: 'Active', joined: 'Jan 2026' },
  { name: 'Priya Patel', email: 'priya@email.com', role: 'Student', status: 'Active', joined: 'Feb 2026' },
  { name: 'Siddharth Mehta', email: 'sid@email.com', role: 'Mentor', status: 'Active', joined: 'Jan 2026' },
  { name: 'Razorpay Inc.', email: 'hr@razorpay.com', role: 'Recruiter', status: 'Verified', joined: 'Mar 2026' },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Admin ERP</h1>
            <p className="text-sm text-slate-500 mt-1">Manage users, programs, faculty, placements, and analytics.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
            <Plus size={14} /> Quick Action
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: '1,247', icon: Users, change: '+12%', color: 'from-indigo-500 to-indigo-600' },
            { label: 'Active Programs', value: '7', icon: BookOpen, change: '+2', color: 'from-emerald-500 to-emerald-600' },
            { label: 'Faculty', value: '24', icon: GraduationCap, change: '+3', color: 'from-violet-500 to-violet-600' },
            { label: 'Placements', value: '156', icon: Briefcase, change: '+18%', color: 'from-amber-500 to-amber-600' },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={20} className="opacity-80" />
                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">{stat.change}</span>
              </div>
              <p className="text-3xl font-extrabold">{stat.value}</p>
              <p className="text-xs text-white/70 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'User Management', desc: 'Manage students, mentors, and recruiters', icon: Users, count: '1,247 users', color: 'bg-indigo-50 border-indigo-100 text-indigo-600', href: '/admin/users' },
            { title: 'Program Management', desc: 'Create and manage programs and curriculum', icon: BookOpen, count: '7 programs', color: 'bg-emerald-50 border-emerald-100 text-emerald-600', href: '/admin/programs' },
            { title: 'Faculty Management', desc: 'Manage instructor profiles and assignments', icon: GraduationCap, count: '24 faculty', color: 'bg-violet-50 border-violet-100 text-violet-600', href: '/admin/faculty' },
            { title: 'Blog Management', desc: 'Create and manage blog articles', icon: FileText, count: '12 articles', color: 'bg-sky-50 border-sky-100 text-sky-600', href: '/admin/blogs' },
            { title: 'Placement Tracking', desc: 'Track placements and hiring pipeline', icon: Briefcase, count: '156 placed', color: 'bg-amber-50 border-amber-100 text-amber-600', href: '/admin/placements' },
            { title: 'Payments & Revenue', desc: 'Track enrollments and revenue', icon: DollarSign, count: '₹2.4M revenue', color: 'bg-rose-50 border-rose-100 text-rose-600', href: '/admin/payments' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{item.count}</span>
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Manage →</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Users Table */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Users</h2>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Email</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((user, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${user.role === 'Student' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : user.role === 'Mentor' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 text-xs font-bold ${user.status === 'Active' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500" /> Enrollment Trends</h2>
            <div className="flex items-center justify-between">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                <div key={i} className="text-center">
                  <div className="w-6 h-16 bg-slate-100 rounded-full relative overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-indigo-500 rounded-full" style={{ height: `${[40, 55, 45, 70, 65, 80][i]}%` }} />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">{month}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Shield size={18} className="text-indigo-500" /> Platform Health</h2>
            <div className="space-y-3">
              {[
                { label: 'Uptime', value: '99.9%', color: 'text-emerald-600' },
                { label: 'Active Users (24h)', value: '342', color: 'text-indigo-600' },
                { label: 'Avg. Session Duration', value: '24 min', color: 'text-amber-600' },
                { label: 'Completion Rate', value: '87%', color: 'text-emerald-600' },
              ].map((metric, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <span className="text-xs text-slate-500">{metric.label}</span>
                  <span className={`text-xs font-bold ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}