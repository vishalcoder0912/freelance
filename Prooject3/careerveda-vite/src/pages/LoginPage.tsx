import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Mail, Lock, Shield, ShieldAlert, Eye, EyeOff, ChevronRight,
  ArrowLeft, Sparkles, Check, Users, Briefcase, MessageSquare,
  Target, Star, GraduationCap, FileText, BarChart3,
  TrendingUp, Award, BookOpen, Clock, Calendar, UserCheck,
  Search, Video, ClipboardList, Map, Send
} from 'lucide-react';
import { login, getRoleRedirect, isValidEmailForRole, type UserRole } from '@/lib/auth';
import { initStudentData } from '@/lib/studentData';

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Weak', color: 'bg-rose-500', width: '20%' },
    { label: 'Fair', color: 'bg-orange-500', width: '40%' },
    { label: 'Good', color: 'bg-amber-500', width: '60%' },
    { label: 'Strong', color: 'bg-emerald-500', width: '80%' },
    { label: 'Very Strong', color: 'bg-emerald-600', width: '100%' },
  ];
  return levels[Math.min(score, 4)];
}

const ROLE_INFO: Record<UserRole, { title: string; desc: string }> = {
  student: { title: 'Student', desc: 'Continue your learning journey' },
  mentor: { title: 'Mentor', desc: 'Manage your learners' },
  recruiter: { title: 'Recruiter', desc: 'Hire top talent' },
  admin: { title: 'Admin', desc: 'Manage platform' },
};

const COMPANY_LOGOS = ['Google', 'Microsoft', 'Amazon', 'Razorpay', 'Adobe', 'Deloitte'];

const ROLE_PREVIEWS: Record<UserRole, { title: string; metrics: { icon: any; label: string; value: string; color: string }[]; desc: string }> = {
  student: {
    title: 'Learning Dashboard Preview',
    desc: 'Your personalized learning command center',
    metrics: [
      { icon: BookOpen, label: 'Course Progress', value: '74%', color: 'text-blue-400' },
      { icon: Brain, label: 'AI Score', value: '82/100', color: 'text-violet-400' },
      { icon: Target, label: 'Placement Readiness', value: '68%', color: 'text-emerald-400' },
      { icon: Award, label: 'Projects Completed', value: '9/15', color: 'text-amber-400' },
    ],
  },
  mentor: {
    title: 'Mentor Workspace Preview',
    desc: 'Track, review, and guide your students',
    metrics: [
      { icon: Users, label: 'Active Students', value: '24', color: 'text-blue-400' },
      { icon: ClipboardList, label: 'Pending Reviews', value: '12', color: 'text-amber-400' },
      { icon: Video, label: 'Upcoming Sessions', value: '6', color: 'text-violet-400' },
      { icon: TrendingUp, label: 'Avg Student Score', value: '87%', color: 'text-emerald-400' },
    ],
  },
  recruiter: {
    title: 'Recruiter Portal Preview',
    desc: 'Post jobs, review candidates, hire talent',
    metrics: [
      { icon: Briefcase, label: 'Active Jobs', value: '6', color: 'text-blue-400' },
      { icon: Search, label: 'Qualified Candidates', value: '48', color: 'text-emerald-400' },
      { icon: Calendar, label: 'Interviews Scheduled', value: '12', color: 'text-amber-400' },
      { icon: Star, label: 'Placements This Qtr', value: '9', color: 'text-violet-400' },
    ],
  },
  admin: {
    title: 'Admin ERP Preview',
    desc: 'Full platform management and analytics',
    metrics: [
      { icon: Users, label: 'Total Users', value: '1,247', color: 'text-blue-400' },
      { icon: BookOpen, label: 'Active Programs', value: '7', color: 'text-emerald-400' },
      { icon: Calendar, label: 'Revenue (MTD)', value: '₹2.4M', color: 'text-amber-400' },
      { icon: TrendingUp, label: 'Placement Rate', value: '87%', color: 'text-violet-400' },
    ],
  },
};

