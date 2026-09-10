import React, { useState } from 'react';
import {
  Printer,
  ExternalLink,
  Download,
  Check,
  X,
  ShieldCheck,
  Info,
  FileText,
} from 'lucide-react';
import { triggerSafeWindowPrint } from '../utils/pdfExport';

interface PrintDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  printBlobUrl: string;
  onDownloadPdf?: () => void;
  dossierType?: 'compliance' | 'artifact';
}

export const PrintDispatchModal: React.FC<PrintDispatchModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  printBlobUrl,
  onDownloadPdf,
  dossierType = 'compliance',
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [directPrintAttempted, setDirectPrintAttempted] = useState(false);

  if (!isOpen) return null;

  const handleDirectPrint = () => {
    setDirectPrintAttempted(true);
    const success = triggerSafeWindowPrint();
    if (!success) {
      console.warn('Native window.print was restricted in this environment.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(printBlobUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header with sovereign styling */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  A4 Print Station
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  GFR-2017 Ready
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close Print Station"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Explanation Alert for iframe sandbox */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold text-amber-950">Why click "Open Print-Ready Tab"?</strong>
              <p className="mt-0.5 text-amber-800">
                Web browsers strictly restrict the native system print dialog inside sandboxed preview iframes. Opening the clean print tab runs the A4 layout in an unconstrained window and auto-launches the system printer dialog immediately.
              </p>
            </div>
          </div>

          {/* Primary Action: Open Clean Print Window */}
          <div className="space-y-2">
            <a
              href={printBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Keep modal open so user can close or download if needed
              }}
              className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all text-sm active:scale-[0.99] cursor-pointer text-decoration-none"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Open Print-Ready Tab (Auto-Prints)</span>
              <ExternalLink className="w-4 h-4 text-slate-950 opacity-70" />
            </a>
            <p className="text-[11px] text-center text-slate-500">
              Opens the complete formatted dossier in a new tab & automatically pops open your printer / "Save as PDF" dialog.
            </p>
          </div>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            {onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Download Vector PDF</span>
              </button>
            )}

            <button
              onClick={handleDirectPrint}
              className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Attempts direct browser print in current window"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{directPrintAttempted ? 'Re-trigger In-Window Print' : 'Direct Browser Print'}</span>
            </button>
          </div>

          {/* Standards & Provenance Footer */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Includes committee signatories & GFR compliance seal</span>
            </div>
            <span className="font-mono text-slate-400">A4 • Portrait</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
