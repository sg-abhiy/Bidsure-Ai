import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw, Plus, FileText, CheckCircle2, FileWarning, RotateCcw } from 'lucide-react';
import { Project } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (proj: Project) => void;
  onNewProject: () => void;
  onResetDemo: () => void;
  isResetting: boolean;
  onStartFresh?: () => void;
  onOpenPlainBriefing?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  projects,
  selectedProject,
  onSelectProject,
  onNewProject,
  onResetDemo,
  isResetting,
  onStartFresh,
  onOpenPlainBriefing,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'compliance', label: 'Compliance Analysis' },
    { id: 'documents', label: 'Documents' },
    { id: 'contradictions', label: 'Contradictions & Missing' },
    { id: 'report', label: 'Report Dossier' },
    { id: 'projects', label: 'All Projects' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm print:hidden">
      {/* Top Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex flex-wrap justify-end items-center gap-3">
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Hybrid Verification (Deterministic Rules + Gemini AI)</span>
          </div>
          {onStartFresh && (
            <button
              onClick={onStartFresh}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors text-xs font-semibold cursor-pointer"
              title="Clear data and start fresh with new tender details"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Start Fresh</span>
            </button>
          )}
          <span className="text-slate-700">|</span>
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-xs font-medium cursor-pointer"
            title="Reset to sample demo project"
          >
            <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Load Sample Demo'}</span>
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  BidSure<span className="text-amber-400 font-extrabold">.AI</span>
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-700">
                  v2.6 GeM Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                Explainable Compliance & Evidence Traceability
              </p>
            </div>
          </div>

          {/* Project Selector Switcher */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Active Bid:</span>
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const found = projects.find((p) => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="bg-slate-900 text-white text-xs font-semibold rounded px-2.5 py-1 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400 max-w-[240px] truncate cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.tenderId} - {p.bidderName}
                </option>
              ))}
            </select>
          </div>

          {/* New Project & Start Fresh CTAs */}
          <div className="flex items-center gap-2">
            {onOpenPlainBriefing && (
              <button
                onClick={onOpenPlainBriefing}
                className="hidden lg:inline-flex items-center gap-1.5 bg-indigo-950/70 hover:bg-indigo-900/80 text-amber-300 border border-indigo-700/60 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                title="Plain English Executive Briefing for Non-Technical Committee"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Plain English Briefing</span>
              </button>
            )}
            {onStartFresh && (
              <button
                onClick={onStartFresh}
                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-400/50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                title="Wipe data and enter new tender & bidder details"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Start Fresh</span>
              </button>
            )}
            <button
              onClick={onNewProject}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-slate-800/50 rounded-t-md'
                    : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
