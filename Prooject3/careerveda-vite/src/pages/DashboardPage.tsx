import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain, LayoutDashboard, Map, MessageSquare, Award,
  UserCheck, Briefcase, Users, LogOut, Bell, Menu, X,
  TrendingUp, Star, Sparkles, CheckCircle2, ChevronRight, BookOpen, Building2, Clock, Check, Loader2, ArrowRight,
  Target, Upload, FileText, Shield, Lock, Unlock, Mail,
  Home, Layers, ClipboardList, Terminal, GraduationCap, Send, Calendar, Trophy, Play, BarChart3, RefreshCw
} from 'lucide-react';
import { PROGRAMS_DATA, PROGRAMS_LIST } from '@/lib/programsData';
import { getProgramLessons, getLessonKey } from '@/lib/lessonsData';
import type { StudentData } from '@/lib/studentData';
import {
  getStudentData, completeOnboardingStep as completeStep,
  getOnboardingProgress, isOnboardingComplete, getCourseProgressPercent,
  getAttendancePercent, getAIScore, getPlacementReadiness, getPlacementTier,
  isPlacementLocked, getUnlockedFeatures, getOnboardingStepLabel,
  getOnboardingStepNav, updateStudentData, simulateWeeklyProgress,
  isLessonCompleted
} from '@/lib/studentData';

