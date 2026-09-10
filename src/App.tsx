import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { ComplianceMatrix } from './components/ComplianceMatrix';
import { EvidenceViewerModal } from './components/EvidenceViewerModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { DocumentManager } from './components/DocumentManager';
import { ContradictionsView } from './components/ContradictionsView';
import { ComplianceReportView } from './components/ComplianceReportView';
import { ProjectList } from './components/ProjectList';
import { NewProjectModal } from './components/NewProjectModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { StartFreshModal } from './components/StartFreshModal';
import {
  Project,
  DocumentItem,
  Requirement,
  ComplianceResult,
  Contradiction,
  MissingDocument,
  ComplianceReport,
  ComplianceStatus,
} from './types';
import {
  CLEAN_BLANK_PROJECT,
  DEMO_PROJECT,
  DEMO_DOCUMENTS,
  DEMO_COMPLIANCE_RESULTS,
  DEMO_CONTRADICTIONS,
  DEMO_MISSING_DOCUMENTS,
  DEMO_REPORT,
} from './demoData';
import { NonTechnicalExplainerModal } from './components/NonTechnicalExplainerModal';
import { ExecutivePlainBriefingModal } from './components/ExecutivePlainBriefingModal';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>([CLEAN_BLANK_PROJECT]);
  const [selectedProject, setSelectedProject] = useState<Project>(CLEAN_BLANK_PROJECT);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [complianceResults, setComplianceResults] = useState<ComplianceResult[]>([]);
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [missingDocuments, setMissingDocuments] = useState<MissingDocument[]>([]);
  const [report, setReport] = useState<ComplianceReport | null>(null);

  // Plain-English explainer modal states (Gemini AI for non-technical stakeholders)
  const [isPlainExplainerOpen, setIsPlainExplainerOpen] = useState<boolean>(false);
  const [plainExplainerItem, setPlainExplainerItem] = useState<ComplianceResult | null>(null);
  const [plainExplainerContra, setPlainExplainerContra] = useState<Contradiction | null>(null);
  const [plainExplainerMissingDoc, setPlainExplainerMissingDoc] = useState<MissingDocument | null>(null);
  const [isPlainBriefingOpen, setIsPlainBriefingOpen] = useState<boolean>(false);

  // Modal states
  const [activeEvidenceItem, setActiveEvidenceItem] = useState<ComplianceResult | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isStartFreshModalOpen, setIsStartFreshModalOpen] = useState<boolean>(false);
  const [uploadCategory, setUploadCategory] = useState<'tender' | 'bidder' | 'supporting'>(
    'tender'
  );
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState<boolean>(false);
  const [isAnalyzingTender, setIsAnalyzingTender] = useState<boolean>(false);
  const [isAnalyzingBidder, setIsAnalyzingBidder] = useState<boolean>(false);
  const [isResettingDemo, setIsResettingDemo] = useState<boolean>(false);

  // Fetch projects list on initial mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setProjects(data);
          loadProjectDetails(data[0].id);
        }
      }
    } catch (err) {
      console.warn('Backend loading, using demo state:', err);
    }
  };

  const loadProjectDetails = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        const loadedProject: Project =
          data.project ||
          (data.id && data.stats ? data : null) ||
          CLEAN_BLANK_PROJECT;
        setSelectedProject(loadedProject);

        if (Array.isArray(data.documents)) {
          setDocuments(data.documents);
        } else {
          setDocuments([]);
        }

        if (Array.isArray(data.complianceResults)) {
          setComplianceResults(data.complianceResults);
        } else {
          setComplianceResults([]);
        }

        if (Array.isArray(data.contradictions)) {
          setContradictions(data.contradictions);
        } else {
          setContradictions([]);
        }

        if (Array.isArray(data.missingDocuments)) {
          setMissingDocuments(data.missingDocuments);
        } else {
          setMissingDocuments([]);
        }

        // Fetch official report
        try {
          const repRes = await fetch(`/api/projects/${projectId}/report`);
          if (repRes.ok) {
            const repData = await repRes.json();
            setReport(repData);
          } else {
            setReport(null);
          }
        } catch {
          setReport(null);
        }
      }
    } catch (err) {
      console.warn('Error loading project details, maintaining state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (p: Project) => {
    if (p) {
      setSelectedProject(p);
      loadProjectDetails(p.id);
    }
  };

  // Re-run compliance check
  const handleRunComplianceCheck = async () => {
    if (!selectedProject?.id) return;
    setIsCheckingCompliance(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/compliance-check`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        const resultsList: ComplianceResult[] = data.complianceResults || [];
        setComplianceResults(resultsList);
        setContradictions(data.contradictions || []);
        setMissingDocuments(data.missingDocuments || []);

        const compCount = resultsList.filter((r) => r.status === 'COMPLIANT').length;
        const revCount = resultsList.filter((r) => r.status === 'NEEDS_REVIEW').length;
        const nonCount = resultsList.filter((r) => r.status === 'NON_COMPLIANT').length;

        setSelectedProject((prev) => {
          const currentStats = prev?.stats || {
            totalRequirements: 0,
            compliant: 0,
            needsReview: 0,
            nonCompliant: 0,
          };
          return {
            ...(prev || DEMO_PROJECT),
            overallScore: data.overallScore ?? prev?.overallScore ?? 82,
            categoryScores: data.categoryScores || prev?.categoryScores || {},
            status: data.status || prev?.status || 'REVIEW REQUIRED',
            stats: {
              ...currentStats,
              totalRequirements: resultsList.length || currentStats.totalRequirements,
              compliant: compCount,
              needsReview: revCount,
              nonCompliant: nonCount,
            },
          };
        });

        // Also fetch refreshed report
        try {
          const repRes = await fetch(`/api/projects/${selectedProject.id}/report`);
          if (repRes.ok) {
            const repData = await repRes.json();
            setReport(repData);
          }
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Error running compliance check:', err);
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  // Run tender extraction
  const handleAnalyzeTender = async () => {
    setIsAnalyzingTender(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/analyze-tender`, {
        method: 'POST',
      });
      if (res.ok) {
        await loadProjectDetails(selectedProject.id);
      }
    } catch (err) {
      console.error('Error analyzing tender:', err);
    } finally {
      setIsAnalyzingTender(false);
    }
  };

  // Run bidder analysis
  const handleAnalyzeBidder = async () => {
    setIsAnalyzingBidder(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/analyze-bidder`, {
        method: 'POST',
      });
      if (res.ok) {
        await handleRunComplianceCheck();
      }
    } catch (err) {
      console.error('Error analyzing bidder:', err);
    } finally {
      setIsAnalyzingBidder(false);
    }
  };

  // Reset to demo data
  const handleResetDemo = async () => {
    setIsResettingDemo(true);
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        await fetchProjects();
        setCurrentTab('dashboard');
      }
    } catch (err) {
      console.error('Error resetting demo:', err);
    } finally {
      setIsResettingDemo(false);
    }
  };

  // Create new project
  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        const created = await res.json();
        setProjects((prev) => [created, ...prev]);
        setSelectedProject(created);
        await loadProjectDetails(created.id);
        setCurrentTab('documents');
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  // Add document
  const handleUploadSuccess = async (newDoc: DocumentItem) => {
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });
      if (res.ok) {
        const saved = await res.json();
        setDocuments((prev) => [saved, ...prev]);
      } else {
        setDocuments((prev) => [newDoc, ...prev]);
      }
    } catch (err) {
      setDocuments((prev) => [newDoc, ...prev]);
    }
  };

  // Granular document deletion
  const handleDeleteDocument = async (docId: string) => {
    try {
      await fetch(`/api/projects/${selectedProject.id}/documents/${docId}`, {
        method: 'DELETE',
      });
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error('Error deleting document:', err);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  // Clear all documents
  const handleClearAllDocuments = async (category: 'tender' | 'bidder' | 'all' = 'all') => {
    try {
      const query = category === 'all' ? '' : `?category=${category}`;
      await fetch(`/api/projects/${selectedProject.id}/documents${query}`, {
        method: 'DELETE',
      });
      if (category === 'all') {
        setDocuments([]);
      } else {
        setDocuments((prev) => prev.filter((d) => d.category !== category));
      }
    } catch (err) {
      console.error('Error clearing documents:', err);
      if (category === 'all') {
        setDocuments([]);
      } else {
        setDocuments((prev) => prev.filter((d) => d.category !== category));
      }
    }
  };

  // Start fresh with new tender and bidder details
  const handleStartFresh = async (details: {
    name: string;
    tenderId: string;
    organization: string;
    bidderName: string;
    bidderGstin: string;
    tenderDeadline?: string;
    description?: string;
    createNewProject: boolean;
  }) => {
    setIsLoading(true);
    try {
      if (details.createNewProject) {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: details.name,
            tenderId: details.tenderId,
            organization: details.organization,
            bidderName: details.bidderName,
            bidderGstin: details.bidderGstin,
            tenderDeadline: details.tenderDeadline,
            description: details.description,
          }),
        });
        if (res.ok) {
          const newProj = await res.json();
          setProjects((prev) => [newProj, ...prev]);
          setSelectedProject(newProj);
          setDocuments([]);
          setComplianceResults([]);
          setContradictions([]);
          setMissingDocuments([]);
          setReport(null);
          setCurrentTab('documents');
        }
      } else {
        // Update current project metadata
        await fetch(`/api/projects/${selectedProject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: details.name,
            tenderId: details.tenderId,
            organization: details.organization,
            bidderName: details.bidderName,
            bidderGstin: details.bidderGstin,
            tenderDeadline: details.tenderDeadline,
            description: details.description,
          }),
        });

        // Wipe artifacts and evaluation results
        await fetch(`/api/projects/${selectedProject.id}/clear`, {
          method: 'POST',
        });

        const updatedProj: Project = {
          ...selectedProject,
          name: details.name,
          tenderId: details.tenderId,
          organization: details.organization,
          bidderName: details.bidderName,
          bidderGstin: details.bidderGstin,
          tenderDeadline: details.tenderDeadline || selectedProject.tenderDeadline,
          description: details.description || '',
          status: 'Draft',
          overallScore: 0,
          categoryScores: {},
          stats: { totalRequirements: 0, compliant: 0, needsReview: 0, nonCompliant: 0 },
        };

        setSelectedProject(updatedProj);
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProject.id ? updatedProj : p))
        );
        setDocuments([]);
        setComplianceResults([]);
        setContradictions([]);
        setMissingDocuments([]);
        setReport(null);
        setCurrentTab('documents');
      }
    } catch (err) {
      console.error('Error starting fresh with new details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual status override by procurement committee
  const handleOverrideStatus = (
    complianceId: string,
    newStatus: ComplianceStatus,
    remark: string
  ) => {
    setComplianceResults((prev) =>
      prev.map((item) => {
        if (item.id === complianceId) {
          return {
            ...item,
            status: newStatus,
            reasoning: remark
              ? `${item.reasoning}\n\n[Committee Audit Override on ${new Date().toLocaleDateString()}]: ${remark}`
              : item.reasoning,
          };
        }
        return item;
      })
    );

    // Recalculate stats
    setSelectedProject((prev) => {
      const updatedList = complianceResults.map((it) =>
        it.id === complianceId ? { ...it, status: newStatus } : it
      );
      const comp = updatedList.filter((r) => r.status === 'COMPLIANT').length;
      const rev = updatedList.filter((r) => r.status === 'NEEDS_REVIEW').length;
      const non = updatedList.filter((r) => r.status === 'NON_COMPLIANT').length;
      const newScore = Math.round((comp / updatedList.length) * 100);

      return {
        ...prev,
        overallScore: newScore,
        status: non > 0 ? 'NON-COMPLIANT' : rev > 0 ? 'REVIEW REQUIRED' : 'COMPLIANT',
        stats: {
          ...prev.stats,
          compliant: comp,
          needsReview: rev,
          nonCompliant: non,
        },
      };
    });
  };

  // Plain English Explainers for Non-Technical Stakeholders (Gemini AI)
  const handleExplainItem = (item: ComplianceResult) => {
    setPlainExplainerItem(item);
    setPlainExplainerContra(null);
    setPlainExplainerMissingDoc(null);
    setIsPlainExplainerOpen(true);
  };

  const handleExplainContradiction = (contra: Contradiction) => {
    setPlainExplainerItem(null);
    setPlainExplainerContra(contra);
    setPlainExplainerMissingDoc(null);
    setIsPlainExplainerOpen(true);
  };

  const handleExplainMissingDoc = (doc: MissingDocument) => {
    setPlainExplainerItem(null);
    setPlainExplainerContra(null);
    setPlainExplainerMissingDoc(doc);
    setIsPlainExplainerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        onResetDemo={handleResetDemo}
        isResetting={isResettingDemo}
        onStartFresh={() => setIsStartFreshModalOpen(true)}
        onOpenPlainBriefing={() => setIsPlainBriefingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Section & Summary Cards */}
            <SummaryCards
              project={selectedProject}
              onNavigateToTab={setCurrentTab}
              onRunCheck={handleRunComplianceCheck}
              isChecking={isCheckingCompliance}
              onOpenPlainBriefing={() => setIsPlainBriefingOpen(true)}
            />

            {/* Quick Alert Banner for Contradictions or Missing Documents */}
            {(contradictions.length > 0 || missingDocuments.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contradiction Alert Card */}
                {contradictions.length > 0 && (
                  <div
                    onClick={() => setCurrentTab('contradictions')}
                    className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-200/60 border border-amber-300 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                            Contradictions Detected
                          </span>
                          <span className="text-xs font-mono font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                            {contradictions.length}
                          </span>
                        </div>
                        <p className="text-xs text-amber-800 line-clamp-1 mt-0.5">
                          Discrepancies found across submitted financial / technical sheets
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                )}

                {/* Missing Documents Alert Card */}
                {missingDocuments.length > 0 && (
                  <div
                    onClick={() => setCurrentTab('contradictions')}
                    className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-center justify-between shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-200/60 border border-rose-300 flex items-center justify-center shrink-0">
                        <XCircle className="w-5 h-5 text-rose-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                            Missing Mandatory Documents
                          </span>
                          <span className="text-xs font-mono font-bold bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded">
                            {missingDocuments.length}
                          </span>
                        </div>
                        <p className="text-xs text-rose-800 line-clamp-1 mt-0.5">
                          Critical certificates not submitted in bidder dossier
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-rose-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                )}
              </div>
            )}

            {/* Compliance Matrix Snapshot */}
            <ComplianceMatrix
              complianceResults={complianceResults}
              onViewEvidence={(item) => setActiveEvidenceItem(item)}
              onExplainItem={handleExplainItem}
            />
          </div>
        )}

        {currentTab === 'compliance' && (
          <div className="space-y-6">
            <ComplianceMatrix
              complianceResults={complianceResults}
              onViewEvidence={(item) => setActiveEvidenceItem(item)}
              onExplainItem={handleExplainItem}
            />
          </div>
        )}

        {currentTab === 'documents' && (
          <DocumentManager
            documents={documents}
            project={selectedProject}
            onUploadClick={(cat) => {
              setUploadCategory(cat);
              setIsUploadModalOpen(true);
            }}
            onAnalyzeTender={handleAnalyzeTender}
            onAnalyzeBidder={handleAnalyzeBidder}
            isAnalyzingTender={isAnalyzingTender}
            isAnalyzingBidder={isAnalyzingBidder}
            onViewDocExcerpt={(doc) => setPreviewDoc(doc)}
            onDeleteDocument={handleDeleteDocument}
            onClearAllDocuments={handleClearAllDocuments}
            onStartFresh={() => setIsStartFreshModalOpen(true)}
          />
        )}

        {currentTab === 'contradictions' && (
          <ContradictionsView
            contradictions={contradictions}
            missingDocuments={missingDocuments}
            onExplainContradiction={handleExplainContradiction}
            onExplainMissingDoc={handleExplainMissingDoc}
          />
        )}

        {currentTab === 'report' && (
          <ComplianceReportView
            report={report}
            project={selectedProject}
            complianceResults={complianceResults}
            contradictions={contradictions}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={(p) => {
              handleSelectProject(p);
              setCurrentTab('dashboard');
            }}
            onNewProject={() => setIsNewProjectModalOpen(true)}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-white font-bold">BidSure AI</span>
            <span>— AI-Powered Integrated Bid Compliance Verification Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Public & Enterprise Procurement Edition</span>
            <span>•</span>
            <span>GFR 2017 & GeM Aligned</span>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('report')}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Export Report
            </button>
          </div>
        </div>
      </footer>

      {/* Evidence Viewer Modal */}
      <EvidenceViewerModal
        item={activeEvidenceItem}
        onClose={() => setActiveEvidenceItem(null)}
        onOverrideStatus={handleOverrideStatus}
        onOpenPlainExplainer={handleExplainItem}
      />

      {/* Non-Technical Plain English Explainer Modal (Gemini AI) */}
      <NonTechnicalExplainerModal
        isOpen={isPlainExplainerOpen}
        onClose={() => setIsPlainExplainerOpen(false)}
        complianceItem={plainExplainerItem}
        contradictionItem={plainExplainerContra}
        missingDocItem={plainExplainerMissingDoc}
        projectName={selectedProject?.name || selectedProject?.tenderId}
      />

      {/* Executive Plain English Briefing Modal (Gemini AI) */}
      <ExecutivePlainBriefingModal
        isOpen={isPlainBriefingOpen}
        onClose={() => setIsPlainBriefingOpen(false)}
        project={selectedProject}
        complianceResults={complianceResults}
        contradictions={contradictions}
        missingDocuments={missingDocuments}
      />

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultCategory={uploadCategory}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Certified Sovereign Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      {/* Start Fresh Modal */}
      <StartFreshModal
        isOpen={isStartFreshModalOpen}
        onClose={() => setIsStartFreshModalOpen(false)}
        onConfirm={handleStartFresh}
        currentProject={selectedProject}
      />
    </div>
  );
}
