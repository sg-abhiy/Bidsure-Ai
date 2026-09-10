import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ShieldAlert,
  Send,
  Loader2,
  Copy,
  Check,
  Compass,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ComplianceResult, Contradiction, MissingDocument, Project, NonTechnicalExplanation } from '../types';

interface NonTechnicalExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ComplianceResult | null;
  contradiction?: Contradiction | null;
  missingDoc?: MissingDocument | null;
  project?: Project | null;
  initialQuestion?: string;
}

export const NonTechnicalExplainerModal: React.FC<NonTechnicalExplainerModalProps> = ({
  isOpen,
  onClose,
  item,
  contradiction,
  missingDoc,
  project,
  initialQuestion = '',
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [explanation, setExplanation] = useState<NonTechnicalExplanation | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>(initialQuestion);
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  // Determine subject title and category
  const title =
    item?.requirement?.title ||
    contradiction?.field ||
    missingDoc?.name ||
    project?.name ||
    'Procurement Technical Specification';

  const category =
    item?.requirement?.category ||
    (contradiction ? 'Cross-Audit Discrepancy' : missingDoc ? 'Missing Document' : 'Tender Evaluation');

  useEffect(() => {
    fetchExplanation();
  }, [item?.id, contradiction?.id, missingDoc?.id]);

  const fetchExplanation = async (questionOverride?: string) => {
    setIsLoading(true);
    try {
      let type: 'requirement' | 'contradiction' | 'missing_document' | 'project_overview' = 'requirement';
      let dataPayload: any = item;

      if (contradiction) {
        type = 'contradiction';
        dataPayload = contradiction;
      } else if (missingDoc) {
        type = 'missing_document';
        dataPayload = missingDoc;
      } else if (project && !item) {
        type = 'project_overview';
        dataPayload = project;
      }

      const res = await fetch('/api/ai/explain-technical-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          data: dataPayload,
          question: questionOverride || undefined,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.explanation) {
          setExplanation(json.explanation);
        }
      }
    } catch (err) {
      console.warn('Error fetching Gemini plain-English explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskCustomQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customQuestion.trim() || isAsking) return;

    const q = customQuestion.trim();
    setIsAsking(true);
    try {
      let dataPayload: any = item || contradiction || missingDoc || project;

      const res = await fetch('/api/ai/explain-technical-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contradiction ? 'contradiction' : 'requirement',
          title,
          data: dataPayload,
          question: q,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const ans =
          json.explanation?.plainEnglishSummary ||
          json.explanation?.recommendedDecision ||
          'Here is the plain English explanation for your question.';

        setQaHistory((prev) => [...prev, { q, a: ans }]);
        setCustomQuestion('');
      }
    } catch (err) {
      console.warn('Error asking Gemini question:', err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(text);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const quickQuestions = [
    'Can the committee legally waive this requirement?',
    'What is the practical risk to our timeline if we overlook this?',
    'What simple question should we ask the bidder in the meeting?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  Gemini AI • Plain English Explainer
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  For Non-Technical Stakeholders
                </span>
              </div>
              <h3 className="text-base font-bold text-white truncate max-w-xl mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/50">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm font-bold text-slate-800">
                Gemini is translating technical details into Plain English...
              </p>
              <p className="text-xs text-slate-500 max-w-md">
                Removing procurement jargon, analyzing real-world business risks, and building everyday analogies for the committee.
              </p>
            </div>
          ) : !explanation ? (
            <div className="py-12 text-center text-slate-500">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Unable to generate explanation</p>
            </div>
          ) : (
            <>
              {/* Top Card: What This Actually Means In Plain English */}
              <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />
                  <h4 className="text-sm font-black uppercase tracking-wider">
                    In Plain Words: What Does This Rule Mean?
                  </h4>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {explanation.plainEnglishSummary}
                </p>

                {/* Relatable Everyday Analogy */}
                {explanation.analogy && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3 mt-3">
                    <Compass className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                        Everyday Analogy
                      </span>
                      <p className="text-xs text-amber-950 font-medium italic leading-relaxed">
                        "{explanation.analogy}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid: What Bidder Did vs Real World Risk */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* What the Bidder Provided */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      What Did the Bidder Submit?
                    </h5>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {explanation.whatTheBidderDid}
                  </p>
                </div>

                {/* Real-World Risk */}
                <div className="bg-rose-50/50 rounded-xl border border-rose-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      The Real-World Business / Safety Risk
                    </h5>
                  </div>
                  <p className="text-xs text-rose-950 leading-relaxed font-medium">
                    {explanation.realWorldRisk}
                  </p>
                </div>
              </div>

              {/* Committee Recommendation */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                    Recommended Committee Decision
                  </span>
                  <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                    {explanation.recommendedDecision}
                  </p>
                </div>
              </div>

              {/* Questions for Committee to Ask Vendor */}
              {explanation.laymanQuestions && explanation.laymanQuestions.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">
                        Simple Questions to Ask in the Meeting
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400">Click to copy</span>
                  </div>

                  <div className="space-y-2">
                    {explanation.laymanQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleCopy(q)}
                        className="p-3 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-lg text-xs text-slate-800 font-medium flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                      >
                        <span className="leading-relaxed">
                          <strong className="text-amber-700 mr-1.5">Q{idx + 1}:</strong> {q}
                        </span>
                        <div className="shrink-0 text-slate-400 group-hover:text-amber-600">
                          {copiedQuestion === q ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jargon Glossary */}
              {explanation.keyJargonTerms && explanation.keyJargonTerms.length > 0 && (
                <div className="bg-slate-100/60 rounded-xl p-4 border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Technical Terms Decoded
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {explanation.keyJargonTerms.map((j, i) => (
                      <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs">
                        <span className="font-bold text-slate-900 block font-mono">{j.term}</span>
                        <span className="text-slate-600 text-[11px] mt-0.5 block leading-normal">
                          {j.plainMeaning}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Q&A with Gemini */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Ask Gemini: Explain Anything About This in Simple Terms
                  </h4>
                </div>

                {/* Q&A History */}
                {qaHistory.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {qaHistory.map((item, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="font-bold text-slate-800 bg-slate-100 p-2.5 rounded-lg">
                          You asked: {item.q}
                        </div>
                        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-950 font-medium leading-relaxed">
                          <strong className="text-indigo-700 block mb-1">Gemini Explains:</strong>
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((qq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomQuestion(qq);
                      }}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      {qq}
                    </button>
                  ))}
                </div>

                {/* Input box */}
                <form onSubmit={handleAskCustomQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Type any question (e.g., 'What happens if we give them 7 days?')..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!customQuestion.trim() || isAsking}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {isAsking ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Ask Gemini</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by Google Gemini 3.8 Flash • Plain Language Translation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
};
