import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Plus,
  RefreshCw,
  FolderOpen,
  Trash2,
  RotateCcw,
  Building2,
  Check,
} from 'lucide-react';
import { DocumentItem, Project } from '../types';

interface DocumentManagerProps {
  documents: DocumentItem[];
  project?: Project;
  onUploadClick: (category: 'tender' | 'bidder' | 'supporting') => void;
  onAnalyzeTender: () => void;
  onAnalyzeBidder: () => void;
  isAnalyzingTender: boolean;
  isAnalyzingBidder: boolean;
  onViewDocExcerpt: (doc: DocumentItem) => void;
  onDeleteDocument?: (docId: string) => void;
  onClearAllDocuments?: (category?: 'tender' | 'bidder' | 'all') => void;
  onStartFresh?: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  project,
  onUploadClick,
  onAnalyzeTender,
  onAnalyzeBidder,
  isAnalyzingTender,
  isAnalyzingBidder,
  onViewDocExcerpt,
  onDeleteDocument,
  onClearAllDocuments,
  onStartFresh,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tender' | 'bidder' | 'supporting'>('all');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const tenderDocs = documents.filter((d) => d.category === 'tender');
  const bidderDocs = documents.filter((d) => d.category === 'bidder');
  const supportingDocs = documents.filter((d) => d.category === 'supporting');

