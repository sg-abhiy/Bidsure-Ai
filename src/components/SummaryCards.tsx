import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  FileWarning,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Info,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Project, RequirementCategory } from '../types';

interface SummaryCardsProps {
  project: Project;
  onNavigateToTab: (tab: string) => void;
  onRunCheck: () => void;
  isChecking: boolean;
  onOpenPlainBriefing?: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  project,
  onNavigateToTab,
  onRunCheck,
  isChecking,
  onOpenPlainBriefing,
}) => {
  if (!project) {
    return null;
  }

  const stats = project.stats || {
    totalRequirements: 0,
    compliant: 0,
    needsReview: 0,
    nonCompliant: 0,
  };
  const overallScore = project.overallScore ?? 0;
  const categoryScores = project.categoryScores || {};

  // Status visual mapping
  const getStatusBadge = () => {
    if (stats.totalRequirements === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          DRAFT / READY FOR FILES
        </span>
      );
    }
    if (stats.nonCompliant > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
          NON-COMPLIANT
        </span>
      );
    }
    if (stats.needsReview > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          REVIEW REQUIRED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
        COMPLIANT
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (stats.totalRequirements === 0) return 'text-slate-400 border-slate-300 bg-slate-50';
    if (score >= 85) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 65) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  const categories: RequirementCategory[] = [
    'Eligibility',
    'Financial',
    'Experience',
    'Technical',
    'Certification',
    'Documentation',
    'Delivery',
    'Legal/Regulatory',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Bid Compliance Analysis */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Tender & Bidder Information */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-mono">
                Tender ID: {project.tenderId}
              </span>
              {getStatusBadge()}
              {project.isDemo && (
                <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                  SIH26100 Reference Case
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.name}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">Procuring Entity:</span>
                <span className="truncate">{project.organization}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-700">Submitted Bidder:</span>
                <span className="font-medium text-slate-900 truncate">{project.bidderName}</span>
              </div>
              {project.bidderGstin && (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="font-semibold text-slate-700">GSTIN:</span>
                  <span className="text-slate-800">{project.bidderGstin}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">Tender Deadline:</span>
                <span>{new Date(project.tenderDeadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Overall Compliance Score Card */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0">
            <div
              className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center shrink-0 shadow-inner ${getScoreColor(
                overallScore
              )}`}
            >
              <span className="text-2xl font-black leading-none font-mono">{overallScore}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                Score
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Overall Compliance Score
                </h4>
                <p className="text-[11px] text-slate-500">
                  Weighted hybrid evaluation across {stats.totalRequirements} clauses
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onRunCheck}
                  disabled={isChecking}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <TrendingUp className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isChecking ? 'Re-Verifying...' : 'Re-Run Compliance Check'}</span>
                </button>

                {onOpenPlainBriefing && (
                  <button
                    onClick={onOpenPlainBriefing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    title="Translate technical metrics into plain English for non-technical committee members"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Executive Briefing (Plain English)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Count Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Requirements */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Requirements</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {stats.totalRequirements}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Extracted from GeM tender</p>
        </div>

        {/* Compliant */}
        <div
          onClick={() => onNavigateToTab('compliance')}
          className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Compliant</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {stats.compliant}
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-800 mt-1">
            <span>Verified with evidence</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Needs Review */}
        <div
          onClick={() => onNavigateToTab('compliance')}
          className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Review</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            {stats.needsReview}
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-800 mt-1">
            <span>Ambiguity or missing SLA</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Non-Compliant */}
        <div
          onClick={() => onNavigateToTab('compliance')}
          className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 shadow-xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Non-Compliant</span>
            <FileWarning className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">
            {stats.nonCompliant}
          </div>
          <div className="flex items-center justify-between text-[11px] text-rose-800 mt-1">
            <span>Disqualifying criteria</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Category Scores Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Compliance Breakdown by Procurement Category
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated with deterministic validation and semantic AI evidence cross-checking
            </p>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Category score target: &ge; 80%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => {
            const score = categoryScores[cat] ?? 0;
            const barColor =
              score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500';
            const badgeBg =
              score >= 80
                ? 'text-emerald-700 bg-emerald-50'
                : score >= 60
                ? 'text-amber-700 bg-amber-50'
                : 'text-rose-700 bg-rose-50';

            return (
              <div
                key={cat}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-bold text-slate-700 truncate" title={cat}>
                    {cat}
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {score}%
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${badgeBg}`}>
                      {score >= 80 ? 'Pass' : score >= 60 ? 'Review' : 'Fail'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-700">GeM Analytical Notice:</strong> This compliance score is an automated analytical decision-support metric calculated from uploaded bid artifacts. It does not constitute an official award or rejection decision under General Financial Rules (GFR) 2017. Official procurement authority endorsement is required.
          </p>
        </div>
      </div>
    </div>
  );
};
