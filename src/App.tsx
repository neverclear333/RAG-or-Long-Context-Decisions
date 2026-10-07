import React, { useState } from 'react';
import { Header } from './components/Header';
import { UseCaseMatrix } from './components/UseCaseMatrix';
import { DecisionWizard } from './components/DecisionWizard';
import { ExecutionTracer } from './components/ExecutionTracer';
import { EconomicsCalculator } from './components/EconomicsCalculator';
import { CustomEvaluator } from './components/CustomEvaluator';
import { TaxonomyReference } from './components/TaxonomyReference';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'use-cases' | 'wizard' | 'traces' | 'calculator' | 'evaluator' | 'taxonomy'
  >('use-cases');
  const [initialTraceId, setInitialTraceId] = useState<string | undefined>(undefined);

  const handleSelectTrace = (caseId: string) => {
    if (caseId.includes('legal')) {
      setInitialTraceId('legal-indemnity-trace');
    } else if (caseId.includes('sre') || caseId.includes('incident')) {
      setInitialTraceId('sre-outage-trace');
    } else {
      setInitialTraceId('legal-indemnity-trace');
    }
    setActiveTab('traces');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'use-cases' && (
          <UseCaseMatrix onSelectTracePrompt={handleSelectTrace} />
        )}
        {activeTab === 'wizard' && <DecisionWizard />}
        {activeTab === 'traces' && (
          <ExecutionTracer initialScenarioId={initialTraceId} />
        )}
        {activeTab === 'calculator' && <EconomicsCalculator />}
        {activeTab === 'evaluator' && <CustomEvaluator />}
        {activeTab === 'taxonomy' && <TaxonomyReference />}
      </main>

      {/* Quiet, Domain-Native Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-semibold text-slate-300">Context Architect</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Decision Framework</span>
            <span aria-hidden="true">·</span>
            <span>RAG vs Long Context vs Agentic RAG</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400 text-xs">
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Context Caching & Embedding Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
