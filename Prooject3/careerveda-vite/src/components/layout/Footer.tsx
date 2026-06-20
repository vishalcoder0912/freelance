import { Link } from 'react-router-dom';
import { Brain, Send } from 'lucide-react';

const footerLinks = {
  Programs: [
    { label: 'Business Analytics with Gen AI', href: '/program/business-analytics-with-gen-ai' },
    { label: 'Product Management', href: '/program/product-management' },
    { label: 'Data Science with Gen AI', href: '/program/data-science-with-gen-ai' },
    { label: 'Data Analytics with Gen AI', href: '/program/data-analytics-with-gen-ai' },
    { label: 'Investment Banking', href: '/program/investment-banking' },
  ],
  Resources: [
    { label: 'AI Career Copilot', href: '/ai-copilot' },
    { label: 'Resume ATS Review', href: '/resume-analyzer' },
    { label: 'Mock Interview Prep', href: '/interview-coach' },
    { label: 'Career Roadmap tool', href: '/career-paths' },
  ],
  Company: [
    { label: 'About Us', href: '/' },
    { label: 'Our Achievers', href: '/achievers' },
    { label: 'Our Faculty', href: '/faculty' },
    { label: 'Our Blog', href: '/blog' },
  ],
  Employers: [
    { label: 'Talent Acquisition', href: '/employers' },
    { label: 'Hire Achievers', href: '/employers' },
    { label: 'Corporate Training', href: '/employers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="relative border-t border-slate-100 bg-white pt-20 pb-10">
      
      {/* Decorative top fade */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
                <Brain size={18} />
              </div>
              <span className="font-bold text-base text-slate-800">
                Career<span className="text-indigo-600">Veda</span>
                <span className="text-[10px] text-slate-400 font-medium ml-1.5 px-1.5 py-0.5 rounded-full border border-slate-100 bg-slate-50">AI OS</span>
              </span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              We analyze your skills, build your roadmap, prepare you for interviews, and connect you with life-changing opportunities. Become irreplaceable.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {[GithubIcon, TwitterIcon, LinkedinIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="font-semibold text-xs text-slate-800 tracking-wider uppercase">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-slate-500 hover:text-indigo-600 text-xs font-medium transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Newsletter & Bottom Strip */}
        <div className="pt-10 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Newsletter */}
          <div className="w-full lg:w-auto flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-800">Subscribe to our Career Digest</p>
              <p className="text-[10px] text-slate-500">Weekly career tips, roadmap reviews, and top vacancies.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex max-w-sm w-full relative">
              <input 
                type="email" 
                placeholder="your.email@domain.com"
                required
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs bg-slate-50/50"
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 w-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

          {/* Copyrights */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left text-[11px] text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} CareerVeda AI OS. All rights reserved.</p>
            <span className="hidden md:inline text-slate-200">|</span>
            <p>Designed with excellence for ambitious professionals.</p>
          </div>

        </div>

      </div>
    </footer>
  );
}
