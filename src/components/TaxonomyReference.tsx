import React from 'react';
import { PARADIGMS } from '../data/paradigms';
import { AlertOctagon, CheckCircle2, ShieldAlert, Cpu, GitFork, BookOpen, Layers } from 'lucide-react';

export const TaxonomyReference: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">Architectural Foundations</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          The Three Invariants & Architectural Taxonomy
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          The trade-offs between RAG, Long Context, and Agentic RAG are rooted in fundamental mathematical invariants of embeddings, multi-head self-attention, and autonomous state machines.
        </p>
      </div>

      {/* The 3 Core Invariants Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
          01. The Three Fundamental Architectural Invariants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Invariant 1: The Chunking Dilemma */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 space-y-3">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
              Invariant I
            </span>
            <h3 className="text-base font-bold text-slate-100">
              The Chunking Dilemma (Vector RAG)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Splitting text into 500-token chunks assumes meaning is localized. But enterprise contracts, financial footnotes, and codebases express meaning across <em>relational structures</em>.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-normal">
              <span className="font-semibold text-rose-400 block">The Breaking Point:</span>
              If the answer to a question requires synthesizing Clause A on page 12 with Caveat B on page 410, cosine similarity will almost never pull both simultaneously without pulling 50 irrelevant intermediate chunks.
            </div>
          </div>

          {/* Invariant 2: Attention Budget & Caching */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-sky-500/30 space-y-3">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block">
              Invariant II
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Attention Budget & Caching (Long Context)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Modern LLMs like Gemini Pro possess 2M token capacity and near-perfect needle-in-a-haystack recall. However, cost and latency scale with token count unless mediated by server-side Prompt Caching.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-normal">
              <span className="font-semibold text-sky-400 block">The Production Key:</span>
              Gemini Context Caching reduces input costs by 75% and latency by ~80% on warm requests. Long Context is economically viable for stable corpora (deal rooms, research papers, core repositories).
            </div>
          </div>

          {/* Invariant 3: Cascading Latency */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
              Invariant III
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Cascading Latency & Loops (Agentic RAG)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Agents introduce non-deterministic state loops. Each planning round, tool invocation, and reflection step is a complete LLM inference call, accumulating latency and token consumption.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-normal">
              <span className="font-semibold text-amber-400 block">The Operational Trap:</span>
              Without strict recursion guards (max 3-5 iterations) and tool timeout circuit-breakers, agents can enter divergence loops costing $0.15+ per user query and degrading p95 latency past 15 seconds.
            </div>
          </div>
        </div>
      </div>

      {/* "When to NEVER Use" Anti-Patterns Table */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>02. The &ldquo;When to NEVER Use&rdquo; Enterprise Commandments</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* NEVER RAG */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-rose-400">
              NEVER Use Standard Vector RAG When:
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc leading-relaxed">
              <li>
                <strong>Whole-contract Due Diligence:</strong> Questions like &ldquo;Does any exhibit contradict Section 14?&rdquo; cannot be solved by top-5 chunk retrieval.
              </li>
              <li>
                <strong>Architectural Code Refactoring:</strong> Code ASTs and imports span file trees. Chunking creates broken type signatures and incomplete diffs.
              </li>
              <li>
                <strong>Dynamic Telemetry:</strong> Outages, live database states, or API telemetry cannot be embedded into a static vector index.
              </li>
            </ul>
          </div>

          {/* NEVER Long Context */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-rose-400">
              NEVER Use Long Context When:
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc leading-relaxed">
              <li>
                <strong>High-Concurrency Live Customer FAQs:</strong> Serving 100k queries/day across 80,000 articles will incur massive token costs and violate sub-second SLAs.
              </li>
              <li>
                <strong>Rapidly Churning Corpora:</strong> If documents change every 10 minutes, Context Caching is constantly invalidated, forcing expensive cold re-tokenization.
              </li>
              <li>
                <strong>External System Orchestration:</strong> Passive context reading cannot trigger database rollbacks or call partner REST APIs.
              </li>
            </ul>
          </div>

          {/* NEVER Agentic RAG */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-rose-400">
              NEVER Use Agentic RAG When:
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc leading-relaxed">
              <li>
                <strong>Direct Factual FAQs:</strong> Spawning a planner and multiple sub-agents to answer &ldquo;What is our 401(k) match?&rdquo; is a costly engineering failure.
              </li>
              <li>
                <strong>Strict &lt; 1-Second Latency Budgets:</strong> Multi-step ReAct loops fundamentally cannot return answers in under 3-5 seconds.
              </li>
              <li>
                <strong>Strict Zero-Variance Determinism:</strong> High-risk financial tax calculations where agent prompt drift could cause compliance breaches.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Production Hybrid Architecture Pattern */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
          <GitFork className="w-4 h-4" />
          <span>03. The Enterprise Hybrid Standard: Agentic Router + Cached Long Context</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100">
          How Leading Enterprises Combine the Paradigms
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          The most robust production architectures do not force a false dichotomy between RAG, Long Context, and Agents.
          Instead, they structure a multi-tier pipeline:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-indigo-400 block">Tier 1: Coarse Routing</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              A lightweight classifier or BM25 index determines whether the query is a simple FAQ (routed to Vector RAG) or a multi-document synthesis problem.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-indigo-400 block">Tier 2: Document Bundle Filtering</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              For complex inquiries across massive archives, an Agent or vector filter identifies the 2 to 4 candidate complete documents (e.g. 500k tokens total).
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-indigo-400 block">Tier 3: Cached Long-Context Synthesis</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Those full candidate documents are loaded un-chunked into a cached Gemini context window, yielding 100% holistic attention without chunk boundary loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
