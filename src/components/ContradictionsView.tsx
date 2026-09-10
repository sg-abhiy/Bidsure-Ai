import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileWarning,
  FileText,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Download,
  ExternalLink,
  Info,
  Sparkles,
} from 'lucide-react';
import { Contradiction, MissingDocument } from '../types';

interface ContradictionsViewProps {
  contradictions: Contradiction[];
  missingDocuments: MissingDocument[];
  onExplainContradiction?: (contra: Contradiction) => void;
  onExplainMissingDoc?: (doc: MissingDocument) => void;
}

export const ContradictionsView: React.FC<ContradictionsViewProps> = ({
  contradictions,
  missingDocuments,
  onExplainContradiction,
  onExplainMissingDoc,
}) => {
  return (
    <div className="space-y-8">
      {/* SECTION 1: CONTRADICTION DETECTION */}
      <div className="space-y-4">
        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-5 rounded-r-xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <h2 className="text-base font-bold text-amber-950">
              Cross-Document Contradiction Detection ({contradictions.length} Detected)
            </h2>
          </div>
          <p className="text-xs text-amber-800 mt-1 max-w-3xl">
            BidSure AI cross-correlates numeric disclosures across multiple bidder submissions. When conflicting claims or metrics appear between different documents, the system flags the contradiction and retains both sources for procurement committee scrutiny.
          </p>
        </div>

        {contradictions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Contradictions Detected</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              All extracted numeric figures and certifications are consistent across uploaded files.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {contradictions.map((contra) => (
              <div
                key={contra.id}
                className="bg-white rounded-xl border-2 border-amber-300 shadow-sm overflow-hidden"
              >
                {/* Contradiction Card Header */}
                <div className="bg-amber-50 px-6 py-3.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-2xs">
                      ⚠ Contradictory Information
                    </span>
                    <span className="text-sm font-bold text-amber-950">
                      Discrepancy in {contra.field}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onExplainContradiction && (
                      <button
                        onClick={() => onExplainContradiction(contra)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                        title="Explain this discrepancy in plain English for non-technical members"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Explain in Plain English</span>
                      </button>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        contra.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {contra.severity} Severity Discrepancy
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="px-6 pt-4 pb-2">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {contra.description}
                  </p>
                </div>

                {/* Side-by-Side Dual Source Comparison */}
                <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Source A */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{contra.sourceA.document}</span>
                      </div>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                        Page {contra.sourceA.page}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Disclosed Value A
                      </span>
                      <div className="text-sm font-extrabold text-amber-700 font-mono mt-0.5">
                        {contra.sourceA.value}
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                      "{contra.sourceA.excerpt}"
                    </div>
                  </div>

                  {/* Source B */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{contra.sourceB.document}</span>
                      </div>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                        Page {contra.sourceB.page}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Disclosed Value B
                      </span>
                      <div className="text-sm font-extrabold text-rose-700 font-mono mt-0.5">
                        {contra.sourceB.value}
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                      "{contra.sourceB.excerpt}"
                    </div>
                  </div>
                </div>

                {/* Audit Action Note */}
                <div className="bg-amber-50/50 px-6 py-3 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900">
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>
                      System Action: Both values flagged for GeM Bid Clarification Letter. No arbitrary selection made.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: MISSING DOCUMENTS DETECTION */}
      <div className="space-y-4 pt-4">
        <div className="bg-rose-500/10 border-l-4 border-rose-500 p-5 rounded-r-xl">
          <div className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-rose-600 shrink-0" />
            <h2 className="text-base font-bold text-rose-950">
              Missing Mandatory Documents ({missingDocuments.length} Unsubmitted)
            </h2>
          </div>
          <p className="text-xs text-rose-800 mt-1 max-w-3xl">
            Tender conditions mandate specific certificates, forms, and financial credentials. The bidder failed to upload the following required documents, impacting eligibility and technical responsiveness.
          </p>
        </div>

        {missingDocuments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">All Required Documents Submitted</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Every mandatory certificate and form requested in the tender notice is present in the bidder file.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-[6%]">Status</th>
                    <th className="py-3 px-3 w-[34%]">Document Title / Certificate</th>
                    <th className="py-3 px-3 w-[14%]">Category</th>
                    <th className="py-3 px-3 w-[20%]">Tender Clause Reference</th>
                    <th className="py-3 px-3 w-[20%]">Compliance Impact</th>
                    <th className="py-3 px-4 text-right w-[10%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {missingDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-rose-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-black text-xs">
                          ❌
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-xs">{doc.name}</div>
                        {doc.mandatory && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                            Mandatory Clause
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {doc.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                        {doc.tenderClause}
                      </td>

                      <td className="py-3 px-3 text-xs text-slate-600 leading-relaxed">
                        {doc.impactDescription}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {onExplainMissingDoc && (
                          <button
                            onClick={() => onExplainMissingDoc(doc)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-md transition-colors cursor-pointer"
                            title="Explain in plain English for non-technical stakeholders"
                          >
                            <Sparkles className="w-3 h-3 text-rose-600" />
                            <span>Explain</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Deficiency Action Notice Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">
                Action: You can generate an automated GeM Bid Clarification Notice listing these missing artifacts.
              </span>
              <button
                onClick={() =>
                  alert(
                    `GeM Deficiency Notice Draft generated for ${missingDocuments.length} missing documents. Export ready in Reports tab.`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                <FileWarning className="w-3.5 h-3.5" />
                <span>Draft GeM Clarification Notice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
