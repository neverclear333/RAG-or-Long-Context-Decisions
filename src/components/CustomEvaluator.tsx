import React, { useState } from 'react';
import { EvaluationResult } from '../types/architecture';
import { Sparkles, CheckCircle2, AlertTriangle, Cpu, ShieldCheck, DollarSign, Clock, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export const CustomEvaluator: React.FC = () => {
  const [title, setTitle] = useState<string>('Taxonomy & Regulatory Policy Compliance Audit');
  const [description, setDescription] = useState<string>(
    'Verifying whether our global consumer banking terms and automated lending algorithms conform to updated FDIC, CFPB, and Basel III regulatory guidelines across 45 separate advisory circulars and internal operating manuals.'
  );
  const [corpusSize, setCorpusSize] = useState<string>('Moderate (1M - 5M tokens)');
  const [queryPattern, setQueryPattern] = useState<string>('Cross-document compliance auditing & exception detection');
  const [latencyRequirement, setLatencyRequirement] = useState<string>('Interactive (3 - 6 seconds)');
  const [updateFrequency, setUpdateFrequency] = useState<string>('Monthly / Quarterly regulatory updates');
  const [budgetSensitivity, setBudgetSensitivity] = useState<string>('Balanced');

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick preset templates
  const presets = [
    {
      name: 'Bank Regulatory Audit',
      title: 'Taxonomy & Regulatory Policy Compliance Audit',
      description: 'Verifying whether our global consumer banking terms and automated lending algorithms conform to updated FDIC, CFPB, and Basel III regulatory guidelines across 45 separate advisory circulars.',
      corpusSize: 'Moderate (1M - 5M tokens)',
      queryPattern: 'Cross-document compliance auditing & exception detection',
      latency: 'Interactive (3 - 6 seconds)'
    },
    {
      name: 'Real-Time IoT Fleet Telemetry',
      title: 'Connected Vehicle Fleet Anomaly Diagnostics',
      description: 'Live sensor telemetry streaming from 20,000 trucks. When a transmission warning fires, query real-time vehicle CAN bus messages, cross-reference repair history, and order replacement parts in ERP.',
      corpusSize: 'Streaming Real-Time + Maintenance Wiki',
      queryPattern: 'Dynamic tool calls, live sensor telemetry & ERP ordering',
      latency: 'Interactive (2 - 5 seconds)'
    },
    {
      name: 'High-Volume SaaS Helpdesk',
      title: 'Customer Self-Service Knowledge Base Deflection',
      description: 'Deflecting Tier-1 questions across 15,000 support articles for 200,000 users per month with strict sub-second response times.',
      corpusSize: 'High Scale (15,000 articles, ~20M tokens)',
      queryPattern: 'Single-point factual Q&A and localized how-to guides',
      latency: 'Sub-second (< 800ms)'
    }
  ];

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          corpusSize,
          queryPattern,
          latencyRequirement,
          updateFrequency,
          budgetSensitivity
        })
      });

      if (!response.ok) {
        throw new Error(`Evaluation request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to complete architectural evaluation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">Architectural Decision Engine</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Custom Enterprise Use-Case Evaluator
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          Input your proprietary enterprise workload specifications. The system executes a rigorous architectural triage comparing Standard RAG, Long Context, and Agentic RAG, identifying specific failure modes and generating a production deployment blueprint.
        </p>

        {/* Presets */}
        <div className="mt-4 flex items-center space-x-2 flex-wrap gap-y-2">
          <span className="text-xs text-slate-400">Quick load template:</span>
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setTitle(preset.title);
                setDescription(preset.description);
                setCorpusSize(preset.corpusSize);
                setQueryPattern(preset.queryPattern);
                setLatencyRequirement(preset.latency);
              }}
              className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handleEvaluate} className="lg:col-span-6 space-y-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
            Workload Specification
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Use Case Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Multi-Tier Vendor Contract Due Diligence"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Problem Description & Data Environment</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
              placeholder="Detail your documents, formats, user expectations, and what questions they ask..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Corpus Scale</label>
              <select
                value={corpusSize}
                onChange={(e) => setCorpusSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>Compact (&lt; 500k tokens)</option>
                <option>Moderate (1M - 5M tokens)</option>
                <option>High Scale (10M - 50M tokens)</option>
                <option>Massive (&gt; 100M tokens)</option>
                <option>Streaming Real-Time + Maintenance Wiki</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Latency SLA Budget</label>
              <select
                value={latencyRequirement}
                onChange={(e) => setLatencyRequirement(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>Sub-second (&lt; 800ms)</option>
                <option>Interactive (2 - 5 seconds)</option>
                <option>Asynchronous batch (10 - 30 seconds)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Query Pattern</label>
            <input
              type="text"
              value={queryPattern}
              onChange={(e) => setQueryPattern(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Cross-document synthesis or point lookup"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-indigo-600/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Architecture...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Architectural Evaluation</span>
              </>
            )}
          </button>
        </form>

        {/* Right Output: Architecture Decision Record (ADR) */}
        <div className="lg:col-span-6 space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          {!result && !loading && (
            <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-3">
              <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-300">Ready for Evaluation</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Click &ldquo;Run Architectural Evaluation&rdquo; to generate a full Architectural Decision Record (ADR) analyzing your workload across all 3 paradigms.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <h3 className="text-sm font-semibold text-slate-200">Evaluating Trade-offs</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Analyzing token economics, chunk boundary integrity, self-attention capabilities, and agent loop stability...
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
              {/* Verdict Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-indigo-400 uppercase tracking-wider">
                    Architectural Decision Record (ADR)
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    Confidence: {result.confidenceScore}%
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  Recommended Architecture: {result.recommendedParadigm}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.executiveSummary}
                </p>
              </div>

              {/* Key Strengths */}
              {result.winnerKeyStrengths && result.winnerKeyStrengths.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                    Core Architectural Advantages:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                    {result.winnerKeyStrengths.map((str, idx) => (
                      <li key={idx} className="leading-relaxed">{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3-Way Assessments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {/* RAG */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Vector RAG</span>
                    <span className="font-mono text-slate-400 text-[11px]">{result.ragAssessment?.verdict}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {result.ragAssessment?.explanation}
                  </p>
                  <p className="text-[10px] text-rose-400 font-mono pt-1 border-t border-slate-900">
                    Failure: {result.ragAssessment?.criticalFailureMode}
                  </p>
                </div>

                {/* Long Context */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Long Context</span>
                    <span className="font-mono text-slate-400 text-[11px]">{result.longContextAssessment?.verdict}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {result.longContextAssessment?.explanation}
                  </p>
                  <p className="text-[10px] text-rose-400 font-mono pt-1 border-t border-slate-900">
                    Failure: {result.longContextAssessment?.criticalFailureMode}
                  </p>
                </div>

                {/* Agentic RAG */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Agentic RAG</span>
                    <span className="font-mono text-slate-400 text-[11px]">{result.agenticRagAssessment?.verdict}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {result.agenticRagAssessment?.explanation}
                  </p>
                  <p className="text-[10px] text-rose-400 font-mono pt-1 border-t border-slate-900">
                    Failure: {result.agenticRagAssessment?.criticalFailureMode}
                  </p>
                </div>
              </div>

              {/* Recommended Stack */}
              {result.recommendedStack && (
                <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-indigo-400 font-mono uppercase tracking-wider font-semibold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Recommended Production Blueprint:</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-400">Retrieval Engine: </span>
                      {result.recommendedStack.retrievalEngine}
                    </div>
                    <div>
                      <span className="text-slate-400">Context Strategy: </span>
                      {result.recommendedStack.contextManagement}
                    </div>
                    <div>
                      <span className="text-slate-400">Guardrails: </span>
                      {result.recommendedStack.guardrails}
                    </div>
                  </div>
                </div>
              )}

              {/* Tradeoff Metrics */}
              {result.tradeoffs && (
                <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                  <span className="font-mono text-slate-400 uppercase tracking-wider block text-[11px]">
                    SLA & Economics Forecast:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-slate-200 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400">p95 Latency: </span>
                      {result.tradeoffs.p95Latency}
                    </div>
                    <div>
                      <span className="text-slate-400">Cost / 10k: </span>
                      {result.tradeoffs.costPer10kQueries}
                    </div>
                    <div>
                      <span className="text-slate-400">Complexity: </span>
                      {result.tradeoffs.operationalComplexity}
                    </div>
                    <div>
                      <span className="text-slate-400">Warning: </span>
                      <span className="text-amber-400">{result.tradeoffs.maintenanceGotcha}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.source && (
                <p className="text-[10px] text-slate-400 font-mono text-right">
                  Engine: {result.source}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
