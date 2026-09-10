import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Layers,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileWarning,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  onNewProject: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onNewProject,
}) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLIANT') return p.status === 'COMPLIANT';
    if (filter === 'REVIEW') return p.status === 'REVIEW REQUIRED';
    if (filter === 'NON_COMPLIANT') return p.status === 'NON-COMPLIANT';
    return true;
  });

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            COMPLIANT
          </span>
        );
      case 'REVIEW REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            REVIEW REQUIRED
          </span>
        );
      case 'NON-COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <FileWarning className="w-3.5 h-3.5 text-rose-600" />
            NON-COMPLIANT
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            GeM Procurement Compliance Projects
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and archived tender compliance audits with evidence verification
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>New Analysis Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const isSelected = selectedProject?.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className={`bg-white rounded-xl border p-6 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-md ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {p.tenderId}
                  </span>
                  {getStatusBadge(p.status)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">Buyer:</span>
                    <span className="truncate">{p.organization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-700">Bidder:</span>
                    <span className="font-medium text-slate-900 truncate">{p.bidderName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">Deadline:</span>
                    <span>{new Date(p.tenderDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Bottom stats row */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Score
                    </span>
                    <span className="font-mono font-extrabold text-sm text-slate-900">
                      {p.overallScore}%
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Clauses
                    </span>
                    <span className="font-mono font-bold text-slate-700">
                      {p.stats.totalRequirements}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-rose-500 uppercase font-bold block">
                      Fail
                    </span>
                    <span className="font-mono font-bold text-rose-700">
                      {p.stats.nonCompliant}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(p);
                  }}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <span>{isSelected ? 'Active Bid' : 'View Audit'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
