import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Mail, Lock, ShieldAlert, Eye, EyeOff, ChevronRight,
  ArrowLeft, Sparkles, Check, Users, Briefcase, MessageSquare,
  Target, Star, ArrowDown, GraduationCap, FileText, Zap, BarChart3,
  TrendingUp, Award
} from 'lucide-react';
import { initStudentData } from '@/lib/studentData';

function getRoleFromEmail(email: string): string {
  const e = email.toLowerCase();
  if (e.includes('admin')) return 'admin';
  if (e.includes('mentor')) return 'mentor';
  if (e.includes('recruiter')) return 'recruiter';
  return 'student';
}

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

const JOURNEY_STEPS = [
  { label: 'Register', subtitle: 'Create your account', icon: GraduationCap },
  { label: 'Career Assessment', subtitle: 'Discover your strengths', icon: Target },
  { label: 'AI Learning Roadmap', subtitle: 'Personalized curriculum', icon: FileText },
  { label: 'Projects & Assignments', subtitle: 'Build real portfolio', icon: Briefcase },
  { label: 'Mock Interviews', subtitle: 'Practice with AI', icon: MessageSquare },
  { label: 'Placement Readiness', subtitle: 'Score based on activity', icon: Zap },
  { label: 'Job Offers', subtitle: 'Get hired', icon: Star },
];

const COMPANY_LOGOS = ['Google', 'Microsoft', 'Amazon', 'Razorpay', 'Adobe', 'Deloitte'];

type PortalRole = 'student' | 'mentor' | 'recruiter';

