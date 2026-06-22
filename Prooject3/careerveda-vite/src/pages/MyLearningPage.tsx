import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, Play, CheckCircle, Clock, ChevronRight, BarChart3, Calendar } from 'lucide-react';
import { getStudentData, getCourseProgressPercent, getAttendancePercent, getFirstIncompleteLessonKey, isLessonCompleted } from '@/lib/studentData';
import { PROGRAMS_DATA } from '@/lib/programsData';
import { getProgramLessons, getLessonKey } from '@/lib/lessonsData';

export default function MyLearningPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(getStudentData());
  const coursePct = getCourseProgressPercent();
  const attPct = getAttendancePercent();
  const purchasedSlug = localStorage.getItem('purchased_program');
  const program = purchasedSlug ? PROGRAMS_DATA[purchasedSlug] : null;
  const modules = purchasedSlug ? getProgramLessons(purchasedSlug) : [];

  useEffect(() => { setData(getStudentData()); }, []);

  const resumeLink = () => {
    if (!purchasedSlug) return '/dashboard';
    const key = getFirstIncompleteLessonKey(purchasedSlug, modules);
    if (!key) return '/my-certificates';
    const [_, modId, lesId] = key.split('-');
    return `/learn/${purchasedSlug}/${modId}-${modId.includes('m') ? '' : ''}`;
  };

  // Fix: reconstruct lesson path
  const getResumePath = () => {
    if (!purchasedSlug) return '/dashboard';
    const lessons = getProgramLessons(purchasedSlug);
    for (const mod of lessons) {
      for (const les of mod.lessons) {
        const key = `${purchasedSlug}-${mod.id}-${les.id}`;
        if (!data.learning.lessonProgress[key]) {
          return `/learn/${purchasedSlug}/${mod.id}/${les.id}`;
        }
      }
    }
    return '/my-certificates';
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Learning</h1>
          <p className="text-sm text-slate-500 mt-1">Track your course progress and continue learning</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Course Progress', value: `${coursePct}%`, icon: BarChart3, color: 'text-blue-500 bg-blue-50' },
            { label: 'Lessons Done', value: `${data.courseProgress.lessonsCompleted}/${data.courseProgress.totalLessons || modules.reduce((s, m) => s + m.lessons.length, 0)}`, icon: BookOpen, color: 'text-violet-500 bg-violet-50' },
            { label: 'Attendance', value: `${attPct}%`, icon: Calendar, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Assignments', value: `${data.courseProgress.assignmentsSubmitted}/${data.courseProgress.totalAssignments}`, icon: Clock, color: 'text-amber-500 bg-amber-50' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`${s.color.split(' ')[1]} border border-slate-100 rounded-2xl p-4 shadow-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={s.color.split(' ')[0]} />
                  <span className="text-[10px] font-bold text-slate-500">{s.label}</span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              </div>
            );
          })}
        </div>

        {!program ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Enroll in a program to begin learning</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">Choose a CareerVeda program and start your journey</p>
            <button onClick={() => navigate('/programs')} className="px-6 py-2.5 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer">
              Browse Programs
            </button>
          </div>
        ) : (
          <>
            {/* Current Program */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{program.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{program.duration} · {program.modules.length} modules</p>
                </div>
                <button onClick={() => navigate(getResumePath())} className="px-5 py-2.5 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer flex items-center gap-1.5">
                  <Play size={14} /> Continue
                </button>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#6D28D9] h-full rounded-full transition-all" style={{ width: `${coursePct}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">{coursePct}% complete</p>
            </div>

            {/* Module List */}
            <div className="space-y-3">
              {modules.map((mod, idx) => {
                const done = mod.lessons.filter(l => isLessonCompleted(getLessonKey(mod.id, l.id))).length;
                const modPct = mod.lessons.length > 0 ? Math.round((done / mod.lessons.length) * 100) : 0;
                return (
                  <div key={mod.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Module {idx + 1}</p>
                        <h3 className="text-sm font-bold text-slate-800 mt-0.5">{mod.title}</h3>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{done}/{mod.lessons.length}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div className={`h-full rounded-full ${modPct === 100 ? 'bg-emerald-500' : 'bg-[#6D28D9]'}`} style={{ width: `${modPct}%` }} />
                    </div>
                    <div className="space-y-1">
                      {mod.lessons.map((les) => {
                        const lKey = `${purchasedSlug}-${mod.id}-${les.id}`;
                        const lDone = data.learning.lessonProgress[lKey];
                        return (
                          <button key={les.id} onClick={() => navigate(`/learn/${purchasedSlug}/${mod.id}/${les.id}`)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer">
                            {lDone ? <CheckCircle size={14} className="text-emerald-500 shrink-0" /> : <Play size={12} className="text-[#6D28D9] ml-0.5 shrink-0" />}
                            <span className={`text-xs flex-1 ${lDone ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{les.title}</span>
                            <span className="text-[9px] text-slate-400">{les.duration}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

