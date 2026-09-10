import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Award,
  BookOpen,
  Check,
} from 'lucide-react';
import { ComplianceResult, ComplianceStatus } from '../types';

interface EvidenceViewerModalProps {
  item: ComplianceResult | null;
  onClose: () => void;
  onOverrideStatus?: (complianceId: string, newStatus: ComplianceStatus, remark: string) => void;
  onOpenPlainExplainer?: (item: ComplianceResult) => void;
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  item,
  onClose,
  onOverrideStatus,
  onOpenPlainExplainer,
}) => {
  if (!item) return null;

  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isOverriding, setIsOverriding] = useState<boolean>(false);
  const [overrideStatus, setOverrideStatus] = useState<ComplianceStatus>(item.status);
  const [officerRemark, setOfficerRemark] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const evidenceList = item.evidence;
  const currentEvidence = evidenceList[activeEvidenceIndex] || null;

  const handleSaveOverride = () => {
    if (onOverrideStatus) {
      onOverrideStatus(item.id, overrideStatus, officerRemark);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsOverriding(false);
      }, 1200);
    }
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            COMPLIANT
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            NEEDS REVIEW
          </span>
        );
      case 'NON_COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-600" />
            NON-COMPLIANT
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Evidence Traceability Viewer
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-xs text-slate-300 font-mono">
                  Clause ID: {item.requirementId}
                </span>
              </div>
              <h3 className="text-base font-bold text-white truncate max-w-xl">
                {item.requirement.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenPlainExplainer && (
              <button
                onClick={() => onOpenPlainExplainer(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition-colors cursor-pointer"
                title="Explain in plain English for non-technical stakeholders"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Explain in Plain English</span>
                <span className="sm:hidden">Plain English</span>
              </button>
            )}
            {getStatusBadge(item.status)}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns (Left: Document Page Preview & Highlight, Right: AI Reasoning & Explanation) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* LEFT COLUMN: Document Page Preview & Visual Highlighter */}
          <div className="lg:col-span-7 bg-slate-100 p-4 sm:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
            {/* Document Viewer Toolbar */}
            <div className="bg-white rounded-t-xl border border-slate-300 px-4 py-2 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 truncate">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">
                  {currentEvidence?.documentName || item.requirement.sourceDocument}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
                {evidenceList.length > 1 && (
                  <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-0.5 border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500">Source:</span>
                    <button
                      disabled={activeEvidenceIndex === 0}
                      onClick={() => setActiveEvidenceIndex((prev) => Math.max(0, prev - 1))}
                      className="p-0.5 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold">
                      {activeEvidenceIndex + 1}/{evidenceList.length}
                    </span>
                    <button
                      disabled={activeEvidenceIndex === evidenceList.length - 1}
                      onClick={() =>
                        setActiveEvidenceIndex((prev) =>
                          Math.min(evidenceList.length - 1, prev + 1)
                        )
                      }
                      className="p-0.5 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                  Page {currentEvidence?.page || item.requirement.sourcePage}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-500">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document Page Canvas Sheet Mockup */}
            <div className="flex-1 bg-slate-300/60 p-4 sm:p-6 rounded-b-xl border-x border-b border-slate-300 overflow-y-auto flex justify-center">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-xl bg-white shadow-md border border-slate-300/80 rounded-sm p-8 text-slate-800 space-y-4 font-serif relative min-h-[520px] transition-transform duration-150"
              >
                {/* Official Letterhead Header */}
                <div className="border-b-2 border-slate-900 pb-3 text-center space-y-0.5 font-sans">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Official Bid Submission Artifact • GeM Procurement
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                    {currentEvidence?.documentName.replace('.pdf', '').replace(/_/g, ' ') ||
                      'SUBMITTED EVIDENCE CERTIFICATE'}
                  </h4>
                  <div className="text-[10px] text-slate-500 flex justify-center gap-4">
                    <span>Date: 25-Feb-2026</span>
                    <span>•</span>
                    <span>Registration Ref: 27AAACB9812M1Z5</span>
                  </div>
                </div>

                {/* Preceding Document Text */}
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  This document forms part of the technical/financial qualification dossier submitted by the bidder against Tender GEM/2026/B/9821430. All representations herein are certified true and extractable for automated and manual audit.
                </p>

                {/* Simulated Section Clause */}
                <div className="font-sans text-xs font-bold text-slate-800 border-l-2 border-slate-400 pl-2">
                  Section 3.4 — Verifiable Compliance Declarations & Financial/Technical Attestations
                </div>

                {/* Highlighted Evidence Callout Box */}
                {currentEvidence ? (
                  <div className="relative my-4 p-4 rounded-lg bg-amber-50/90 border-2 border-amber-400 shadow-sm font-sans">
                    <div className="absolute -top-3 left-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Extracted & Verified Evidence Excerpt</span>
                    </div>

                    <p className="text-xs font-medium text-slate-900 leading-relaxed pt-1">
                      "{currentEvidence.excerpt}"
                    </p>

                    <div className="mt-3 pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between text-[10px] text-amber-900">
                      <span className="font-semibold">
                        Extracted Value: <strong className="font-bold underline">{currentEvidence.extractedValue || item.extractedValue}</strong>
                      </span>
                      <span className="font-mono bg-amber-200/70 px-1.5 py-0.5 rounded">
                        Extraction Confidence: {currentEvidence.confidence || item.confidence}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-6 p-6 rounded-lg bg-rose-50 border-2 border-dashed border-rose-300 text-center font-sans">
                    <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    <h5 className="text-xs font-bold text-rose-900">Missing Evidence Document</h5>
                    <p className="text-[11px] text-rose-700 mt-1 max-w-sm mx-auto">
                      No corresponding page or file was submitted by the bidder for this required condition.
                    </p>
                  </div>
                )}

                {/* Trailing Contextual Text */}
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  The undersigned authorized signatory acknowledges that any false declaration or unsubstantiated metric constitutes grounds for disqualification under GeM General Terms and Conditions (GTC) and GFR Rule 151.
                </p>

                {/* Digital Signature Footer */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] font-sans text-slate-500">
                  <div>
                    <span className="font-bold block text-slate-700">Digitally Verified Document</span>
                    <span>SHA-256: 8f4a21...c910e</span>
                  </div>
                  <div className="text-right">
                    <div className="w-20 border-b border-slate-400 mb-1"></div>
                    <span className="font-bold text-slate-800">Authorized Signatory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Reasoning, Rule Engine, & Traceability Explanation */}
          <div className="lg:col-span-5 p-6 overflow-y-auto space-y-5 bg-white">
            {/* Header: Rule Comparison */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Rule-Based & Semantic Verification
              </span>

              {/* Requirement Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tender Requirement ({item.requirement.category})
                </div>
                <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                  {item.requirement.requirement}
                </p>
                <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-2">
                  <span>Source: {item.requirement.sourceDocument}</span>
                  <span>•</span>
                  <span>Page {item.requirement.sourcePage}</span>
                </div>
              </div>

              {/* Required vs Found Comparison Matrix */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Required Condition
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 block mt-1">
                    {item.requiredCondition || item.requirement.requiredValue}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    item.status === 'COMPLIANT'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : item.status === 'NEEDS_REVIEW'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase block opacity-80">
                    Bidder Submitted Value
                  </span>
                  <span className="text-xs font-mono font-bold block mt-1">
                    {item.extractedValue}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Reasoning & Explanation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Explainable Decision Reasoning</span>
                </h4>
                <div className="flex items-center gap-2">
                  {onOpenPlainExplainer && (
                    <button
                      onClick={() => onOpenPlainExplainer(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Plain English</span>
                    </button>
                  )}
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Confidence: {item.confidence}%
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <p className="whitespace-pre-line">{item.reasoning}</p>
                {item.evaluationType === 'rule_based' && (
                  <div className="text-[11px] text-indigo-700 bg-indigo-50/80 p-2 rounded border border-indigo-200/60 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>Deterministic Mathematical Check: Computed by numeric verification rule.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contradiction Alert if Flagged */}
            {item.contradictionFlag && (
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Cross-Document Contradiction Detected</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {item.contradictionDetails ||
                    'Conflicting values were detected between the submitted documents. Both values are preserved for committee review.'}
                </p>
              </div>
            )}

            {/* Procurement Officer Audit & Manual Override */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Procurement Committee Action
                </span>
                {!isOverriding ? (
                  <button
                    onClick={() => setIsOverriding(true)}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                  >
                    Adjust / Override Verdict
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOverriding(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isOverriding && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-3 animate-in fade-in">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Adjust Compliance Verdict
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['COMPLIANT', 'NEEDS_REVIEW', 'NON_COMPLIANT'] as ComplianceStatus[]).map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setOverrideStatus(st)}
                            className={`px-2 py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                              overrideStatus === st
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {st === 'COMPLIANT'
                              ? 'Compliant'
                              : st === 'NEEDS_REVIEW'
                              ? 'Needs Review'
                              : 'Non-Compliant'}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Official Committee Remark / Audit Note
                    </label>
                    <textarea
                      value={officerRemark}
                      onChange={(e) => setOfficerRemark(e.target.value)}
                      placeholder="e.g., Reviewed by Evaluation Committee on 08-Mar-2026. Bidder requested for 2-day clarification under GeM Clause 12..."
                      rows={2}
                      className="w-full bg-white text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                    />
                  </div>

                  <button
                    onClick={handleSaveOverride}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-950" />
                        <span>Verdict Recorded Successfully</span>
                      </>
                    ) : (
                      <span>Save Committee Decision</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">GeM Evidence Traceability Standard:</span>
            <span>Every AI conclusion references verifiable document citations & page numbers</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
