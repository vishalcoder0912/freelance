import DashboardLayout from '@/components/layout/DashboardLayout';
import { Briefcase, Building2, Calendar, Star, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const APPLICATIONS = [
  { company: 'Razorpay', role: 'AI Engineer', status: 'Interview Scheduled', date: 'Jun 25, 2026', matchScore: 91, logo: 'R' },
  { company: 'Swiggy', role: 'Machine Learning Engineer', status: 'Application Reviewed', date: 'Jun 20, 2026', matchScore: 87, logo: 'S' },
  { company: 'Google', role: 'Data Scientist', status: 'Assessment Phase', date: 'Jun 15, 2026', matchScore: 82, logo: 'G' },
  { company: 'Microsoft', role: 'AI Engineer', status: 'Submitted', date: 'Jun 10, 2026', matchScore: 78, logo: 'M' },
];

const STATUS_COLORS: Record<string, string> = {
  'Interview Scheduled': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Application Reviewed': 'bg-amber-50 text-amber-600 border-amber-100',
  'Assessment Phase': 'bg-blue-50 text-blue-600 border-blue-100',
  'Submitted': 'bg-slate-50 text-slate-600 border-slate-100',
};

export default function MyPlacementPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Placement</h1>
          <p className="text-sm text-slate-500 mt-1">Track your job applications and interview pipeline.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Applications', value: '12', color: 'text-indigo-600' },
            { label: 'Interviews', value: '4', color: 'text-emerald-600' },
            { label: 'Offers', value: '0', color: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 text-center">
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Active Applications</h2>
          {APPLICATIONS.map((app, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                  {app.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{app.company}</h3>
                      <p className="text-xs text-slate-500">{app.role}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                      <p className="text-[10px] text-slate-400 mt-1">{app.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-xs text-slate-500"><Star size={12} className="text-amber-400" /> {app.matchScore}% Match</span>
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View Details <ChevronRight size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Calendar size={18} className="text-indigo-500" /> Upcoming Interviews</h2>
          <div className="space-y-3">
            {[
              { company: 'Razorpay', role: 'AI Engineer', date: 'Jun 25, 2026', time: '3:00 PM', type: 'Technical' },
              { company: 'Swiggy', role: 'ML Engineer', date: 'Jun 28, 2026', time: '11:00 AM', type: 'System Design' },
            ].map((interview, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{interview.role} at {interview.company}</h4>
                    <p className="text-[10px] text-slate-400">{interview.date} · {interview.time} · {interview.type}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700">Prepare</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}