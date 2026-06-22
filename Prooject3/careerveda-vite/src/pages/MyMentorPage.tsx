import DashboardLayout from '@/components/layout/DashboardLayout';
import { Star, Calendar, Video } from 'lucide-react';

const MENTORS = [
  { name: 'Siddharth Mehta', role: 'Director of Engineering at Razorpay', specialization: 'AI Engineering', rating: 4.9, sessions: 12, avatar: 'SM', available: true },
  { name: 'Sneha Rao', role: 'Principal Architect at AWS', specialization: 'System Design', rating: 4.8, sessions: 8, avatar: 'SR', available: false },
  { name: 'Rajesh Malhotra', role: 'Managing Director at Goldman Sachs', specialization: 'Investment Banking', rating: 4.7, sessions: 6, avatar: 'RM', available: true },
];

const SESSIONS = [
  { topic: 'MLOps Pipeline Design Review', mentor: 'Siddharth Mehta', date: 'Jun 24, 2026', time: '5:00 PM', status: 'Confirmed' },
  { topic: 'System Design Deep Dive', mentor: 'Sneha Rao', date: 'Jun 26, 2026', time: '4:00 PM', status: 'Pending' },
];

export default function MyMentorPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Mentor</h1>
          <p className="text-sm text-slate-500 mt-1">Connect with your mentors and schedule sessions.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">My Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MENTORS.map((mentor, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs">{mentor.avatar}</div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{mentor.name}</h3>
                    <p className="text-[10px] text-slate-400">{mentor.specialization}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-3">{mentor.role}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {mentor.rating}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {mentor.sessions} sessions</span>
                  <span className={`flex items-center gap-1 ${mentor.available ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${mentor.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    {mentor.available ? 'Available' : 'Busy'}
                  </span>
                </div>
                <button className="w-full py-2 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer">
                  Schedule Session
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><Video size={18} className="text-[#6D28D9]" /> Upcoming Mentorship Sessions</h2>
          {SESSIONS.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-700">{session.topic}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{session.mentor} · {session.date} at {session.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${session.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                  {session.status}
                </span>
                <button className="px-3 py-1.5 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold hover:bg-[#5B21B6] cursor-pointer">Join</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
