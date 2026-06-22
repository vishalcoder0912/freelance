import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map, Lock, Unlock, CheckCircle2, ArrowLeft, ChevronRight,
  Target, Sparkles, Brain, Code2, BarChart3, LineChart, Briefcase,
  TrendingUp, BookOpen, Play, Clock, Star, Award, GraduationCap, Shield, Trophy, Zap
} from 'lucide-react';
import { PROGRAMS_DATA, PROGRAMS_LIST } from '@/lib/programsData';
import { getProgramLessons, getLessonKey } from '@/lib/lessonsData';
import {
  getStudentData, getCourseProgressPercent, getAttendancePercent,
  getAIScore, getPlacementReadiness, getUnlockedFeatures,
  isLessonCompleted
} from '@/lib/studentData';

const PATH_ICONS: Record<string, any> = {
  'ai-engineering': Brain,
  'data-science-with-gen-ai': BarChart3,
  'data-analytics-with-gen-ai': LineChart,
  'product-management': Target,
  'investment-banking': Briefcase,
  'business-analytics-with-gen-ai': TrendingUp,
};

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState<string | null>(null);

  useEffect(() => {
    const purchased = localStorage.getItem('purchased_program');
    const data = getStudentData();
    if (purchased && PROGRAMS_DATA[purchased]) {
      setActivePath(purchased);
    } else if (data.selectedCareerPath && PROGRAMS_DATA[data.selectedCareerPath]) {
      setActivePath(data.selectedCareerPath);
    } else {
      setActivePath(Object.keys(PROGRAMS_DATA)[0]);
    }
  }, []);

  const purchased = localStorage.getItem('purchased_program');
  const studentData = getStudentData();
  const activeProgram = activePath ? PROGRAMS_DATA[activePath] : null;
  const PathIcon = activePath && PATH_ICONS[activePath] ? PATH_ICONS[activePath] : Map;
  const features = getUnlockedFeatures();
  const coursePct = getCourseProgressPercent();

  if (!activeProgram) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <p className="text-slate-500 text-sm">No programs available.</p>
      </div>
    );
  }

  const totalModules = activeProgram.modules.length;
  const unlockedCount = Math.min(
    Math.max(1, Math.floor((coursePct / 100) * totalModules)),
    totalModules
  );

  const getModuleStatus = (idx: number) => {
    if (idx < unlockedCount - 1) return 'completed';
    if (idx === unlockedCount - 1) return 'current';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Career Roadmap</h1>
              <p className="text-sm text-slate-500">Your progression path to mastery</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Program Selector */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Choose a Path</h3>
            {Object.entries(PROGRAMS_DATA).map(([slug, prog]) => {
              const Icon = PATH_ICONS[slug] || Map;
              const isEnrolled = purchased === slug;
              const isSelected = activePath === slug;
              return (
                <button
                  key={slug}
                  onClick={() => setActivePath(slug)}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {prog.title}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{prog.duration}</p>
                  </div>
                  {isEnrolled && (
                    <span className="shrink-0 bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">Enrolled</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Roadmap Visualization */}
          <div className="lg:col-span-9 space-y-6">
            {/* Program Header Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeProgram.color} flex items-center justify-center text-white shadow-lg`}>
                    <PathIcon size={28} />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">{activeProgram.title}</h2>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-bold text-slate-400">{activeProgram.duration}</span>
                      <span className="text-[10px] text-slate-300">|</span>
                      <span className="text-[10px] font-bold text-emerald-600">{activeProgram.placementRate} Placement</span>
                      <span className="text-[10px] text-slate-300">|</span>
                      <span className="text-[10px] font-bold text-indigo-600">{activeProgram.avgPackage} Avg</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500">Progress</p>
                  <p className="text-2xl font-extrabold text-indigo-600">{coursePct}%</p>
                </div>
              </div>
            </div>

            {/* Skill Tree / Roadmap */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200" />

                <div className="space-y-0">
                  {activeProgram.modules.map((module, idx) => {
                    const status = getModuleStatus(idx);
                    const isFirst = idx === 0;
                    const isLast = idx === totalModules - 1;

                    return (
                      <div key={idx} className="relative flex items-start gap-6 pb-8 last:pb-0">
                        {/* Node circle */}
                        <div className="relative z-10 flex-shrink-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                            status === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                              : status === 'current'
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-100'
                                : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircle2 size={20} />
                            ) : status === 'current' ? (
                              <Play size={18} className="ml-0.5" />
                            ) : (
                              <Lock size={16} />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                          status === 'completed'
                            ? 'bg-emerald-50/50 border-emerald-100'
                            : status === 'current'
                              ? 'bg-indigo-50/50 border-indigo-200 shadow-md'
                              : 'bg-slate-50/50 border-slate-100'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : status === 'current'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-slate-100 text-slate-500'
                              }`}>
                                Level {idx + 1}
                              </span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                status === 'completed'
                                  ? 'text-emerald-500'
                                  : status === 'current'
                                    ? 'text-indigo-500 animate-pulse'
                                    : 'text-slate-400'
                              }`}>
                                {status === 'completed' ? 'Completed' : status === 'current' ? 'In Progress' : 'Locked'}
                              </span>
                            </div>
                            {status === 'current' && activePath && (
                              <button
                                onClick={() => {
                                  if (!purchased) { navigate('/programs'); return; }
                                  const modules = getProgramLessons(activePath);
                                  const mod = modules[idx];
                                  if (!mod) return;
                                  const firstIncomplete = mod.lessons.find(l => !isLessonCompleted(getLessonKey(mod.id, l.id)));
                                  const target = firstIncomplete || mod.lessons[0];
                                  if (target) navigate(`/learn/${activePath}/${mod.id}/${target.id}`);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold rounded-lg transition-all cursor-pointer"
                              >
                                Continue <ChevronRight size={10} className="inline" />
                              </button>
                            )}
                          </div>

                          <h3 className={`text-sm font-bold mb-1 ${
                            status === 'completed' ? 'text-emerald-800' : status === 'current' ? 'text-indigo-900' : 'text-slate-500'
                          }`}>
                            {module}
                          </h3>

                          <p className={`text-[11px] ${
                            status === 'completed' ? 'text-emerald-600/70' : status === 'current' ? 'text-indigo-600/70' : 'text-slate-400'
                          }`}>
                            {status === 'completed' && 'All lessons completed. Ready for next level.'}
                            {status === 'current' && 'Complete lessons, assignments, and projects to advance.'}
                            {status === 'locked' && 'Complete previous level to unlock this module.'}
                          </p>

                          {/* Progress bar for current level */}
                          {status === 'current' && (
                            <div className="mt-3 w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '33%' }} />
                            </div>
                          )}
                        </div>

                        {/* Arrow between levels */}
                        {!isLast && (
                          <div className="absolute -bottom-1 left-[29px] text-slate-300">
                            <ChevronRight size={12} className="rotate-90" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Levels</p>
                <p className="text-xl font-extrabold text-slate-800">{totalModules}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
                <p className="text-xl font-extrabold text-emerald-600">{unlockedCount > 0 ? unlockedCount - 1 : 0}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">In Progress</p>
                <p className="text-xl font-extrabold text-indigo-600">{unlockedCount > 0 ? 1 : 0}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Locked</p>
                <p className="text-xl font-extrabold text-slate-400">{Math.max(0, totalModules - unlockedCount)}</p>
              </div>
            </div>

            {/* Action CTA */}
            {!purchased && (
              <div className="bg-gradient-to-r from-indigo-900 to-violet-950 text-white rounded-3xl p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm">Enroll to track your progress</h3>
                  <p className="text-indigo-200 text-[11px]">Get real-time progression, mentor feedback, and placement eligibility.</p>
                </div>
                <button
                  onClick={() => navigate('/programs')}
                  className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                >
                  View Programs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}