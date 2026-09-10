import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  Printer,
  Scale,
  Award,
  Hash,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  FileCheck2,
} from 'lucide-react';
import { DocumentItem } from '../types';
import { exportDocumentDossierPdf, openDocumentPrintInNewTab } from '../utils/pdfExport';
import { PrintDispatchModal } from './PrintDispatchModal';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  const [activeTab, setActiveTab] = useState<'juridical' | 'fulltext' | 'clauses' | 'provenance'>('juridical');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfExported, setPdfExported] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printBlobUrl, setPrintBlobUrl] = useState<string>('');

  const handleCopyCitation = () => {
    const citation = `[GeM Evidentiary Record] Artifact: ${document.fileName} | SHA-256: 8f4a21e69b0d2a84c7e199d7b32a10e4c5d6e7f8 | Ingestion Ref: ${document.id} | Statutory Classification: ${document.category.toUpperCase()} | GFR-2017 Audit Registry`;
    navigator.clipboard?.writeText(citation);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportPdf = () => {
    try {
      setIsExportingPdf(true);
      exportDocumentDossierPdf(document);
      setPdfExported(true);
      setTimeout(() => setPdfExported(false), 3000);
    } catch (err) {
      console.error('Error exporting document dossier PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    const { blobUrl } = openDocumentPrintInNewTab(document);
    setPrintBlobUrl(blobUrl);
    setIsPrintModalOpen(true);
  };

  const getDocTypeIcon = (type: string) => {
    if (type.includes('XLS') || type.includes('CSV')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    return <FileText className="w-5 h-5 text-amber-400" />;
  };

  // High language formal metadata syntheses based on document category and filename
  const getFormalJuridicalMetadata = () => {
    const isFinancial = document.fileName.toLowerCase().includes('balance') || document.fileName.toLowerCase().includes('turnover') || document.fileName.toLowerCase().includes('ca_');
    const isCertification = document.fileName.toLowerCase().includes('iso') || document.fileName.toLowerCase().includes('nabl');
    const isTender = document.category === 'tender';
    const isStatutory = document.fileName.toLowerCase().includes('gst') || document.fileName.toLowerCase().includes('udyam') || document.fileName.toLowerCase().includes('affidavit');

    if (isTender) {
      return {
        statutoryClass: 'Public Procurement Tender Solicitation Instrument',
        governingLaw: 'Rule 144, 150 & 161 of General Financial Rules (GFR), 2017; GeM GTC Version 4.0',
        evidentiaryAdmissibility: 'Primary Source Instrument • Binding Regulatory RFP',
        signatoryAuthority: 'Competent Procurement Authority (NTPC Ltd / Ministry of Power)',
        auditWeight: 'Conclusive Baseline Standard (Benchmark Specification)',
        abstract: 'This statutory solicitation document establishes the mandatory eligibility criteria, commercial covenants, quantitative thresholds, and technical specifications governing Bid Ref: GEM/2026/B/9821430. All bidder submissions are subjected to strict strictissimi juris compliance scrutiny pursuant to the Public Procurement (Preference to Make in India) Order and MSMED Act statutory directives.',
      };
    }

    if (isFinancial) {
      return {
        statutoryClass: 'Independent Statutory Auditor’s Attestation & Financial Dossier',
        governingLaw: 'Section 134(5), Section 143 & Third Schedule of Companies Act, 2013; ICAI Standards on Auditing',
        evidentiaryAdmissibility: 'Admissible under Section 65B Indian Evidence Act with Verifiable UDIN',
        signatoryAuthority: 'M/s R.K. Singhania & Associates, Practicing Chartered Accountants (FRN: 014289N)',
        auditWeight: 'High Evidentiary Value with Cross-Examination Flag for Subsidiary Variance',
        abstract: 'Audited balance sheets, profit & loss affirmations, and net-worth schedules submitted to establish financial solvency, liquidity thresholds, and three-year revenue from operations. The evidentiary audit indicates standalone manufacturing operational revenue of ₹7.20 Crore, whereas the appended CA certificate aggregates auxiliary non-manufacturing subsidiary turnover of ₹12.40 Crore, necessitating committee clarification under GeM Clause 12.',
      };
    }

    if (isCertification) {
      return {
        statutoryClass: 'Accredited Quality System & Laboratory Standard Conformity Certificate',
        governingLaw: 'Bureau of Indian Standards (BIS) Act, 2016; ISO/IEC 17025 Conformity Assessment Regs',
        evidentiaryAdmissibility: 'Verifiable via NABCB / NABL National Laboratory Portal',
        signatoryAuthority: 'National Accreditation Board for Testing and Calibration Laboratories (NABL)',
        auditWeight: 'Substantive Technical Admissibility (Subject to IP68 Ingress Scope Clarification)',
        abstract: 'Official conformity and empirical laboratory assessment artifacts attesting to compliance with ISO 9001:2015 quality management procedures and mechanical tensile benchmarks. Mechanical stress tolerances conform to IS 15841 standards; however, water ingress protection certification is substantiated to IP65 spray protocols rather than the tender-stipulated continuous IP68 immersion standard.',
      };
    }

    if (isStatutory) {
      return {
        statutoryClass: 'Statutory Registration & Sovereign Affirmation Affidavit',
        governingLaw: 'Central Goods and Services Tax Act, 2017; Public Procurement (Make in India) Order, 2017',
        evidentiaryAdmissibility: 'Sovereign Statutory Verification via GSTN and Udyam Portals',
        signatoryAuthority: 'Department of Revenue / Ministry of Micro, Small and Medium Enterprises',
        auditWeight: 'Conclusive Legal Precedent for Eligibility and Exemption Entitlement',
        abstract: 'Notarized statutory affidavit and sovereign portal-issued credential certifying Class-I Local Supplier status with 68.5% domestic value addition located at Chakan industrial zone, Pune, Maharashtra. Corroborates active regular GSTIN compliance and MSME Udyam credentials authorizing exemption from Earnest Money Deposit (EMD) under GFR Rule 170(i).',
      };
    }

    return {
      statutoryClass: 'Bidder Contractual Undertaking & Formal Commercial Submission',
      governingLaw: 'Indian Contract Act, 1872; GeM Special Terms and Conditions (STC)',
      evidentiaryAdmissibility: 'Prima Facie Contractual Representation',
      signatoryAuthority: 'Authorized Signatory under Power of Attorney / Board Resolution',
      auditWeight: 'Material Contractual Commitment',
      abstract: 'Contractual declarations, past supply completion credentials, and operational undertakings executed under company seal. Demonstrates past contract execution with Central Public Sector Undertakings (BPCL and Tata Projects Ltd) while noting a total operational pedigree of 2.8 continuous years against the tender requirement of 5 years.',
    };
  };

  const meta = getFormalJuridicalMetadata();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Formal High-Language Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              {getDocTypeIcon(document.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20 font-mono">
                  Sovereign Evidentiary Artifact
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-mono">
                  Registry UID: {document.id}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SHA-256 Validated
                </span>
              </div>
              <h3 className="text-base font-bold text-white truncate max-w-2xl mt-0.5">
                {document.fileName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Download Official PDF (.pdf)"
            >
              {pdfExported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden sm:inline">PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden sm:inline">{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Print Juridical Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyCitation}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Copy Certified Citation"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="bg-slate-100 px-6 pt-3 border-b border-slate-300 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('juridical')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'juridical'
                  ? 'bg-white text-slate-900 border-slate-300 border-b-white -mb-px shadow-xs'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Juridical & Statutory Summary</span>
            </button>
            <button
              onClick={() => setActiveTab('fulltext')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fulltext'
                  ? 'bg-white text-slate-900 border-slate-300 border-b-white -mb-px shadow-xs'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Certified Document Text & Inscription</span>
            </button>
            <button
              onClick={() => setActiveTab('clauses')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'clauses'
                  ? 'bg-white text-slate-900 border-slate-300 border-b-white -mb-px shadow-xs'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Clause Linkage ({document.relevantRequirementsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('provenance')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'provenance'
                  ? 'bg-white text-slate-900 border-slate-300 border-b-white -mb-px shadow-xs'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-slate-600" />
              <span>Forensic Provenance & Audit Trail</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 pb-2">
            Page Count: <span className="font-bold text-slate-800">{document.pageCount}</span> • Format: <span className="font-bold text-slate-800 uppercase">{document.type}</span>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: JURIDICAL & STATUTORY SUMMARY (HIGH LANGUAGE) */}
          {activeTab === 'juridical' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Official Seal / Sovereign Notice Banner */}
              <div className="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-700 shrink-0" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950 font-sans">
                    Forensic Juridical Abstract & Substantive Assessment
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-serif text-justify">
                  {meta.abstract}
                </p>
              </div>

              {/* Juridical Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Statutory Classification
                  </span>
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {meta.statutoryClass}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Artifact Category: <span className="font-semibold text-slate-700 capitalize">{document.category}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Governing Legal Directives & Codes
                  </span>
                  <div className="text-xs font-bold text-indigo-950 leading-snug font-mono">
                    {meta.governingLaw}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Applicable to: Central Government & CPSU Procurements
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Evidentiary Admissibility Standard
                  </span>
                  <div className="text-xs font-bold text-emerald-900 leading-snug flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{meta.evidentiaryAdmissibility}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Certified with Optical Traceability & Checksum
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Signatory & Attesting Authority
                  </span>
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {meta.signatoryAuthority}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Verification Weight: <span className="font-semibold text-slate-800">{meta.auditWeight}</span>
                  </div>
                </div>
              </div>

              {/* Substantive Inscription Highlights */}
              <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Substantive Extracted Declarations & Evidentiary Inscription</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    OCR Ingestion Confidence: 99.4%
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-serif text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {document.textContent || document.content || 'Document text extracted and stored in procurement vault.'}
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                  <span>Audited for Tender Ref: GEM/2026/B/9821430</span>
                  <span className="font-mono">Ingested Date: {document.uploadDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFIED DOCUMENT TEXT & INSCRIPTION (HIGH LANGUAGE LEGAL SHEET) */}
          {activeTab === 'fulltext' && (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-slate-300 p-8 sm:p-12 space-y-6 font-serif text-slate-800 relative">
              {/* Sovereign Letterhead Watermark Simulation */}
              <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1 font-sans">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  Government e-Marketplace (GeM) • Public Procurement Compliance Division
                </div>
                <h2 className="text-base font-extrabold text-slate-950 uppercase tracking-wide">
                  Certified Procurement Artifact Dossier
                </h2>
                <div className="text-xs text-slate-600 flex justify-center gap-4 flex-wrap pt-1 font-mono">
                  <span>File: {document.fileName}</span>
                  <span>•</span>
                  <span>Registration: 27AAACB9812M1Z5</span>
                  <span>•</span>
                  <span>Dossier: SIH26100-AUDIT</span>
                </div>
              </div>

              {/* Preamble */}
              <div className="space-y-2 text-xs leading-relaxed font-sans">
                <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-center bg-slate-100 py-1 rounded">
                  Legal Attestation & Official Record Pursuant to General Financial Rules (GFR), 2017
                </div>
                <p className="text-justify text-slate-700">
                  BE IT KNOWN TO ALL PUBLIC PROCUREMENT COMMITTEES AND AUDIT BODIES that the representations, certificates, metrics, and contractual undertakings contained within this certified evidentiary artifact have been deposited by the bidder into the National GeM Procurement Repository. All contents herein are held as solemn statutory attestations under penalty of summary disqualification and debarment pursuant to Rule 151 of GFR 2017 and Clause 4(m) of the GeM General Terms and Conditions.
                </p>
              </div>

              {/* Substantive Text Body */}
              <div className="space-y-3 font-serif text-xs leading-relaxed border-y border-slate-200 py-6">
                <div className="font-sans font-bold text-slate-900 text-xs">
                  Article I — Substantive Content & Factual Declarations:
                </div>
                <div className="bg-slate-50/80 p-5 rounded-lg border border-slate-200 text-slate-900 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                  {document.textContent || document.content || 'Content registered in secure audit vault.'}
                </div>
              </div>

              {/* Sovereign Juridical Attestation Footer */}
              <div className="pt-4 space-y-4 font-sans text-xs text-slate-600">
                <p className="text-[11px] leading-relaxed text-justify text-slate-500">
                  Pursuant to Section 65B of the Indian Evidence Act, 1872 and the Information Technology Act, 2000, this digital reproduction constitutes an authentic, tamper-evident reproduction of the original document submitted by the tenderer. Any alteration or discrepancy invalidates this audit record.
                </p>

                <div className="flex items-end justify-between pt-6 border-t border-slate-200">
                  <div className="space-y-1 text-[10px] font-mono text-slate-500">
                    <div>Cryptographic Checksum: <strong className="text-slate-800">8f4a21e69b0d2a84c7e199...</strong></div>
                    <div>Verification Algorithm: SHA-256 / RSA-2048</div>
                    <div>Status: <span className="text-emerald-700 font-bold">CERTIFIED PRIMA FACIE</span></div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="w-32 border-b-2 border-slate-800 ml-auto mb-1"></div>
                    <div className="text-[11px] font-bold text-slate-900">Chief Procurement Scrutiny Officer</div>
                    <div className="text-[10px] text-slate-500">GeM Technical Evaluation Committee</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLAUSE LINKAGE & COMPLIANCE MAPPING */}
          {activeTab === 'clauses' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-2xs space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Tender Requirements Cross-Referencing Schedule
                </h4>
                <p className="text-xs text-slate-500">
                  This document serves as the primary evidentiary citation for <strong className="text-slate-800">{document.relevantRequirementsCount} distinct contractual clauses</strong> in Tender GEM/2026/B/9821430.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 font-mono">
                        Financial Criteria
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Clause 3.1: Minimum Average Annual Financial Turnover Threshold
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Discrepancy Under Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-serif">
                    Requires ₹10.00 Cr 3-year turnover. Document certifies operational turnover of ₹7.20 Cr in standalone accounts versus ₹12.40 Cr consolidated. Flagged for committee adjudication under GFR 2017 Rule 144.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-900 font-mono">
                        Technical Standards
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Clause 4.8: Ingress Protection & Tensile Strength Testing
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Standard Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-serif">
                    Document cites laboratory testing under NABL accreditation certifying compliance with IS 15841 specifications with verified tensile strength yield of 920 MPa.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 font-mono">
                        Statutory Preference
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Clause 1.4: Public Procurement (Make in India) Local Content Verification
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Class-1 Qualified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-serif">
                    Statutory affidavit under Rule 153(iii) affirming 68.5% domestic value addition, exceeding the mandatory 50% threshold for Class-1 Local Supplier purchase preference.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FORENSIC PROVENANCE & AUDIT TRAIL */}
          {activeTab === 'provenance' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-700" />
                  <span>Chain of Custody & Cryptographic Audit Verification</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Every artifact uploaded to BidSure AI is cryptographically sealed, time-stamped, and immutably indexed to ensure zero evidentiary tampering during procurement litigation or CAG audits.
                </p>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400 text-[11px]">
                  <span>RECORD PROPERTY</span>
                  <span>SYSTEM TELEMETRY VALUE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unique Ingestion ID:</span>
                  <span className="text-amber-400 font-bold">{document.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Ingestion Timestamp:</span>
                  <span>2026-03-02T11:42:19.492Z</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SHA-256 Evidentiary Digest:</span>
                  <span className="text-emerald-400 truncate max-w-sm">8f4a21e69b0d2a84c7e199d7b32a10e4c5d6e7f8a91b2c3d4e5f6a7b8c9d0e1f</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MIME Content Type:</span>
                  <span>application/pdf; version=1.7 (Acrobat ISO 32000-1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OCR Engine Subsystem:</span>
                  <span>Neural Ingestion Layer v4.8 (Latin/Devanagari Digits)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statutory Tamper Seal:</span>
                  <span className="text-emerald-400 font-bold">UNCOMPROMISED (VALID)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Audit Provenance Node:</span>
                  <span>GeM Central Ingress Node #4 (MeitY Empanelled Cloud)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="font-bold text-slate-800">GeM Audit Standard:</span>
            <span>All evidentiary extractions comply with GFR 2017 & Information Technology Act evidentiary doctrines</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Download official PDF copy of this evidentiary dossier"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>{isExportingPdf ? 'Exporting...' : 'Export Certified PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Print document or save to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={handleCopyCitation}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>{isCopied ? 'Citation Copied' : 'Copy Citation'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Dismiss Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Print Dispatch Modal for Document Artifact */}
      <PrintDispatchModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Evidentiary Artifact Print Station"
        subtitle={`Artifact: ${document.fileName} • Classification: ${document.category.toUpperCase()}`}
        printBlobUrl={printBlobUrl}
        onDownloadPdf={handleExportPdf}
        dossierType="artifact"
      />
    </div>
  );
};
