export interface TraceStep {
  stepNumber: number;
  phase: string;
  action: string;
  inputSnippet: string;
  outputSnippet: string;
  durationMs: number;
  tokensConsumed: number;
  status: 'success' | 'warning' | 'error' | 'info';
  annotation: string;
}

export interface ArchitectureTrace {
  paradigm: 'rag' | 'long-context' | 'agentic-rag';
  name: string;
  totalDurationMs: number;
  totalTokens: number;
  estimatedCost: string;
  verdict: 'Success (High Accuracy)' | 'Success (Flawed / Incomplete)' | 'Failure (Hallucination / Truncation)' | 'Success (High Cost)';
  finalResponse: string;
  keyObservation: string;
  steps: TraceStep[];
}

export interface ScenarioTraceSimulation {
  id: string;
  title: string;
  category: string;
  prompt: string;
  underlyingContextSize: string;
  ragTrace: ArchitectureTrace;
  longContextTrace: ArchitectureTrace;
  agenticTrace: ArchitectureTrace;
}

export const SIMULATED_TRACES: ScenarioTraceSimulation[] = [
  {
    id: 'legal-indemnity-trace',
    title: 'Cross-Contract Indemnification Analysis',
    category: 'Legal Due Diligence',
    prompt: 'Extract the aggregate indemnification cap under Section 9.1 and determine whether IP infringement liabilities in Schedule 4.2 are carved out or subject to the general basket.',
    underlyingContextSize: '650,000 tokens (12 Merger Agreements + Schedules)',
    
    ragTrace: {
      paradigm: 'rag',
      name: 'Standard Vector RAG',
      totalDurationMs: 490,
      totalTokens: 1850,
      estimatedCost: '$0.0003',
      verdict: 'Failure (Hallucination / Truncation)',
      keyObservation: 'Top-K vector similarity pulled the general cap clause, but missed the schedule amendment because the schedule lacked high semantic keyword overlap. Result is legally erroneous.',
      finalResponse: 'Under Section 9.1, the aggregate indemnification cap is strictly limited to $10,000,000 (10% of transaction consideration) with a $500,000 deductible basket. IP claims are governed by the general cap. [WARNING: Inaccurate - Missed Schedule 4.2 Carve-out]',
      steps: [
        {
          stepNumber: 1,
          phase: 'Embedding Generation',
          action: 'Embed user query via text-embedding-004',
          inputSnippet: '"Extract the aggregate indemnification cap under Section 9.1..."',
          outputSnippet: 'Vector representation [dim: 768, norm: 1.0]',
          durationMs: 45,
          tokensConsumed: 32,
          status: 'info',
          annotation: 'Query converted into dense embedding vector.'
        },
        {
          stepNumber: 2,
          phase: 'ANN Vector Retrieval',
          action: 'Cosine similarity search over 4,200 document chunks (k=4)',
          inputSnippet: 'HNSW index search with threshold > 0.70',
          outputSnippet: 'Retrieved: Chunk #142 (Sec 9.1 Cap), Chunk #143 (Sec 9.2 Basket), Chunk #88 (General Indemnity), Chunk #310 (Notice)',
          durationMs: 65,
          tokensConsumed: 0,
          status: 'warning',
          annotation: 'CRITICAL FAILURE: Schedule 4.2 ranked #28 in similarity because it referenced "Special Liabilities" without the words "indemnification cap". Chunk missed!'
        },
        {
          stepNumber: 3,
          phase: 'Context Assembly',
          action: 'Concatenate top-4 retrieved chunks into LLM prompt',
          inputSnippet: 'Chunks #142, #143, #88, #310 (total 1,420 tokens)',
          outputSnippet: 'Prompt payload assembled with system guardrails',
          durationMs: 10,
          tokensConsumed: 1420,
          status: 'info',
          annotation: 'Severed cross-references. Model is blind to the 200-page gap between Sec 9 and Schedule 4.'
        },
        {
          stepNumber: 4,
          phase: 'LLM Generation',
          action: 'Generate answer from bounded retrieved context',
          inputSnippet: 'System prompt + Retrieved snippets',
          outputSnippet: 'Generated answer asserting $10M cap applies across all liabilities.',
          durationMs: 370,
          tokensConsumed: 398,
          status: 'error',
          annotation: 'Model answered accurately based on what it saw, but its context was fatally incomplete.'
        }
      ]
    },

    longContextTrace: {
      paradigm: 'long-context',
      name: 'Long Context LLM (with Context Caching)',
      totalDurationMs: 1650,
      totalTokens: 651200,
      estimatedCost: '$0.0035 (Cached)',
      verdict: 'Success (High Accuracy)',
      keyObservation: 'Whole-document attention successfully reconciled the cross-reference between Section 9.1 and Schedule 4.2 with zero chunk loss. Server-side prompt caching minimized latency and token cost.',
      finalResponse: 'Section 9.1 establishes a general indemnification cap of $10,000,000 (10% of Enterprise Value). However, pursuant to Schedule 4.2 ("Excluded Liabilities"), claims arising from Intellectual Property Infringement and Environmental Non-Compliance are expressly carved out and subject to an uncapped liability ceiling up to the full Purchase Price ($100,000,000).',
      steps: [
        {
          stepNumber: 1,
          phase: 'Context Cache Lookup',
          action: 'Check server-side cache for Deal Corpus SHA-256 hash',
          inputSnippet: 'Cache key: `deal_packet_merger_corp_2024_rev2`',
          outputSnippet: 'CACHE HIT (650,000 tokens cached, TTL remaining: 6.2 days)',
          durationMs: 80,
          tokensConsumed: 0,
          status: 'success',
          annotation: '75% cost discount applied; eliminates re-tokenization latency of 650k tokens.'
        },
        {
          stepNumber: 2,
          phase: 'Full-Sequence Self-Attention',
          action: 'Evaluate user query against complete 650k token context window',
          inputSnippet: 'User query appended to cached deal memory',
          outputSnippet: 'Attention heads bridge Section 9.1 cross-reference to Schedule 4.2 paragraph 3',
          durationMs: 1100,
          tokensConsumed: 650050,
          status: 'success',
          annotation: 'Multi-head attention detects exact legal relationship without chunk boundary truncation.'
        },
        {
          stepNumber: 3,
          phase: 'Grounded Answer Generation',
          action: 'Synthesize verified legal response with verbatim citations',
          inputSnippet: 'Attended representations -> Output decoder',
          outputSnippet: 'Comprehensive breakdown citing Section 9.1, Section 1.1 definitions, and Schedule 4.2 exceptions.',
          durationMs: 470,
          tokensConsumed: 450,
          status: 'success',
          annotation: '100% legal precision with zero missed caveats.'
        }
      ]
    },

    agenticTrace: {
      paradigm: 'agentic-rag',
      name: 'Agentic RAG (Self-Reflective Loop)',
      totalDurationMs: 9850,
      totalTokens: 14800,
      estimatedCost: '$0.038',
      verdict: 'Success (High Cost)',
      keyObservation: 'Agentic loop successfully caught the missing carve-out by reflecting and searching for schedule exceptions in Step 3. However, it took 9.8 seconds and 4 LLM round-trips.',
      finalResponse: 'Initial search located the general $10,000,000 cap in Section 9.1. An autonomous follow-up tool query over Schedules revealed Schedule 4.2, which explicitly carves out Intellectual Property claims from the general deductible and cap.',
      steps: [
        {
          stepNumber: 1,
          phase: 'Query Planning & Decomposition',
          action: 'Agent parses goal into sub-queries',
          inputSnippet: '"Extract aggregate indemnification cap and check IP carve-outs"',
          outputSnippet: 'Sub-goal 1: Query Section 9.1 for cap. Sub-goal 2: Query Schedules for carve-out definitions.',
          durationMs: 750,
          tokensConsumed: 850,
          status: 'info',
          annotation: 'Agent formulates structured execution plan.'
        },
        {
          stepNumber: 2,
          phase: 'Tool Call: Vector Search #1',
          action: 'Query vector DB for "Section 9.1 indemnification cap"',
          inputSnippet: 'Vector tool call -> top 3 chunks',
          outputSnippet: 'Retrieved Section 9.1 ($10M cap)',
          durationMs: 410,
          tokensConsumed: 1200,
          status: 'info',
          annotation: 'First sub-question resolved.'
        },
        {
          stepNumber: 3,
          phase: 'Self-RAG Reflection & Gap Detection',
          action: 'Grader checks if IP carve-out question is answered',
          inputSnippet: 'Evaluate retrieved chunks against query intent',
          outputSnippet: 'VERDICT: INSUFFICIENT. General cap found, but IP carve-out status remains unverified.',
          durationMs: 820,
          tokensConsumed: 1650,
          status: 'warning',
          annotation: 'Corrective loop triggers second targeted retrieval.'
        },
        {
          stepNumber: 4,
          phase: 'Tool Call: Targeted Keyword Search #2',
          action: 'Query index for "Schedule 4.2 IP carve out excluded liability"',
          inputSnippet: 'Targeted lexical + vector filter',
          outputSnippet: 'Retrieved Schedule 4.2 text',
          durationMs: 380,
          tokensConsumed: 1850,
          status: 'success',
          annotation: 'Successfully located missing clause via corrective re-query.'
        },
        {
          stepNumber: 5,
          phase: 'Final Synthesis & Verification',
          action: 'Combine Sub-goal 1 and Sub-goal 2 findings',
          inputSnippet: 'Aggregated findings from both tool calls',
          outputSnippet: 'Generated complete verified answer.',
          durationMs: 1490,
          tokensConsumed: 2250,
          status: 'success',
          annotation: 'High accuracy achieved, but required 9.8s and 5 internal state transitions.'
        }
      ]
    }
  },
  {
    id: 'sre-outage-trace',
    title: 'Kubernetes Pod Outage & Commit Correlation',
    category: 'DevOps & SRE',
    prompt: 'Diagnose why payment-gateway pods are crashlooping with OOMKilled errors in us-east-1 and identify the offending commit merged in the last 2 hours.',
    underlyingContextSize: '2.5M tokens (Runbooks + Live Kubernetes API + GitHub Diff)',
    
    ragTrace: {
      paradigm: 'rag',
      name: 'Standard Vector RAG',
      totalDurationMs: 410,
      totalTokens: 1100,
      estimatedCost: '$0.0002',
      verdict: 'Failure (Hallucination / Truncation)',
      keyObservation: 'RAG retrieved static 2022 troubleshooting documentation on how to increase memory limits, but had zero visibility into the live Kubernetes cluster or recent GitHub commits.',
      finalResponse: 'To resolve OOMKilled errors on payment-gateway, edit the Deployment manifest and increase `resources.limits.memory` from 512Mi to 1Gi using `kubectl edit deploy payment-gateway`. [FATAL: Did not diagnose the active incident or find the offending commit]',
      steps: [
        {
          stepNumber: 1,
          phase: 'Query Embedding',
          action: 'Embed query into vector space',
          inputSnippet: '"Diagnose why payment-gateway pods are crashlooping..."',
          outputSnippet: 'Vector representation generated',
          durationMs: 35,
          tokensConsumed: 28,
          status: 'info',
          annotation: 'Standard vector indexing.'
        },
        {
          stepNumber: 2,
          phase: 'Vector DB Search',
          action: 'Search static runbook index',
          inputSnippet: 'ANN search over static wiki documentation',
          outputSnippet: 'Retrieved: "Kubernetes Memory Troubleshooting Guide (2022)"',
          durationMs: 50,
          tokensConsumed: 850,
          status: 'error',
          annotation: 'Static vector store has NO access to live cluster state or GitHub commit logs.'
        },
        {
          stepNumber: 3,
          phase: 'Prompt Generation',
          action: 'Generate response from static runbook',
          inputSnippet: 'Generic wiki advice',
          outputSnippet: 'Advised increasing memory limit blindly.',
          durationMs: 325,
          tokensConsumed: 220,
          status: 'warning',
          annotation: 'Outage persists because underlying memory leak in new commit was not discovered.'
        }
      ]
    },

    longContextTrace: {
      paradigm: 'long-context',
      name: 'Long Context LLM',
      totalDurationMs: 4800,
      totalTokens: 180000,
      estimatedCost: '$0.045',
      verdict: 'Success (Flawed / Incomplete)',
      keyObservation: 'If an engineer manually dumps 10MB of logs into the prompt, Long Context can spot the Java heap dump, but it cannot actively execute follow-up queries or verify git diffs.',
      finalResponse: 'The ingested log dump shows `java.lang.OutOfMemoryError: Java heap space` in `PaymentCacheManager`. However, I cannot query GitHub to identify which commit introduced this change without external tool access.',
      steps: [
        {
          stepNumber: 1,
          phase: 'Document Loading',
          action: 'Ingest 180,000 tokens of raw console logs pasted by engineer',
          inputSnippet: 'Raw stdout dump from 6 failing pods',
          outputSnippet: '180k tokens parsed into memory context',
          durationMs: 2400,
          tokensConsumed: 180000,
          status: 'warning',
          annotation: 'High token volume spent ingesting repetitive log spam.'
        },
        {
          stepNumber: 2,
          phase: 'Self-Attention Analysis',
          action: 'Pinpoint error stack traces in log stream',
          inputSnippet: 'Self-attention across 180k tokens',
          outputSnippet: 'Identified heap exhaustion stack trace at line 41,209.',
          durationMs: 1600,
          tokensConsumed: 180100,
          status: 'info',
          annotation: 'Found the symptom, but cannot interact with external systems to find the root cause commit.'
        },
        {
          stepNumber: 3,
          phase: 'Synthesis',
          action: 'Summarize findings with missing action context',
          inputSnippet: 'Log analysis result',
          outputSnippet: 'Reported heap leak, recommended manual engineer git log check.',
          durationMs: 800,
          tokensConsumed: 210,
          status: 'info',
          annotation: 'Incomplete triage: engineer must still do manual investigation.'
        }
      ]
    },

    agenticTrace: {
      paradigm: 'agentic-rag',
      name: 'Agentic RAG (Autonomous Incident Agent)',
      totalDurationMs: 7600,
      totalTokens: 6200,
      estimatedCost: '$0.016',
      verdict: 'Success (High Accuracy)',
      keyObservation: 'Agent autonomously queried the Kubernetes API, diagnosed the memory leak, checked GitHub commits, pinpointed the exact offending commit SHA, and generated a 1-click rollback command.',
      finalResponse: 'ROOT CAUSE IDENTIFIED: Commit #d94e1a ("Enable unbounded in-memory cache for card issuer metadata") merged 42 minutes ago by dev-user introduced a memory leak in `IssuerCache.go`. All 4 pods failed after memory usage surged to 512Mi limit. RECOMMENDATION: Execute 1-click rollback to commit #c1209b.',
      steps: [
        {
          stepNumber: 1,
          phase: 'Live Telemetry Inspection',
          action: 'Tool Call: `k8s_describe_pod(namespace="prod", app="payment-gateway")`',
          inputSnippet: 'Query live Kubernetes API',
          outputSnippet: 'Exit Code 137 (OOMKilled), Last restart: 8 mins ago',
          durationMs: 620,
          tokensConsumed: 450,
          status: 'success',
          annotation: 'Live verification of active pod crash condition.'
        },
        {
          stepNumber: 2,
          phase: 'Git History Inspection',
          action: 'Tool Call: `github_get_recent_commits(repo="payment-service", hours=2)`',
          inputSnippet: 'Query GitHub API for recent merges',
          outputSnippet: 'Found 2 commits: #c1209b (Docs) and #d94e1a ("Enable unbounded in-memory cache...")',
          durationMs: 510,
          tokensConsumed: 980,
          status: 'success',
          annotation: 'Filtered directly to suspected code deployment window.'
        },
        {
          stepNumber: 3,
          phase: 'Code Diff Analysis',
          action: 'Tool Call: `github_get_diff(commit="d94e1a")`',
          inputSnippet: 'Inspect code changes in commit',
          outputSnippet: 'Diff shows: `sync.Map` initialized with no TTL eviction or max capacity limit.',
          durationMs: 710,
          tokensConsumed: 1850,
          status: 'success',
          annotation: 'Direct smoking-gun identification in source code.'
        },
        {
          stepNumber: 4,
          phase: 'Correlated Remediation Proposal',
          action: 'Synthesize findings and draft safe rollback plan',
          inputSnippet: 'Correlate K8s restart timestamp with commit deployment timestamp',
          outputSnippet: 'Generated exact diagnosis, root cause explanation, and rollback PR command.',
          durationMs: 1420,
          tokensConsumed: 1200,
          status: 'success',
          annotation: 'Incident resolved end-to-end without engineer context switching.'
        }
      ]
    }
  }
];
