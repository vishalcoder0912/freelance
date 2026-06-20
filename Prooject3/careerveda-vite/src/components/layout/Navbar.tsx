import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sparkles, Brain, GraduationCap, Building2, Users, BookOpen, ArrowRight } from 'lucide-react';

const programLinks = [
  { label: 'Business Analytics with Gen AI', slug: 'business-analytics-with-gen-ai' },
  { label: 'Product Management', slug: 'product-management' },
  { label: 'Data Science with Gen AI', slug: 'data-science-with-gen-ai' },
  { label: 'Data Analytics with Gen AI', slug: 'data-analytics-with-gen-ai' },
  { label: 'Investment Banking', slug: 'investment-banking' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[rgba(250,250,252,0.8)] backdrop-blur-md border-b border-[rgba(15,23,42,0.06)] py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              <Brain size={18} />
              <div className="absolute inset-0 bg-indigo-600 rounded-xl blur-md opacity-35 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-none text-[#0F172A]">
                Career<span className="text-indigo-600">Veda</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
                AI Career OS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5">
            
            {/* Programs Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('programs')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeDropdown === 'programs' ? 'text-indigo-600 bg-indigo-50/55' : 'text-slate-600 hover:text-indigo-600'
              }`}>
                Programs <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'programs' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'programs' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-72 mt-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-xl shadow-slate-200/50"
                  >
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-1">
                      <GraduationCap size={12} className="text-indigo-500" /> Executive Pathways
                    </p>
                    <div className="grid gap-1">
                      {programLinks.map((prog) => (
                        <Link 
                          key={prog.slug} 
                          to={`/program/${prog.slug}`}
                          className="px-3 py-2.5 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors text-xs font-semibold block animate-in fade-in slide-in-from-top-1 duration-100"
                        >
                          {prog.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Career Paths */}
            <Link to="/career-paths" className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Career Paths
            </Link>

            {/* For Companies */}
            <Link to="/employers" className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              For Companies
            </Link>
            
            {/* Our Achievers */}
            <Link to="/achievers" className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Our Achievers
            </Link>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeDropdown === 'resources' ? 'text-indigo-600 bg-indigo-50/55' : 'text-slate-600 hover:text-indigo-600'
              }`}>
                Resources <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-48 mt-2 bg-white border border-slate-100 rounded-2xl p-3 shadow-xl shadow-slate-200/50"
                  >
                    <div className="grid gap-1">
                      <Link to="/faculty" className="px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors text-xs font-semibold block">
                        Our Faculty
                      </Link>
                      <Link to="/blog" className="px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors text-xs font-semibold block">
                        Our Blog
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pricing */}
            <a 
              href="#pricing" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('demo-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </a>

          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white transition-all shadow-sm"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/career-analysis')} 
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all duration-200 cursor-pointer shadow"
            >
              Start Free Analysis <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 p-6 shadow-2xl flex flex-col justify-between lg:hidden"
            >
              <div className="mt-8 space-y-6">
                
                {/* Logo */}
                <div className="flex items-center gap-2.5 pb-6 border-b border-slate-100">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Brain size={16} />
                  </div>
                  <span className="font-bold text-base text-[#0F172A]">CareerVeda</span>
                </div>

                {/* Mobile Links */}
                <div className="space-y-1">
                  
                  {/* Programs sub-list */}
                  <div className="py-2">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'programs' ? null : 'programs')}
                      className="flex items-center justify-between w-full text-slate-800 font-semibold text-sm py-2"
                    >
                      <span className="flex items-center gap-2"><BookOpen size={16} className="text-slate-400" /> Programs</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === 'programs' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'programs' && (
                      <div className="pl-6 pt-2 grid gap-2 border-l border-slate-100 ml-2 mt-1">
                        {programLinks.map((prog) => (
                          <Link 
                            key={prog.slug} 
                            to={`/program/${prog.slug}`}
                            className="text-slate-600 text-xs py-1 hover:text-indigo-600 block"
                          >
                            {prog.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link to="/achievers" className="flex items-center gap-2 text-slate-800 font-semibold text-sm py-3">
                    <Users size={16} className="text-slate-400" /> Our Achievers
                  </Link>

                  <Link to="/faculty" className="flex items-center gap-2 text-slate-800 font-semibold text-sm py-3">
                    <GraduationCap size={16} className="text-slate-400" /> Our Faculty
                  </Link>

                  <Link to="/blog" className="flex items-center gap-2 text-slate-800 font-semibold text-sm py-3">
                    <BookOpen size={16} className="text-slate-400" /> Our Blog
                  </Link>

                  <Link to="/employers" className="flex items-center gap-2 text-slate-800 font-semibold text-sm py-3">
                    <Building2 size={16} className="text-slate-400" /> For Employers
                  </Link>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => navigate('/login')} 
                  className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-semibold rounded-xl transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/career-analysis')} 
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                  Start Free Analysis <Sparkles size={16} />
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
