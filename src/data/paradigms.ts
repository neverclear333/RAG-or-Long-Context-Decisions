import { ParadigmDetails } from '../types/architecture';

export const PARADIGMS: Record<string, ParadigmDetails> = {
  rag: {
    id: 'rag',
    name: 'Standard Vector RAG',
    tagline: 'High-throughput semantic search over bounded token chunks',
    badge: 'Vector Search + Top-K',
    color: 'emerald',
    accentBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    summary: 'Splits enterprise documents into small chunks (256-1024 tokens), indexes dense embeddings in a vector database, and retrieves top-k relevant fragments to inject into the LLM prompt.',
    primaryMechanism: 'Dense/sparse bi-encoder retrieval + Cosine similarity + Top-K prompt stuffing',
    strengths: [
      'Near sub-second latency (p50 ~350ms, p95 ~650ms)',
      'Extremely economical token consumption ($0.001 - $0.005 per query)',
      'Scales to hundreds of millions of documents without linear memory growth',
      'Mature production tooling (pgvector, Pinecone, Qdrant, Milvus)',
      'Enables granular access control (RBAC metadata filtering per chunk)'
    ],
    weaknesses: [
      'Chunk Boundary Truncation: Key context split between chunks is lost',
      'Cannot synthesize holistic document structure or document-wide themes',
      'Embedding blind spots: Struggles with novel terminology, acronyms, or non-semantic exact matches',
      'High operational overhead: Chunking strategy tuning, embedding drift, and reranker maintenance'
    ],
    sweetSpot: 'Large, static or steadily growing corpora with high query concurrency (>50 QPS) where questions seek specific isolated facts or FAQs.',
    fatalFlaw: 'Multi-document synthesis and cross-schedule contract clauses where the answer depends on relationships dispersed across 500 pages.',
    typicalLatency: '350ms - 800ms',
    costProfile: 'Lowest ($1.50 - $4.00 per 10k queries)',
    operationalComplexity: 'Medium'
  },
  'long-context': {
    id: 'long-context',
    name: 'Long Context LLM',
    tagline: 'Direct ingestion of full un-chunked documents into 1M-2M context windows',
    badge: 'Context Caching + Attention',
    color: 'sky',
    accentBg: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-400',
    summary: 'Loads entire books, multi-hundred-page dossiers, or complete codebases directly into models like Gemini 1.5/2.0 Pro with up to 2 million tokens, utilizing native self-attention across the whole text.',
    primaryMechanism: 'Full-sequence multi-head self-attention + Server-side prompt caching (Context Caching)',
    strengths: [
      'Zero chunking loss: The model sees every table, paragraph, footnote, and dependency in natural sequence',
      'Superb cross-document reasoning, comparative synthesis, and contradiction detection',
      'No vector database or embedding pipeline to build, tune, or re-index',
      'Context Caching reduces repetitive token cost by 75% and cuts latency by ~80% on cached hits',
      'Direct citations and quote extraction with complete document fidelity'
    ],
    weaknesses: [
      'Higher latency on cold cache (p50 ~2.5s, p95 ~5.5s for 500k tokens)',
      'Costly if corpus changes continuously, invalidating cached context frequently',
      'Cannot scale to corpora beyond 2M-5M tokens without prior filtering or segmenting',
      '"Attention budget" / Needle-in-a-haystack degradation under extreme distraction with multiple competing noise documents'
    ],
    sweetSpot: 'Deep document analysis (100-1,500 pages) requiring holistic understanding, contract due diligence, financial 10-K comparisons, and complex codebases.',
    fatalFlaw: 'High-throughput enterprise portals with 100,000 separate short articles where caching 50,000 distinct items is economically impossible.',
    typicalLatency: '1.2s - 4.5s (Cached: ~800ms)',
    costProfile: 'Moderate with Caching ($15 - $45 per 10k queries; Uncached: $80 - $200)',
    operationalComplexity: 'Low'
  },
  'agentic-rag': {
    id: 'agentic-rag',
    name: 'Agentic RAG',
    tagline: 'Iterative reasoning, query decomposition, tool routing & corrective validation',
    badge: 'Multi-Step Orchestration',
    color: 'amber',
    accentBg: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    summary: 'An autonomous agent plans multi-step retrieval workflows, breaks complex questions into sub-queries, executes specialized tools (vector search, SQL, APIs), grades document relevance, and self-corrects.',
    primaryMechanism: 'ReAct / LangGraph state loops + Query decomposition + Self-RAG reflection + Dynamic tool routing',
    strengths: [
      'Solves multi-hop enterprise inquiries where Step B depends on results from Step A',
      'Bridges heterogeneous data silos (combines unstructured docs with live relational SQL and external APIs)',
      'Corrective Self-RAG: Evaluates if retrieved docs actually answer the query, reformulating if inadequate',
      'Eliminates single-retrieval failure: dynamically adjusts filters, dates, and query facets on the fly'
    ],
    weaknesses: [
      'Highest latency: Multiple LLM inference steps yield 4s - 15s end-to-end response times',
      'Non-deterministic behavior: Agents can hallucinate tool arguments or enter circular reasoning loops',
      'Token multiplication: Each reflection loop re-prompts the model, driving up inference expenditure',
      'Complex production engineering: Requires state machines, timeout guards, and fallback circuits'
    ],
    sweetSpot: 'Mission-critical enterprise workflows involving investigation, incident triage, complex compliance audits, and multi-system automation.',
    fatalFlaw: 'High-concurrency user-facing chat apps requiring instant snappy answers (<1s) where multi-step loops cause unacceptable delays and user abandonment.',
    typicalLatency: '4.5s - 12.0s',
    costProfile: 'High ($60 - $180 per 10k queries due to 3-6x token loops)',
    operationalComplexity: 'Very High'
  },
  hybrid: {
    id: 'hybrid',
    name: 'Hybrid Architectures',
    tagline: 'Agentic Routing into Long-Context Windows & GraphRAG',
    badge: 'Best-of-Breed Synergy',
    color: 'purple',
    accentBg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    summary: 'Combines the strengths of multiple paradigms: for instance, using an Agentic router or vector filter to select the top 3 relevant whole documents (e.g. 400k tokens), and loading them directly into a Long-Context cached window.',
    primaryMechanism: 'Hierarchical coarse filtering + Full-document context injection + Reflective synthesis',
    strengths: [
      'Scales across massive enterprise repositories without chunk boundary loss',
      'Limits context costs by only loading the candidate documents identified by the agent',
      'Unifies the speed of coarse indexing with the reasoning power of long-context attention'
    ],
    weaknesses: [
      'Requires coordinating multiple subsystems and caching layers',
      'Moderate latency profile (2.5s - 6.0s)'
    ],
    sweetSpot: 'Enterprise intelligence platforms analyzing huge repositories where individual queries require deep reasoning across 2 to 5 full documents.',
    fatalFlaw: 'Premature optimization for simple single-source FAQ use cases.',
    typicalLatency: '2.5s - 6.5s',
    costProfile: 'Balanced ($30 - $70 per 10k queries)',
    operationalComplexity: 'High'
  }
};
