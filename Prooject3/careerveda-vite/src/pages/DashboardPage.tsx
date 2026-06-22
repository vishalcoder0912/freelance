import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain, LayoutDashboard, Map, MessageSquare, Award,
  UserCheck, Briefcase, Users, LogOut, Bell, Menu, X,
  TrendingUp, Star, Sparkles, CheckCircle2, ChevronRight, BookOpen, Building2, Clock, Check, Loader2, ArrowRight,
  Target, Upload, FileText, Shield, Lock, Unlock, Mail
} from 'lucide-react';
import { PROGRAMS_DATA, PROGRAMS_LIST } from '@/lib/programsData';
import {
  getStudentData, StudentData, completeOnboardingStep as completeStep,
  getOnboardingProgress, isOnboardingComplete, getCourseProgressPercent,
  getAttendancePercent, getAIScore, getPlacementReadiness, getPlacementTier,
  isPlacementLocked, getUnlockedFeatures, getOnboardingStepLabel,
  getOnboardingStepNav, updateStudentData, simulateWeeklyProgress
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

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true, locked: false },
    { label: 'Roadmap', icon: Map, href: '/career-paths', locked: false },
    { label: 'AI Copilot', icon: MessageSquare, href: '/ai-copilot', locked: !features.includes('ai-copilot') },
    { label: 'Resume Analyzer', icon: Award, href: '/resume-analyzer', locked: !features.includes('resume-analyzer') },
    { label: 'Interview Coach', icon: UserCheck, href: '/interview-coach', locked: !features.includes('mock-interview') },
    { label: 'Career Paths', icon: Map, href: '/career-paths', locked: false },
    { label: 'Jobs', icon: Briefcase, href: '/programs', locked: !features.includes('placement-portal') },
    { label: 'Faculty', icon: Users, href: '/faculty', locked: false },
    { label: 'Employers', icon: Building2, href: '/employers', locked: false },
  ];

  const getMetricColor = (val: number) => {
    if (val >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'text-emerald-500' };
    if (val >= 50) return { text: 'text-amber-600', bg: 'bg-amber-50', icon: 'text-amber-500' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', icon: 'text-rose-500' };
  };

  const mc = getMetricColor(placementScore);

  return (
    <div className="min-h-screen flex bg-[#FAFAFC] text-slate-800 font-sans relative">
      
      {/* Checkout overlay modal */}
      {isPurchasing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800">Processing Enrollment</h3>
              <p className="text-slate-500 text-xs">Registering your account to the pathway and allocating your AI copilot resources...</p>
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
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={32} className="animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800">Pathway Unlocked!</h3>
              <p className="text-slate-500 text-xs">Your student credentials have been updated. Preparing your personalized workspace...</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`border-r border-slate-100 bg-white flex flex-col justify-between transition-all duration-300 z-30 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-5 space-y-6">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Brain size={16} />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-sm text-slate-800">
                  Career<span className="text-indigo-600">Veda</span>
                </span>
              )}
            </Link>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600"
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    item.active 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} className={item.active ? 'text-white' : 'text-slate-400'} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                {user?.displayName ? user.displayName.charAt(0) : 'R'}
              </div>
              {sidebarOpen && (
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">{user?.displayName || 'Rohan Sharma'}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 bg-white px-8 flex items-center justify-between z-10">
          <div>
            <h1 className="font-bold text-sm text-slate-800">
              {activeProgram ? 'Premium Classroom Workspace' : 'Student Command Center'}
            </h1>
            <p className="text-[10px] text-slate-400">
              {activeProgram ? `Pathway: ${activeProgram.title}` : 'Track and optimize your career benchmarks.'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {activeProgram && (
              <button 
                onClick={handleResetProgram}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-[10px] font-bold rounded-xl transition-all"
              >
                Reset to Free Mode
              </button>
            )}
            <button className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 relative">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600" />
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-xl bg-white transition-all"
            >
              Public Home
            </button>
          </div>
        </header>

        {/* Dynamic content depending on purchase status */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-8 flex-grow">
          
          {activeProgram ? (
            /* ======================================================== */
            /* 1. PREMIUM PURCHASED USER DASHBOARD (SECOND DASHBOARD)   */
            /* ======================================================== */
            <>
              {/* Banner */}
              <div className="bg-gradient-to-r from-indigo-900 to-violet-950 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-radial-gradient from-violet-600/20 to-transparent pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                    Active Enrollment · {activeProgram.duration} Track
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{activeProgram.title}</h2>
                  <p className="text-indigo-200 text-xs max-w-md">
                    Welcome back, {user?.displayName || 'Rohan'}! Complete your weekly milestone tasks to stay on track for placement matching.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate('/interview-coach')}
                    className="px-5 py-2.5 bg-white text-indigo-950 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer relative z-10"
                  >
                    AI Mock Interview
                  </button>
                  <button 
                    onClick={() => navigate('/ai-copilot')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer relative z-10"
                  >
                    Chat Copilot
                  </button>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Class Attendance', value: '94%', plus: 'Target 90% required', color: 'text-indigo-600', icon: CheckCircle2 },
                  { label: 'Assignments Done', value: '4 / 6', plus: 'Next due in 2 days', color: 'text-emerald-600', icon: BookOpen },
                  { label: 'AI Score Bench', value: '87 / 100', plus: 'Top 15% in cohort', color: 'text-sky-600', icon: TrendingUp },
                  { label: 'Placement Pipeline', value: 'Ready', plus: 'Unlocked by score', color: 'text-amber-600', icon: Star }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                          <Icon size={14} className="text-slate-400" />
                        </div>
                      </div>
                      <h3 className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</h3>
                      <p className="text-[9px] font-semibold text-slate-400 mt-1">{stat.plus}</p>
                    </div>
                  );
                })}
              </div>

              {/* Double Column Classroom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Dynamic Curriculum roadmap progress */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Your Personalized Learning Path</h3>
                      <p className="text-[9px] text-slate-400">Dynamic tracker mapping to current vacancies</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">66% Complete</span>
                  </div>

                  <div className="space-y-3">
                    {activeProgram.modules.map((module, idx) => {
                      const isCompleted = idx < 3;
                      const isCurrent = idx === 3;
                      return (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${
                            isCurrent 
                              ? 'bg-indigo-50/20 border-indigo-200 shadow-sm' 
                              : 'border-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                              isCompleted 
                                ? 'bg-indigo-600 border-indigo-600 text-white' 
                                : isCurrent
                                  ? 'bg-white border-indigo-500 text-indigo-600'
                                  : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span className={`text-xs font-semibold ${isCurrent ? 'text-indigo-600' : 'text-slate-700'}`}>
                              {module}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">
                            {isCompleted ? 'Completed ✓' : isCurrent ? 'Currently Active' : 'Locked'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Classroom resources */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Live lectures panel */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-indigo-600 animate-pulse" />
                      <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Live Masterclass</h4>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded inline-block animate-pulse">
                        Today at 6:00 PM
                      </p>
                      <h5 className="text-xs font-bold text-slate-800">Advanced GenAI Fine-Tuning Patterns</h5>
                      <p className="text-[9px] text-slate-400 leading-normal">Hosted by Siddharth Mehta (Director of Engineering at Razorpay)</p>
                      <button 
                        onClick={() => alert('Launching Zoom/Google Meet classroom session!')}
                        className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all"
                      >
                        Join Class Session
                      </button>
                    </div>
                  </div>

                  {/* Slack & Community invites */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Community Hub</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Join the private student slack workspace to collaborate with peers and alumni.</p>
                    <button 
                      onClick={() => alert('Slack invite link copied to clipboard!')}
                      className="w-full py-2 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 text-[10px] font-bold rounded-lg transition-all"
                    >
                      Invite Slack Link
                    </button>
                  </div>

                </div>

              </div>
            </>
          ) : (
            /* ======================================================== */
            /* 2. FREE USER DASHBOARD (METRICS & PATHWAYS PURCHASE WIDGET)*/
            /* ======================================================== */
            <>
              {/* Free User Greeting Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-bold text-indigo-300 uppercase tracking-widest">
                    Account Status · Free Tier
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Welcome, {user?.displayName || 'Guest'} 👋</h2>
                  <p className="text-indigo-200 text-xs max-w-lg">
                    Unlock a premium executive program below to generate your complete 6-month syllabus, receive 1-on-1 industry mentorship, and secure placement support.
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/programs')}
                  className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer relative z-10"
                >
                  Explore Programs
                </button>
              </div>

              {/* Free User AI Scorecards */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-800">Your AI Career DNA Scorecard</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Career Readiness', value: '87%', plus: '+12% this month', color: 'text-indigo-600', icon: TrendingUp },
                    { label: 'Interview Score', value: '74%', plus: '+9% this week', color: 'text-emerald-600', icon: UserCheck },
                    { label: 'AI Match Score', value: '92%', plus: 'Top matching: Razorpay', color: 'text-sky-600', icon: Sparkles },
                    { label: 'Roadmap Milestone', value: 'Locked', plus: 'Purchase a track to open', color: 'text-slate-400 border-dashed bg-slate-50/50', icon: Star }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                            <Icon size={14} className="text-slate-400" />
                          </div>
                        </div>
                        <h3 className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</h3>
                        <p className="text-[9px] font-semibold text-slate-400 mt-1">{stat.plus}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unlock Premium pathways catalog list */}
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-800">Unlock Premium Learning Pathways</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Select a career track below to enroll and configure your personalized workspace dashboard.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {PROGRAMS_LIST.map((prog, i) => (
                    <div 
                      key={i} 
                      className="bg-white border border-slate-100 hover:border-indigo-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[9px] font-bold text-indigo-600">
                            {prog.duration} Program
                          </span>
                          <span className="text-xs font-black text-emerald-600">{prog.price}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">{prog.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-normal">{prog.desc}</p>
                        <ul className="space-y-1.5 pt-2">
                          {prog.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-500">
                              <Check size={10} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-5 flex items-center gap-3">
                        <button 
                          onClick={() => navigate(`/program/${prog.slug}`)}
                          className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 text-[10px] font-bold rounded-lg transition-all"
                        >
                          View Syllabus
                        </button>
                        <button 
                          onClick={() => handleUnlockPathway(prog.slug)}
                          className="flex-grow py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow shadow-indigo-600/10"
                        >
                          Unlock Pathway & Enroll <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
