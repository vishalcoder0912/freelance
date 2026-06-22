import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar, Star, ChevronRight } from 'lucide-react';
import { getStudentData } from '@/lib/studentData';

const STATUS_COLORS: Record<string, string> = {
  'Interview Scheduled': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Application Reviewed': 'bg-amber-50 text-amber-600 border-amber-100',
  'Assessment Phase': 'bg-blue-50 text-blue-600 border-blue-100',
  'Submitted': 'bg-slate-50 text-slate-600 border-slate-100',
  'Offer': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Rejected': 'bg-red-50 text-rose-600 border-rose-100',
};

export default function MyPlacementPage() {
  const [data, setData] = useState(getStudentData());
  useEffect(() => { setData(getStudentData()); }, []);

  const apps = data.applications || [];
  const interviews = data.interviewSessions || [];
  const interviewCount = interviews.filter(i => i.type.toLowerCase().includes('interview') || i.type.toLowerCase().includes('mock')).length;
  const offers = apps.filter(a => a.status === 'Offer').length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Placement</h1>
          <p className="text-sm text-slate-500 mt-1">Track your job applications and interview pipeline.</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Applications', value: apps.length, color: 'text-[#6D28D9]', bg: 'bg-violet-50' },
            { label: 'Interviews', value: interviewCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Offers', value: offers, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg Match', value: apps.length > 0 ? `${Math.round(apps.reduce((s, a) => s + a.matchScore, 0) / apps.length)}%` : '—', color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border border-slate-100 rounded-2xl p-5 text-center shadow-sm`}>
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {apps.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-800">Applications</h2>
            {apps.map((app, i) => (
              <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {app.company[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{app.company}</h3>
                        <p className="text-xs text-slate-500">{app.role}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${STATUS_COLORS[app.status] || STATUS_COLORS['Submitted']}`}>{app.status}</span>
                        <p className="text-[10px] text-slate-400 mt-1">{app.appliedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Star size={12} className="text-amber-400" /> {app.matchScore}% Match</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {interviews.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><Calendar size={18} className="text-[#6D28D9]" /> Interview Sessions</h2>
            <div className="space-y-3">
              {interviews.map((iv, i) => (
                <div key={iv.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{iv.type}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{iv.date} · Score: {iv.score}/100</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${iv.score >= 80 ? 'bg-emerald-50 text-emerald-600' : iv.score >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-rose-600'}`}>
                    {iv.score >= 80 ? 'Strong' : iv.score >= 60 ? 'Average' : 'Needs Work'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {apps.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500">No applications yet</p>
            <p className="text-xs text-slate-400 mt-1">Browse and apply for jobs from the Jobs page</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}