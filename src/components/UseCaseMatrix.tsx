import React, { useState } from 'react';
import { ENTERPRISE_USE_CASES } from '../data/useCases';
import { PARADIGMS } from '../data/paradigms';
import { EnterpriseUseCase, ParadigmType } from '../types/architecture';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck, Cpu, Terminal, Filter, Layers } from 'lucide-react';

interface UseCaseMatrixProps {
  onSelectTracePrompt?: (useCaseId: string) => void;
}

export const UseCaseMatrix: React.FC<UseCaseMatrixProps> = ({ onSelectTracePrompt }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(ENTERPRISE_USE_CASES[0].id);

  const industries = ['All', 'Legal & Compliance', 'Customer Operations', 'DevOps & SRE', 'Financial Services', 'Software Engineering', 'Healthcare & Life Sciences', 'Supply Chain'];
  const patterns = ['All', 'Point Fact Retrieval', 'Cross-Document Synthesis', 'Multi-Hop Tool Execution', 'Holistic Document Reasoning'];

  const filteredCases = ENTERPRISE_USE_CASES.filter((item) => {
    const matchIndustry = selectedIndustry === 'All' || item.industry === selectedIndustry;
    const matchPattern = selectedPattern === 'All' || item.reasoningType === selectedPattern;
    return matchIndustry && matchPattern;
  });

  const selectedCase = ENTERPRISE_USE_CASES.find((item) => item.id === selectedCaseId) || filteredCases[0] || ENTERPRISE_USE_CASES[0];

  const getWinnerBadge = (winner: ParadigmType) => {
    switch (winner) {
      case 'rag':
        return <span className="text-emerald-400 font-medium">Standard Vector RAG</span>;
      case 'long-context':
        return <span className="text-sky-400 font-medium">Long Context LLM</span>;
      case 'agentic-rag':
        return <span className="text-amber-400 font-medium">Agentic RAG</span>;
      case 'hybrid':
        return <span className="text-purple-400 font-medium">Hybrid Architecture</span>;
    }
  };

  const getFitIndicator = (fit: string) => {
    switch (fit) {
      case 'Ideal':
        return (
          <span className="inline-flex items-center space-x-1 text-emerald-400 font-medium text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal Choice</span>
          </span>
        );
      case 'Viable':
        return (
          <span className="inline-flex items-center space-x-1 text-sky-400 font-medium text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Viable Alternative</span>
          </span>
        );
      case 'Suboptimal':
        return (
          <span className="inline-flex items-center space-x-1 text-amber-400 font-medium text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Suboptimal Fit</span>
          </span>
        );
      case 'Anti-Pattern':
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-rose-400 font-medium text-xs">
            <XCircle className="w-3.5 h-3.5" />
            <span>Severe Anti-Pattern</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Overview Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2">Production Architecture Matrix</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight text-balance">
            When RAG, Long Context, and Agentic RAG Prevail
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Real enterprise deployments do not fail from poor prompts; they fail from architectural mismatch.
            Review rigorous benchmarks across high-concurrency retrieval, deep cross-document synthesis, and multi-system autonomous orchestration.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
          {/* Industry Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
              <Filter className="w-3 h-3 text-slate-500" />
              <span>Filter by Industry Domain:</span>
            </label>
            <div className="flex flex-wrap gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    selectedIndustry === ind
                      ? 'bg-slate-800 text-slate-100 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Reasoning Pattern Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
              <Layers className="w-3 h-3 text-slate-500" />
              <span>Filter by Reasoning Topology:</span>
            </label>
            <div className="flex flex-wrap gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {patterns.map((pat) => (
                <button
                  key={pat}
                  onClick={() => setSelectedPattern(pat)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    selectedPattern === pat
                      ? 'bg-slate-800 text-slate-100 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Cases Selector on left, Deep-Dive Breakdown on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List of Use Cases */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Enterprise Scenarios ({filteredCases.length})</span>
            <span>Click to inspect architecture</span>
          </div>

          <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
            {filteredCases.map((useCase) => {
              const isSelected = useCase.id === selectedCase.id;
              return (
                <div
                  key={useCase.id}
                  onClick={() => setSelectedCaseId(useCase.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  {/* Clean unboxed metadata row */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 flex-wrap">
                    <span className="text-slate-300 font-medium">{useCase.industry}</span>
                    <span aria-hidden="true">·</span>
                    <span>{useCase.corpusScale}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-400">{useCase.latencySla}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                    {useCase.title}
                  </h3>

                  {/* Short summary */}
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {useCase.summary}
                  </p>

                  {/* Winner Verdict Line */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400">Winner:</span>
                      {getWinnerBadge(useCase.verdict.winner)}
                    </div>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {useCase.verdict.confidence}% confidence
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredCases.length === 0 && (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400 text-sm">
                No enterprise use cases match the selected filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Pane: Deep Dive Architecture Blueprint */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
          {/* Header of Selected Case */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-indigo-400 font-semibold">{selectedCase.industry}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedCase.reasoningType}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{selectedCase.difficulty} Complexity</span>
              </div>

              {onSelectTracePrompt && (
                <button
                  onClick={() => onSelectTracePrompt(selectedCase.id)}
                  className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                >
                  <span>View live execution trace</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {selectedCase.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {selectedCase.enterpriseContext}
            </p>
          </div>

          {/* Verdict Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Architectural Verdict</span>
                <span className="text-slate-600">·</span>
                {getWinnerBadge(selectedCase.verdict.winner)}
              </div>
              <span className="text-xs font-mono text-indigo-300 tabular-nums">
                Score: {selectedCase.verdict.confidence}/100
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100">
              {selectedCase.verdict.headline}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedCase.verdict.executiveRationale}
            </p>
          </div>

          {/* Granular 3-Way Comparative Assessment */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Tri-Model Technical Evaluation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* RAG Assessment Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Vector RAG</span>
                  {getFitIndicator(selectedCase.assessments.rag.fit)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="text-slate-300 tabular-nums">{selectedCase.assessments.rag.p95Latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost / 10k:</span>
                    <span className="text-slate-300 tabular-nums">{selectedCase.assessments.rag.costEstimate}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-medium text-rose-400 mb-0.5">Failure Mode / Vulnerability:</p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {selectedCase.assessments.rag.failureMode}
                  </p>
                </div>
              </div>

              {/* Long Context Assessment Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Long Context</span>
                  {getFitIndicator(selectedCase.assessments.longContext.fit)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="text-slate-300 tabular-nums">{selectedCase.assessments.longContext.p95Latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost / 10k:</span>
                    <span className="text-slate-300 tabular-nums">{selectedCase.assessments.longContext.costEstimate}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-medium text-rose-400 mb-0.5">Failure Mode / Vulnerability:</p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {selectedCase.assessments.longContext.failureMode}
                  </p>
                </div>
              </div>

              {/* Agentic RAG Assessment Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Agentic RAG</span>
                  {getFitIndicator(selectedCase.assessments.agenticRag.fit)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="text-slate-300 tabular-nums">{selectedCase.assessments.agenticRag.p95Latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost / 10k:</span>
                    <span className="text-slate-300 tabular-nums">{selectedCase.assessments.agenticRag.costEstimate}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-medium text-rose-400 mb-0.5">Failure Mode / Vulnerability:</p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {selectedCase.assessments.agenticRag.failureMode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Production Blueprint */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recommended Production Blueprint: {selectedCase.blueprint.architectureName}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-mono block text-[11px] mb-1">Ingestion & Document Pipeline:</span>
                <p className="text-slate-200">{selectedCase.blueprint.ingestionPipeline}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-mono block text-[11px] mb-1">Context / Retrieval / Attention Layer:</span>
                <p className="text-slate-200">{selectedCase.blueprint.retrievalOrContextLayer}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-mono block text-[11px] mb-1">Cache & Memory Topology:</span>
                <p className="text-slate-200">{selectedCase.blueprint.cacheOrIndexStrategy}</p>
              </div>
            </div>

            {/* Safeguards */}
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Critical Production Safeguards:</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-xs text-slate-400">
                {selectedCase.blueprint.safeguards.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sample Query & Real Simulation Snippet */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span>Sample Enterprise Query:</span>
            </span>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
              "{selectedCase.sampleEnterpriseQuery}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800/60">
                <span className="text-emerald-400 font-medium block">RAG Outcome:</span>
                <p className="text-slate-400 mt-0.5">{selectedCase.traceHighlights.ragOutcome}</p>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/60">
                <span className="text-sky-400 font-medium block">Long Context Outcome:</span>
                <p className="text-slate-400 mt-0.5">{selectedCase.traceHighlights.longContextOutcome}</p>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/60">
                <span className="text-amber-400 font-medium block">Agentic Outcome:</span>
                <p className="text-slate-400 mt-0.5">{selectedCase.traceHighlights.agenticOutcome}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
