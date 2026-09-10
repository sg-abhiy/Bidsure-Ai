import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Plus,
} from 'lucide-react';
import { DocumentItem } from '../types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory: 'tender' | 'bidder' | 'supporting';
  onUploadSuccess: (doc: DocumentItem) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  defaultCategory,
  onUploadSuccess,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<'tender' | 'bidder' | 'supporting'>(defaultCategory);
  const [fileName, setFileName] = useState('');
  const [docType, setDocType] = useState('PDF');
  const [fileContent, setFileContent] = useState('');
  const [pageCount, setPageCount] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick preset templates
  const applyPreset = (presetName: string, type: string, pages: number, sampleContent: string) => {
    setFileName(presetName);
    setDocType(type);
    setPageCount(pages);
    setFileContent(sampleContent);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setFileName(file.name);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    setDocType(ext);

    // Read content
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text || `[Binary ${ext} document uploaded: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB]`);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        projectId: 'active-project',
        fileName,
        type: docType,
        category,
        uploadDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Analyzed',
        pageCount,
        size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
        relevantRequirementsCount: category === 'tender' ? 8 : 4,
        content:
          fileContent ||
          `Official ${category} artifact: ${fileName}. Extracted and OCR-indexed for GeM compliance engine.`,
      };

      onUploadSuccess(newDoc);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Upload className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Procurement Artifact</h3>
              <p className="text-xs text-slate-400">PDF, DOCX, TXT, or XLSX with automated text extraction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample File Presets */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
            Quick-Select Sample Bidder Artifact:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                applyPreset(
                  'ISO_45001_Safety_Certificate_2026.pdf',
                  'PDF',
                  3,
                  'Certificate of Occupational Health and Safety Management System. ISO 45001:2018. Scope: Design and manufacture of personal fall arrest systems and safety harnesses. Validity: 14-Aug-2027.'
                )
              }
              className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-800 font-medium transition-colors cursor-pointer"
            >
              + ISO 45001 Certificate
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset(
                  'CA_NetWorth_Solvency_Certificate.pdf',
                  'PDF',
                  2,
                  'Chartered Accountant Net Worth Certificate. Certified Net Worth: ₹14.50 Crore as of 31-March-2025. Bank Solvency verified with State Bank of India.'
                )
              }
              className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-800 font-medium transition-colors cursor-pointer"
            >
              + Solvency Certificate
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset(
                  'OEM_Authorization_Form_MAF.pdf',
                  'PDF',
                  1,
                  'Manufacturer Authorization Form (MAF). We hereby authorize Vanguard Apex to bid and supply our OEM Certified Gas Detectors with 5-year replacement SLA.'
                )
              }
              className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-800 font-medium transition-colors cursor-pointer"
            >
              + OEM MAF Authorization
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Document Category */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Artifact Classification *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('tender')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  category === 'tender'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Tender Notice
              </button>
              <button
                type="button"
                onClick={() => setCategory('bidder')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  category === 'bidder'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Bidder Submission
              </button>
              <button
                type="button"
                onClick={() => setCategory('supporting')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  category === 'supporting'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Supporting Annexure
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.xlsx,.csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
            />
            <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">
              Drag & Drop your procurement file here, or{' '}
              <span className="text-amber-600 underline">browse computer</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports PDF, DOCX, TXT, XLSX (Up to 50 MB)
            </p>
          </div>

          {/* Selected File Details */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              File Name / Identified Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Financial_Statement_FY24-25.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-white text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
            />
          </div>

          {/* Extracted Text Content / Preview */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Extracted Document Text / OCR Clauses Preview
            </label>
            <textarea
              rows={3}
              placeholder="Text extracted from file will appear here for verification..."
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="w-full bg-slate-50 text-xs p-2.5 rounded-lg border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fileName || isProcessing}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-40 flex items-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : 'text-amber-400'}`} />
              <span>{isProcessing ? 'Processing OCR & Indexing...' : 'Index & Add Artifact'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