interface OnboardingStep {
  key: keyof StudentData['onboarding'];
  done: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [purchasedSlug, setPurchasedSlug] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('careerveda_user');
    if (raw) setUser(JSON.parse(raw));
    setData(getStudentData());
    setPurchasedSlug(localStorage.getItem('purchased_program'));
    setLoading(false);
  }, []);

  const refreshData = () => setData(getStudentData());

  const handleCompleteStep = (key: keyof StudentData['onboarding']) => {
    completeStep(key);
    refreshData();
    setNotification('\u2713 ' + getOnboardingStepLabel(key) + ' completed!');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem('careerveda_user');
    navigate('/login');
  };

  const handleUnlockPathway = (slug: string) => {
    setIsPurchasing(slug);
    setTimeout(() => {
      setIsPurchasing(null);
      setPurchaseSuccess(true);
      localStorage.setItem('purchased_program', slug);
      setPurchasedSlug(slug);
      setTimeout(() => setPurchaseSuccess(false), 1500);
    }, 2000);
  };

  const handleResetProgram = () => {
    localStorage.removeItem('purchased_program');
    setPurchasedSlug(null);
  };

  const getFirstIncompleteLessonLink = (): string | null => {
    if (!purchasedSlug) return null;
    const modules = getProgramLessons(purchasedSlug);
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (!isLessonCompleted(getLessonKey(mod.id, lesson.id))) {
          return `/learn/${purchasedSlug}/${mod.id}/${lesson.id}`;
        }
      }
    }
    return null;
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const activeProgram = purchasedSlug ? PROGRAMS_DATA[purchasedSlug] : null;
  const onboardingProgress = getOnboardingProgress();
  const onboardingDone = isOnboardingComplete();
  const coursePct = getCourseProgressPercent();
  const attPct = getAttendancePercent();
  const aiScore = getAIScore();
  const placementScore = getPlacementReadiness();
  const placementTier = getPlacementTier(placementScore);
  const features = getUnlockedFeatures();
  const locked = isPlacementLocked();

  const onboardingStepKeys: OnboardingStep[] = [
    { key: 'emailVerified', done: data.onboarding.emailVerified },
    { key: 'profileCompleted', done: data.onboarding.profileCompleted },
    { key: 'resumeUploaded', done: data.onboarding.resumeUploaded },
    { key: 'careerAssessmentTaken', done: data.onboarding.careerAssessmentTaken },
    { key: 'careerPathSelected', done: data.onboarding.careerPathSelected },
  ];

  const sidebarGroups = [
    {
      label: null,
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true, locked: false },
        { label: 'My Learning', icon: BookOpen, href: '/my-learning', locked: false },
        { label: 'Assignments', icon: ClipboardList, href: '/my-projects', locked: false },
        { label: 'Projects', icon: Terminal, href: '/my-projects', locked: false },
        { label: 'Certificates', icon: Award, href: '/my-certificates', locked: false },
      ]
    },
    {
      label: 'AI Tools',
      items: [
        { label: 'AI Copilot', icon: MessageSquare, href: '/ai-copilot', locked: !features.includes('ai-copilot') },
        { label: 'Resume Analyzer', icon: FileText, href: '/resume-analyzer', locked: !features.includes('resume-analyzer') },
        { label: 'Interview Coach', icon: UserCheck, href: '/interview-coach', locked: !features.includes('mock-interview') },
      ]
    },
    {
      label: 'Career',
      items: [
        { label: 'Career Paths', icon: Map, href: '/career-paths', locked: false },
        { label: 'Jobs', icon: Briefcase, href: '/programs', locked: !features.includes('placement-portal') },
        { label: 'Applications', icon: Send, href: '/my-placement', locked: !features.includes('placement-portal') },
      ]
    },
    {
      label: null,
      items: [
        { label: 'Community', icon: Users, href: '#', locked: false },
        { label: 'Faculty', icon: GraduationCap, href: '/faculty', locked: false },
        { label: 'Employers', icon: Building2, href: '/employers', locked: false },
      ]
    }
  ];

  const metricCards = [
    { label: 'Course Progress', value: coursePct + '%', sub: (data.courseProgress.lessonsCompleted + data.courseProgress.assignmentsSubmitted + data.courseProgress.projectsCompleted) + '/' + (data.courseProgress.totalLessons + data.courseProgress.totalAssignments + data.courseProgress.totalProjects) + ' items', icon: BookOpen, color: 'blue' },
    { label: 'Attendance', value: attPct + '%', sub: data.attendance.attended + '/' + data.attendance.total + ' classes', icon: Calendar, color: 'emerald' },
    { label: 'AI Score', value: aiScore !== null ? aiScore + '/100' : 'N/A', sub: aiScore !== null ? 'From resume, interviews & assignments' : 'Complete activities to generate', icon: Brain, color: 'violet' },
    { label: 'Placement Readiness', value: placementScore + '/100', sub: placementTier, icon: Shield, color: 'amber' },
  ];

  const getMetricStyle = (color: string, val: number) => {
    if (val === 0 && color !== 'amber') return { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-400', icon: 'text-slate-300', badge: 'bg-slate-100 text-slate-500' };
    const styles: Record<string, any> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
      violet: { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', icon: 'text-violet-500', badge: 'bg-violet-100 text-violet-700' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
    };
    return styles[color] || styles.blue;
  };

  const programModules = activeProgram?.modules || [];
  const moduleProgress = Math.min(data.courseProgress.lessonsCompleted, programModules.length);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800 font-sans relative">

      {/* Notification toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-in slide-in-from-right-2 duration-200 flex items-center gap-2">
          <CheckCircle2 size={16} />
          {notification}
        </div>
      )}

      {/* Checkout overlay */}
      {isPurchasing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mx-auto text-violet-600">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800">Processing Enrollment</h3>
              <p className="text-slate-500 text-xs">Registering your account to the pathway...</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-left">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Selected Track</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{PROGRAMS_DATA[isPurchasing]?.title}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">{PROGRAMS_DATA[isPurchasing]?.price}</span>
            </div>
          </div>
        </div>
      )}

      {purchaseSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={32} className="animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800">Pathway Unlocked!</h3>
              <p className="text-slate-500 text-xs">Your personalized workspace is ready.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== SIDEBAR (Grouped Layout) ===== */}
      <div className={`border-r border-slate-100 bg-white flex flex-col justify-between transition-all duration-300 z-30 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-5 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6D28D9] text-white flex items-center justify-center">
                <Brain size={16} />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-sm text-slate-800">Career<span className="text-[#6D28D9]">Veda</span></span>
              )}
            </Link>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-[#6D28D9] cursor-pointer">
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          <nav className="space-y-5">
            {sidebarGroups.map((group, gi) => (
              <div key={gi}>
                {group.label && sidebarOpen && (
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item, ii) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={ii}
                        onClick={() => { if (!item.locked) navigate(item.href); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          item.active
                            ? 'bg-[#6D28D9] text-white shadow-sm'
                            : item.locked
                              ? 'text-slate-400 opacity-60 cursor-not-allowed'
                              : 'text-slate-600 hover:text-[#6D28D9] hover:bg-slate-50'
                        }`}
                        title={item.locked ? 'Complete previous steps to unlock' : item.label}
                      >
                        {item.locked ? <Lock size={15} /> : <Icon size={15} className={item.active ? 'text-white' : 'text-slate-400'} />}
                        {sidebarOpen && (
                          <span className="flex items-center gap-1.5">
                            {item.label}
                            {item.locked && <Lock size={9} />}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#6D28D9]/10 border border-[#6D28D9]/20 flex items-center justify-center font-bold text-[#6D28D9]">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              {sidebarOpen && (
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">{user?.name || 'Student'}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button onClick={handleLogout} className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 bg-white px-6 lg:px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:text-[#6D28D9] cursor-pointer">
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-bold text-sm text-slate-800">
                {user?.name ? 'Welcome, ' + user.name.split(' ')[0] : 'Dashboard'}
              </h1>
              <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!activeProgram && (
              <button onClick={() => navigate('/programs')} className="px-4 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer">
                Enroll Now
              </button>
            )}
            <button className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 relative cursor-pointer">
              <Bell size={15} />
              {data.assignmentsDue > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />}
            </button>
            <button onClick={() => navigate('/')} className="hidden md:flex px-3 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
              Public Site
            </button>
          </div>
        </header>

        {/* ===== CONTENT AREA ===== */}
        <div className="p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6 flex-grow">

          {/* ================================================================ */}
          {/* 1. COMPACT ONBOARDING (max 320px)                                */}
          {/* ================================================================ */}
          {!onboardingDone && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" style={{ maxHeight: '320px' }}>
              <div className="bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] px-6 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-violet-200 uppercase tracking-widest">Getting Started · Step {onboardingProgress.completed} of {onboardingProgress.total}</span>
                    <h2 className="text-sm font-bold text-white mt-0.5">Complete your profile to unlock the full experience</h2>
                  </div>
                  <span className="text-white font-bold text-sm">{Math.round((onboardingProgress.completed / onboardingProgress.total) * 100)}%</span>
                </div>
                <div className="mt-2 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${(onboardingProgress.completed / onboardingProgress.total) * 100}%` }} />
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-2">
                {onboardingStepKeys.map((step, i) => {
                  const nav = getOnboardingStepNav(step.key);
                  return (
                    <div key={step.key} className={`flex items-center gap-2 p-2 rounded-xl ${step.done ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {step.done ? <Check size={10} /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-medium truncate ${step.done ? 'text-emerald-700 line-through' : 'text-slate-600'}`}>
                          {getOnboardingStepLabel(step.key)}
                        </p>
                      </div>
                      {!step.done && (
                        nav ? (
                          <button onClick={() => navigate(nav)} className="text-[9px] font-bold text-[#6D28D9] hover:underline shrink-0 cursor-pointer">Go</button>
                        ) : (
                          <button onClick={() => handleCompleteStep(step.key)} className="text-[9px] font-bold text-[#6D28D9] hover:underline shrink-0 cursor-pointer">Done</button>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 2. CONTINUE LEARNING (always visible)                            */}
          {/* ================================================================ */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Play size={22} className="ml-0.5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {activeProgram ? activeProgram.title : 'Getting Started'}
                  </p>
                  <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                    {activeProgram
                      ? (activeProgram.modules[moduleProgress] || activeProgram.modules[0])
                      : 'Set up your profile to begin learning'
                    }
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {activeProgram
                      ? 'Module ' + (moduleProgress + 1) + ' of ' + activeProgram.modules.length + ' \u00B7 ' + coursePct + '% complete'
                      : 'Complete the onboarding checklist above'
                    }
                  </p>
                  {activeProgram && (
                    <div className="mt-2 w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: coursePct + '%' }} />
                    </div>
                  )}
                </div>
              </div>
              {activeProgram && (
                <button
                  onClick={() => {
                    const link = getFirstIncompleteLessonLink();
                    navigate(link || '/my-learning');
                  }}
                  className="px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Play size={14} /> Resume Learning
                </button>
              )}
            </div>
          </div>

          {/* ================================================================ */}
          {/* 3. PERFORMANCE METRICS (color-coded cards)                       */}
          {/* ================================================================ */}
          {(onboardingDone || activeProgram) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metricCards.map((card, i) => {
                const s = getMetricStyle(card.color, card.color === 'amber' ? placementScore : card.color === 'blue' ? coursePct : card.color === 'violet' ? (aiScore ?? 0) : attPct);
                const Icon = card.icon;
                return (
                  <div key={i} className={`${s.bg} ${s.border} border rounded-2xl p-4 shadow-sm transition-all hover:shadow-md`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
                      <Icon size={14} className={s.icon} />
                    </div>
                    <h3 className={`text-xl font-extrabold ${s.text}`}>{card.value}</h3>
                    <p className="text-[9px] text-slate-400 mt-1">{card.sub}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================================================================ */}
          {/* 4. ASSIGNMENTS + UPCOMING CLASSES                                */}
          {/* ================================================================ */}
          {(onboardingDone || activeProgram) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-800">Assignments</h3>
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg">{data.assignmentsDue} Due</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <p className="text-[11px] font-medium text-slate-700">Submissions this week</p>
                    <span className="text-xs font-bold text-slate-800">{data.courseProgress.assignmentsSubmitted}/{data.courseProgress.totalAssignments || 5}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <p className="text-[11px] font-medium text-slate-700">Average Score</p>
                    <span className={`text-xs font-bold ${data.scores.assignmentAvg !== null ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {data.scores.assignmentAvg !== null ? data.scores.assignmentAvg + '%' : '--'}
                    </span>
                  </div>
                </div>
                <button onClick={() => navigate('/my-projects')} className="mt-3 w-full py-2 border border-slate-200 hover:border-[#6D28D9] text-slate-600 hover:text-[#6D28D9] text-[10px] font-bold rounded-xl transition-all cursor-pointer">
                  View All Assignments
                </button>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-800">Upcoming Classes</h3>
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">{data.attendance.total > 0 ? data.attendance.total + ' Total' : '--'}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-slate-400" />
                      <p className="text-[11px] font-medium text-slate-700">Next Session</p>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{data.nextClass || 'Not Scheduled'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-slate-400" />
                      <p className="text-[11px] font-medium text-slate-700">Attendance</p>
                    </div>
                    <span className={`text-xs font-bold ${attPct >= 80 ? 'text-emerald-600' : attPct >= 50 ? 'text-amber-600' : 'text-slate-400'}`}>{attPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 5. LEARNING ROADMAP TIMELINE                                     */}
          {/* ================================================================ */}
          {activeProgram && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Learning Roadmap</h3>
                  <p className="text-[9px] text-slate-400">Your program progression timeline</p>
                </div>
                <span className="text-xs font-bold text-[#6D28D9] bg-violet-50 px-2.5 py-1 rounded-lg">{coursePct}% Complete</span>
              </div>
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200" />
                <div className="space-y-0">
                  {programModules.map((module, idx) => {
                    const isCompleted = idx < moduleProgress;
                    const isCurrent = idx === moduleProgress;
                    const modData = purchasedSlug ? getProgramLessons(purchasedSlug)[idx] : null;
                    const firstLessonId = modData?.lessons[0]?.id;
                    const moduleLink = purchasedSlug && firstLessonId ? `/learn/${purchasedSlug}/m${idx}/${firstLessonId}` : null;
                    const Content = (
                      <div className={`flex-1 p-3 rounded-xl border transition-all ${isCompleted ? 'bg-emerald-50/50 border-emerald-100' : isCurrent ? 'bg-violet-50/50 border-violet-200' : 'bg-slate-50/50 border-slate-100'} ${moduleLink && (isCompleted || isCurrent) ? 'hover:shadow-md hover:border-[#6D28D9]/30' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-700' : isCurrent ? 'text-violet-700' : 'text-slate-500'}`}>
                            {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Locked'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">Level {idx + 1}</span>
                        </div>
                        <p className={`text-sm font-bold mt-0.5 ${isCompleted ? 'text-emerald-800' : isCurrent ? 'text-slate-800' : 'text-slate-500'}`}>{module}</p>
                        {(isCompleted || isCurrent) && moduleLink && (
                          <p className="text-[9px] font-medium text-[#6D28D9] mt-1 flex items-center gap-1">
                            {isCurrent ? 'Continue module' : 'Review module'} <ChevronRight size={10} />
                          </p>
                        )}
                      </div>
                    );
                    return (
                      <div key={idx} className="relative flex items-start gap-4 pb-5 last:pb-0">
                        <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : isCurrent
                              ? 'bg-[#6D28D9] border-[#6D28D9] text-white ring-4 ring-violet-100'
                              : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {isCompleted ? <Check size={16} /> : isCurrent ? <Play size={14} className="ml-0.5" /> : <Lock size={12} />}
                        </div>
                        {moduleLink && (isCompleted || isCurrent) ? (
                          <button onClick={() => navigate(moduleLink!)} className="flex-1 text-left cursor-pointer">
                            {Content}
                          </button>
                        ) : Content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 6. AI CAREER COACH RECOMMENDATIONS                               */}
          {/* ================================================================ */}
          {(onboardingDone || activeProgram) && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={16} className="text-[#6D28D9]" />
                <h3 className="font-bold text-sm text-slate-800">AI Career Coach</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <button onClick={() => navigate('/resume-analyzer')} className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-left hover:shadow-sm transition-all cursor-pointer">
                  <FileText size={14} className="text-blue-500 mb-1.5" />
                  <p className="text-[10px] font-bold text-blue-700">Complete Resume Analysis</p>
                  <p className="text-[8px] text-blue-500 mt-0.5">Get ATS score & suggestions</p>
                </button>
                <button onClick={() => navigate('/interview-coach')} className="p-3 bg-violet-50 border border-violet-100 rounded-xl text-left hover:shadow-sm transition-all cursor-pointer">
                  <UserCheck size={14} className="text-violet-500 mb-1.5" />
                  <p className="text-[10px] font-bold text-violet-700">Practice Mock Interview</p>
                  <p className="text-[8px] text-violet-500 mt-0.5">HR, technical & coding rounds</p>
                </button>
                <button onClick={() => navigate('/career-paths')} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-left hover:shadow-sm transition-all cursor-pointer">
                  <Map size={14} className="text-emerald-500 mb-1.5" />
                  <p className="text-[10px] font-bold text-emerald-700">Explore Career Paths</p>
                  <p className="text-[8px] text-emerald-500 mt-0.5">Find your ideal track</p>
                </button>
                <button onClick={() => navigate('/ai-copilot')} className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-left hover:shadow-sm transition-all cursor-pointer">
                  <MessageSquare size={14} className="text-amber-500 mb-1.5" />
                  <p className="text-[10px] font-bold text-amber-700">Chat with AI Mentor</p>
                  <p className="text-[8px] text-amber-500 mt-0.5">Get personalized guidance</p>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 7. COMMUNITY ACTIVITY                                            */}
          {/* ================================================================ */}
          {(onboardingDone || activeProgram) && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#6D28D9]" />
                  <h3 className="font-bold text-sm text-slate-800">Community Activity</h3>
                </div>
                <button onClick={() => navigate('/community')} className="text-[10px] font-bold text-[#6D28D9] hover:underline cursor-pointer">Open Community</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-lg font-extrabold text-slate-800">27</p>
                  <p className="text-[9px] text-slate-500">New Discussions</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-lg font-extrabold text-slate-800">4</p>
                  <p className="text-[9px] text-slate-500">Upcoming Events</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-lg font-extrabold text-slate-800">2</p>
                  <p className="text-[9px] text-slate-500">Active Hackathons</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-lg font-extrabold text-slate-800">18</p>
                  <p className="text-[9px] text-slate-500">Job Referrals</p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 8. PLACEMENT READINESS BREAKDOWN                                 */}
          {/* ================================================================ */}
          {(onboardingDone || activeProgram) && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-800">Placement Readiness</h3>
                </div>
                <span className="text-lg font-extrabold text-amber-600">{placementScore}/100</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Attendance', score: Math.round(attPct * 0.25), max: 25, pct: attPct, color: 'bg-emerald-500' },
                  { label: 'Assignments', score: Math.min(25, Math.round((data.courseProgress.totalAssignments > 0 ? (data.courseProgress.assignmentsSubmitted / data.courseProgress.totalAssignments) : 0) * 25)), max: 25, pct: data.courseProgress.totalAssignments > 0 ? Math.round((data.courseProgress.assignmentsSubmitted / data.courseProgress.totalAssignments) * 100) : 0, color: 'bg-blue-500' },
                  { label: 'Projects', score: Math.min(25, Math.round((data.courseProgress.totalProjects > 0 ? (data.courseProgress.projectsCompleted / data.courseProgress.totalProjects) : 0) * 25)), max: 25, pct: data.courseProgress.totalProjects > 0 ? Math.round((data.courseProgress.projectsCompleted / data.courseProgress.totalProjects) * 100) : 0, color: 'bg-violet-500' },
                  { label: 'Interview Readiness', score: Math.min(25, data.scores.interviewScore !== null ? Math.round(data.scores.interviewScore * 0.25) : 0), max: 25, pct: data.scores.interviewScore ?? 0, color: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <p className="text-[10px] font-semibold text-slate-600">{item.label}</p>
                    </div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: item.pct + '%' }} />
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-[10px] font-bold text-slate-700">{item.score}/{item.max}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!locked && (
                <button onClick={() => navigate('/programs')} className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer">
                  Browse Placement Jobs
                </button>
              )}
              {locked && (
                <p className="mt-3 text-[9px] text-slate-400 text-center">Complete all areas above 70% to unlock the placement portal.</p>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* 9. PREMIUM PATHWAYS (free onboarded users)                       */}
          {/* ================================================================ */}
          {!activeProgram && onboardingDone && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-bold text-sm text-slate-800">Unlock Premium Learning Pathways</h3>
                <p className="text-[10px] text-slate-400">Select a career track to get a complete syllabus, mentorship, and placement support.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROGRAMS_LIST.slice(0, 4).map((prog, i) => (
                  <div key={i} className="bg-white border border-slate-100 hover:border-violet-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-violet-50 border border-violet-100 text-[8px] font-bold text-violet-600">{prog.duration}</span>
                        <span className="text-[10px] font-black text-emerald-600">{prog.price}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{prog.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{prog.desc}</p>
                    </div>
                    <div className="pt-4 flex items-center gap-2">
                      <button onClick={() => navigate(`/program/${prog.slug}`)} className="flex-1 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 text-[9px] font-bold rounded-xl transition-all cursor-pointer">
                        View
                      </button>
                      <button onClick={() => handleUnlockPathway(prog.slug)} className="flex-1 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-[9px] font-bold rounded-xl transition-all cursor-pointer">
                        Enroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* DEMO MODE (free users)                                           */}
          {/* ================================================================ */}
          {!activeProgram && onboardingDone && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={14} className="text-amber-500" />
                <p className="text-[10px] text-amber-700 font-medium">Try demo mode to simulate weekly progress and see your metrics change.</p>
              </div>
              <button
                onClick={() => { simulateWeeklyProgress(); refreshData(); }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-bold rounded-xl transition-all cursor-pointer shrink-0"
              >
                Simulate +
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
