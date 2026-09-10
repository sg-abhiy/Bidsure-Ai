import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileText,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  Award,
  Info,
  Check,
} from 'lucide-react';
import { ComplianceReport, Project, ComplianceResult, Contradiction } from '../types';
import { exportOfficialCompliancePdf, openPrintDossierInNewTab } from '../utils/pdfExport';
import { PrintDispatchModal } from './PrintDispatchModal';

interface ComplianceReportViewProps {
  report: ComplianceReport | null;
  project: Project;
  complianceResults?: ComplianceResult[];
  contradictions?: Contradiction[];
}

export const ComplianceReportView: React.FC<ComplianceReportViewProps> = ({
  report,
  project,
  complianceResults,
  contradictions,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printBlobUrl, setPrintBlobUrl] = useState<string>('');

  if (!report || !project) return null;

  const stats = project.stats || {
    totalRequirements: 0,
    compliant: 0,
    needsReview: 0,
    nonCompliant: 0,
  };

  const handleExportPdf = () => {
    try {
      setIsExporting(true);
      exportOfficialCompliancePdf(project, report, complianceResults, contradictions);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 3500);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    // Generate standalone A4 print HTML and attempt opening/printing
    const { blobUrl } = openPrintDossierInNewTab(
      project,
      report,
      complianceResults,
      contradictions
    );
    setPrintBlobUrl(blobUrl);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            GeM Bid Compliance Evaluation Dossier
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive audit report for Tender Committee review. Formatted for standard A4 printing and publication-grade PDF archival.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
            title="Download vector PDF dossier with GeM seals and compliance matrix"
          >
            {exportedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Official PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isExporting ? 'Generating PDF...' : 'Download Official PDF (.pdf)'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm active:scale-95"
            title="Print clean document or save to PDF via system print dialog"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Dossier (A4)</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md p-8 sm:p-12 text-slate-900 space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-amber-400 font-black text-xs">
                GeM
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Government e-Marketplace • Compliance Evaluation Committee
              </span>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <span>Report Generated: {new Date(report.generatedAt).toLocaleString()}</span>
              <span className="block font-bold text-slate-800">Dossier ID: GeM-VER-2026-9812</span>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
            Bid Compliance Verification & Evidence Traceability Report
          </h1>
          <p className="text-xs text-slate-600">
            Prepared under Smart India Hackathon (SIH26100) Integrated GeM Bid Compliance Framework
          </p>
        </div>

        {/* Section 1 & 2: Tender & Bidder Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tender Details
            </span>
            <div className="text-sm font-bold text-slate-900">{project.name}</div>
            <div className="text-slate-600 flex items-center gap-2">
              <span className="font-semibold">Tender ID:</span>
              <span className="font-mono">{project.tenderId}</span>
            </div>
            <div className="text-slate-600 flex items-center gap-2">
              <span className="font-semibold">Procuring Entity:</span>
              <span>{project.organization}</span>
            </div>
            <div className="text-slate-600 flex items-center gap-2">
              <span className="font-semibold">Submission Deadline:</span>
              <span>{new Date(project.tenderDeadline).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Bidder Information
            </span>
            <div className="text-sm font-bold text-slate-900">{project.bidderName}</div>
            {project.bidderGstin && (
              <div className="text-slate-600 flex items-center gap-2">
                <span className="font-semibold">Bidder GSTIN:</span>
                <span className="font-mono">{project.bidderGstin}</span>
              </div>
            )}
            <div className="text-slate-600 flex items-center gap-2">
              <span className="font-semibold">Evaluation Status:</span>
              <span className="font-bold text-amber-700 uppercase">{project.status}</span>
            </div>
            <div className="text-slate-600 flex items-center gap-2">
              <span className="font-semibold">Total Verified Clauses:</span>
              <span className="font-mono font-bold">{stats.totalRequirements} Clauses</span>
            </div>
          </div>
        </div>

        {/* Section 3: Score & Executive Summary */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Overall Compliance Score
              </span>
              <h3 className="text-xl font-bold">Comprehensive Technical & Financial Rating</h3>
              <p className="text-xs text-slate-300">
                Calculated algorithmically based on deterministic constraints & semantic AI verification
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-3xl font-black font-mono text-amber-400">
                  {report.overallScore}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Weighted Score
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              1. Executive Summary & Evaluation Verdict
            </h3>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {report.executiveSummary}
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            2. Category-Wise Compliance Matrix
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Procurement Category</th>
                <th className="py-2.5 px-3">Compliance Rating</th>
                <th className="py-2.5 px-3">Total Evaluated</th>
                <th className="py-2.5 px-3">Compliant</th>
                <th className="py-2.5 px-3">Needs Review</th>
                <th className="py-2.5 px-3">Non-Compliant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.categoryBreakdown.map((cat) => (
                <tr key={cat.category} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-semibold text-slate-900">{cat.category}</td>
                  <td className="py-2 px-3 font-mono font-bold">
                    <span
                      className={
                        cat.score >= 80
                          ? 'text-emerald-700'
                          : cat.score >= 60
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }
                    >
                      {cat.score}%
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono">{cat.total}</td>
                  <td className="py-2 px-3 font-mono text-emerald-700 font-bold">{cat.compliant}</td>
                  <td className="py-2 px-3 font-mono text-amber-700 font-bold">{cat.needsReview}</td>
                  <td className="py-2 px-3 font-mono text-rose-700 font-bold">{cat.nonCompliant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Non-Compliant Items Callout */}
        {report.nonCompliantItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>3. Disqualifying Non-Compliant Conditions ({report.nonCompliantItems.length})</span>
            </h3>
            <div className="space-y-3">
              {report.nonCompliantItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-rose-900">
                    <span>
                      3.{idx + 1} {item.requirement.title} ({item.requirement.category})
                    </span>
                    <span className="font-mono text-[10px] bg-rose-200 px-2 py-0.5 rounded text-rose-900">
                      Confidence: {item.confidence}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                    <div>
                      <span className="text-slate-500">Required:</span>{' '}
                      <strong>{item.requiredCondition}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Extracted Value:</span>{' '}
                      <strong className="text-rose-700">{item.extractedValue}</strong>
                    </div>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed pt-1">
                    <strong>Reasoning:</strong> {item.reasoning}
                  </p>
                  {item.evidence.length > 0 && (
                    <div className="text-[11px] text-slate-500 font-mono pt-1">
                      Evidence Source: {item.evidence[0].documentName} (Page {item.evidence[0].page})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Documents Callout */}
        {report.missingDocuments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>4. Missing Mandatory Documents ({report.missingDocuments.length})</span>
            </h3>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3 w-8">#</th>
                  <th className="py-2 px-3">Missing Document Name</th>
                  <th className="py-2 px-3">Tender Clause Reference</th>
                  <th className="py-2 px-3">Impact Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.missingDocuments.map((doc, i) => (
                  <tr key={doc.id} className="hover:bg-rose-50/40">
                    <td className="py-2 px-3 font-mono">{i + 1}</td>
                    <td className="py-2 px-3 font-bold text-rose-900">{doc.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{doc.tenderClause}</td>
                    <td className="py-2 px-3 text-slate-700">{doc.impactDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Contradictions Callout */}
        {report.contradictions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>5. Flagged Cross-Document Contradictions ({report.contradictions.length})</span>
            </h3>
            <div className="space-y-3">
              {report.contradictions.map((c, i) => (
                <div key={c.id} className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs space-y-2">
                  <div className="font-bold text-amber-950">
                    5.{i + 1} Discrepancy in {c.field} ({c.severity} Severity)
                  </div>
                  <p className="text-slate-700">{c.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                    <div className="bg-white p-2 rounded border border-amber-200">
                      <span className="font-semibold block text-slate-600">{c.sourceA.document} (P.{c.sourceA.page}):</span>
                      <strong className="text-amber-800 font-mono">{c.sourceA.value}</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-amber-200">
                      <span className="font-semibold block text-slate-600">{c.sourceB.document} (P.{c.sourceB.page}):</span>
                      <strong className="text-rose-800 font-mono">{c.sourceB.value}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign-off / Signature Blocks */}
        <div className="pt-12 border-t-2 border-slate-200 grid grid-cols-3 gap-8 text-center text-xs text-slate-600">
          <div className="space-y-6">
            <div className="h-10 border-b border-slate-400 mx-6"></div>
            <div>
              <span className="font-bold block text-slate-900">Procurement Officer</span>
              <span className="text-[10px] text-slate-400">Technical Evaluation Committee</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-10 border-b border-slate-400 mx-6"></div>
            <div>
              <span className="font-bold block text-slate-900">Finance Member / CA</span>
              <span className="text-[10px] text-slate-400">Financial Scrutiny Cell</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-10 border-b border-slate-400 mx-6"></div>
            <div>
              <span className="font-bold block text-slate-900">Committee Chairman</span>
              <span className="text-[10px] text-slate-400">GeM Purchase Approval Body</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center leading-relaxed">
          {report.disclaimer}
        </div>
      </div>

      {/* Print Dispatch Modal for Reliable Multi-environment Printing */}
      <PrintDispatchModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="GeM Bid Compliance Dossier Print Station"
        subtitle={`Tender ID: ${project.tenderId || 'GEM/2026/B/9821430'} • Bidder: ${project.bidderName}`}
        printBlobUrl={printBlobUrl}
        onDownloadPdf={handleExportPdf}
        dossierType="compliance"
      />
    </div>
  );
};
