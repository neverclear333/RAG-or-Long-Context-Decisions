import { EnterpriseUseCase } from '../types/architecture';

export const ENTERPRISE_USE_CASES: EnterpriseUseCase[] = [
  {
    id: 'legal-due-diligence',
    title: 'M&A Due Diligence & 800-Page Contract Cross-Examination',
    industry: 'Legal & Compliance',
    difficulty: 'Mission-Critical',
    summary: 'Evaluating aggregate indemnification liabilities, cross-default provisions, and carve-outs across 12 merger agreements and ancillary disclosure schedules totaling ~650,000 tokens.',
    enterpriseContext: 'Corporate legal team conducting acquisition review under strict 72-hour regulatory filing deadlines. An overlooked indemnification limitation or conflicting definition between Schedule 3.2 and Section 9.4 could expose the firm to tens of millions in unhedged liability.',
    challenge: 'Legal contracts use cross-referencing definitions ("as defined in Section 1.1(c), except as modified by the Supplemental Agreement dated Nov 2022"). Answers depend on reconciling fragmented clauses that contradict each other across distant sections.',
    corpusScale: '650,000 tokens (12 full contracts + exhibits)',
    corpusTokens: 650000,
    monthlyQueryVolume: '15,000 queries/month',
    latencySla: '< 5 seconds (Interactive attorney research)',
    updateFrequency: 'Static for deal duration (cached for 1-2 weeks)',
    reasoningType: 'Cross-Document Synthesis',
    
    verdict: {
      winner: 'long-context',
      confidence: 96,
      headline: 'Long Context with Prompt Caching is the Decisive Victor',
      executiveRationale: 'Standard RAG suffers catastrophic failure here because chunking splits cross-referencing definitions from operative covenants. Legal due diligence requires full-document self-attention over every clause, and Gemini Context Caching delivers 75% cost savings with ~1.8s cached response times.'
    },
    
    assessments: {
      rag: {
        fit: 'Anti-Pattern',
        score: 3.8,
        pros: ['Low initial infrastructure cost', 'Fast vector lookup'],
        cons: [
          'Catastrophic chunk boundary truncation',
          'Misses cross-schedule disclosure caveats located 200 pages away',
          'Cosine similarity favors matching repetitive legalese boilerplate over nuanced exceptions'
        ],
        failureMode: 'Retrieves Section 9.1 indemnification cap ($5M) but misses Exhibit B amendment defining special environmental claims with uncapped liability, resulting in a dangerous false negative.',
        p95Latency: '680ms',
        costEstimate: '$3.20 / 10k queries'
      },
      longContext: {
        fit: 'Ideal',
        score: 9.7,
        pros: [
          'Full-document self-attention captures every cross-reference and defined term',
          'Context Caching holds the 650k-token deal packet warm for all partner attorneys',
          'Exact verbatim citations with paragraph numbers across all 12 documents',
          'Zero vector indexing, zero chunk tuning overhead'
        ],
        cons: [
          'Requires warm context cache (cold cache first run takes ~4.2s)',
          'Requires structured prompt guidance to prevent attention drift on minor boilerplate'
        ],
        failureMode: 'If the deal corpus expands past 2M tokens, must segment into 2 bundles; otherwise zero systemic failure modes.',
        p95Latency: '2.1s (Cached: 1.4s)',
        costEstimate: '$24.50 / 10k queries (with 80% Context Caching)'
      },
      agenticRag: {
        fit: 'Viable',
        score: 7.2,
        pros: [
          'Can recursively chase cross-references across sections',
          'Can formulate specific sub-queries for each indemnification clause'
        ],
        cons: [
          '4x to 8x higher latency (9-14 seconds per question)',
          'Agent tool hops introduce compounding risk of stopping prematurely before discovering all exceptions',
          'Unnecessary operational complexity when the entire corpus comfortably fits in context'
        ],
        failureMode: 'Agent planner assumes it found all indemnity clauses after 3 vector searches, failing to query the unindexed disclosure annex.',
        p95Latency: '11.4s',
        costEstimate: '$85.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'Cached Full-Corpus Attention Pipeline',
      ingestionPipeline: 'Unstructured.io / pdfplumber markdown parser preserving table alignments and exhibit headers',
      retrievalOrContextLayer: 'Gemini Context Caching with 1-week deal TTL (650k tokens loaded once, shared across deal room)',
      inferenceLayer: 'Gemini 3.1 Pro / Gemini 3.8 Flash with system prompt establishing legal definition precedence rules',
      cacheOrIndexStrategy: 'Server-side prompt cache hashed on SHA-256 of the 12 deal documents',
      safeguards: [
        'Mandatory page-number and clause-citation verification',
        'Strict extraction schema for indemnification caps, baskets, and sunset periods',
        'Automatic negative prompt asserting: "If no exception is stated in the packet, explicitly state not found"'
      ]
    },
    
    sampleEnterpriseQuery: 'What is the aggregate indemnification cap under the Agreement, and are IP infringement or environmental liabilities carved out of the general deductible?',
    traceHighlights: {
      ragOutcome: 'Retrieved Section 8.2 ($10M cap) but missed Schedule 4.1(d) which explicitly excludes IP infringement from the cap. Output is legally inaccurate.',
      longContextOutcome: 'Identified the $10M baseline in Sec 8.2, cross-referenced defined terms in Sec 1.1, and detected Schedule 4.1(d) environmental carve-out. 100% accurate extraction.',
      agenticOutcome: 'Agent executed 4 retrieval rounds, correctly located the clauses after 10.2s, but incurred $0.12 in LLM token overhead per query.'
    }
  },
  {
    id: 'customer-support-kb',
    title: 'Enterprise Customer Operations across 85,000 Support Docs',
    industry: 'Customer Operations',
    difficulty: 'Standard',
    summary: 'Answering high-volume end-user queries (500,000 queries/month) against 85,000 product manuals, troubleshooting guides, warranty policies, and release notes.',
    enterpriseContext: 'Tier-1 and Tier-2 automated support deflection for a global hardware and enterprise software provider. Requires sub-second responses embedded in live support chat widgets with strict SLA requirements (<800ms p95).',
    challenge: 'High concurrency (80+ queries per second during peak hours), massive distributed article count (120M total tokens), highly localized factual answers (e.g., "How to reset Bluetooth on Model X-400?").',
    corpusScale: '120 Million tokens across 85,000 articles',
    corpusTokens: 120000000,
    monthlyQueryVolume: '500,000 queries/month',
    latencySla: '< 750ms p95',
    updateFrequency: 'Continuous (articles updated hourly by support engineers)',
    reasoningType: 'Point Fact Retrieval',
    
    verdict: {
      winner: 'rag',
      confidence: 98,
      headline: 'Standard Vector RAG is the Undisputed Production Winner',
      executiveRationale: 'With 120M tokens of corpus that exceeds any single context window and strict <750ms latency requirements at 500k queries/month, Vector RAG with hybrid search (dense + BM25) is orders of magnitude cheaper, faster, and operationally aligned.'
    },
    
    assessments: {
      rag: {
        fit: 'Ideal',
        score: 9.8,
        pros: [
          'Blazing fast latency: p50 280ms, p95 550ms',
          'Extremely cost-effective: ~$2.10 per 10k queries',
          'Easily scales to 120M+ tokens with pgvector or Pinecone indexing',
          'Incremental upsert: updates individual articles in milliseconds without invalidating existing caches',
          'Metadata filtering by product line, OS version, and user permission tier'
        ],
        cons: [
          'Requires solid chunking and metadata extraction during ingestion',
          'Needs hybrid keyword (BM25) matching for exact hardware model codes'
        ],
        failureMode: 'If user asks "Compare troubleshooting steps for all 40 printer models", standard RAG cannot retrieve all 40 simultaneously.',
        p95Latency: '550ms',
        costEstimate: '$2.10 / 10k queries ($105/month total API spend)'
      },
      longContext: {
        fit: 'Anti-Pattern',
        score: 2.1,
        pros: ['Deep understanding of entire manuals if pre-filtered to a single model'],
        cons: [
          'Impossible to load 120M tokens into a single context window',
          'Continuous hourly article updates make long-context caching economically impractical',
          'Latency (2.5s - 4.5s) violates the <750ms real-time chat SLA',
          'Astronomical token cost for high-volume customer deflection'
        ],
        failureMode: 'Corpus scale exceeds 2M token window by 60x; cannot run without pre-filtering, negating its native advantage.',
        p95Latency: '3.8s',
        costEstimate: '$140.00 / 10k queries ($7,000/month)'
      },
      agenticRag: {
        fit: 'Suboptimal',
        score: 4.5,
        pros: ['Can ask clarifying questions if user prompt is ambiguous'],
        cons: [
          'Severe latency violation: 5s - 8s multi-step execution kills chat UX',
          'Overkill for 94% of single-point FAQ queries',
          'Cost multiplier on simple queries (5x token usage)'
        ],
        failureMode: 'Agent loops trying to verify firmware versions when a direct vector search already surfaced the exact reboot step.',
        p95Latency: '6.8s',
        costEstimate: '$72.00 / 10k queries ($3,600/month)'
      }
    },
    
    blueprint: {
      architectureName: 'High-Throughput Hybrid Vector Architecture',
      ingestionPipeline: 'Semantic chunking (400 tokens with 80 token overlap) with automated product-metadata tagging',
      retrievalOrContextLayer: 'Hybrid Search: Dense Vector (text-embedding-004) + Sparse BM25, followed by Cohere Rerank v3 (Top-4 chunks)',
      inferenceLayer: 'Gemini 3.8 Flash (temperature 0.0, deterministic fact extraction)',
      cacheOrIndexStrategy: 'Redis semantic query cache for top 500 FAQ questions; pgvector / Pinecone with HNSW index',
      safeguards: [
        'Strict confidence threshold: if top rerank score < 0.65, route gracefully to human tier-2 agent',
        'Grounding verification: reject answers referencing models outside the user-specified query filter'
      ]
    },
    
    sampleEnterpriseQuery: 'My Apex-500 enterprise router displays a solid amber power LED after firmware upgrade 4.2.1. How do I initiate TFTP recovery mode?',
    traceHighlights: {
      ragOutcome: 'Hybrid search matched model "Apex-500" and error "solid amber LED" to Section 4.3 of the hardware guide. Answer delivered in 410ms for $0.0003.',
      longContextOutcome: 'Cannot ingest 85,000 manuals without an upstream retrieval filter. Must revert to RAG anyway.',
      agenticOutcome: 'Agent created a 3-step plan: Step 1 find manual, Step 2 extract TFTP, Step 3 format answer. Took 5.4s for the exact same result.'
    }
  },
  {
    id: 'sre-incident-triage',
    title: 'SRE Production Incident Triage & Automated Runbook Remediation',
    industry: 'DevOps & SRE',
    difficulty: 'Mission-Critical',
    summary: 'Investigating high-severity production outages by querying real-time Kubernetes events, Datadog traces, recent Git deployments, and executing interactive runbooks.',
    enterpriseContext: 'Core infrastructure team resolving P0/P1 alerts. An engineer is paged at 2:00 AM because payment checkout latency spiked 800% and database connections are exhausting connection pools across 3 regions.',
    challenge: 'The root cause is never contained in static documentation alone. The system must query live telemetry APIs, formulate diagnostic hypotheses, execute database status checks, cross-reference against change logs, and recommend or execute safe rollback commands.',
    corpusScale: 'Static runbooks (~2M tokens) + Live streaming metrics, logs & API state',
    corpusTokens: 2500000,
    monthlyQueryVolume: '8,000 investigations/month',
    latencySla: '< 15 seconds (Engineers waiting for automated triage)',
    updateFrequency: 'Streaming live real-time state',
    reasoningType: 'Multi-Hop Tool Execution',
    
    verdict: {
      winner: 'agentic-rag',
      confidence: 97,
      headline: 'Agentic RAG is the Only Paradigm That Can Execute Dynamic Triage',
      executiveRationale: 'Static retrieval (RAG) and passive ingestion (Long Context) are inherently incapable of diagnosing production outages because the data does not exist in a static corpus. Agentic RAG dynamically invokes observability APIs, evaluates intermediate findings, and drives multi-step remediation.'
    },
    
    assessments: {
      rag: {
        fit: 'Anti-Pattern',
        score: 2.5,
        pros: ['Can retrieve static runbooks quickly'],
        cons: [
          'Completely blind to real-time production state, live error logs, and cluster events',
          'Cannot execute diagnostic tools or SQL queries',
          'Answers with outdated generic advice rather than the specific root cause'
        ],
        failureMode: 'Retrieves standard "How to restart PostgreSQL" runbook while the true outage cause is an un-migrated schema lock from an active canary deploy.',
        p95Latency: '620ms',
        costEstimate: '$2.80 / 10k queries'
      },
      longContext: {
        fit: 'Suboptimal',
        score: 4.8,
        pros: ['Can ingest 50,000 lines of dumped log files if pre-collected by an engineer'],
        cons: [
          'Passive architecture: cannot interact with external systems or query follow-up APIs',
          'Log dumps are noisy and waste millions of tokens on irrelevant heartbeats',
          'Cannot take safe corrective actions (e.g. cordon a node, pause a rollout)'
        ],
        failureMode: 'Engineers must manually script log collection and paste it into the prompt; misses live state changes happening during the conversation.',
        p95Latency: '5.2s',
        costEstimate: '$45.00 / 10k queries'
      },
      agenticRag: {
        fit: 'Ideal',
        score: 9.8,
        pros: [
          'Decomposes triage: 1) Query alerts -> 2) Inspect pod crash loops -> 3) Check recent Git commits -> 4) Correlate with runbook',
          'Dynamic tool calling: Prometheus metrics, Kubernetes API, PostgreSQL pg_stat_activity, GitHub diffs',
          'Self-correcting hypothesis testing: checks if database CPU spiked BEFORE or AFTER deployment',
          'Prepares deterministic verification commands with human-in-the-loop approval gates'
        ],
        cons: [
          'Higher latency per investigation (6s - 12s)',
          'Requires robust agent guardrails to prevent accidental destructive actions (e.g. read-only tokens)'
        ],
        failureMode: 'If tool credentials expire or agent hits API rate limits, must fallback to structured runbook display.',
        p95Latency: '8.5s',
        costEstimate: '$95.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'Autonomous Diagnostic & Remediation Agentic Loop',
      ingestionPipeline: 'Vectorized internal runbooks + real-time API integrations (Datadog, Kubernetes, GitHub, Slack)',
      retrievalOrContextLayer: 'LangGraph stateful workflow with ReAct tool executor and dynamic scratchpad memory',
      inferenceLayer: 'Gemini 3.1 Pro / Gemini 3.8 Flash with structured function calling and tool schemas',
      cacheOrIndexStrategy: 'In-memory ephemeral state per incident channel; cached read-only runbook embeddings',
      safeguards: [
        'Strict Read-Only tool permission enforcement for automated actions',
        'Remediation action proposals require explicit Slack interactive button confirmation from on-call engineer',
        'Maximum 5 iteration steps circuit breaker to avoid infinite diagnostic loops'
      ]
    },
    
    sampleEnterpriseQuery: 'Payment checkout failure rate jumped to 22% in us-east-1. Correlate with deployments in the last 60 minutes and identify failing dependencies.',
    traceHighlights: {
      ragOutcome: 'Returned generic "Checkout Failure Troubleshooting Guide" from 2022. Provided zero diagnostic insight on the active incident.',
      longContextOutcome: 'Processed raw 30MB log dump, found 400 error lines, but could not determine which service introduced the regression without Git data.',
      agenticOutcome: 'Agent called K8s API -> detected crashlooping payment-gateway pods -> called GitHub API -> found commit #b82f4 merged 14 mins ago -> extracted bad environment variable -> proposed 1-click rollback. Outage resolved in 3 mins.'
    }
  },
  {
    id: 'financial-10k-competitor-analysis',
    title: 'Multi-Year SEC 10-K & Peer Bank Competitive Synthesis',
    industry: 'Financial Services',
    difficulty: 'Complex',
    summary: 'Analyzing credit risk, commercial real estate provisions, and net interest margin trends across 5 years of annual filings (10-Ks) for 4 peer financial institutions (~1.8M tokens).',
    enterpriseContext: 'Equity research analysts and Chief Risk Officers benchmarking bank balance sheet resilience across economic cycles. Missing subtle shifts in non-accrual loan disclosures buried in financial statement footnotes can lead to flawed valuations.',
    challenge: 'Requires both macroscopic synthesis across 20 distinct multi-hundred-page regulatory filings and microscopic table arithmetic (calculating CAGR, loan loss reserve ratios, and yield spread shifts).',
    corpusScale: '1.8 Million tokens across 20 annual SEC filings',
    corpusTokens: 1800000,
    monthlyQueryVolume: '25,000 queries/month',
    latencySla: '< 6 seconds',
    updateFrequency: 'Quarterly (high caching stability)',
    reasoningType: 'Holistic Document Reasoning',
    
    verdict: {
      winner: 'hybrid',
      confidence: 93,
      headline: 'Hybrid Architecture: Agentic Planner + Long-Context Ingestion Wins',
      executiveRationale: 'Pure RAG fails because financial footnotes are divorced from balance sheet headers. Pure Long Context on all 20 reports at once stresses the 2M token limit and incurs high cost. The winning hybrid pattern: an Agent decomposes the query by institution and routes full annual reports into cached Long-Context windows for holistic synthesis.'
    },
    
    assessments: {
      rag: {
        fit: 'Suboptimal',
        score: 5.2,
        pros: ['Can fetch individual tables with specific keywords'],
        cons: [
          'Severely degrades on complex multi-year trend queries',
          'Table chunking fractures column alignments and footnote cross-references',
          'Cannot synthesize continuous narrative shifts in "Management Discussion & Analysis" (MD&A)'
        ],
        failureMode: 'Retrieves 2023 allowance for credit losses table but pulls the 2021 MD&A commentary, combining discordant data points into an inaccurate narrative.',
        p95Latency: '820ms',
        costEstimate: '$4.10 / 10k queries'
      },
      longContext: {
        fit: 'Viable',
        score: 8.8,
        pros: [
          'Understands complete tables, footnotes, and accounting policies without distortion',
          'Detects language tone shifts in CEO letters and MD&A sections across consecutive years',
          'High precision calculations when documents are present in context'
        ],
        cons: [
          'All 20 filings combined (1.8M tokens) approach maximum context budget',
          'Token cost is high if context cache expires'
        ],
        failureMode: 'Attention concentration focuses on the beginning and end filings, under-sampling middle years without explicit query scoping.',
        p95Latency: '3.6s',
        costEstimate: '$38.00 / 10k queries (with Context Caching)'
      },
      agenticRag: {
        fit: 'Suboptimal',
        score: 6.8,
        pros: ['Can break down comparison into structured sub-tasks per bank'],
        cons: [
          'Multiple retrieval hops over chunked tables still inherit RAG table distortion',
          'High cumulative latency (10s - 16s) across 20 filings'
        ],
        failureMode: 'Agent spends 12 iterations searching for "CRE allowance" when different banks label it as "Commercial mortgage non-accruals".',
        p95Latency: '12.8s',
        costEstimate: '$92.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'Agentic Document Routing into Cached Long-Context Windows',
      ingestionPipeline: 'SEC EDGAR XBRL table parser + HTML Markdown transformer preserving financial grid tables',
      retrievalOrContextLayer: 'Agent router selects relevant institution-year filings -> loads into 2 parallel Gemini Long-Context windows with prompt caching',
      inferenceLayer: 'Gemini 3.1 Pro with chain-of-thought calculation scratchpad and tabular verification prompt',
      cacheOrIndexStrategy: 'Cached SEC 10-K document bundles (partitioned by bank, cached for 90 days)',
      safeguards: [
        'Automated Python code-execution sandbox for balance sheet arithmetic (prevents LLM math hallucinations)',
        'Mandatory footnote citation requirement (must cite Item 8, Note 6)'
      ]
    },
    
    sampleEnterpriseQuery: 'Compare how JPMorgan Chase and Wells Fargo adjusted their Office Commercial Real Estate loan loss allowances between 2021 and 2024. Highlight the primary divergence in risk assumptions.',
    traceHighlights: {
      ragOutcome: 'Pulled scattered table rows from 2021 and 2024. Hallucinated a 14% change because it confused total CRE with sub-category office property reserves.',
      longContextOutcome: 'Ingested the complete 10-Ks for both banks. Accurately extracted the exact office exposure percentages and quoted the differing macroeconomic scenarios.',
      agenticOutcome: 'Hybrid planner loaded JPM 10-Ks into Cache A, WFC into Cache B, executed exact Python math comparison, and delivered an executive comparative matrix in 4.1s.'
    }
  },
  {
    id: 'enterprise-codebase-refactoring',
    title: 'Monorepo Architecture Discovery & Cross-Module Refactoring',
    industry: 'Software Engineering',
    difficulty: 'Complex',
    summary: 'Guiding large-scale architectural refactoring across a 250,000-line TypeScript / Go monorepo (~700,000 tokens), tracing dependency injection graphs, breaking API changes, and circular imports.',
    enterpriseContext: 'Staff software engineers migrating legacy REST microservices to gRPC and transitioning an internal event bus. Changing an interface in the core types package impacts 85 dependent services across the repository.',
    challenge: 'Code is a tightly coupled directed acyclic graph. AST symbol lookup only finds direct references; understanding whether changing a payload shape will break downstream consumers requires seeing the full module lifecycle.',
    corpusScale: '700,000 tokens (monorepo source code + schemas)',
    corpusTokens: 700000,
    monthlyQueryVolume: '30,000 queries/month',
    latencySla: '< 4 seconds (Developer interactive IDE assist)',
    updateFrequency: 'Frequent (on git commit / branch checkout)',
    reasoningType: 'Holistic Document Reasoning',
    
    verdict: {
      winner: 'long-context',
      confidence: 94,
      headline: 'Long Context LLM is the Definitive Choice for Code Refactoring',
      executiveRationale: 'Vector RAG is notoriously broken for architectural refactoring because embedding chunking severs import hierarchies, type definitions, and call stacks. Ingesting the entire repository into a Long Context window (Gemini 2M token capacity) preserves complete syntactic and semantic graphs.'
    },
    
    assessments: {
      rag: {
        fit: 'Suboptimal',
        score: 4.2,
        pros: ['Great for localized "Find function definition for authenticateUser" lookup'],
        cons: [
          'Chunks of 50 lines sever call hierarchies and interfaces from their implementations',
          'Embeddings do not understand transitive dependencies or inheritance chains',
          'Cannot generate cohesive multi-file refactoring diffs'
        ],
        failureMode: 'Suggests changing interface `UserSession` based on top-k files, missing 14 downstream service handlers that will fail compilation.',
        p95Latency: '720ms',
        costEstimate: '$3.50 / 10k queries'
      },
      longContext: {
        fit: 'Ideal',
        score: 9.6,
        pros: [
          'The LLM sees the complete directory tree, all imports, exports, and type definitions simultaneously',
          'Understands subtle side effects and circular dependency loops across modules',
          'Generates complete, syntactically correct multi-file refactor patches',
          'Gemini Context Caching caches the repository head commit across all developer queries'
        ],
        cons: [
          'Branch checkout requires refreshing the cache (takes ~3s)',
          'Requires intelligent `.gitignore` filtering to exclude binary artifacts and node_modules'
        ],
        failureMode: 'If the monorepo exceeds 2M tokens (e.g. 500k+ lines), requires sub-tree scoping.',
        p95Latency: '2.4s (Cached: 1.6s)',
        costEstimate: '$26.00 / 10k queries (with branch caching)'
      },
      agenticRag: {
        fit: 'Viable',
        score: 7.4,
        pros: ['Can invoke grep, git diff, and LSP (Language Server Protocol) tools in loops'],
        cons: [
          'Multi-step tool exploration is slow (15-25 seconds per query)',
          'High token consumption navigating file trees step-by-step',
          'Risk of getting lost in deep dependency cycles'
        ],
        failureMode: 'Agent wanders through 20 file reads before finding the relevant config handler, timing out the IDE extension.',
        p95Latency: '16.2s',
        costEstimate: '$115.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'Repository-Wide In-Memory Attention Architecture',
      ingestionPipeline: 'Source code packager (repomix/tree-sitter) filtering tests, comments, and assets into compact AST-tagged markdown',
      retrievalOrContextLayer: 'Gemini Context Caching keyed by Git commit SHA (700k tokens cached for current main branch)',
      inferenceLayer: 'Gemini 3.1 Pro with strict code-diff generation schema',
      cacheOrIndexStrategy: 'Automatic GitHub webhook invalidates context cache on merged pull requests',
      safeguards: [
        'Post-generation TypeScript compiler dry-run (`tsc --noEmit`) to verify zero syntax errors',
        'Automatic git diff patch validation before presenting code to engineer'
      ]
    },
    
    sampleEnterpriseQuery: 'We are deprecating the synchronous `AccountBillingClient` in favor of the asynchronous `BillingEventPublisher`. Show all impacted services and generate the refactored implementation for `CheckoutService`.',
    traceHighlights: {
      ragOutcome: 'Found `AccountBillingClient` definition and 2 obvious usages, but missed the 6 indirect middleware consumers. Code refactor broke compilation.',
      longContextOutcome: 'Traced all 8 consumers across 4 modules, updated dependency injection container, and generated complete drop-in replacement with zero broken types.',
      agenticOutcome: 'Used LSP to trace references after 9 tool hops (14s). Correct, but 7x slower than cached Long-Context direct generation.'
    }
  },
  {
    id: 'clinical-trial-matching',
    title: 'Clinical Trial Protocol Eligibility & Multi-Criteria Patient Records',
    industry: 'Healthcare & Life Sciences',
    difficulty: 'Mission-Critical',
    summary: 'Evaluating complex oncological clinical trial protocols against longitudinal electronic health records (EHRs) containing unstructured clinical notes, lab panels, and genomic sequencing.',
    enterpriseContext: 'Major academic medical center matching cancer patients to cutting-edge Phase II/III trials. Protocols have 35-50 rigorous inclusion/exclusion criteria (e.g. prior lines of therapy, ECOG performance status, specific biomarker mutations, and organ clearance thresholds).',
    challenge: 'Medical criteria require dynamic evaluation loops: "Must have failed at least 2 platinum-based therapies, have EGFR exon 20 insertion, and no history of pneumonitis within 6 months". Information is scattered across pathology reports, encounter notes, and HL7 lab panels over 4 years.',
    corpusScale: 'Protocol (120k tokens) + Patient longitudinal EHR (300k tokens)',
    corpusTokens: 420000,
    monthlyQueryVolume: '10,000 evaluations/month',
    latencySla: '< 20 seconds (Clinical coordinator workflow)',
    updateFrequency: 'Updated per patient encounter',
    reasoningType: 'Multi-Hop Tool Execution',
    
    verdict: {
      winner: 'agentic-rag',
      confidence: 96,
      headline: 'Agentic RAG is Vital for Rigorous Clinical Protocol Evaluation',
      executiveRationale: 'Evaluating 40+ independent medical criteria where a single missed exclusion criterion invalidates trial eligibility requires autonomous, criterion-by-criterion verification with corrective self-evaluation. Agentic RAG ensures systematic verification of each rule against clinical facts.'
    },
    
    assessments: {
      rag: {
        fit: 'Anti-Pattern',
        score: 3.1,
        pros: ['Quick lookup of general disease category'],
        cons: [
          'High risk of life-threatening false negatives or false positives',
          'Cannot evaluate temporal dependencies ("therapy X occurred after therapy Y")',
          'Lacks medical logic: cannot compute creatinine clearance or staging criteria'
        ],
        failureMode: 'Retrieves patient note mentioning "pneumonitis in 2021" and flags exclusion, failing to recognize that it resolved > 6 months ago and is permissible.',
        p95Latency: '850ms',
        costEstimate: '$3.80 / 10k queries'
      },
      longContext: {
        fit: 'Viable',
        score: 7.9,
        pros: [
          'Can fit both trial protocol and patient EHR in context easily (420k tokens)',
          'Good at capturing narrative history in clinical progress notes'
        ],
        cons: [
          'Prone to "satisficing": when asked to evaluate 45 criteria, single-pass LLMs often evaluate 35 and glaze over subtle exclusions',
          'Cannot call external medical ontologies (SNOMED, RxNorm, LOINC) to normalize drug names'
        ],
        failureMode: 'Overlooks exclusion #38 (QTcF interval > 470ms) buried in an appendix ECG report while focusing on prominent biomarker inclusion.',
        p95Latency: '3.8s',
        costEstimate: '$32.00 / 10k queries'
      },
      agenticRag: {
        fit: 'Ideal',
        score: 9.7,
        pros: [
          'Deconstructs protocol into a structured criterion checklist (Criteria 1 through 42)',
          'Iteratively validates each criterion with targeted retrieval across the patient record',
          'Executes medical tools: drug class normalizer, temporal timeline builder, lab calculation scripts',
          'Self-correcting confidence auditor: flags ambiguous criteria for clinical coordinator manual review'
        ],
        cons: [
          'Higher execution time (12s - 18s per patient trial evaluation)',
          'Requires HIPAA-compliant orchestration environment'
        ],
        failureMode: 'If clinical notes lack critical staging info, the agent explicitly returns "Indeterminate: Requires confirmation of Stage IV biopsy" instead of guessing.',
        p95Latency: '14.5s',
        costEstimate: '$105.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'Deterministic Clinical Criteria Verification Agent',
      ingestionPipeline: 'FHIR JSON parser + de-identification transformer + ClinicalBERT medical NER annotator',
      retrievalOrContextLayer: 'LangGraph multi-step state machine with dedicated sub-agents for Oncology History, Labs, and Biomarkers',
      inferenceLayer: 'Gemini 3.1 Pro with structured output JSON schema enforcing boolean verdict + evidence quote per criterion',
      cacheOrIndexStrategy: 'Pre-cached clinical trial protocol templates; temporary patient session memory',
      safeguards: [
        'Zero-assumption invariant: any unconfirmed criterion defaults to "Ambiguous / Needs Clinical Review"',
        'Direct quote citation requirement for all eligibility confirmations',
        'Audit trail log for FDA compliance'
      ]
    },
    
    sampleEnterpriseQuery: 'Assess patient #PT-8849 for eligibility against the Lung-Exon20 NCT04982231 trial. Verify prior chemotherapy regimens, baseline organ clearance, and central nervous system metastases status.',
    traceHighlights: {
      ragOutcome: 'Declared patient eligible based on top 3 snippets, missing an active brain metastasis recorded in a radiology addendum. High patient safety risk.',
      longContextOutcome: 'Evaluated 28 criteria accurately but missed the lab exclusion for absolute neutrophil count (ANC < 1,500).',
      agenticOutcome: 'Decomposed 36 criteria into sub-checks. Successfully verified platinum therapy history, executed lab calculation tool, and flagged ANC violation. Prevented ineligible enrollment.'
    }
  },
  {
    id: 'hr-benefits-policy-faq',
    title: 'Enterprise HR & Global Benefits Policy Assistant',
    industry: 'Customer Operations',
    difficulty: 'Standard',
    summary: 'Assisting 65,000 multinational employees with questions regarding health plans, PTO accrual, parental leave, bereavement policies, and 401(k) matching across 18 countries.',
    enterpriseContext: 'Global enterprise People Operations deflection portal. Employees submit questions via Slack and Microsoft Teams expecting quick, authoritative answers with links to the official benefits documentation.',
    challenge: 'Broad collection of localized policies (e.g., California vs New York vs UK vs Germany benefits). Questions are direct and factual. The portal handles 120,000 queries per month.',
    corpusScale: '4,500 policy articles (~8 Million tokens)',
    corpusTokens: 8000000,
    monthlyQueryVolume: '120,000 queries/month',
    latencySla: '< 900ms p95',
    updateFrequency: 'Monthly (quarterly open enrollment updates)',
    reasoningType: 'Point Fact Retrieval',
    
    verdict: {
      winner: 'rag',
      confidence: 97,
      headline: 'Standard Vector RAG Delivers the Best Latency, Cost, and Accuracy',
      executiveRationale: 'HR policy questions are classic single-point factual inquiries ("How many days of bereavement leave am I entitled to in Texas?"). Vector RAG with metadata filtering on country and location is sub-second, extraordinarily inexpensive, and maintains clean authoritative links.'
    },
    
    assessments: {
      rag: {
        fit: 'Ideal',
        score: 9.8,
        pros: [
          'Sub-second response time (p50 320ms, p95 620ms)',
          'Negligible cost: ~$1.80 per 10k queries ($21/month total API cost for 120k queries)',
          'Metadata filtering by employee region/office guarantees localized policy accuracy',
          'Direct URL linking to source policy documents in Workday/Confluence'
        ],
        cons: [
          'Must keep region metadata tags cleanly organized during ingestion'
        ],
        failureMode: 'If user omits their location, system must prompt "Which country or state are you located in?" before retrieving.',
        p95Latency: '620ms',
        costEstimate: '$1.80 / 10k queries'
      },
      longContext: {
        fit: 'Anti-Pattern',
        score: 2.8,
        pros: ['Understands all policies if bundled per country'],
        cons: [
          '8M tokens cannot fit in a single context window',
          'Massive cost overkill ($15-30/10k queries vs $1.80) for simple policy FAQs',
          'Unacceptable latency for live Slack bot interaction (2.5s - 4.5s)'
        ],
        failureMode: 'High token expense for basic questions that require only a 3-sentence policy quote.',
        p95Latency: '3.4s',
        costEstimate: '$28.00 / 10k queries'
      },
      agenticRag: {
        fit: 'Suboptimal',
        score: 4.0,
        pros: ['Can integrate with Workday API to check live user PTO balances'],
        cons: [
          'Excessive latency (6-9s) for simple informational FAQs',
          'Agent loop instability on straightforward policy lookups'
        ],
        failureMode: 'Agent attempts multi-hop planning when a single vector search immediately surfaces the bereavement table.',
        p95Latency: '7.1s',
        costEstimate: '$68.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'Metadata-Enriched Hierarchical Vector RAG',
      ingestionPipeline: 'Confluence / PDF parser with automatic jurisdiction & benefit-category metadata tagging',
      retrievalOrContextLayer: 'Dense vector search with strict metadata filtering: `{ location: user.location, role: user.employeeType }`',
      inferenceLayer: 'Gemini 3.8 Flash (temperature 0.1) with grounded citation formatting',
      cacheOrIndexStrategy: 'Redis semantic cache for top 250 common HR questions (achieves 45% cache hit rate at <50ms)',
      safeguards: [
        'Strict disclaimers for medical and legal questions with automatic escalation to HR People Partner',
        'Confidence score thresholding to prevent policy hallucinations'
      ]
    },
    
    sampleEnterpriseQuery: 'What is the maximum carryover for unused PTO at the end of the calendar year for full-time employees in California?',
    traceHighlights: {
      ragOutcome: 'Filtered by `state: CA` and `type: Full-Time`. Retrieved California Labor Code compliant PTO section. Answered in 340ms: "California PTO does not expire; it accrues up to a maximum cap of 1.5x annual rate." Accurate.',
      longContextOutcome: 'Loaded nationwide policy packet. Extracted the same fact after 3.2s, at 14x the cost.',
      agenticOutcome: 'Spawned planner agent, called HR search tool, verified California policy, took 6.8s for identical factual output.'
    }
  },
  {
    id: 'supply-chain-triage',
    title: 'Dynamic Supply Chain Inventory & ERP Disruption Triage',
    industry: 'Supply Chain',
    difficulty: 'Mission-Critical',
    summary: 'Triaging global logistics disruptions by correlating carrier shipping delay notices with SAP ERP warehouse stock levels, pending supplier purchase orders, and customer SLA penalties.',
    enterpriseContext: 'Global electronics manufacturer facing a port strike in Rotterdam and an air freight embargo. Logistics managers must instantly identify which customer shipments are jeopardized, find substitute inventory across 14 global warehouses, and calculate financial penalties.',
    challenge: 'Heterogeneous data landscape: Carrier delay notices arrive as unstructured emails and PDFs; inventory levels live in transactional SAP SQL databases; contractual SLA penalties live in vendor agreements.',
    corpusScale: 'Unstructured contracts & notices (4M tokens) + Live transactional ERP SQL database',
    corpusTokens: 4000000,
    monthlyQueryVolume: '18,000 queries/month',
    latencySla: '< 10 seconds',
    updateFrequency: 'Real-time transactional updates',
    reasoningType: 'Multi-Hop Tool Execution',
    
    verdict: {
      winner: 'agentic-rag',
      confidence: 98,
      headline: 'Agentic RAG is Indispensable for Bridging ERP Databases and Documents',
      executiveRationale: 'Static retrieval and long context models cannot query transactional SQL databases, calculate live inventory balances, or execute logistics reallocation algorithms. Agentic RAG acts as an intelligent orchestrator bridging vector stores, ERP APIs, and SQL databases.'
    },
    
    assessments: {
      rag: {
        fit: 'Anti-Pattern',
        score: 2.2,
        pros: ['Can retrieve static supplier contracts and penalty clauses'],
        cons: [
          'Completely unable to query live SAP warehouse stock levels or carrier tracking APIs',
          'Cannot perform mathematical reallocation of safety stock across facilities',
          'Static knowledge is obsolete within minutes of a shipping delay'
        ],
        failureMode: 'Retrieves standard supplier delivery terms while completely blind to the fact that Rotterdam warehouse has 0 units in stock.',
        p95Latency: '680ms',
        costEstimate: '$3.00 / 10k queries'
      },
      longContext: {
        fit: 'Suboptimal',
        score: 3.9,
        pros: ['Can analyze all vendor contracts simultaneously if loaded in context'],
        cons: [
          'Passive document reader: cannot connect to live ERP APIs or execute SQL queries',
          'Streaming real-time inventory into context every minute would cost tens of thousands in token spend',
          'Cannot dispatch automated freight reroute requests'
        ],
        failureMode: 'Relies on static snapshot data that is 24 hours stale during an active port shutdown.',
        p95Latency: '4.2s',
        costEstimate: '$52.00 / 10k queries'
      },
      agenticRag: {
        fit: 'Ideal',
        score: 9.8,
        pros: [
          'Step 1: Ingest carrier delay notice PDF -> extract impacted vessel & container IDs',
          'Step 2: Query SAP SQL database to identify customer orders linked to those containers',
          'Step 3: Query alternative warehouse stock levels in Frankfurt and Warsaw',
          'Step 4: Vector search customer contracts for late-delivery penalty caps',
          'Step 5: Formulate optimal reallocation plan minimizing contractual liquidated damages'
        ],
        cons: [
          'Requires secure database connection credentials and read-only schema views',
          'Multi-hop latency (6s - 11s)'
        ],
        failureMode: 'If ERP SQL query times out, agent must retry or alert logistics operator with partial document findings.',
        p95Latency: '9.4s',
        costEstimate: '$88.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'Heterogeneous Multi-System Orchestration Agent',
      ingestionPipeline: 'Continuous email/PDF parser for carrier disruption notices + real-time SAP ERP connector',
      retrievalOrContextLayer: 'LangGraph orchestrator coordinating SQL Query Tool, Carrier API Tool, and Contract Vector DB',
      inferenceLayer: 'Gemini 3.1 Pro / Gemini 3.8 Flash with tool calling and mathematical optimization prompt',
      cacheOrIndexStrategy: 'Cached contract vector embeddings; zero caching on transactional SQL inventory states',
      safeguards: [
        'Read-only SQL user role with strict row limits to prevent database performance impact',
        'Reallocation orders require two-person authorization before SAP execution'
      ]
    },
    
    sampleEnterpriseQuery: 'Maersk vessel Astrid is delayed 14 days at Rotterdam. Which Tier-1 automotive customer orders are jeopardized, what are the contractual late penalties, and can we fulfill from Frankfurt inventory?',
    traceHighlights: {
      ragOutcome: 'Extracted contract late penalty rate ($5,000/day) but could not tell which orders were on the vessel. Completely useless for operational triage.',
      longContextOutcome: 'Synthesized 50 pages of supplier terms, but had no access to current inventory in Frankfurt. Failed to solve the problem.',
      agenticOutcome: 'Agent executed 4 tools: Parsed manifest -> queried SAP orders (found 3 BMW orders) -> queried Frankfurt stock (verified 450 units available) -> calculated $70k saved in penalties. Produced ready-to-execute rerouting manifest.'
    }
  },
  {
    id: 'pharma-literature-meta-analysis',
    title: 'Pharma Drug Discovery Literature Synthesis across 60 Studies',
    industry: 'Healthcare & Life Sciences',
    difficulty: 'Complex',
    summary: 'Synthesizing clinical efficacy, off-target toxicity profiles, and conflicting IC50 laboratory assay data across 60 published research papers on novel kinase inhibitors (~900,000 tokens).',
    enterpriseContext: 'Translational medicine team prioritizing candidate molecules for lead optimization. Two different labs report contradictory binding affinity data for the same chemical scaffold due to divergent assay pH and buffer conditions.',
    challenge: 'Resolving subtle experimental discrepancies buried in the "Materials and Methods" sections and supplementary tables across 60 separate papers. Standard chunk retrieval misses the methodological context that explains why Lab A observed inhibition while Lab B did not.',
    corpusScale: '900,000 tokens across 60 research papers and supplements',
    corpusTokens: 900000,
    monthlyQueryVolume: '6,000 deep research queries/month',
    latencySla: '< 8 seconds',
    updateFrequency: 'Static per research campaign (cached for 3-6 months)',
    reasoningType: 'Cross-Document Synthesis',
    
    verdict: {
      winner: 'long-context',
      confidence: 95,
      headline: 'Long Context LLM Ingestion Resolves Contradictory Scientific Evidence',
      executiveRationale: 'Standard RAG fails because it pulls the headline conclusions ("Molecule X showed 85% inhibition") without retrieving the crucial methodology footnote 12 pages away explaining the differing assay conditions. Loading all 60 papers into a cached Long-Context window gives the LLM complete visibility across experimental methodologies.'
    },
    
    assessments: {
      rag: {
        fit: 'Suboptimal',
        score: 4.6,
        pros: ['Finds papers mentioning the target molecule rapidly'],
        cons: [
          'Extracts superficial numbers while missing experimental conditions (buffer pH, incubation time, cell line variant)',
          'Treats conflicting claims as contradictions rather than explaining methodological differences',
          'Table chunking splits dose-response curves from their legend descriptions'
        ],
        failureMode: 'Concludes that Lab A and Lab B had incompatible results, failing to connect that Lab A used wild-type kinase while Lab B evaluated the T790M gatekeeper mutant.',
        p95Latency: '780ms',
        costEstimate: '$3.50 / 10k queries'
      },
      longContext: {
        fit: 'Ideal',
        score: 9.6,
        pros: [
          'Full-context attention spans both the abstract and the fine-print Materials & Methods',
          'Synthesizes multi-paper comparative tables with precise chemical concentrations and cell lines',
          'Resolves apparent data conflicts by cross-referencing experimental protocols',
          'Context Caching holds the 60-paper campaign warm for the entire discovery team'
        ],
        cons: [
          'Cold-cache latency is 3.5s - 5.5s',
          'Requires high-quality PDF extraction to preserve scientific formulas and sub/superscripts'
        ],
        failureMode: 'If campaign expands to 200+ papers (>3M tokens), must use topic-clustering filter upstream.',
        p95Latency: '2.8s (Cached: 1.8s)',
        costEstimate: '$31.00 / 10k queries (with Context Caching)'
      },
      agenticRag: {
        fit: 'Viable',
        score: 7.0,
        pros: ['Can systematically iterate paper by paper with a structured extraction schema'],
        cons: [
          'Very slow: iterating over 60 papers in sequential agent loops takes 45-90 seconds',
          'Compounding token costs with multiple extraction sub-agents',
          'Unnecessary when the entire 60-paper dossier fits within 1M tokens of Gemini Pro'
        ],
        failureMode: 'Agent aborts extraction after 15 papers due to context window accumulation or loop timeout.',
        p95Latency: '18.5s',
        costEstimate: '$120.00 / 10k queries'
      }
    },
    
    blueprint: {
      architectureName: 'High-Fidelity Scientific Dossier Attention System',
      ingestionPipeline: 'Nougat / Grobid scientific PDF parser preserving equations, chemical formulas, and tabular matrices',
      retrievalOrContextLayer: 'Gemini Context Caching with 30-day campaign TTL (900k tokens loaded once per target molecule)',
      inferenceLayer: 'Gemini 3.1 Pro with scientific synthesis prompt requiring structured markdown comparison tables',
      cacheOrIndexStrategy: 'Hashed context cache per target kinase research project',
      safeguards: [
        'Mandatory publication DOI and table citation on every reported quantitative value',
        'Flagging any assay data where cell line or assay buffer is unreported'
      ]
    },
    
    sampleEnterpriseQuery: 'Reconcile the contradictory binding affinity (Kd) reported for compound BAY-8821 in the 2023 Patel paper vs the 2024 Zhang study. Did differences in ATP concentration explain the 10-fold potency divergence?',
    traceHighlights: {
      ragOutcome: 'Retrieved both Kd values (12nM vs 140nM) and stated the literature is inconsistent. Did not retrieve the ATP concentration details.',
      longContextOutcome: 'Located the 12nM value in Patel (tested at 10uM ATP) and 140nM in Zhang (tested at physiological 1mM ATP). Correctly identified BAY-8821 as an ATP-competitive inhibitor whose apparent Kd scales with ATP. Brilliant synthesis.',
      agenticOutcome: 'Agent formulated 3 sub-queries and reached the same conclusion after 22 seconds and 6 tool calls.'
    }
  }
];
