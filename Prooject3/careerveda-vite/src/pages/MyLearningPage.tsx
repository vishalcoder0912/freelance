import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, Play, Clock, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

const COURSES = [
  { title: 'Python Programming & Math Foundations', progress: 100, duration: '4 weeks', completed: true },
  { title: 'Classical Machine Learning with Scikit-Learn', progress: 100, duration: '3 weeks', completed: true },
  { title: 'Neural Networks & Deep Learning Core (PyTorch)', progress: 100, duration: '5 weeks', completed: true },
  { title: 'Natural Language Processing & Computer Vision', progress: 65, duration: '4 weeks', completed: false },
  { title: 'Large Language Models (RAG, Fine-Tuning)', progress: 30, duration: '6 weeks', completed: false },
  { title: 'MLOps, Docker & Containerized Deployments', progress: 0, duration: '4 weeks', completed: false },
];

export default function MyLearningPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Learning</h1>
          <p className="text-sm text-slate-500 mt-1">Track your course progress and continue learning.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Active Courses</h2>
            <span className="text-xs font-medium text-slate-400">{COURSES.filter(c => !c.completed).length} in progress</span>
          </div>

          {COURSES.map((course, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${course.completed ? 'bg-emerald-50 border border-emerald-100' : 'bg-indigo-50 border border-indigo-100'}`}>
                    {course.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <BookOpen size={18} className="text-indigo-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800">{course.title}</h3>
                      <span className="text-xs font-semibold text-slate-400">{course.duration}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${course.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{course.progress}%</span>
                    </div>
                    {!course.completed && course.progress > 0 && (
                      <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                        <Play size={12} /> Continue Learning <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Clock size={18} className="text-indigo-500" /> Upcoming Live Sessions</h2>
          <div className="space-y-3">
            {[
              { title: 'Advanced GenAI Fine-Tuning Patterns', date: 'Today, 6:00 PM', instructor: 'Siddharth Mehta' },
              { title: 'System Design for AI Engineers', date: 'Tomorrow, 4:00 PM', instructor: 'Sneha Rao' },
              { title: 'MLOps Pipeline Workshop', date: 'Fri, 2:00 PM', instructor: 'Dr. Arindam Sen' },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">{session.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{session.date} · {session.instructor}</p>
                </div>
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700">Join</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}