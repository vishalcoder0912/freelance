import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard, Briefcase, Users, Calendar, Award, TrendingUp, Search,
  FileText, Star, ChevronRight, Plus, Clock, CheckCircle, Link2, Mail,
  Phone, MapPin, DollarSign, Filter, ExternalLink, BarChart3, UserCheck,
  Send, X, Edit, Trash2
} from 'lucide-react';

export default function RecruiterDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const name = user?.name || 'Recruiter';

  const subPage = location.pathname.replace('/recruiter', '') || '/';

  const tabs = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/recruiter' },
    { label: 'Jobs', icon: Briefcase, href: '/recruiter/jobs' },
    { label: 'Candidates', icon: Users, href: '/recruiter/candidates' },
    { label: 'Applications', icon: FileText, href: '/recruiter/applications' },
    { label: 'Interviews', icon: Calendar, href: '/recruiter/interviews' },
    { label: 'Offers', icon: Award, href: '/recruiter/offers' },
    { label: 'Analytics', icon: TrendingUp, href: '/recruiter/analytics' },
    { label: 'Company', icon: Link2, href: '/recruiter/company' },
  ];

  const renderContent = () => {
    switch (subPage) {
      case '/': return <DashboardHome />;
      case '/jobs': return <JobListings />;
      case '/candidates': return <CandidateSearch />;
      case '/applications': return <ApplicationsPipeline />;
      case '/interviews': return <InterviewManagement />;
      case '/offers': return <OfferManagement />;
      case '/analytics': return <HiringAnalytics />;
      case '/company': return <CompanyProfile />;
      default: return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 bg-[#F8FAFC]">
        {/* Sub-navigation */}
        <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-2xl shadow-sm p-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.href === '/recruiter' ? subPage === '/' : subPage.startsWith(tab.href.replace('/recruiter', ''));
            return (
              <button
                key={tab.href}
                onClick={() => navigate(tab.href)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive ? 'bg-[#6D28D9] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {renderContent()}
      </div>
    </DashboardLayout>
  );

  function DashboardHome() {
    const stats = [
      { label: 'Open Jobs', value: '14', icon: Briefcase, color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { label: 'Applications', value: '326', icon: FileText, color: 'bg-violet-50 text-violet-600 border-violet-100' },
      { label: 'Interviews', value: '41', icon: Calendar, color: 'bg-amber-50 text-amber-600 border-amber-100' },
      { label: 'Offers Sent', value: '12', icon: Award, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    ];

    const recentApps = [
      { name: 'Aditya Sen', role: 'AI Engineer', status: 'Shortlisted', statusColor: 'bg-emerald-100 text-emerald-700' },
      { name: 'Rohan Sharma', role: 'ML Engineer', status: 'Screening', statusColor: 'bg-amber-100 text-amber-700' },
      { name: 'Priya Patel', role: 'Data Scientist', status: 'Interview', statusColor: 'bg-blue-100 text-blue-700' },
      { name: 'Neha Gupta', role: 'Product Manager', status: 'Review', statusColor: 'bg-slate-100 text-slate-700' },
    ];

    const interviews = [
      { candidate: 'Aditya Sen', role: 'AI Engineer', date: 'Jun 25, 2026', time: '3:00 PM' },
      { candidate: 'Rohan Sharma', role: 'ML Engineer', date: 'Jun 26, 2026', time: '11:00 AM' },
      { candidate: 'Priya Patel', role: 'Data Scientist', date: 'Jun 27, 2026', time: '2:30 PM' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {name}</h1>
          <p className="text-sm text-slate-500 mt-1">Razorpay Recruiting</p>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`${s.color} border rounded-2xl p-5 bg-white shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon size={20} />
                  <span className="text-2xl font-extrabold text-slate-900">{s.value}</span>
                </div>
                <p className="text-xs font-bold text-slate-500">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Recent Applications</h2>
              <button onClick={() => navigate('/recruiter/applications')} className="text-xs font-bold text-[#6D28D9] hover:underline cursor-pointer">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Name</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Role</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((app, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">{app.role}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${app.statusColor}`}>{app.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="px-3 py-1 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold hover:bg-[#5B21B6] cursor-pointer">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">Upcoming Interviews</h2>
              <button onClick={() => navigate('/recruiter/interviews')} className="text-xs font-bold text-[#6D28D9] hover:underline cursor-pointer">Manage</button>
            </div>
            <div className="space-y-3">
              {interviews.map((iv, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{iv.candidate} · {iv.role}</p>
                      <p className="text-[10px] text-slate-400">{iv.date} · {iv.time}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold hover:bg-[#5B21B6] cursor-pointer">Join</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function JobListings() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ role: '', location: '', experience: '', skills: '', salary: '', description: '' });

    const jobs = [
      { role: 'Senior AI Engineer', location: 'Bangalore, IN', exp: '3-5 yrs', applicants: 42, status: 'Active', posted: 'Jun 15' },
      { role: 'ML Engineer', location: 'Remote', exp: '2-4 yrs', applicants: 28, status: 'Active', posted: 'Jun 18' },
      { role: 'Data Scientist', location: 'Mumbai, IN', exp: '2-3 yrs', applicants: 35, status: 'Active', posted: 'Jun 20' },
      { role: 'Product Manager', location: 'Delhi, IN', exp: '4-6 yrs', applicants: 18, status: 'Closed', posted: 'Jun 10' },
    ];

    const handlePost = () => {
      setShowForm(false);
      setForm({ role: '', location: '', experience: '', skills: '', salary: '', description: '' });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Job Listings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your open positions</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer">
            <Plus size={14} /> Post New Job
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Location</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Experience</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Applicants</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Posted</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{job.role}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{job.location}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{job.exp}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{job.applicants}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{job.status}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{job.posted}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-[#6D28D9] hover:bg-violet-50 rounded-lg cursor-pointer"><Edit size={14} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-800">Create Job</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-slate-50/50" />
              <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-slate-50/50" />
              <input placeholder="Experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-slate-50/50" />
              <input placeholder="Skills" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-slate-50/50" />
              <input placeholder="Salary" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-slate-50/50" />
            </div>
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-slate-50/50 resize-none" />
            <div className="flex items-center gap-3">
              <button onClick={handlePost} className="px-6 py-2.5 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] cursor-pointer">Post Job</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function CandidateSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const [scoreFilter, setScoreFilter] = useState('');

    const candidates = [
      { name: 'Aditya Sen', role: 'AI Engineer', match: 94, exp: '3 years', availability: 'Immediate', status: 'Shortlisted', statusColor: 'bg-emerald-100 text-emerald-700' },
      { name: 'Rohan Sharma', role: 'ML Engineer', match: 91, exp: '4 years', availability: '2 weeks', status: 'Interview', statusColor: 'bg-blue-100 text-blue-700' },
      { name: 'Priya Patel', role: 'Data Scientist', match: 88, exp: '2 years', availability: '1 month', status: 'Reviewed', statusColor: 'bg-amber-100 text-amber-700' },
      { name: 'Siddharth Mehta', role: 'Backend Engineer', match: 85, exp: '5 years', availability: 'Immediate', status: 'New', statusColor: 'bg-slate-100 text-slate-700' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Candidates</h1>
            <p className="text-sm text-slate-500 mt-1">Find the best talent for your roles</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search candidates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-white" />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select value={programFilter} onChange={e => setProgramFilter(e.target.value)} className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#6D28D9] appearance-none">
              <option value="">All Programs</option>
              <option>AI & ML</option>
              <option>Data Science</option>
              <option>Product Management</option>
            </select>
          </div>
          <select value={scoreFilter} onChange={e => setScoreFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#6D28D9]">
            <option value="">Min Score</option>
            <option>90%+</option>
            <option>80%+</option>
            <option>70%+</option>
          </select>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Match Score</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Experience</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Availability</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((c, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{c.role}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><Star size={12} className="text-amber-400 fill-amber-400" /> {c.match}%</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{c.exp}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{c.availability}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.statusColor}`}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold hover:bg-[#5B21B6] cursor-pointer">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function ApplicationsPipeline() {
    const stages = [
      {
        title: 'Applied', color: 'border-t-sky-400', count: 3,
        cards: [
          { name: 'Ravi Kumar', role: 'AI Engineer', date: 'Jun 20', initials: 'RK' },
          { name: 'Sneha Reddy', role: 'Data Analyst', date: 'Jun 21', initials: 'SR' },
          { name: 'Ankit Verma', role: 'ML Engineer', date: 'Jun 22', initials: 'AV' },
        ]
      },
      {
        title: 'Screening', color: 'border-t-amber-400', count: 3,
        cards: [
          { name: 'Neha Gupta', role: 'Product Manager', date: 'Jun 19', initials: 'NG' },
          { name: 'Vikram Singh', role: 'Backend Engineer', date: 'Jun 20', initials: 'VS' },
          { name: 'Pooja Jain', role: 'Data Scientist', date: 'Jun 20', initials: 'PJ' },
        ]
      },
      {
        title: 'Interview', color: 'border-t-blue-400', count: 2,
        cards: [
          { name: 'Aditya Sen', role: 'AI Engineer', date: 'Jun 25', initials: 'AS' },
          { name: 'Rohan Sharma', role: 'ML Engineer', date: 'Jun 26', initials: 'RS' },
        ]
      },
      {
        title: 'Offer', color: 'border-t-emerald-400', count: 1,
        cards: [
          { name: 'Priya Patel', role: 'Data Scientist', date: 'Jun 22', initials: 'PP' },
        ]
      },
      {
        title: 'Hired', color: 'border-t-[#6D28D9]', count: 1,
        cards: [
          { name: 'Amit Desai', role: 'DevOps Engineer', date: 'Jun 15', initials: 'AD' },
        ]
      },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Applications Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">Track candidates through your hiring stages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage, si) => (
            <div key={si} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
              <div className={`bg-white border-t-4 ${stage.color} px-4 py-3 border-b border-slate-100`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700">{stage.title}</h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{stage.count}</span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {stage.cards.map((card, ci) => (
                  <div key={ci} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white text-[10px] font-bold">
                        {card.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-700 truncate">{card.name}</p>
                        <p className="text-[9px] text-slate-400 truncate">{card.role}</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-2">{card.date}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function InterviewManagement() {
    const interviews = [
      { candidate: 'Aditya Sen', role: 'AI Engineer', date: 'Jun 25, 2026', time: '3:00 PM', type: 'Technical', status: 'Confirmed', statusColor: 'bg-emerald-100 text-emerald-700' },
      { candidate: 'Rohan Sharma', role: 'ML Engineer', date: 'Jun 26, 2026', time: '11:00 AM', type: 'System Design', status: 'Confirmed', statusColor: 'bg-emerald-100 text-emerald-700' },
      { candidate: 'Priya Patel', role: 'Data Scientist', date: 'Jun 27, 2026', time: '2:30 PM', type: 'HR Round', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700' },
      { candidate: 'Neha Gupta', role: 'Product Manager', date: 'Jun 28, 2026', time: '10:00 AM', type: 'Technical', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700' },
    ];

    const [scheduleForm, setScheduleForm] = useState({ candidate: '', role: '', date: '', time: '', type: 'Technical' });

    const handleSchedule = () => {
      setScheduleForm({ candidate: '', role: '', date: '', time: '', type: 'Technical' });
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Interviews</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and schedule candidate interviews</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Upcoming Interviews</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Time</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Type</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((iv, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
                          {iv.candidate.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{iv.candidate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{iv.role}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{iv.date}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{iv.time}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{iv.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${iv.statusColor}`}>{iv.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold hover:bg-[#5B21B6] cursor-pointer">Join</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Schedule New Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input placeholder="Candidate" value={scheduleForm.candidate} onChange={e => setScheduleForm({ ...scheduleForm, candidate: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-slate-50/50" />
            <input placeholder="Role" value={scheduleForm.role} onChange={e => setScheduleForm({ ...scheduleForm, role: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-slate-50/50" />
            <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-slate-50/50" />
            <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-slate-50/50" />
            <select value={scheduleForm.type} onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#6D28D9]">
              <option>Technical</option>
              <option>System Design</option>
              <option>HR Round</option>
              <option>Managerial</option>
            </select>
          </div>
          <button onClick={handleSchedule} className="px-6 py-2.5 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] cursor-pointer">Schedule</button>
        </div>
      </div>
    );
  }

  function OfferManagement() {
    const [offerForm, setOfferForm] = useState({ candidate: '', role: '', amount: '' });

    const offers = [
      { candidate: 'Aditya Sen', role: 'AI Engineer', amount: '₹28 LPA', status: 'Sent', statusColor: 'bg-amber-100 text-amber-700', date: 'Jun 22' },
      { candidate: 'Rohan Sharma', role: 'ML Engineer', amount: '₹24 LPA', status: 'Accepted', statusColor: 'bg-emerald-100 text-emerald-700', date: 'Jun 20' },
      { candidate: 'Priya Patel', role: 'Data Scientist', amount: '₹22 LPA', status: 'Declined', statusColor: 'bg-rose-100 text-rose-700', date: 'Jun 18' },
      { candidate: 'Siddharth Mehta', role: 'Backend Engineer', amount: '₹30 LPA', status: 'Sent', statusColor: 'bg-amber-100 text-amber-700', date: 'Jun 23' },
    ];

    const handleSend = () => {
      setOfferForm({ candidate: '', role: '', amount: '' });
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Offers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage offers sent to candidates</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Offer Amount</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
                          {o.candidate.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{o.candidate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{o.role}</td>
                    <td className="px-6 py-4 text-xs font-bold text-emerald-600">{o.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.statusColor}`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{o.date}</td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold hover:bg-[#5B21B6] cursor-pointer">
                        {o.status === 'Sent' ? 'Remind' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Send New Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Candidate" value={offerForm.candidate} onChange={e => setOfferForm({ ...offerForm, candidate: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-slate-50/50" />
            <input placeholder="Role" value={offerForm.role} onChange={e => setOfferForm({ ...offerForm, role: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-slate-50/50" />
            <input placeholder="Amount (e.g. ₹24 LPA)" value={offerForm.amount} onChange={e => setOfferForm({ ...offerForm, amount: e.target.value })} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9] bg-slate-50/50" />
          </div>
          <button onClick={handleSend} className="flex items-center gap-2 px-6 py-2.5 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] cursor-pointer">
            <Send size={14} /> Send Offer
          </button>
        </div>
      </div>
    );
  }

  function HiringAnalytics() {
    const metrics = [
      { label: 'Time to Hire', value: '18 days', icon: Clock, pct: 72, color: 'text-blue-600', barColor: 'bg-blue-500' },
      { label: 'Offer Acceptance', value: '83%', icon: CheckCircle, pct: 83, color: 'text-emerald-600', barColor: 'bg-emerald-500' },
      { label: 'Interview Conversion', value: '37%', icon: TrendingUp, pct: 37, color: 'text-amber-600', barColor: 'bg-amber-500' },
      { label: 'Top Skills', value: 'Python, SQL, ML', icon: Star, pct: 90, color: 'text-violet-600', barColor: 'bg-violet-500' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hiring Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Key metrics and insights for your hiring pipeline</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Icon size={20} className={m.color} />
                  <span className="text-2xl font-extrabold text-slate-900">{m.value}</span>
                </div>
                <p className="text-xs font-bold text-slate-500">{m.label}</p>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`${m.barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><BarChart3 size={16} className="text-[#6D28D9]" /> Monthly Hiring Trend</h2>
            <div className="flex items-end justify-between h-32 pt-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                <div key={i} className="text-center flex-1">
                  <div className="w-full px-2">
                    <div className="w-full bg-slate-100 rounded-lg relative overflow-hidden" style={{ height: '100px' }}>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#6D28D9] to-[#8B5CF6] rounded-lg transition-all" style={{ height: `${[30, 45, 40, 65, 55, 70][i]}%` }} />
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5">{month}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><UserCheck size={16} className="text-[#6D28D9]" /> Source of Hires</h2>
            <div className="space-y-3">
              {[
                { label: 'LinkedIn', pct: 45, color: 'bg-blue-500' },
                { label: 'Referrals', pct: 25, color: 'bg-emerald-500' },
                { label: 'Career Page', pct: 18, color: 'bg-amber-500' },
                { label: 'Campus', pct: 12, color: 'bg-violet-500' },
              ].map((src, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-slate-600 w-20">{src.label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`${src.color} h-full rounded-full`} style={{ width: `${src.pct}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 w-8 text-right">{src.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function CompanyProfile() {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto">
            <Link2 size={36} className="text-slate-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Company Profile</h2>
            <p className="text-sm text-slate-400 mt-1">Company profile settings coming soon</p>
          </div>
          <button className="px-6 py-2.5 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] cursor-pointer">
            Get Notified
          </button>
        </div>
      </div>
    );
  }
}
