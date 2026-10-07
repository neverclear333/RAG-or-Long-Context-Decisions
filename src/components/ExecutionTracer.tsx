import React, { useState } from 'react';
import { SIMULATED_TRACES } from '../data/simulatedTraces';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Zap, ArrowRight, Play, Database, FileText, Bot } from 'lucide-react';

export const ExecutionTracer: React.FC<{ initialScenarioId?: string }> = ({ initialScenarioId }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId || SIMULATED_TRACES[0].id);
  const [activeParadigmTab, setActiveParadigmTab] = useState<'rag' | 'long-context' | 'agentic-rag'>('rag');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const scenario = SIMULATED_TRACES.find((s) => s.id === selectedScenarioId) || SIMULATED_TRACES[0];

  const currentTrace =
    activeParadigmTab === 'rag'
      ? scenario.ragTrace
      : activeParadigmTab === 'long-context'
      ? scenario.longContextTrace
      : scenario.agenticTrace;

  const getVerdictBadge = (verdict: string) => {
    if (verdict.includes('High Accuracy')) {
      return (
        <span className="inline-flex items-center space-x-1 text-emerald-400 font-medium text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{verdict}</span>
        </span>
      );
    }
    if (verdict.includes('Flawed') || verdict.includes('High Cost')) {
      return (
        <span className="inline-flex items-center space-x-1 text-amber-400 font-medium text-xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{verdict}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 text-rose-400 font-medium text-xs">
        <XCircle className="w-3.5 h-3.5" />
        <span>{verdict}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">Execution Trace Sandbox</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Side-by-Side Pipeline Execution Trace
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          Observe step-by-step how Standard RAG, Long Context LLMs, and Agentic RAG handle the identical enterprise query.
          Inspect token payloads, latency overhead, attention heads, and where truncation or hallucination strikes.
        </p>

        {/* Scenario Selector */}
        <div className="mt-5 flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Select Trace Scenario:</span>
          <div className="flex gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
            {SIMULATED_TRACES.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setActiveStepIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedScenarioId === sc.id
                    ? 'bg-slate-800 text-slate-100 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Prompt Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-indigo-400 uppercase tracking-wider">{scenario.category} Prompt</span>
          <span className="text-slate-400">Corpus: {scenario.underlyingContextSize}</span>
        </div>
        <p className="text-sm font-medium text-slate-100 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80">
          "{scenario.prompt}"
        </p>
      </div>

      {/* 3-Way Metrics Comparison Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* RAG summary */}
        <div
          onClick={() => {
            setActiveParadigmTab('rag');
            setActiveStepIndex(0);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeParadigmTab === 'rag'
              ? 'bg-slate-900/90 border-emerald-500/50 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Standard Vector RAG</span>
            </span>
            {getVerdictBadge(scenario.ragTrace.verdict)}
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-2">
            <span className="tabular-nums flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{scenario.ragTrace.totalDurationMs}ms</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums flex items-center space-x-1">
              <Zap className="w-3 h-3 text-slate-400" />
              <span>{scenario.ragTrace.totalTokens.toLocaleString()} tokens</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">{scenario.ragTrace.estimatedCost}</span>
          </div>
        </div>

        {/* Long Context summary */}
        <div
          onClick={() => {
            setActiveParadigmTab('long-context');
            setActiveStepIndex(0);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeParadigmTab === 'long-context'
              ? 'bg-slate-900/90 border-sky-500/50 ring-1 ring-sky-500/30'
              : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-sky-400 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Long Context LLM</span>
            </span>
            {getVerdictBadge(scenario.longContextTrace.verdict)}
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-2">
            <span className="tabular-nums flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{scenario.longContextTrace.totalDurationMs}ms</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums flex items-center space-x-1">
              <Zap className="w-3 h-3 text-slate-400" />
              <span>{scenario.longContextTrace.totalTokens.toLocaleString()} tokens</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">{scenario.longContextTrace.estimatedCost}</span>
          </div>
        </div>

        {/* Agentic RAG summary */}
        <div
          onClick={() => {
            setActiveParadigmTab('agentic-rag');
            setActiveStepIndex(0);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeParadigmTab === 'agentic-rag'
              ? 'bg-slate-900/90 border-amber-500/50 ring-1 ring-amber-500/30'
              : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>Agentic RAG</span>
            </span>
            {getVerdictBadge(scenario.agenticTrace.verdict)}
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-2">
            <span className="tabular-nums flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{scenario.agenticTrace.totalDurationMs}ms</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums flex items-center space-x-1">
              <Zap className="w-3 h-3 text-slate-400" />
              <span>{scenario.agenticTrace.totalTokens.toLocaleString()} tokens</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">{scenario.agenticTrace.estimatedCost}</span>
          </div>
        </div>
      </div>

      {/* Stepper Pipeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step list & Stepper */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Execution Timeline ({currentTrace.steps.length} steps)</span>
            <span>Click step to inspect data payload</span>
          </div>

          <div className="space-y-2">
            {currentTrace.steps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/50 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-indigo-400">Step {step.stepNumber}: {step.phase}</span>
                    <span className="font-mono text-slate-400 tabular-nums">{step.durationMs}ms</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {step.action}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    {step.annotation}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Key Observation box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 mt-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Architectural Takeaway:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTrace.keyObservation}
            </p>
          </div>
        </div>

        {/* Selected Step Payload Inspector & Model Output */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step Inspector Card */}
          {currentTrace.steps[activeStepIndex] && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                    Step {currentTrace.steps[activeStepIndex].stepNumber} Payload Inspection
                  </span>
                  <h3 className="text-base font-bold text-slate-100">
                    {currentTrace.steps[activeStepIndex].phase}
                  </h3>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <div>Latency: {currentTrace.steps[activeStepIndex].durationMs}ms</div>
                  <div>Tokens: {currentTrace.steps[activeStepIndex].tokensConsumed}</div>
                </div>
              </div>

              {/* Input snippet */}
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400">Input / Target:</span>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 break-words">
                  {currentTrace.steps[activeStepIndex].inputSnippet}
                </div>
              </div>

              {/* Output snippet */}
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400">Output Payload:</span>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 break-words">
                  {currentTrace.steps[activeStepIndex].outputSnippet}
                </div>
              </div>

              {/* Step Analysis */}
              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                <span className="font-semibold block mb-0.5">Deep Diagnostic:</span>
                {currentTrace.steps[activeStepIndex].annotation}
              </div>
            </div>
          )}

          {/* Final Synthesized Output Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Synthesized Enterprise Response
              </span>
              {getVerdictBadge(currentTrace.verdict)}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {currentTrace.finalResponse}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
