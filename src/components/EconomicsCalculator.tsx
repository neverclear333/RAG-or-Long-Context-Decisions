import React, { useState } from 'react';
import { DollarSign, Clock, TrendingUp, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

export const EconomicsCalculator: React.FC = () => {
  const [monthlyQueries, setMonthlyQueries] = useState<number>(50000);
  const [corpusTokens, setCorpusTokens] = useState<number>(500000);
  const [cacheHitRate, setCacheHitRate] = useState<number>(75); // %
  const [agentSteps, setAgentSteps] = useState<number>(3); // multi-hop iterations

  // Real Enterprise Unit Economics (based on Gemini 3.8 Flash & Pro tier token rates and industry vector DB costs)
  // Standard RAG:
  // - Top-k chunks injected: 1,500 tokens input per query
  // - Embedding cost per query: 32 tokens input = negligible
  // - LLM input: $0.15 / 1M tokens ($0.00015 / 1k tokens)
  // - Output tokens: 400 tokens @ $0.60 / 1M tokens
  // - Vector DB cluster cost (Pinecone standard pod / pgvector allocated CPU): ~$70 - $250/mo baseline
  const ragTokenCostPerQuery = (1500 * 0.15) / 1000000 + (400 * 0.60) / 1000000;
  const vectorDbBaselinePerMonth = corpusTokens > 1000000 ? 180 : 80;
  const totalRagMonthlyCost = monthlyQueries * ragTokenCostPerQuery + vectorDbBaselinePerMonth;
  const ragCostPerQuery = totalRagMonthlyCost / monthlyQueries;
  const ragLatency = 480; // ms

  // Long Context (with Context Caching):
  // - Ingests full corpus tokens (e.g. 500,000 tokens)
  // - Gemini Context Caching rate: $0.0375 / 1M tokens on cache hit (75% discount on input)
  // - Uncached input rate: $0.15 / 1M tokens
  // - Cache storage rate: ~$1.00 / 1M tokens per day (~$0.033 / 1M tokens per hour)
  // - Output tokens: 500 tokens @ $0.60 / 1M tokens
  const uncachedInputCost = (corpusTokens * 0.15) / 1000000;
  const cachedInputCost = (corpusTokens * 0.0375) / 1000000;
  const cacheStorageMonthly = (corpusTokens * 1.00 * 30) / 1000000; // storage per month for warm cache
  const blendedInputCost =
    (cacheHitRate / 100) * cachedInputCost + (1 - cacheHitRate / 100) * uncachedInputCost;
  const longContextOutputCost = (500 * 0.60) / 1000000;
  const totalLongContextMonthlyCost =
    monthlyQueries * (blendedInputCost + longContextOutputCost) + (cacheHitRate > 0 ? cacheStorageMonthly : 0);
  const longContextCostPerQuery = totalLongContextMonthlyCost / monthlyQueries;
  const longContextLatency = cacheHitRate > 50 ? 1400 : 3200; // ms

  // Long Context (Uncached raw baseline):
  const uncachedTotalMonthlyCost =
    monthlyQueries * (uncachedInputCost + longContextOutputCost);

  // Agentic RAG:
  // - Planner call (800 input, 200 output)
  // - N tool evaluation loops (each 1,500 input chunks, 300 output)
  // - Final synthesizer (2,500 input, 500 output)
  // - Vector DB baseline included
  const agentTokensPerQuery = 800 + agentSteps * 1500 + 2500;
  const agentOutputPerQuery = 200 + agentSteps * 300 + 500;
  const agentTokenCostPerQuery =
    (agentTokensPerQuery * 0.15) / 1000000 + (agentOutputPerQuery * 0.60) / 1000000;
  const totalAgenticMonthlyCost =
    monthlyQueries * agentTokenCostPerQuery + vectorDbBaselinePerMonth;
  const agenticCostPerQuery = totalAgenticMonthlyCost / monthlyQueries;
  const agenticLatency = 1200 + agentSteps * 2100; // ms

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">Total Cost of Ownership</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Enterprise Economics & Latency Modeler
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          Evaluate real-world enterprise infrastructure expenses. Discover when Context Caching makes Long Context cheaper than Vector RAG, and quantify the token multipliers of Agentic loops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
            Workload Configuration
          </h2>

          {/* Monthly Queries */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Monthly Query Volume</span>
              <span className="font-mono text-indigo-400 font-semibold tabular-nums">
                {monthlyQueries.toLocaleString()} queries
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={500000}
              step={5000}
              value={monthlyQueries}
              onChange={(e) => setMonthlyQueries(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1k (Pilots)</span>
              <span>50k (Mid-Scale)</span>
              <span>500k (High-Traffic)</span>
            </div>
          </div>

          {/* Corpus Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Active Document Corpus Tokens</span>
              <span className="font-mono text-indigo-400 font-semibold tabular-nums">
                {corpusTokens.toLocaleString()} tokens
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={1500000}
              step={50000}
              value={corpusTokens}
              onChange={(e) => setCorpusTokens(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50k (~100 pgs)</span>
              <span>750k (~1,500 pgs)</span>
              <span>1.5M (Full 10-K Bundle)</span>
            </div>
          </div>

          {/* Cache Hit Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Long Context Cache Hit Rate</span>
              <span className="font-mono text-sky-400 font-semibold tabular-nums">
                {cacheHitRate}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={cacheHitRate}
              onChange={(e) => setCacheHitRate(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (No Caching)</span>
              <span>50% (Intermittent)</span>
              <span>95% (Stable Corpus)</span>
            </div>
          </div>

          {/* Agent Steps */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Average Agent Loops / Tool Calls</span>
              <span className="font-mono text-amber-400 font-semibold tabular-nums">
                {agentSteps} steps
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={agentSteps}
              onChange={(e) => setAgentSteps(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 (Single Tool)</span>
              <span>3 (ReAct Loop)</span>
              <span>6 (Deep Diagnostic)</span>
            </div>
          </div>

          {/* Context Caching Tip */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Caching Economics:</span>
            </div>
            <p className="leading-relaxed">
              Gemini Context Caching reduces input token costs by 75% for tokens beyond the cache threshold. This eliminates the traditional penalty of repeatedly passing hundreds of pages.
            </p>
          </div>
        </div>

        {/* Results & Comparison Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Monthly Spend Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* RAG */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 block">Vector RAG</span>
              <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
                ${Math.round(totalRagMonthlyCost).toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </div>
              <div className="text-xs font-mono text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Per Query:</span>
                  <span className="text-slate-200 tabular-nums">${ragCostPerQuery.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-slate-200 tabular-nums">{ragLatency}ms</span>
                </div>
              </div>
            </div>

            {/* Long Context */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 space-y-2">
              <span className="text-xs font-semibold text-sky-400 block">
                Long Context ({cacheHitRate}% Cache)
              </span>
              <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
                ${Math.round(totalLongContextMonthlyCost).toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </div>
              <div className="text-xs font-mono text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Per Query:</span>
                  <span className="text-slate-200 tabular-nums">${longContextCostPerQuery.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-slate-200 tabular-nums">{(longContextLatency / 1000).toFixed(1)}s</span>
                </div>
              </div>
            </div>

            {/* Agentic RAG */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <span className="text-xs font-semibold text-amber-400 block">
                Agentic RAG ({agentSteps} steps)
              </span>
              <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
                ${Math.round(totalAgenticMonthlyCost).toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </div>
              <div className="text-xs font-mono text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Per Query:</span>
                  <span className="text-slate-200 tabular-nums">${agenticCostPerQuery.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-slate-200 tabular-nums">{(agenticLatency / 1000).toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Cost Comparison Breakdown Bar */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Relative Monthly Cost Multiplier
            </span>

            <div className="space-y-2 text-xs">
              {/* RAG Bar */}
              <div className="flex items-center gap-3">
                <span className="w-28 text-slate-400 font-medium shrink-0">Vector RAG</span>
                <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(4, (totalRagMonthlyCost / totalAgenticMonthlyCost) * 100)
                      )}%`
                    }}
                  />
                </div>
                <span className="font-mono text-slate-200 w-20 text-right tabular-nums">
                  ${Math.round(totalRagMonthlyCost).toLocaleString()}
                </span>
              </div>

              {/* Long Context Bar */}
              <div className="flex items-center gap-3">
                <span className="w-28 text-slate-400 font-medium shrink-0">Long Context</span>
                <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(4, (totalLongContextMonthlyCost / totalAgenticMonthlyCost) * 100)
                      )}%`
                    }}
                  />
                </div>
                <span className="font-mono text-slate-200 w-20 text-right tabular-nums">
                  ${Math.round(totalLongContextMonthlyCost).toLocaleString()}
                </span>
              </div>

              {/* Agentic RAG Bar */}
              <div className="flex items-center gap-3">
                <span className="w-28 text-slate-400 font-medium shrink-0">Agentic RAG</span>
                <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
                <span className="font-mono text-slate-200 w-20 text-right tabular-nums">
                  ${Math.round(totalAgenticMonthlyCost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Strategic Financial Rationale */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold font-mono uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Architectural Economics Verdict:</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-100">Vector RAG</strong> is overwhelmingly more cost-effective when monthly queries exceed 100,000 and answers are localized. Vector DB baseline hosting amortizes to fractions of a cent per query.
              </p>
              <p>
                <strong className="text-slate-100">Long Context with Prompt Caching</strong> is highly viable for high-value research, legal, and deal-room workflows. Notice that without caching, your monthly spend would be{' '}
                <span className="text-rose-400 font-mono font-medium tabular-nums">
                  ${Math.round(uncachedTotalMonthlyCost).toLocaleString()}
                </span>
                —Context Caching saves{' '}
                <span className="text-emerald-400 font-mono font-medium tabular-nums">
                  ${Math.round(uncachedTotalMonthlyCost - totalLongContextMonthlyCost).toLocaleString()}
                </span>{' '}
                each month!
              </p>
              <p>
                <strong className="text-slate-100">Agentic RAG</strong> carries a{' '}
                <span className="text-amber-400 font-mono font-medium">
                  {(totalAgenticMonthlyCost / (totalRagMonthlyCost || 1)).toFixed(1)}x
                </span>{' '}
                cost multiplier due to token loops and reflection rounds. Reserve it strictly for workflows where autonomous tool calling or cross-system database actions are required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