const ROLE_INFO: Record<PortalRole, { title: string; desc: string }> = {
  student: { title: 'Student', desc: 'Continue your learning journey' },
  mentor: { title: 'Mentor', desc: 'Manage your learners' },
  recruiter: { title: 'Recruiter', desc: 'Hire top talent' },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'magic'>('password');
  const [portalRole, setPortalRole] = useState<PortalRole>('student');
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const role = getRoleFromEmail(email);
      const name = email.split('@')[0];
      localStorage.setItem('careerveda_user', JSON.stringify({ name, email, role, photoURL: null }));
      initStudentData();
      const pending = localStorage.getItem('pending_purchase');
      if (pending) {
        localStorage.setItem('purchased_program', pending);
        localStorage.removeItem('pending_purchase');
      }
      const routeMap: Record<string, string> = {
        admin: '/admin', mentor: '/mentor', recruiter: '/recruiter', student: '/dashboard',
      };
      navigate(routeMap[role] || '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (_provider: string) => {
    setError('Social login is unavailable in offline mode. Please use email/password.');
  };

  const pwStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
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
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20 group-hover:shadow-lg group-hover:shadow-[#6D28D9]/30 transition-shadow">
              <Brain size={20} />
            </div>
            <span className="font-bold text-lg text-slate-800">
              Career<span className="text-[#6D28D9]">Veda</span>
            </span>
          </Link>

          {/* Role Switcher */}
          <div className="flex bg-slate-100 rounded-xl p-0.5">
            {(Object.entries(ROLE_INFO) as [PortalRole, typeof ROLE_INFO['student']][]).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setPortalRole(key)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer capitalize ${
                  portalRole === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {info.title}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {portalRole === 'student' ? 'Welcome Back' : portalRole === 'mentor' ? 'Mentor Portal' : 'Recruiter Portal'}
            </h1>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-sm">
              {portalRole === 'student' && 'Access your learning dashboard, AI career coach, placement portal, and personalized roadmap.'}
              {portalRole === 'mentor' && 'Track student progress, review assignments, and schedule mentoring sessions.'}
              {portalRole === 'recruiter' && 'Post jobs, review candidate profiles, and schedule interviews.'}
            </p>
          </div>

          {/* Trust markers */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { icon: Users, text: '12,400+ Active Learners' },
              { icon: Briefcase, text: '927+ Hiring Partners' },
              { icon: Brain, text: 'AI Career Copilot' },
              { icon: Target, text: 'Placement Assistance' },
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

          {/* Error */}
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

          {/* Auth Mode Tabs */}
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

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[#6D28D9] focus:ring-[#6D28D9]/20"
                />
                <span className="text-[10px] font-medium text-slate-500">Remember me</span>
              </label>
            </div>

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

          {/* Divider */}
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-1/3 h-px bg-slate-200" />
            <span>Or continue with</span>
            <span className="w-1/3 h-px bg-slate-200" />
          </div>

          {/* Social */}
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
            Don't have an account?{' '}
            <Link to="/register" className="text-[#6D28D9] font-bold hover:text-[#5B21B6] transition-colors">
              Register now
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ===== RIGHT: CAREER OS ECOSYSTEM ===== */}
      <div className="hidden lg:col-span-7 lg:flex flex-col relative overflow-hidden min-h-screen" style={{ background: '#020617' }}>
        {/* Animated particles */}
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
            animate={{
              y: [0, -20 - Math.random() * 30, 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: 5 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Ambient glows */}
        <div className="absolute top-[-20%] right-[-5%] w-[600px] h-[600px] bg-[#6D28D9]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] bg-[#10B981]/8 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#8B5CF6]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between min-h-screen p-10 lg:p-14">
          {/* Top: Headline + Placement Hook */}
          <div className="flex items-start justify-between max-w-3xl">
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

            {/* Placement Hook */}
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

          {/* Middle: Large Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="my-6"
          >
            <div className="flex items-center gap-12">
              {/* Timeline nodes */}
              <div className="flex items-center gap-0 flex-1">
                {JOURNEY_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i < 3;
                  return (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                          isActive
                            ? 'bg-[#6D28D9]/20 border-[#6D28D9]/40 text-[#8B5CF6] shadow-lg shadow-[#6D28D9]/10'
                            : 'bg-white/[0.04] border-white/[0.08] text-slate-600'
                        }`}>
                          <Icon size={14} />
                        </div>
                        <p className={`text-[9px] font-semibold mt-1.5 text-center leading-tight ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                          {step.label.split(' ')[0]}
                        </p>
                        <p className="text-[7px] text-slate-600 text-center hidden xl:block">{step.subtitle}</p>
                      </div>
                      {i < JOURNEY_STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-2 mt-[-24px] ${i < 3 ? 'bg-gradient-to-r from-[#6D28D9]/60 to-[#8B5CF6]/30' : 'bg-white/[0.06]'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Bottom: Unified Stats Container + OS Preview */}
          <div className="grid grid-cols-12 gap-5">
            {/* Stats Glass Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="col-span-5 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5"
            >
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Platform Reach</p>
              <div className="grid grid-cols-2 gap-y-4">
                {[
                  { value: '12,400+', label: 'Active Learners' },
                  { value: '927+', label: 'Hiring Partners' },
                  { value: '87%', label: 'Placement Success' },
                  { value: '4.9/5', label: 'Student Rating' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-extrabold text-white">{stat.value}</p>
                    <p className="text-[9px] text-slate-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Career OS Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="col-span-4 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5"
            >
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Career OS Preview</p>
              <div className="space-y-3">
                {[
                  { icon: FileText, label: 'Resume Score', value: '88/100', color: 'text-emerald-400' },
                  { icon: Brain, label: 'AI Recommendation', value: 'Product Analytics', color: 'text-violet-400' },
                  { icon: Briefcase, label: 'Placement Matches', value: '12 Jobs', color: 'text-blue-400' },
                  { icon: MessageSquare, label: 'Interview Readiness', value: '82/100', color: 'text-amber-400' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={12} className="text-slate-500" />
                        <span className="text-[10px] text-slate-400">{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Company Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="col-span-3 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-center"
            >
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Our Alumni Work At</p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {COMPANY_LOGOS.map((name) => (
                  <span key={name} className="text-[10px] font-bold text-slate-400 tracking-wider uppercase opacity-70">
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
