export type ParadigmType = 'rag' | 'long-context' | 'agentic-rag' | 'hybrid';

export interface ParadigmDetails {
  id: ParadigmType;
  name: string;
  tagline: string;
  badge: string;
  color: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  summary: string;
  primaryMechanism: string;
  strengths: string[];
  weaknesses: string[];
  sweetSpot: string;
  fatalFlaw: string;
  typicalLatency: string;
  costProfile: string;
  operationalComplexity: 'Low' | 'Medium' | 'High' | 'Very High';
}

export interface GranularAssessment {
  fit: 'Ideal' | 'Viable' | 'Suboptimal' | 'Anti-Pattern';
  score: number; // 0 - 10
  pros: string[];
  cons: string[];
  failureMode: string;
  p95Latency: string;
  costEstimate: string;
}

export interface EnterpriseUseCase {
  id: string;
  title: string;
  industry: 'Legal & Compliance' | 'Customer Operations' | 'DevOps & SRE' | 'Financial Services' | 'Healthcare & Life Sciences' | 'Software Engineering' | 'Supply Chain';
  difficulty: 'Standard' | 'Complex' | 'Mission-Critical';
  summary: string;
  enterpriseContext: string;
  challenge: string;
  corpusScale: string;
  corpusTokens: number;
  monthlyQueryVolume: string;
  latencySla: string;
  updateFrequency: string;
  reasoningType: 'Point Fact Retrieval' | 'Cross-Document Synthesis' | 'Multi-Hop Tool Execution' | 'Holistic Document Reasoning';
  
  verdict: {
    winner: ParadigmType;
    confidence: number;
    headline: string;
    executiveRationale: string;
  };
  
  assessments: {
    rag: GranularAssessment;
    longContext: GranularAssessment;
    agenticRag: GranularAssessment;
  };
  
  blueprint: {
    architectureName: string;
    ingestionPipeline: string;
    retrievalOrContextLayer: string;
    inferenceLayer: string;
    cacheOrIndexStrategy: string;
    safeguards: string[];
  };
  
  sampleEnterpriseQuery: string;
  traceHighlights: {
    ragOutcome: string;
    longContextOutcome: string;
    agenticOutcome: string;
  };
}

export interface DecisionWizardState {
  corpusSize: 'small' | 'medium' | 'large' | 'massive'; // <500k, 500k-5M, 5M-50M, >50M
  informationTopology: 'factual-point' | 'cross-doc-synthesis' | 'dynamic-tools' | 'whole-file-structure';
  latencyRequirement: 'realtime' | 'interactive' | 'async'; // <800ms, 2-5s, 10-30s
  dataDynamics: 'static' | 'periodic' | 'realtime-streaming';
  reasoningDepth: 'single-hop' | 'multi-hop' | 'iterative-validation';
  budgetSensitivity: 'high-volume-low-cost' | 'balanced' | 'quality-first';
}

export interface EvaluationResult {
  recommendedParadigm: string;
  confidenceScore: number;
  executiveSummary: string;
  winnerKeyStrengths: string[];
  ragAssessment: {
    verdict: string;
    score: number;
    explanation: string;
    criticalFailureMode: string;
  };
  longContextAssessment: {
    verdict: string;
    score: number;
    explanation: string;
    criticalFailureMode: string;
  };
  agenticRagAssessment: {
    verdict: string;
    score: number;
    explanation: string;
    criticalFailureMode: string;
  };
  recommendedStack: {
    retrievalEngine: string;
    contextManagement: string;
    guardrails: string;
  };
  tradeoffs: {
    p95Latency: string;
    costPer10kQueries: string;
    operationalComplexity: string;
    maintenanceGotcha: string;
  };
  fallback?: boolean;
  source?: string;
}
