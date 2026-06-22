import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Mail, Lock, ShieldAlert, Sparkles, Eye, EyeOff, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function syncUserToPostgres(userData: {
  firebase_uid: string;
  name: string;
  email: string;
  role?: string;
  provider?: string;
  photo_url?: string;
}) {
  try {
    const res = await fetch(`${API_URL}/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) console.warn('PostgreSQL sync failed:', await res.text());
  } catch (err) {
    console.warn('PostgreSQL sync error:', err);
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Sync user to PostgreSQL
      await syncUserToPostgres({
        firebase_uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || email,
        role: 'STUDENT',
        provider: 'email',
      });

      const pending = localStorage.getItem('pending_purchase');
      if (pending) {
        localStorage.setItem('purchased_program', pending);
        localStorage.removeItem('pending_purchase');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (providerName: 'google' | 'github') => {
    setError('');
    setLoading(true);
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Sync user to PostgreSQL
      await syncUserToPostgres({
        firebase_uid: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        role: 'STUDENT',
        provider: providerName,
        photo_url: user.photoURL || undefined,
      });

      const pending = localStorage.getItem('pending_purchase');
      if (pending) {
        localStorage.setItem('purchased_program', pending);
        localStorage.removeItem('pending_purchase');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${providerName}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm hover:shadow-md cursor-pointer z-50"
      >
        <ArrowLeft size={14} /> Back
      </motion.button>

      {/* ===== LEFT: AUTH FORM ===== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-5 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12 relative z-10"
      >
        <div className="max-w-md w-full mx-auto space-y-7">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20 group-hover:shadow-lg group-hover:shadow-indigo-600/30 transition-shadow">
              <Brain size={20} />
            </div>
            <span className="font-bold text-lg text-slate-800">
              Career<span className="text-indigo-600">Veda</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Enter your details to access your career dashboard.</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-medium"
            >
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.name@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                />
                <Mail size={15} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                />
                <Lock size={15} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-2xl hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ChevronRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-1/3 h-px bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
            <span>Or continue with</span>
            <span className="w-1/3 h-px bg-gradient-to-l from-transparent via-slate-200 to-slate-200" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleProviderLogin('google')}
              className="flex items-center justify-center gap-2.5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleProviderLogin('github')}
              className="flex items-center justify-center gap-2.5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
              Register now
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ===== RIGHT: VISUAL PANEL ===== */}
      <div className="hidden lg:col-span-7 lg:flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 min-h-screen">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        {/* Ambient glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]" />

        {/* Floating orbs */}
        <div className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-indigo-400/40 animate-pulse" />
        <div className="absolute top-[35%] left-[15%] w-1.5 h-1.5 rounded-full bg-violet-400/30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[25%] right-[30%] w-2.5 h-2.5 rounded-full bg-emerald-400/20 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col justify-between min-h-screen p-16">
          {/* Top section */}
          <div className="space-y-5 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-indigo-300 uppercase backdrop-blur-sm">
              <Sparkles size={12} /> AI Career OS Ecosystem
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl font-extrabold tracking-tight text-white leading-tight"
            >
              Become
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">Irreplaceable</span>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-indigo-200/80 text-sm leading-relaxed"
            >
              Get personalized AI career analysis, structured 6-month roadmap tracking, expert 1-on-1 coaching sessions, and placement recommendations.
            </motion.p>
          </div>

          {/* Bottom - Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative max-w-sm"
          >
            {/* Decorative quote mark */}
            <div className="absolute -top-3 -left-2 text-5xl font-serif text-indigo-500/20 leading-none">&ldquo;</div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl hover:bg-white/10 transition-colors">
              <p className="text-indigo-100 text-sm leading-relaxed">
                "The AI dashboard matches you with live openings, while showing you the exact skills you need to learn. It completely transformed my search."
              </p>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg">
                  S
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Siddharth Mehta</p>
                  <p className="text-[10px] text-indigo-300">AI Engineer at Razorpay</p>
                </div>
              </div>
            </div>

            {/* Bottom glow line */}
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
