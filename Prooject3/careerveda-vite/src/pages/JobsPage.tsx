import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Briefcase, MapPin, Clock, DollarSign, Star, Search, Filter,
  Bookmark, BookmarkCheck, ChevronRight, Building2, Users, Award
} from 'lucide-react';
import { getStudentData, applyForJob, isPlacementLocked, getPlacementReadiness, getPlacementTier, type JobListing } from '@/lib/studentData';

const JOB_LISTINGS: JobListing[] = [
  { id: 'j1', company: 'Google', role: 'Data Scientist', location: 'Bangalore, India', salary: '₹25 LPA', type: 'Full-time', experience: '2-4 years', skills: ['Python', 'TensorFlow', 'SQL', 'ML'], postedAt: '2 days ago', description: 'Build ML models for Google Search and Assistant. Work with petabyte-scale data.' },
  { id: 'j2', company: 'Microsoft', role: 'AI Engineer', location: 'Hyderabad, India', salary: '₹22 LPA', type: 'Full-time', experience: '3-5 years', skills: ['PyTorch', 'Azure', 'NLP', 'Transformers'], postedAt: '1 week ago', description: 'Develop and deploy AI solutions for Microsoft Copilot and Azure AI services.' },
  { id: 'j3', company: 'Amazon', role: 'ML Engineer', location: 'Bangalore, India', salary: '₹28 LPA', type: 'Full-time', experience: '3-6 years', skills: ['AWS', 'SageMaker', 'Python', 'Deep Learning'], postedAt: '3 days ago', description: 'Build recommendation systems and supply chain ML models at Amazon scale.' },
  { id: 'j4', company: 'Razorpay', role: 'Data Analyst', location: 'Bangalore, India', salary: '₹12 LPA', type: 'Full-time', experience: '1-3 years', skills: ['SQL', 'Python', 'Tableau', 'Statistics'], postedAt: '5 days ago', description: 'Analyze payment data and build dashboards for business teams.' },
  { id: 'j5', company: 'Deloitte', role: 'Business Analyst', location: 'Mumbai, India', salary: '₹10 LPA', type: 'Full-time', experience: '0-2 years', skills: ['Excel', 'SQL', 'Power BI', 'Communication'], postedAt: '1 week ago', description: 'Work with consulting teams to deliver data-driven insights to clients.' },
  { id: 'j6', company: 'Adobe', role: 'Product Analyst', location: 'Noida, India', salary: '₹18 LPA', type: 'Full-time', experience: '2-4 years', skills: ['Product Analytics', 'SQL', 'A/B Testing', 'Python'], postedAt: '4 days ago', description: 'Drive product decisions through data analysis and experimentation.' },
];

export default function JobsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(getStudentData());
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const locked = isPlacementLocked();
  const readiness = getPlacementReadiness();
  const tier = getPlacementTier(readiness);

  const allSkills = [...new Set(JOB_LISTINGS.flatMap(j => j.skills))];
  const filtered = JOB_LISTINGS.filter(j =>
    (j.role.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())) &&
    (!selectedSkill || j.skills.includes(selectedSkill))
  );

  const handleApply = (job: JobListing) => {
    if (locked) return;
    applyForJob(job);
    setData(getStudentData());
  };

  const isApplied = (jobId: string) => data.applications.some(a => a.jobId === jobId);
  const isSaved = (jobId: string) => data.savedJobs.includes(jobId);

  const toggleSave = (jobId: string) => {
    const d = getStudentData();
    d.savedJobs = d.savedJobs.includes(jobId) ? d.savedJobs.filter(id => id !== jobId) : [...d.savedJobs, jobId];
    setData(d);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Jobs</h1>
            <p className="text-sm text-slate-500 mt-1">Find your next opportunity</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border ${locked ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              {locked ? `${tier} · ${readiness}%` : `Placement Ready · ${readiness}%`}
            </div>
          </div>
        </div>

        {locked && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Award size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800">Placement eligibility not yet met</p>
              <p className="text-[10px] text-amber-700 mt-0.5">Complete all onboarding steps, maintain 80%+ attendance, and score 70%+ on assignments and projects to unlock job applications.</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs by role or company..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#6D28D9]" />
          </div>
          <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#6D28D9] bg-white cursor-pointer">
            <option value="">All Skills</option>
            {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-[10px] font-bold text-slate-400">{filtered.length} jobs</span>
        </div>

        <div className="space-y-3">
          {filtered.map((job) => (
            <div key={job.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {job.company[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{job.role}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400"><MapPin size={11} /> {job.location}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400"><DollarSign size={11} /> {job.salary}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400"><Briefcase size={11} /> {job.type}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400"><Clock size={11} /> {job.postedAt}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">{job.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {job.skills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleSave(job.id)} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer">
                    {isSaved(job.id) ? <BookmarkCheck size={16} className="text-[#6D28D9]" /> : <Bookmark size={16} />}
                  </button>
                  <button
                    onClick={() => handleApply(job)}
                    disabled={locked || isApplied(job.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      isApplied(job.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      locked ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                      'bg-[#6D28D9] text-white hover:bg-[#5B21B6]'
                    }`}
                  >
                    {isApplied(job.id) ? 'Applied' : locked ? 'Locked' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
              <Briefcase size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-500">No jobs match your search</p>
              <p className="text-xs text-slate-400 mt-1">Try different keywords or filters</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
