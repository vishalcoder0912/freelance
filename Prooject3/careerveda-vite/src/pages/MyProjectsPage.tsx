import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FolderKanban, Users, Star, ExternalLink } from 'lucide-react';

const PROJECTS = [
  { title: 'Automated ATS Resume Grader', category: 'AI', status: 'Completed', score: 92, teamSize: 3, technologies: ['Python', 'DeepSeek', 'Vite'] },
  { title: 'Real-time Distributed Chat Gateway', category: 'Web Development', status: 'In Progress', score: 78, teamSize: 2, technologies: ['React', 'Node.js', 'Redis'] },
  { title: 'Market Basket Affinity Predictor', category: 'Data Science', status: 'Completed', score: 88, teamSize: 4, technologies: ['Python', 'Tableau', 'Scikit-Learn'] },
  { title: 'Multi-Agent Orchestration System', category: 'AI', status: 'In Progress', score: 65, teamSize: 3, technologies: ['LangChain', 'FastAPI', 'Docker'] },
];

export default function MyProjectsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Showcase your work and track project progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <FolderKanban size={18} className="text-indigo-500" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                  {project.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-1">{project.title}</h3>
              <p className="text-xs text-slate-400 mb-1">{project.category}</p>

              <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users size={12} /> {project.teamSize} members</span>
                <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {project.score}/100</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech, j) => (
                  <span key={j} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-medium text-slate-500">{tech}</span>
                ))}
              </div>

              <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                <ExternalLink size={12} /> View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}