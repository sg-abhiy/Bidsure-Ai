import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  AlertCircle,
  ArrowUpDown,
  Sparkles,
  Calculator,
  ShieldAlert,
} from 'lucide-react';
import { ComplianceResult, RequirementCategory, ComplianceStatus } from '../types';

interface ComplianceMatrixProps {
  complianceResults: ComplianceResult[];
  onViewEvidence: (result: ComplianceResult) => void;
  onExplainItem?: (result: ComplianceResult) => void;
  onRunCheck?: () => void;
  isChecking?: boolean;
}

export const ComplianceMatrix: React.FC<ComplianceMatrixProps> = ({
  complianceResults,
  onViewEvidence,
  onExplainItem,
  onRunCheck,
  isChecking = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'status' | 'confidence' | 'category' | 'title'>('status');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const categories: (RequirementCategory | 'ALL')[] = [
    'ALL',
    'Eligibility',
    'Financial',
    'Experience',
    'Technical',
    'Certification',
    'Documentation',
    'Delivery',
    'Legal/Regulatory',
    'Other',
  ];

  const statuses: { id: string; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Statuses' },
    { id: 'COMPLIANT', label: 'Compliant' },
    { id: 'NEEDS_REVIEW', label: 'Needs Review' },
    { id: 'NON_COMPLIANT', label: 'Non-Compliant' },
  ];

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return complianceResults
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'ALL' && item.requirement.category !== selectedCategory) {
          return false;
        }
        // Status filter
        if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.requirement.title.toLowerCase().includes(q);
          const matchReq = item.requirement.requirement.toLowerCase().includes(q);
          const matchVal = item.extractedValue.toLowerCase().includes(q);
          const matchReason = item.reasoning.toLowerCase().includes(q);
          const matchDoc = item.evidence.some((e) => e.documentName.toLowerCase().includes(q));
          if (!matchTitle && !matchReq && !matchVal && !matchReason && !matchDoc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'confidence') {
          return sortAsc ? a.confidence - b.confidence : b.confidence - a.confidence;
        }
        if (sortField === 'status') {
          const rank = { NON_COMPLIANT: 1, NEEDS_REVIEW: 2, COMPLIANT: 3 };
          return sortAsc ? rank[a.status] - rank[b.status] : rank[b.status] - rank[a.status];
        }
        if (sortField === 'category') {
          return sortAsc
            ? a.requirement.category.localeCompare(b.requirement.category)
            : b.requirement.category.localeCompare(a.requirement.category);
        }
        return sortAsc
          ? a.requirement.title.localeCompare(b.requirement.title)
          : b.requirement.title.localeCompare(a.requirement.title);
      });
  }, [complianceResults, selectedCategory, selectedStatus, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: 'status' | 'confidence' | 'category' | 'title') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getStatusPill = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            COMPLIANT
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            NEEDS REVIEW
          </span>
        );
      case 'NON_COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            NON-COMPLIANT
          </span>
        );
    }
  };

  const getEvaluationTypeIcon = (type: string) => {
    if (type === 'rule_based') {
      return (
        <span
          className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded"
          title="Deterministic mathematical or rule-based verification"
        >
          <Calculator className="w-3 h-3 text-indigo-600" />
          Rule-Based
        </span>
      );
    }
    if (type === 'semantic_llm') {
      return (
        <span
          className="inline-flex items-center gap-1 text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded"
          title="Semantic AI analysis & clause understanding"
        >
          <Sparkles className="w-3 h-3 text-purple-600" />
          AI Semantic
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded"
        title="Hybrid deterministic + LLM semantic reasoning"
      >
        <Sparkles className="w-3 h-3 text-sky-600" />
        Hybrid
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Bid Compliance Matrix</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                {filteredItems.length} of {complianceResults.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Every requirement matched against bidder evidence with full explainability and confidence scoring
            </p>
          </div>

          {/* Action buttons & Search bar */}
          <div className="flex flex-wrap items-center gap-2">
            {onRunCheck && (
              <button
                onClick={onRunCheck}
                disabled={isChecking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
                title="Run or re-evaluate compliance check for this project"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : 'text-amber-400'}`} />
                <span>{isChecking ? 'Checking Compliance...' : 'Run Compliance Check'}</span>
              </button>
            )}

            {/* Search bar */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clause, value, or document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Category Filter dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium bg-white text-slate-700 border border-slate-300 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Status Filter buttons */}
          <div className="inline-flex rounded-md shadow-2xs border border-slate-300 bg-white p-0.5">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  selectedStatus === s.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {(selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-amber-700 hover:underline font-semibold ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Compliance Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th
                onClick={() => toggleSort('title')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors w-[26%]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Requirement / Tender Clause</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('category')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors w-[12%]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 w-[16%]">Required Condition</th>
              <th className="py-3 px-3 w-[18%]">Bidder Extracted Evidence</th>
              <th
                onClick={() => toggleSort('status')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors w-[12%]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('confidence')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors w-[8%]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Conf.</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right w-[8%]">Traceability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">
                    {complianceResults.length === 0
                      ? 'No requirements extracted yet'
                      : 'No matching requirements found'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-md mx-auto mb-4">
                    {complianceResults.length === 0
                      ? 'Click below to extract tender clauses and evaluate compliance against submitted bidder documentation.'
                      : 'Try clearing your category filter or search query.'}
                  </p>
                  {complianceResults.length === 0 && onRunCheck && (
                    <button
                      onClick={onRunCheck}
                      disabled={isChecking}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Sparkles className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                      <span>{isChecking ? 'Evaluating Compliance...' : 'Run Compliance Check Now'}</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onViewEvidence(item)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Requirement Title & Clause */}
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {item.requirement.title}
                        </span>
                        {item.requirement.mandatory && (
                          <span className="text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded">
                            Mandatory
                          </span>
                        )}
                        {item.contradictionFlag && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded animate-pulse"
                            title="Contradictory information detected across bidder files"
                          >
                            <ShieldAlert className="w-3 h-3 text-amber-700" />
                            Contradiction
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                        {item.requirement.requirement}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Source: {item.requirement.sourceDocument}</span>
                        <span>•</span>
                        <span>Page {item.requirement.sourcePage}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 align-top">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                      {item.requirement.category}
                    </span>
                  </td>

                  {/* Required Condition */}
                  <td className="py-3 px-3 align-top font-medium text-slate-800">
                    <div className="font-mono text-xs text-slate-900 bg-slate-100/60 px-2 py-1 rounded border border-slate-200/60 inline-block">
                      {item.requiredCondition || item.requirement.requiredValue || 'As specified'}
                    </div>
                  </td>

                  {/* Bidder Extracted Evidence */}
                  <td className="py-3 px-3 align-top">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 text-xs">
                        {item.extractedValue}
                      </div>
                      {item.evidence.length > 0 && (
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{item.evidence[0].documentName}</span>
                          <span>(P.{item.evidence[0].page})</span>
                        </div>
                      )}
                      {item.evidence.length === 0 && (
                        <span className="text-[11px] text-rose-600 font-semibold italic">
                          No matching evidence uploaded
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 align-top">
                    {getStatusPill(item.status)}
                    <div className="mt-1">{getEvaluationTypeIcon(item.evaluationType)}</div>
                  </td>

                  {/* Confidence Score */}
                  <td className="py-3 px-3 align-top">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-bold text-slate-800 text-xs">
                        {item.confidence}%
                      </span>
                    </div>
                    <div className="w-12 bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${
                          item.confidence >= 90
                            ? 'bg-emerald-500'
                            : item.confidence >= 75
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </td>

                  {/* Actions: View Evidence & Plain English Explainer */}
                  <td className="py-3 px-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {onExplainItem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExplainItem(item);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
                          title="Explain this technical requirement in plain English for non-technical stakeholders"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>Explain</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewEvidence(item);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer group-hover:shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        <span>Evidence</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
