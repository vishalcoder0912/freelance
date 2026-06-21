import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Video, FileText, MessageSquare, BarChart3, Calendar, Star, TrendingUp, ArrowRight } from 'lucide-react';

const STUDENTS = [
  { name: 'Rohan Sharma', course: 'AI Engineering', progress: 66, lastSession: '2 days ago', attendance: 94, score: 87 },
  { name: 'Priya Patel', course: 'Data Science', progress: 45, lastSession: '1 day ago', attendance: 88, score: 82 },
  { name: 'Aditya Sen', course: 'AI Engineering', progress: 80, lastSession: 'Today', attendance: 96, score: 91 },
  { name: 'Neha Gupta', course: 'Product Management', progress: 55, lastSession: '3 days ago', attendance: 85, score: 78 },
];

export default function MentorDashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mentor Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your students, sessions, and feedback.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Active Students', value: '24', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
            { label: 'Sessions This Month', value: '18', icon: Video, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Assignments to Review', value: '12', icon: FileText, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { label: 'Avg. Student Score', value: '87%', icon: TrendingUp, color: 'text-sky-600 bg-sky-50 border-sky-100' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Students Table */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">My Students</h2>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Student</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Course</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Progress</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Last Session</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Attendance</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Score</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((student, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{student.course}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{student.lastSession}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${student.attendance >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{student.attendance}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${student.score >= 85 ? 'text-emerald-600' : student.score >= 75 ? 'text-amber-600' : 'text-slate-500'}`}>{student.score}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Calendar size={18} className="text-indigo-500" /> Today's Sessions</h2>
              <span className="text-xs font-medium text-slate-400">3 sessions</span>
            </div>
            <div className="space-y-3">
              {[
                { student: 'Priya Patel', time: '4:00 PM', topic: 'Data Science Q&A' },
                { student: 'Aditya Sen', time: '5:30 PM', topic: 'MLOps Review' },
                { student: 'Neha Gupta', time: '7:00 PM', topic: 'Product Strategy' },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-700">{session.student}</p>
                    <p className="text-[10px] text-slate-400">{session.topic} at {session.time}</p>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700">Join</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><MessageSquare size={18} className="text-indigo-500" /> Recent Feedback</h2>
              <button className="text-xs font-semibold text-indigo-600">View All</button>
            </div>
            <div className="space-y-3">
              {[
                { student: 'Rohan Sharma', type: 'Assignment Review', grade: 'A', date: '2 hours ago' },
                { student: 'Priya Patel', type: 'Mock Interview', grade: 'B+', date: '1 day ago' },
              ].map((fb, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-700">{fb.student}</p>
                    <p className="text-[10px] text-slate-400">{fb.type} · {fb.date}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100">{fb.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}