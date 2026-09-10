import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Building2,
  Calendar,
  FileText,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Project } from '../types';

interface StartFreshModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: Project;
  onConfirmStartFresh: (details: {
    name: string;
    tenderId: string;
    organization: string;
    bidderName: string;
    bidderGstin: string;
    tenderDeadline?: string;
    description?: string;
    createNewProject: boolean;
  }) => void;
  onClearCurrentDocsOnly: () => void;
}

export const StartFreshModal: React.FC<StartFreshModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onConfirmStartFresh,
  onClearCurrentDocsOnly,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(
    currentProject.isDemo ? '' : currentProject.name
  );
  const [tenderId, setTenderId] = useState(
    currentProject.isDemo ? '' : currentProject.tenderId
  );
  const [organization, setOrganization] = useState(
    currentProject.isDemo ? '' : currentProject.organization
  );
  const [bidderName, setBidderName] = useState(
    currentProject.isDemo ? '' : currentProject.bidderName
  );
  const [bidderGstin, setBidderGstin] = useState(
    currentProject.isDemo ? '' : currentProject.bidderGstin || ''
  );
  const [tenderDeadline, setTenderDeadline] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(
    currentProject.isDemo ? '' : currentProject.description || ''
  );
  const [asNewProject, setAsNewProject] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tenderId.trim() || !bidderName.trim()) {
      return;
    }

    onConfirmStartFresh({
      name: name.trim(),
      tenderId: tenderId.trim(),
      organization: organization.trim() || 'Procurement Authority',
      bidderName: bidderName.trim(),
      bidderGstin: bidderGstin.trim(),
      tenderDeadline,
      description: description.trim(),
      createNewProject: asNewProject,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Start Fresh with New Details
              </h3>
              <p className="text-xs text-slate-400">
                Clear existing tender & bidder documents to enter your own procurement data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              Entering new details will initialize a clean evaluation workspace with <strong>0 documents</strong>. You can then upload your own tender specifications and bidder dossiers to run automated compliance checks.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Tender Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tender Title / Procurement Package *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Supply & Installation of High-Capacity Generators"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Tender ID & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tender ID / GeM Reference *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GEM/2026/B/1098231"
                  value={tenderId}
                  onChange={(e) => setTenderId(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Procuring Entity / Authority
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Defence / NTPC"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {/* Bidder Legal Name & GSTIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bidder / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bharat Engineering Solutions Pvt Ltd"
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bidder GSTIN / PAN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 27AAACB9812M1Z5"
                  value={bidderGstin}
                  onChange={(e) => setBidderGstin(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {/* Tender Deadline & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Submission Deadline
                </label>
                <input
                  type="date"
                  value={tenderDeadline}
                  onChange={(e) => setTenderDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scope Summary (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief procurement description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Quick Action to Just Clear Current Documents */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Only want to empty the current bid's files?</span>
            <button
              type="button"
              onClick={() => {
                onClearCurrentDocsOnly();
                onClose();
              }}
              className="text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe Current Documents Only</span>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
              <span>Initialize Fresh Evaluation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
