import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Calendar, MessageSquare, Star, Clock, Video, ChevronRight } from 'lucide-react';

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
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Mentor</h1>
          <p className="text-sm text-slate-500 mt-1">Connect with your mentors and schedule sessions.</p>
        </div>

        {/* Active Mentors */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">My Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MENTORS.map((mentor, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">{mentor.avatar}</div>
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
                <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
                  Schedule Session
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Video size={18} className="text-indigo-500" /> Upcoming Mentorship Sessions</h2>
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
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700">Join</button>
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><MessageSquare size={18} className="text-indigo-500" /> Recent Messages</h2>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { from: 'Siddharth Mehta', message: 'Great progress on the MLOps project! Let\'s discuss the next steps.', time: '2 hours ago' },
              { from: 'Sneha Rao', message: 'Please review the system design materials before our session.', time: '1 day ago' },
            ].map((msg, i) => (
              <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">{msg.from.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-700">{msg.from}</h4>
                    <span className="text-[9px] text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}