  const filteredDocs =
    activeTab === 'all'
      ? documents
      : documents.filter((d) => d.category === activeTab);

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'Analyzed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Analyzed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
            Processing
          </span>
        );
      case 'Uploading':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            Uploading
          </span>
        );
      case 'Error':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Error
          </span>
        );
    }
  };

  const getDocIcon = (type: string) => {
    if (type.includes('XLS') || type.includes('CSV')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    return <FileText className="w-5 h-5 text-amber-600 shrink-0" />;
  };

  const handleDelete = (docId: string) => {
    if (onDeleteDocument) {
      onDeleteDocument(docId);
    }
  };

  const handleClearConfirm = () => {
    if (onClearAllDocuments) {
      onClearAllDocuments(activeTab === 'all' ? 'all' : (activeTab as any));
      setIsConfirmingClear(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Details & Action Triggers */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-900">
              Procurement Artifacts & Document Management
            </h2>
            {project && (
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                {project.tenderId}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {project ? (
              <span>
                Active Bid: <strong className="text-slate-800">{project.name}</strong> • Bidder: <strong className="text-slate-800">{project.bidderName}</strong>
              </span>
            ) : (
              'Store, OCR-extract, and index tender clauses and bidder qualification dossiers for automated evidence citation'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onStartFresh && (
            <button
              onClick={onStartFresh}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Clear current data and initialize fresh with new tender details"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
              <span>Start Fresh / New Details</span>
            </button>
          )}

          <button
            onClick={() => onUploadClick('tender')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Tender Doc</span>
          </button>
          <button
            onClick={() => onUploadClick('bidder')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950" />
            <span>Upload Bidder Dossier</span>
          </button>
        </div>
      </div>

      {/* When 0 total documents exist, show a guided 2-part onboarding container */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center font-bold">
              <FolderOpen className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Your Evaluation Workspace is Ready & Fresh
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To begin automated bid evaluation under GFR-2017 & GeM guidelines, upload the <strong>Tender Specification</strong> (NIT/RFP) and the <strong>Bidder Dossier / Binder</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Step 1: Tender Documents */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-6 text-center transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl mx-auto flex items-center justify-center font-mono font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Tender Documents (NIT / RFP)</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload the official Notice Inviting Tender, technical specifications, eligibility clauses, and turnover criteria.
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => onUploadClick('tender')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Upload Tender Document</span>
                </button>
              </div>
            </div>

            {/* Step 2: Bidder Dossier */}
            <div className="bg-amber-50/40 border-2 border-dashed border-amber-300 hover:border-amber-400 rounded-2xl p-6 text-center transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl mx-auto flex items-center justify-center font-mono font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Bidder Dossier / Binder</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload bidder qualification papers: audited balance sheets, CA certificates, ISO certifications, and OEM undertakings.
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => onUploadClick('bidder')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Bidder Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* AI Extraction Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tender Extraction Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stage 1: Tender Requirement Extraction
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {tenderDocs.length} Tender Docs
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Extract Structured Tender Clauses
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  AI parses uploaded tender PDFs and identifies all eligibility, financial turnover, technical, and delivery conditions into structured requirements.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {tenderDocs.length > 0 ? 'Ready for extraction' : 'No tender document uploaded'}
                </span>
                <button
                  onClick={onAnalyzeTender}
                  disabled={isAnalyzingTender || tenderDocs.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingTender ? 'animate-spin' : 'text-amber-400'}`} />
                  <span>{isAnalyzingTender ? 'Extracting Clauses...' : 'Run Tender Extraction'}</span>
                </button>
              </div>
            </div>

            {/* Bidder Evidence Extraction Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stage 2: Bidder Evidence Extraction
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {bidderDocs.length} Bidder Files
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Extract Verifiable Evidence Citations
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Scans balance sheets, GST registrations, test reports, and certifications to extract metrics with exact page references and quotes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {bidderDocs.length > 0 ? 'Ready for evidence matching' : 'No bidder documents uploaded'}
                </span>
                <button
                  onClick={onAnalyzeBidder}
                  disabled={isAnalyzingBidder || bidderDocs.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingBidder ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingBidder ? 'Analyzing Evidence...' : 'Extract Bidder Evidence'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document Section Tabs & List Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tab Selection & Batch Actions */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  All Artifacts ({documents.length})
                </button>
                <button
                  onClick={() => setActiveTab('tender')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'tender'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Tender Documents ({tenderDocs.length})
                </button>
                <button
                  onClick={() => setActiveTab('bidder')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'bidder'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Bidder Dossier ({bidderDocs.length})
                </button>
                <button
                  onClick={() => setActiveTab('supporting')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'supporting'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Supporting ({supportingDocs.length})
                </button>
              </div>

              {/* Clear / Wipe Action */}
              {onClearAllDocuments && documents.length > 0 && (
                <div className="flex items-center gap-2">
                  {isConfirmingClear ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-lg">
                      <span className="text-[11px] font-bold text-rose-800">Clear all {activeTab} files?</span>
                      <button
                        onClick={handleClearConfirm}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded cursor-pointer"
                      >
                        Yes, Wipe
                      </button>
                      <button
                        onClick={() => setIsConfirmingClear(false)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsConfirmingClear(true)}
                      className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer"
                      title="Clear all documents in active view"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Files</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Documents Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-[36%]">Filename & Title</th>
                    <th className="py-3 px-3 w-[15%]">Document Type</th>
                    <th className="py-3 px-3 w-[12%]">Upload Date</th>
                    <th className="py-3 px-3 w-[14%]">Processing Status</th>
                    <th className="py-3 px-3 w-[11%]">Relevant Clauses</th>
                    <th className="py-3 px-4 text-right w-[12%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <FolderOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-600">No documents in this category</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Upload a file above to begin evidence indexing
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* File Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              {getDocIcon(doc.type)}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <div className="font-bold text-slate-900 truncate max-w-sm">
                                {doc.fileName}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.pageCount} Pages</span>
                                <span>•</span>
                                <span className="uppercase text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {doc.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                              doc.category === 'tender'
                                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                                : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}
                          >
                            {doc.category === 'tender' ? 'Tender Document' : 'Bidder Dossier'}
                          </span>
                        </td>

                        {/* Upload Date */}
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {doc.uploadDate}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">{getStatusBadge(doc.status)}</td>

                        {/* Relevant Requirements */}
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                            {doc.relevantRequirementsCount} Clauses
                          </span>
                        </td>

                        {/* Actions: Preview and Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewDocExcerpt(doc)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="View formal high-language evidentiary preview and provenance"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span className="hidden sm:inline">Preview</span>
                            </button>

                            {onDeleteDocument && (
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove document from analysis"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
