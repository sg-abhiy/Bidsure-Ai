import React, { useState } from 'react';
import { X, Plus, Sparkles, Building2, Calendar, FileText, Check } from 'lucide-react';
import { Project } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectData: Partial<Project>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [tenderId, setTenderId] = useState('');
  const [organization, setOrganization] = useState('');
  const [bidderName, setBidderName] = useState('');
  const [bidderGstin, setBidderGstin] = useState('');
  const [tenderDeadline, setTenderDeadline] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');

  const handleTemplateLoad = (type: 'safety' | 'it_hardware') => {
    if (type === 'safety') {
      setName('Supply of High-Altitude Industrial Safety Equipment');
      setTenderId('GEM/2026/B/9821430');
      setOrganization('National Thermal Power Corporation (NTPC Ltd.)');
      setBidderName('Vanguard Apex Industrial Solutions Pvt Ltd');
      setBidderGstin('27AAACB9812M1Z5');
      setDescription(
        'Procurement of industrial safety equipment, harnesses, helmets, and certified gas monitors under Make-in-India guidelines.'
      );
    } else {
      setName('Supply and Installation of Server Racks & High-Speed Switches');
      setTenderId('GEM/2026/B/8741902');
      setOrganization('Ministry of Electronics & Information Technology (MeitY)');
      setBidderName('CyberGrid Systems India LLP');
      setBidderGstin('07AAKCS4591B1Z3');
      setDescription(
        'Turnkey supply of OEM enterprise switches with Tier-3 redundancy and 5-year onsite warranty.'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tenderId || !bidderName) return;

    onCreateProject({
      name,
      tenderId,
      organization: organization || 'Government Procuring Entity',
      bidderName,
      bidderGstin,
      tenderDeadline,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Plus className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Bid Analysis</h3>
              <p className="text-xs text-slate-400">Initialize a tender compliance verification project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Template Selector */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick-Fill Sample Tender:</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTemplateLoad('safety')}
              className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              Safety Equipment
            </button>
            <button
              type="button"
              onClick={() => handleTemplateLoad('it_hardware')}
              className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              IT Hardware
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Tender Title / Procurement Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Supply of Industrial Safety Equipment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Tender ID (GeM / CPPP) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., GEM/2026/B/9821430"
                value={tenderId}
                onChange={(e) => setTenderId(e.target.value)}
                className="w-full bg-white text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Procuring Entity / Buyer *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., NTPC Ltd. / Ministry of Defence"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-white text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Bidder / Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Vanguard Apex Solutions Pvt Ltd"
                value={bidderName}
                onChange={(e) => setBidderName(e.target.value)}
                className="w-full bg-white text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Bidder GSTIN / PAN
              </label>
              <input
                type="text"
                placeholder="e.g., 27AAACB9812M1Z5"
                value={bidderGstin}
                onChange={(e) => setBidderGstin(e.target.value)}
                className="w-full bg-white text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Tender Submission Deadline
            </label>
            <input
              type="date"
              value={tenderDeadline}
              onChange={(e) => setTenderDeadline(e.target.value)}
              className="w-full bg-white text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Procurement Scope / Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of required supplies or services..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Create & Proceed to Document Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
