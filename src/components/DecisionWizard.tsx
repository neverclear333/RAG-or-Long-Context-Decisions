import React, { useState } from 'react';
import { DecisionWizardState } from '../types/architecture';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Lightbulb, ShieldAlert, Cpu } from 'lucide-react';

const INITIAL_STATE: DecisionWizardState = {
  corpusSize: 'medium',
  informationTopology: 'cross-doc-synthesis',
  latencyRequirement: 'interactive',
  dataDynamics: 'static',
  reasoningDepth: 'multi-hop',
  budgetSensitivity: 'balanced'
};

export const DecisionWizard: React.FC = () => {
  const [state, setState] = useState<DecisionWizardState>(INITIAL_STATE);

  // Dynamic evaluation scoring
  const calculateScores = () => {
    let ragScore = 60;
    let longContextScore = 60;
    let agenticScore = 60;

    // 1. Corpus Size
    if (state.corpusSize === 'small') {
      ragScore += 5;
      longContextScore += 35;
      agenticScore += 10;
    } else if (state.corpusSize === 'medium') {
      // 500k - 2M tokens: Sweet spot for Gemini 1M-2M context window
      ragScore += 10;
      longContextScore += 30;
      agenticScore += 15;
    } else if (state.corpusSize === 'large') {
      // 2M - 20M tokens: Long context alone struggles without upstream filter
      ragScore += 25;
      longContextScore -= 10;
      agenticScore += 20;
    } else if (state.corpusSize === 'massive') {
      // > 50M tokens: Vector RAG is strictly required
      ragScore += 35;
      longContextScore -= 30;
      agenticScore += 15;
    }

    // 2. Information Topology
    if (state.informationTopology === 'factual-point') {
      ragScore += 30;
      longContextScore -= 15;
      agenticScore -= 20;
    } else if (state.informationTopology === 'cross-doc-synthesis') {
      ragScore -= 25;
      longContextScore += 35;
      agenticScore += 10;
    } else if (state.informationTopology === 'dynamic-tools') {
      ragScore -= 35;
      longContextScore -= 25;
      agenticScore += 40;
    } else if (state.informationTopology === 'whole-file-structure') {
      ragScore -= 20;
      longContextScore += 30;
      agenticScore += 10;
    }

    // 3. Latency Requirement
    if (state.latencyRequirement === 'realtime') {
      ragScore += 30;
      longContextScore -= 15;
      agenticScore -= 40; // Agentic RAG cannot do sub-second
    } else if (state.latencyRequirement === 'interactive') {
      ragScore += 10;
      longContextScore += 15;
      agenticScore += 0;
    } else if (state.latencyRequirement === 'async') {
      ragScore -= 10;
      longContextScore += 10;
      agenticScore += 25;
    }

    // 4. Data Dynamics
    if (state.dataDynamics === 'static') {
      longContextScore += 25; // Perfect for context caching!
      ragScore += 5;
      agenticScore += 5;
    } else if (state.dataDynamics === 'periodic') {
      ragScore += 15;
      longContextScore += 5;
      agenticScore += 10;
    } else if (state.dataDynamics === 'realtime-streaming') {
      ragScore -= 10;
      longContextScore -= 25; // Cache invalidation kills economics
      agenticScore += 30; // Agentic tool call queries live state
    }

    // 5. Reasoning Depth
    if (state.reasoningDepth === 'single-hop') {
      ragScore += 20;
      longContextScore += 5;
      agenticScore -= 25;
    } else if (state.reasoningDepth === 'multi-hop') {
      ragScore -= 15;
      longContextScore += 15;
      agenticScore += 25;
    } else if (state.reasoningDepth === 'iterative-validation') {
      ragScore -= 30;
      longContextScore += 5;
      agenticScore += 35;
    }

    // 6. Budget
    if (state.budgetSensitivity === 'high-volume-low-cost') {
      ragScore += 25;
      longContextScore -= 15;
      agenticScore -= 30;
    } else if (state.budgetSensitivity === 'quality-first') {
      longContextScore += 15;
      agenticScore += 20;
    }

    const clamp = (v: number) => Math.min(98, Math.max(15, v));
    const finalRag = clamp(ragScore);
    const finalLong = clamp(longContextScore);
    const finalAgentic = clamp(agenticScore);

    let winner = 'Standard Vector RAG';
    let winnerId: 'rag' | 'long-context' | 'agentic-rag' | 'hybrid' = 'rag';
    let winnerRationale = '';

    if (finalAgentic > finalRag && finalAgentic > finalLong) {
      winner = 'Agentic RAG';
      winnerId = 'agentic-rag';
      winnerRationale = 'Your workload demands dynamic multi-step reasoning, external tool/API execution, and iterative validation loops that cannot be resolved in a single retrieval step.';
    } else if (finalLong > finalRag && finalLong >= finalAgentic) {
      winner = 'Long Context LLM';
      winnerId = 'long-context';
      winnerRationale = 'Your workload centers on cross-document synthesis or holistic file structures where chunking severs critical dependencies. With server-side Prompt Caching, Long Context delivers the highest accuracy.';
    } else if (finalRag >= finalLong && finalRag >= finalAgentic) {
      winner = 'Standard Vector RAG';
      winnerId = 'rag';
      winnerRationale = 'High corpus scale, sub-second latency needs, or high query concurrency make Vector RAG the most reliable and cost-efficient architecture.';
    }

    // Check for Hybrid sweet spot
    const isHybrid = (finalLong > 75 && finalAgentic > 75) || (state.corpusSize === 'large' && state.informationTopology === 'cross-doc-synthesis');

    return {
      rag: finalRag,
      longContext: finalLong,
      agentic: finalAgentic,
      winner: isHybrid ? 'Hybrid (Agentic Router + Long Context)' : winner,
      winnerId: isHybrid ? 'hybrid' : winnerId,
      winnerRationale: isHybrid
        ? 'Your workload spans a large overall corpus but requires holistic multi-document reasoning for individual queries. Use an Agentic filter to select the top candidate documents, then ingest full documents into a cached Long-Context window.'
        : winnerRationale
    };
  };

  const results = calculateScores();

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">Architecture Navigator</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Enterprise Architectural Decision Engine
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          Configure your specific enterprise constraints below. The scoring model computes fit scores across token economics, latency SLAs, chunk boundary integrity, and system determinism.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Questionnaire */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question 1: Corpus Size */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-200 block">
              1. Total Active Corpus Size (Volume of text/documents to evaluate)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'small', label: '< 500k tokens', sub: '1-3 large dossiers' },
                { id: 'medium', label: '500k - 2M tokens', sub: 'Fits in Gemini window' },
                { id: 'large', label: '2M - 20M tokens', sub: 'Multi-dept archives' },
                { id: 'massive', label: '> 50M tokens', sub: 'Enterprise-wide lake' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setState({ ...state, corpusSize: opt.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    state.corpusSize === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Information Topology */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-200 block">
              2. Information Topology (How is the needed knowledge distributed?)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'factual-point', label: 'Point Fact & FAQ Lookup', sub: 'Answer lives in 1-2 distinct sentences or small sections' },
                { id: 'cross-doc-synthesis', label: 'Cross-Document Synthesis', sub: 'Answer requires reconciling multiple conflicting or cross-referenced documents' },
                { id: 'dynamic-tools', label: 'Live APIs & Heterogeneous SQL', sub: 'Must query active databases, API tools, or real-time event streams' },
                { id: 'whole-file-structure', label: 'Full Structural / Code Graph', sub: 'Requires holistic understanding of entire files, ASTs, or schemas' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setState({ ...state, informationTopology: opt.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    state.informationTopology === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Latency & Concurrency */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-200 block">
              3. Response Latency SLA Budget
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'realtime', label: '< 800ms (p95)', sub: 'Live customer chat / search' },
                { id: 'interactive', label: '2s - 5s', sub: 'Analyst / developer tool' },
                { id: 'async', label: '8s - 30s', sub: 'Batch / automated triage' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setState({ ...state, latencyRequirement: opt.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    state.latencyRequirement === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Data Dynamics */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-200 block">
              4. Corpus Freshness & Update Cadence
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'static', label: 'Static / Weekly', sub: 'Stable; ideal for Prompt Cache' },
                { id: 'periodic', label: 'Daily Updates', sub: 'Predictable batch upsert' },
                { id: 'realtime-streaming', label: 'Real-Time Streaming', sub: 'High churn; invalidates cache' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setState({ ...state, dataDynamics: opt.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    state.dataDynamics === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Reasoning Depth */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-200 block">
              5. Reasoning Depth & Execution Loops
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single-hop', label: 'Single-Pass Lookup', sub: 'Direct extract & summarize' },
                { id: 'multi-hop', label: 'Multi-Hop Dependent', sub: 'Step 2 depends on Step 1 output' },
                { id: 'iterative-validation', label: 'Self-Correcting Verification', sub: 'Must audit against 20+ rules' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setState({ ...state, reasoningDepth: opt.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    state.reasoningDepth === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setState(INITIAL_STATE)}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to defaults</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Recommendation Engine & Scoring */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Main Verdict Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/40 shadow-xl space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono uppercase tracking-wider text-indigo-400">Recommended Architecture</span>
                <span>Automated Triage</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {results.winner}
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              {results.winnerRationale}
            </p>

            {/* Live Scores Bars */}
            <div className="space-y-3.5 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Workload Fit Scoring
              </span>

              {/* RAG Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">Standard Vector RAG</span>
                  <span className="font-mono text-emerald-400 tabular-nums">{results.rag}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${results.rag}%` }}
                  />
                </div>
              </div>

              {/* Long Context Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">Long Context LLM</span>
                  <span className="font-mono text-sky-400 tabular-nums">{results.longContext}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${results.longContext}%` }}
                  />
                </div>
              </div>

              {/* Agentic RAG Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">Agentic RAG</span>
                  <span className="font-mono text-amber-400 tabular-nums">{results.agentic}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${results.agentic}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Trade-Off Guidance */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Primary Architectural Guardrail:</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {results.winnerId === 'rag' &&
                  'Beware chunk boundary truncation. If questions begin requesting cross-document synthesis or comparative summaries, implement a reranker or hierarchical parent-document retriever.'}
                {results.winnerId === 'long-context' &&
                  'Ensure prompt caching (Context Caching) is enabled. Without cache hits, continuous 1M+ token ingestion will incur unsustainable token costs and higher p95 latency.'}
                {results.winnerId === 'agentic-rag' &&
                  'Enforce strict circuit-breaker recursion limits (max 5 tool calls) and read-only database roles to prevent runaway token costs and non-deterministic agent loops.'}
                {results.winnerId === 'hybrid' &&
                  'Maintain clean separation between the coarse agent router and the downstream long-context synthesis window to prevent cache misses.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
