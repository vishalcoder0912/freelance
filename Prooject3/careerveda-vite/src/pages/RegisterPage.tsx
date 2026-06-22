import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Firebase imports are commented out – using localStorage auth instead.
// import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
import { Brain, ArrowLeft, Mail, Lock, User, ShieldAlert, Sparkles } from 'lucide-react';
import { initStudentData } from '@/lib/studentData';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 800));

      // Default role is student
      const role = 'student';

      // Store user in localStorage
      localStorage.setItem('careerveda_user', JSON.stringify({
        name,
        email,
        role,
        photoURL: null,
      }));

      // Initialize student progress data (defaults to all zeros)
      initStudentData();

      // Complete pending purchase
      const pending = localStorage.getItem('pending_purchase');
      if (pending) {
        localStorage.setItem('purchased_program', pending);
        localStorage.removeItem('pending_purchase');
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register account. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers are disabled when Firebase is commented out
  const handleProviderLogin = async (_providerName: 'google' | 'github') => {
    setError('Social registration is unavailable in offline mode. Please use email/password.');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAFAFC] grid-bg-light">
      
      {/* Left Back Arrow */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer z-50"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Left Columns: Register Form */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 relative z-10">
        
        <div className="max-w-md w-full mx-auto space-y-6">
          
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 group inline-block">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
                <Brain size={18} />
              </div>
              <span className="font-bold text-base text-slate-800">
                Career<span className="text-indigo-600">Veda</span>
              </span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 text-xs">Unlock your personalized career analysis dashboard.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium">
              <ShieldAlert size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Rohan Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                />
                <User size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="rohan@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                />
                <Mail size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                />
                <Lock size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-1/3 h-px bg-slate-100" />
            <span>Or register with</span>
            <span className="w-1/3 h-px bg-slate-100" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleProviderLogin('google')}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" strokeLinejoin="round" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" strokeLinejoin="round" />
              </svg>
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleProviderLogin('github')}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 font-medium">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
          </p>

        </div>
      </div>

      {/* Right Column: Visual Panel */}
      <div className="hidden lg:col-span-7 bg-indigo-900 text-white relative lg:flex flex-col justify-between p-20 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-4 max-w-md relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest text-indigo-300 uppercase">
            <Sparkles size={11} /> AI Career OS Ecosystem
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Become Irreplaceable.</h2>
          <p className="text-indigo-200 text-xs leading-relaxed">
            Register today to benchmark your ATS Score, unlock 100+ roadmap steps, coordinate with top industry experts, and match with the top company listings.
          </p>
        </div>

        <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-sm">
          <p className="text-indigo-200 text-xs italic">
            "We built this platform to provide high-fidelity curriculum resources and dynamic AI tools for ambitious professionals looking to pivot."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-300/30 flex items-center justify-center font-bold text-xs">CV</div>
            <div>
              <p className="text-xs font-bold">CareerVeda Faculty</p>
              <p className="text-[9px] text-indigo-300">Curriculum Advisory Board</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
