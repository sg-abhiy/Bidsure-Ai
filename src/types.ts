export type RequirementCategory =
  | 'Eligibility'
  | 'Financial'
  | 'Experience'
  | 'Technical'
  | 'Certification'
  | 'Documentation'
  | 'Delivery'
  | 'Legal/Regulatory'
  | 'Other';

export type ComplianceStatus = 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT';

export interface Requirement {
  id: string;
  projectId: string;
  category: RequirementCategory;
  title: string;
  requirement: string;
  mandatory: boolean;
  requiredValue?: string | number;
  unit?: string;
  evidenceRequired: string;
  sourceDocument: string;
  sourcePage: number;
}

export interface EvidenceItem {
  id?: string;
  documentName: string;
  documentType: 'tender' | 'bidder' | 'supporting';
  page: number;
  excerpt: string;
  extractedValue?: string | number;
  highlightSnippet?: string;
  confidence: number; // e.g. 96
}

export interface ComplianceResult {
  id: string;
  requirementId: string;
  requirement: Requirement;
  status: ComplianceStatus;
  confidence: number; // 0 to 100
  extractedValue: string;
  requiredCondition: string;
  reasoning: string;
  evidence: EvidenceItem[];
  evaluationType: 'rule_based' | 'semantic_llm' | 'hybrid';
  contradictionFlag?: boolean;
  contradictionDetails?: string;
}

export interface Contradiction {
  id: string;
  field: string;
  severity: 'HIGH' | 'MEDIUM';
  description: string;
  sourceA: {
    document: string;
    page: number;
    value: string;
    excerpt: string;
  };
  sourceB: {
    document: string;
    page: number;
    value: string;
    excerpt: string;
  };
}

export interface MissingDocument {
  id: string;
  name: string;
  category: RequirementCategory;
  mandatory: boolean;
  tenderClause: string;
  impactDescription: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  fileName: string;
  category: 'tender' | 'bidder' | 'supporting';
  type: string;
  size: string;
  uploadDate: string;
  status: 'Uploading' | 'Processing' | 'Analyzed' | 'Error';
  pageCount: number;
  relevantRequirementsCount: number;
  textContent?: string;
  content?: string;
}

export interface Project {
  id: string;
  name: string;
  tenderId: string;
  organization: string;
  bidderName: string;
  bidderGstin?: string;
  tenderDeadline: string;
  description: string;
  createdAt: string;
  status: 'Draft' | 'Analyzing' | 'Compliant' | 'Review Required' | 'Non-Compliant' | 'COMPLIANT' | 'REVIEW REQUIRED' | 'NON-COMPLIANT';
  overallScore: number;
  categoryScores: Partial<Record<RequirementCategory, number>>;
  stats: {
    totalRequirements: number;
    compliant: number;
    needsReview: number;
    nonCompliant: number;
  };
  isDemo?: boolean;
}

export interface ComplianceReport {
  project: Project;
  generatedAt: string;
  overallScore: number;
  executiveSummary: string;
  matrix: ComplianceResult[];
  nonCompliantItems: ComplianceResult[];
  reviewItems: ComplianceResult[];
  missingDocuments: MissingDocument[];
  contradictions: Contradiction[];
  categoryBreakdown: {
    category: RequirementCategory;
    score: number;
    total: number;
    compliant: number;
    needsReview: number;
    nonCompliant: number;
  }[];
  disclaimer: string;
}

export interface NonTechnicalExplanation {
  title: string;
  plainEnglishSummary: string;
  whatTheBidderDid: string;
  realWorldRisk: string;
  recommendedDecision: string;
  analogy?: string;
  laymanQuestions: string[];
  keyJargonTerms?: { term: string; plainMeaning: string }[];
}

export interface ExecutivePlainBriefing {
  overallHealthVerdict: string;
  verdictTone: 'POSITIVE' | 'CAUTION' | 'CRITICAL';
  scoreExplanation: string;
  topStrengths: string[];
  topConcerns: string[];
  plainEnglishContradictions: string[];
  committeeActionChecklist: string[];
  analogy: string;
}