const JOURNEY_STEPS = [
  { label: 'Register', icon: GraduationCap, desc: 'Create account' },
  { label: 'Assessment', icon: Target, desc: 'Discover strengths' },
  { label: 'AI Roadmap', icon: Map, desc: 'Personalized path' },
  { label: 'Learn & Build', icon: BookOpen, desc: 'Lessons & projects' },
  { label: 'Mock Interview', icon: UserCheck, desc: 'Practice with AI' },
  { label: 'Placement', icon: Send, desc: 'Get matched' },
  { label: 'Job Offer', icon: Award, desc: 'Start your career' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'magic'>('password');
  const [portalRole, setPortalRole] = useState<UserRole>(isAdminLogin ? 'admin' : 'student');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isAdminLogin) setPortalRole('admin');
  }, [isAdminLogin]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % JOURNEY_STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));

      if (!isValidEmailForRole(email, portalRole)) {
        throw new Error(`Access denied: This portal requires an email with "${portalRole}" in it.`);
      }

      const user = login(email, password, portalRole);
      initStudentData();

      const pending = localStorage.getItem('pending_purchase');
      if (pending) {
        localStorage.setItem('purchased_program', pending);
        localStorage.removeItem('pending_purchase');
      }

      navigate(getRoleRedirect(user.role));
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (_provider: string) => {
    setError('Social login is unavailable in offline mode. Please use email/password.');
  };

  const pwStrength = password ? getPasswordStrength(password) : null;

  const availableRoles: UserRole[] = isAdminLogin ? ['admin'] : ['student', 'mentor', 'recruiter'];
  const preview = ROLE_PREVIEWS[portalRole];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(isAdminLogin ? '/login' : '/')}
        className="absolute top-6 left-6 p-2.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-[#6D28D9] transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm hover:shadow-md cursor-pointer z-50"
      >
        <ArrowLeft size={14} /> Back
      </motion.button>

      {/* ===== LEFT: AUTH ===== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-5 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12 relative z-10"
      >
        <div className="max-w-md w-full mx-auto space-y-5">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20 group-hover:shadow-lg group-hover:shadow-[#6D28D9]/30 transition-shadow">
              <Brain size={20} />
            </div>
            <span className="font-bold text-lg text-slate-800">
              Career<span className="text-[#6D28D9]">Veda</span>
            </span>
          </Link>

          {!isAdminLogin && (
            <div className="flex bg-slate-100 rounded-xl p-0.5">
              {availableRoles.map((key) => (
                <button
                  key={key}
                  onClick={() => setPortalRole(key)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer capitalize ${
                    portalRole === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {ROLE_INFO[key].title}
                </button>
              ))}
            </div>
          )}

          {isAdminLogin && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
              <ShieldAlert size={14} className="text-amber-600 shrink-0" />
              <span className="text-[10px] font-bold text-amber-700">Admin Portal — Authorized access only</span>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isAdminLogin ? 'Admin Login' : portalRole === 'student' ? 'Welcome Back' : portalRole === 'mentor' ? 'Mentor Portal' : 'Recruiter Portal'}
            </h1>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-sm">
              {portalRole === 'student' && 'Access your learning dashboard, AI career coach, placement portal, and personalized roadmap.'}
              {portalRole === 'mentor' && 'Track student progress, review assignments, and schedule mentoring sessions.'}
              {portalRole === 'recruiter' && 'Post jobs, review candidate profiles, and schedule interviews.'}
              {portalRole === 'admin' && 'Full platform management — users, programs, placements, and analytics.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { icon: portalRole === 'recruiter' ? Briefcase : Users, text: portalRole === 'recruiter' ? '900+ Hiring Partners' : portalRole === 'mentor' ? '24 Active Students' : '12,400+ Active Learners' },
              { icon: portalRole === 'mentor' ? ClipboardList : Briefcase, text: portalRole === 'student' ? '927+ Hiring Partners' : portalRole === 'mentor' ? '18 Sessions/Month' : '48 Qualified Candidates' },
              { icon: Brain, text: 'AI Career Copilot' },
              { icon: Target, text: portalRole === 'admin' ? '87% Placement Rate' : 'Placement Assistance' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon size={11} className="text-[#6D28D9]" />
                  <span className="text-[10px] text-slate-500 font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium"
            >
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex bg-slate-100 rounded-xl p-0.5">
            <button
              onClick={() => setAuthMode('password')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === 'password' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Password
            </button>
            <button
              onClick={() => setAuthMode('magic')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === 'magic' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Magic Link
            </button>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={isAdminLogin ? 'admin@careerveda.com' : 'you@company.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10 transition-all placeholder:text-slate-300"
                />
                <Mail size={14} className="text-slate-400 group-focus-within:text-[#6D28D9] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {authMode === 'password' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-[10px] font-semibold text-[#6D28D9] hover:text-[#5B21B6] transition-colors">Forgot?</a>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10 transition-all placeholder:text-slate-300"
                  />
                  <Lock size={14} className="text-slate-400 group-focus-within:text-[#6D28D9] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {password && pwStrength && (
                  <div className="space-y-1">
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`${pwStrength.color} h-full rounded-full transition-all duration-300`} style={{ width: pwStrength.width }} />
                    </div>
                    <p className="text-[8px] font-medium text-slate-400">{pwStrength.label}</p>
                  </div>
                )}
              </div>
            )}

            {authMode === 'magic' && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-[10px] text-blue-700 font-medium">We'll send a magic sign-in link to your email. No password needed.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] active:bg-[#4C1D95] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#6D28D9]/20 hover:shadow-xl hover:shadow-[#6D28D9]/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {authMode === 'magic' ? 'Sending Link...' : 'Signing In...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {authMode === 'magic' ? 'Send Magic Link' : 'Sign In'} <ChevronRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-1/3 h-px bg-slate-200" />
            <span>Or continue with</span>
            <span className="w-1/3 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleProviderLogin('google')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] text-slate-700 text-xs font-semibold transition-all cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            </button>
            <button onClick={() => handleProviderLogin('github')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] text-slate-700 text-xs font-semibold transition-all cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </button>
            <button onClick={() => handleProviderLogin('linkedin')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] text-slate-700 text-xs font-semibold transition-all cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 font-medium">
            {isAdminLogin ? (
              <Link to="/login" className="text-[#6D28D9] font-bold hover:text-[#5B21B6] transition-colors">Back to User Login</Link>
            ) : (
              <>Don't have an account?{' '}
              <Link to="/register" className="text-[#6D28D9] font-bold hover:text-[#5B21B6] transition-colors">Register now</Link></>
            )}
          </p>
        </div>
      </motion.div>

      {/* ===== RIGHT: CAREER OS PRODUCT PREVIEW ===== */}
      <div className="hidden lg:col-span-7 lg:flex flex-col relative overflow-hidden min-h-screen" style={{ background: '#020617' }}>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: i % 3 === 0 ? 'rgba(109,40,217,0.3)' : i % 3 === 1 ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.25)',
            }}
            animate={{ y: [0, -20 - Math.random() * 30, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 5 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
        <div className="absolute top-[-20%] right-[-5%] w-[600px] h-[600px] bg-[#6D28D9]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] bg-[#10B981]/8 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#8B5CF6]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between min-h-screen p-10 lg:p-14">
          {/* Top: Headline + Placement Hook */}
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-bold tracking-widest text-[#8B5CF6] uppercase"
              >
                <Sparkles size={11} /> AI Career Operating System
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.5 }}
                className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.1]"
              >
                Transform Skills<br />
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#6D28D9] to-[#10B981] bg-clip-text text-transparent">Into Careers</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-slate-400 text-sm max-w-md"
              >
                Learn. Build. Get Mentored. Get Hired.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center min-w-[140px]"
            >
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg Salary Growth</p>
              <p className="text-3xl font-extrabold text-[#10B981] mt-1">67%</p>
              <p className="text-[8px] text-slate-500 mt-0.5">Across all programs</p>
            </motion.div>
          </div>

          {/* Middle: Product Preview + Journey */}
          <div className="grid grid-cols-12 gap-5 my-6">
            {/* Product Preview Metrics */}
            <div className="col-span-7 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Product Preview</p>
                  <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FileText, label: 'Resume Score', value: '88/100', pct: 88, color: 'bg-emerald-500' },
                    { icon: Shield, label: 'Placement Readiness', value: '74/100', pct: 74, color: 'bg-violet-500' },
                    { icon: Briefcase, label: 'Jobs Matched', value: '12', pct: 60, color: 'bg-blue-500' },
                    { icon: MessageSquare, label: 'Interview Score', value: '82/100', pct: 82, color: 'bg-amber-500' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon size={12} className="text-slate-500" />
                            <span className="text-[9px] text-slate-400 font-medium">{item.label}</span>
                          </div>
                          <span className="text-xs font-extrabold text-white">{item.value}</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ delay: 0.8 + i * 0.15, duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${item.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Role-Specific Dynamic Preview */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={portalRole}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5"
                >
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">{preview.title}</p>
                  <p className="text-[10px] text-slate-400 mb-3">{preview.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {preview.metrics.map((metric, i) => {
                      const Icon = metric.icon;
                      return (
                        <div key={i} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg p-2.5">
                          <Icon size={14} className={metric.color} />
                          <div>
                            <p className="text-[10px] font-bold text-white">{metric.value}</p>
                            <p className="text-[8px] text-slate-500">{metric.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Career Journey Timeline */}
            <div className="col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 h-full"
              >
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Your Career Journey</p>
                <div className="relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/[0.08]" />
                  <div className="space-y-0">
                    {JOURNEY_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const isActive = i === activeStep;
                      const isDone = i < activeStep;
                      return (
                        <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                          <motion.div
                            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                            className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                              isDone
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : isActive
                                  ? 'bg-[#6D28D9]/30 border-[#6D28D9]/60 text-[#8B5CF6] shadow-lg shadow-[#6D28D9]/20'
                                  : 'bg-white/[0.04] border-white/[0.08] text-slate-600'
                            }`}>
                            {isDone ? <Check size={12} /> : <Icon size={12} />}
                          </motion.div>
                          <div className="min-w-0 pt-1">
                            <p className={`text-[10px] font-bold ${isDone ? 'text-emerald-300' : isActive ? 'text-white' : 'text-slate-500'}`}>
                              {step.label}
                            </p>
                            <p className="text-[8px] text-slate-600">{step.desc}</p>
                          </div>
                          {i < JOURNEY_STEPS.length - 1 && (
                            <motion.div
                              animate={isActive ? { y: [0, 3, 0] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute left-[19px] top-8 text-slate-600"
                            >
                              <ChevronRight size={8} className="rotate-90" />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom: Company Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between"
          >
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest shrink-0 mr-6">Our Alumni Work At</p>
            <div className="flex items-center gap-6 overflow-hidden">
              {COMPANY_LOGOS.concat(COMPANY_LOGOS).map((name, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-500 tracking-wider uppercase opacity-50 whitespace-nowrap">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
