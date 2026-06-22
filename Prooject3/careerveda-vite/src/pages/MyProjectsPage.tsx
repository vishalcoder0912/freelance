import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FolderKanban, Users, Star, ExternalLink } from 'lucide-react';
import { getStudentData } from '@/lib/studentData';

export default function MyProjectsPage() {
  const [data, setData] = useState(getStudentData());
  useEffect(() => { setData(getStudentData()); }, []);
  const projects = data.projects || [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Showcase your work and track project progress.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: projects.length, color: 'text-[#6D28D9]', bg: 'bg-violet-50' },
            { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border border-slate-100 rounded-2xl p-5 text-center shadow-sm`}>
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <FolderKanban size={18} className="text-[#6D28D9]" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : project.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-1">{project.title}</h3>
                <p className="text-xs text-slate-400 mb-1">{project.category}</p>

                <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {project.teamSize} members</span>
                  {project.score && <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {project.score}/100</span>}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech, j) => (
                    <span key={j} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-medium text-slate-500">{tech}</span>
                  ))}
                </div>

                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-[#6D28D9] hover:underline">
                    <ExternalLink size={12} /> View on GitHub
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500">No projects yet</p>
            <p className="text-xs text-slate-400 mt-1">Start a new project to showcase your work</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
