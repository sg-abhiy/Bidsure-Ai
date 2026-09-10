import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  Printer,
  Loader2,
  Lightbulb,
  Compass,
  FileCheck,
  Send,
  Building2,
  Layers,
} from 'lucide-react';
import { Project, ExecutivePlainBriefing } from '../types';

interface ExecutivePlainBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ExecutivePlainBriefingModal: React.FC<ExecutivePlainBriefingModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [briefing, setBriefing] = useState<ExecutivePlainBriefing | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [qaList, setQaList] = useState<Array<{ q: string; a: string }>>([]);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchBriefing();
  }, [project.id]);

  const fetchBriefing = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/executive-plain-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.briefing) {
          setBriefing(json.briefing);
        }
      }
    } catch (err) {
      console.warn('Error fetching plain briefing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customQuestion.trim() || isAsking) return;

    const q = customQuestion.trim();
    setIsAsking(true);
    try {
      const res = await fetch('/api/ai/explain-technical-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'project_overview',
          title: project.name,
          data: project,
          question: q,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const ans =
          json.explanation?.plainEnglishSummary ||
          json.explanation?.recommendedDecision ||
          'Here is the plain-English response to your question.';
        setQaList((prev) => [...prev, { q, a: ans }]);
        setCustomQuestion('');
      }
    } catch (err) {
      console.warn('Error asking question:', err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopyText = () => {
    if (!briefing) return;
    const text = `EXECUTIVE NON-TECHNICAL BRIEFING (GEMINI AI)
Project: ${project.name} (${project.tenderId})
Bidder: ${project.bidderName}
Overall Score: ${project.overallScore}%

VERDICT:
${briefing.overallHealthVerdict}

SCORE EXPLANATION:
${briefing.scoreExplanation}

TOP STRENGTHS:
${briefing.topStrengths.map((s) => `• ${s}`).join('\n')}

TOP CONCERNS:
${briefing.topConcerns.map((c) => `• ${c}`).join('\n')}

COMMITTEE ACTION CHECKLIST:
${briefing.committeeActionChecklist.map((a) => `[ ] ${a}`).join('\n')}

ANALOGY:
${briefing.analogy}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Executive Plain-English Briefing
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  Gemini 3.8 Flash
                </span>
              </div>
              <h3 className="text-base font-bold text-white truncate max-w-xl mt-0.5">
                {project.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              disabled={!briefing}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Briefing'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/50">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm font-bold text-slate-800">
                Gemini is synthesizing the non-technical executive briefing...
              </p>
              <p className="text-xs text-slate-500 max-w-md">
                Translating financial ratios, legal clauses, and audit discrepancies into an easy-to-read 2-minute briefing.
              </p>
            </div>
          ) : !briefing ? (
            <div className="py-12 text-center text-slate-500">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Unable to load executive briefing</p>
            </div>
          ) : (
            <>
              {/* Verdict Banner */}
              <div
                className={`p-5 rounded-xl border-2 shadow-xs ${
                  briefing.verdictTone === 'CRITICAL'
                    ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                    : briefing.verdictTone === 'CAUTION'
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {briefing.verdictTone === 'CRITICAL' ? (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : briefing.verdictTone === 'CAUTION' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <span className="text-xs font-black uppercase tracking-wider">
                    Executive Bottom Line
                  </span>
                </div>
                <h4 className="text-base font-bold leading-relaxed">
                  {briefing.overallHealthVerdict}
                </h4>
                <p className="text-xs mt-2 opacity-90 leading-relaxed font-medium">
                  {briefing.scoreExplanation}
                </p>
              </div>

              {/* Analogy Card */}
              {briefing.analogy && (
                <div className="bg-white rounded-xl border border-indigo-200 p-4 flex items-start gap-3 shadow-xs">
                  <Compass className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block mb-0.5">
                      Non-Technical Analogy
                    </span>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{briefing.analogy}"
                    </p>
                  </div>
                </div>
              )}

              {/* Strengths & Concerns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 pb-2 border-b border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      What the Bidder Got Right
                    </h5>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {briefing.topStrengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concerns */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 pb-2 border-b border-slate-100">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      Key Red Flags & Concerns
                    </h5>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {briefing.topConcerns.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed font-medium">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contradictions in Plain English */}
              {briefing.plainEnglishContradictions && briefing.plainEnglishContradictions.length > 0 && (
                <div className="bg-amber-50/50 rounded-xl border border-amber-200 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      Paperwork Contradictions in Plain Words
                    </h5>
                  </div>
                  <div className="space-y-2">
                    {briefing.plainEnglishContradictions.map((contra, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200/80 text-xs text-slate-800 font-medium">
                        {contra}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Committee Action Checklist */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
                  <FileCheck className="w-4 h-4 text-slate-700" />
                  <h5 className="text-xs font-bold uppercase tracking-wider">
                    Recommended Committee Action Checklist
                  </h5>
                </div>
                <div className="space-y-2">
                  {briefing.committeeActionChecklist.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2.5 font-medium"
                    >
                      <input
                        type="checkbox"
                        id={`act-${idx}`}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <label htmlFor={`act-${idx}`} className="cursor-pointer leading-relaxed">
                        {action}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ask Gemini Any Question */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Ask Gemini: Explain Any Part of This Bid in Simple Words
                  </h5>
                </div>

                {qaList.length > 0 && (
                  <div className="space-y-3 pt-1">
                    {qaList.map((item, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="font-bold text-slate-800 bg-slate-100 p-2.5 rounded-lg">
                          You asked: {item.q}
                        </div>
                        <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-950 font-medium leading-relaxed">
                          <strong className="text-indigo-700 block mb-1">Gemini Plain Explanation:</strong>
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Ask a non-technical question (e.g., 'Is this vendor financially stable?')..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!customQuestion.trim() || isAsking}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {isAsking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            BidSure AI • Decision-Support Briefing for Procurement Committees
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
