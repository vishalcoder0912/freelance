import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Briefcase, Users, Calendar, Award, Search, Star, ChevronRight, Plus, Clock, CheckCircle2 } from 'lucide-react';

const CANDIDATES = [
  { name: 'Aditya Sen', role: 'AI Engineer', matchScore: 94, experience: '3 years', status: 'Shortlisted', availability: 'Immediate' },
  { name: 'Rohan Sharma', role: 'ML Engineer', matchScore: 91, experience: '4 years', status: 'Interview Scheduled', availability: '2 weeks' },
  { name: 'Priya Patel', role: 'Data Scientist', matchScore: 88, experience: '2 years', status: 'Reviewed', availability: '1 month' },
  { name: 'Neha Gupta', role: 'Product Manager', matchScore: 85, experience: '3 years', status: 'New', availability: 'Immediate' },
];

const STATUS_COLORS: Record<string, string> = {
  'Shortlisted': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Interview Scheduled': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  'Reviewed': 'bg-amber-50 text-amber-600 border-amber-100',
  'New': 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function RecruiterDashboard() {
  const [search, setSearch] = useState('');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Recruiter Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Post jobs, review candidates, and schedule interviews.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
            <Plus size={14} /> Post New Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Active Jobs', value: '6', icon: Briefcase, color: 'text-indigo-600' },
            { label: 'Total Candidates', value: '48', icon: Users, color: 'text-emerald-600' },
            { label: 'Interviews', value: '12', icon: Calendar, color: 'text-amber-600' },
            { label: 'Placements', value: '3', icon: Award, color: 'text-sky-600' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={20} className={stat.color} />
                  <span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
                </div>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm bg-white" />
          </div>
          <select className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-500">
            <option>All Status</option>
            <option>Shortlisted</option>
            <option>Interview Scheduled</option>
            <option>Reviewed</option>
            <option>New</option>
          </select>
          <select className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-500">
            <option>All Roles</option>
            <option>AI Engineer</option>
            <option>ML Engineer</option>
            <option>Data Scientist</option>
            <option>Product Manager</option>
          </select>
        </div>

        {/* Candidates Table */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Candidate Pipeline</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Match</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Experience</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Availability</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {CANDIDATES.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((candidate, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{candidate.role}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><Star size={12} /> {candidate.matchScore}%</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{candidate.experience}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{candidate.availability}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_COLORS[candidate.status]}`}>{candidate.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Calendar size={18} className="text-indigo-500" /> Upcoming Interviews</h2>
          <div className="space-y-3">
            {[
              { candidate: 'Aditya Sen', role: 'AI Engineer', date: 'Jun 25, 2026', time: '3:00 PM', type: 'Technical' },
              { candidate: 'Rohan Sharma', role: 'ML Engineer', date: 'Jun 26, 2026', time: '11:00 AM', type: 'System Design' },
            ].map((interview, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{interview.candidate} · {interview.role}</h4>
                    <p className="text-[10px] text-slate-400">{interview.date} · {interview.time} · {interview.type}</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700">Join</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}