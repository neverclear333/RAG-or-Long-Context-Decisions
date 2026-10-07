import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API endpoint for evaluating custom enterprise use cases
app.post('/api/evaluate', async (req, res) => {
  try {
    const {
      title,
      description,
      corpusSize,
      documentTypes,
      queryPattern,
      latencyRequirement,
      updateFrequency,
      budgetSensitivity
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return structured fallback analysis when API key is not configured
      return res.json({
        fallback: true,
        source: 'Context Architect Heuristic Engine (Configure GEMINI_API_KEY for dynamic generative evaluation)',
        ...generateHeuristicEvaluation(req.body)
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a Principal Enterprise AI Architect specializing in Retrieval-Augmented Generation (RAG), Long-Context LLMs (e.g., Gemini 1.5/2.0 Pro 1M-2M context windows with prompt caching), and Agentic RAG (multi-step reasoning, query decomposition, corrective self-RAG, routing).

Evaluate the following enterprise use case and determine which paradigm is most effective, why, and what the fatal pitfalls of the alternative architectures are.

USE CASE DETAILS:
- Title: ${title}
- Description: ${description}
- Corpus Size & Scale: ${corpusSize || 'Moderate (1M - 10M tokens)'}
- Document Types: ${documentTypes || 'PDFs, docs, wiki pages, database schemas'}
- Query Pattern: ${queryPattern || 'Semantic question answering and cross-document lookup'}
- Latency Requirement: ${latencyRequirement || 'Interactive (2 - 5 seconds)'}
- Data Update Frequency: ${updateFrequency || 'Daily'}
- Budget & Cost Sensitivity: ${budgetSensitivity || 'Balanced'}

Respond ONLY with a valid JSON object matching this exact TypeScript structure:
{
  "recommendedParadigm": "Standard RAG" | "Long Context" | "Agentic RAG" | "Hybrid (Specify)",
  "confidenceScore": number (between 70 and 98),
  "executiveSummary": "2-3 crisp sentences on why this paradigm wins",
  "winnerKeyStrengths": ["bullet 1", "bullet 2", "bullet 3"],
  "ragAssessment": {
    "verdict": "Winner" | "Viable Alternative" | "Suboptimal" | "Anti-Pattern",
    "score": number (1-10),
    "explanation": "Detailed rationale",
    "criticalFailureMode": "Specific failure mode for this use case (e.g. chunk boundary loss, missing global context)"
  },
  "longContextAssessment": {
    "verdict": "Winner" | "Viable Alternative" | "Suboptimal" | "Anti-Pattern",
    "score": number (1-10),
    "explanation": "Detailed rationale",
    "criticalFailureMode": "Specific failure mode for this use case (e.g. token cost blowup at scale, latency spike, uncacheable churn)"
  },
  "agenticRagAssessment": {
    "verdict": "Winner" | "Viable Alternative" | "Suboptimal" | "Anti-Pattern",
    "score": number (1-10),
    "explanation": "Detailed rationale",
    "criticalFailureMode": "Specific failure mode for this use case (e.g. non-deterministic tool loops, cascading latency, 5x token overhead)"
  },
  "recommendedStack": {
    "retrievalEngine": "e.g. Pinecone / pgvector with hybrid BM25 + dense rerank OR Gemini Context Caching OR LangGraph with sub-agents",
    "contextManagement": "e.g. 512-token semantic chunking with metadata filtering OR 1.2M token context cache with 1h TTL",
    "guardrails": "e.g. Hallucination grounding checks, query reformulator, latency circuit-breaker"
  },
  "tradeoffs": {
    "p95Latency": "e.g. 650ms or 3.2s or 8.5s",
    "costPer10kQueries": "e.g. $12.50 or $140.00",
    "operationalComplexity": "Low" | "Medium" | "High" | "Extreme",
    "maintenanceGotcha": "Key engineering warning"
  }
}`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out after 8s')), 8000)
    );

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ fallback: false, ...parsed });

  } catch (err: any) {
    console.warn('Gemini evaluation notice (activating heuristic fallback):', err.message);
    // Fallback to local heuristic engine if LLM call fails
    return res.json({
      fallback: true,
      error: err.message,
      source: 'Context Architect Heuristic Engine',
      ...generateHeuristicEvaluation(req.body)
    });
  }
});

// Heuristic expert evaluation engine
function generateHeuristicEvaluation(body: any) {
  const text = ((body.title || '') + ' ' + (body.description || '')).toLowerCase();
  const corpus = (body.corpusSize || '').toLowerCase();
  const query = (body.queryPattern || '').toLowerCase();
  const latency = (body.latencyRequirement || '').toLowerCase();

  let paradigm: 'Standard RAG' | 'Long Context' | 'Agentic RAG' | 'Hybrid (Agentic + Long Context)' = 'Standard RAG';
  let confidence = 85;

  const isCrossDoc = text.includes('compare') || text.includes('across') || text.includes('synthesis') || text.includes('contract') || text.includes('due diligence') || text.includes('audit');
  const isMultiStep = text.includes('action') || text.includes('tool') || text.includes('incident') || text.includes('troubleshoot') || text.includes('sql') || text.includes('multi-hop') || text.includes('triage') || text.includes('remediation');
  const isSmallDense = corpus.includes('< 500k') || corpus.includes('single') || corpus.includes('book') || corpus.includes('few documents') || corpus.includes('800-page');
  const isHighScale = corpus.includes('massive') || corpus.includes('millions') || corpus.includes('50,000') || corpus.includes('> 10m');
  const isRealtime = latency.includes('sub-second') || latency.includes('< 1s') || latency.includes('real-time');

  if (isMultiStep && !isRealtime) {
    paradigm = 'Agentic RAG';
    confidence = 92;
  } else if (isCrossDoc && isSmallDense) {
    paradigm = 'Long Context';
    confidence = 94;
  } else if (isCrossDoc && isMultiStep) {
    paradigm = 'Hybrid (Agentic + Long Context)';
    confidence = 88;
  } else if (isHighScale || isRealtime) {
    paradigm = 'Standard RAG';
    confidence = 91;
  } else if (isCrossDoc) {
    paradigm = 'Long Context';
    confidence = 86;
  }

  const summaries: Record<string, string> = {
    'Standard RAG': 'Standard Vector RAG is optimal here due to the high corpus scale and need for fast, cost-effective point lookups. Retrieving top-k chunks bounded to relevant passages minimizes token expenditure and latency.',
    'Long Context': 'Long Context models with prompt caching excel here because the query requires holistic reasoning and cross-referencing across the entire document corpus, where chunking would sever critical semantic relationships.',
    'Agentic RAG': 'Agentic RAG is the decisively superior pattern because the task requires multi-hop reasoning, dynamic query decomposition, and validation loops that cannot be resolved in a single retrieval step.',
    'Hybrid (Agentic + Long Context)': 'A Hybrid architecture is essential: an Agentic planner decomposes the multi-hop workflow and routes filtered full documents directly into a Long-Context window with prompt caching for holistic synthesis.'
  };

  return {
    recommendedParadigm: paradigm,
    confidenceScore: confidence,
    executiveSummary: summaries[paradigm] || summaries['Standard RAG'],
    winnerKeyStrengths: [
      paradigm === 'Standard RAG' ? 'Sub-second p95 retrieval latency across massive document archives' : paradigm === 'Long Context' ? 'Zero chunk boundary loss; LLM maintains holistic global document attention' : 'Autonomous multi-step query planning and corrective validation',
      paradigm === 'Standard RAG' ? 'Lowest cost per 10k queries ($2-5 vs $100+ for raw long context)' : paradigm === 'Long Context' ? 'Context Caching delivers 75% cost reduction and 80% latency speedup on warm queries' : 'Dynamic tool invocations (APIs, SQL, web) interleaved with vector retrieval',
      paradigm === 'Standard RAG' ? 'Simple operational surface area with battle-tested vector databases' : paradigm === 'Long Context' ? 'Eliminates embedding tuning, reranker latency, and chunking strategy bugs' : 'Self-correcting verification loops discard irrelevant intermediate documents'
    ],
    ragAssessment: {
      verdict: paradigm === 'Standard RAG' ? 'Winner' : isHighScale ? 'Viable Alternative' : 'Suboptimal',
      score: paradigm === 'Standard RAG' ? 9.2 : 5.8,
      explanation: paradigm === 'Standard RAG' ? 'Ideal for factual lookup and high-throughput point queries across large corpora.' : 'Chunking isolates individual sentences, severing the macro-level dependencies required here.',
      criticalFailureMode: 'Chunk boundary truncation: key context spans multiple split chunks and misses top-k threshold.'
    },
    longContextAssessment: {
      verdict: paradigm === 'Long Context' ? 'Winner' : isSmallDense ? 'Viable Alternative' : 'Suboptimal',
      score: paradigm === 'Long Context' ? 9.5 : 5.2,
      explanation: paradigm === 'Long Context' ? 'Ingesting full context into memory allows high-precision comparative reasoning.' : 'Economically prohibitive if queries cannot leverage cached prompts across huge archives.',
      criticalFailureMode: 'Attention distraction / needle degradation and high input token costs without warm cache hits.'
    },
    agenticRagAssessment: {
      verdict: paradigm === 'Agentic RAG' || paradigm.includes('Hybrid') ? 'Winner' : 'Suboptimal',
      score: paradigm === 'Agentic RAG' ? 9.4 : 6.1,
      explanation: paradigm === 'Agentic RAG' ? 'Multi-hop planner orchestrates iterative retrieval, grading, and corrective reformulations.' : 'Overkill for simple factual Q&A, introducing 3x-6x latency overhead and potential loop drift.',
      criticalFailureMode: 'Compounding latency and token runaway if agent enters unbounded reflection loops.'
    },
    recommendedStack: {
      retrievalEngine: paradigm === 'Standard RAG' ? 'pgvector / Pinecone with Hybrid Dense (Cohere) + Sparse (BM25) and Cohere Rerank v3' : paradigm === 'Long Context' ? 'Gemini 3.8 Flash / Gemini 3.1 Pro with Context Caching (TTL: 1 hour)' : 'LangGraph / LlamaIndex Agent with Sub-Question Planner and Self-RAG Grader',
      contextManagement: paradigm === 'Standard RAG' ? 'Hierarchical chunking (256-token child chunks with 1024-token parent context)' : paradigm === 'Long Context' ? 'Full document injection into 1M context window with system prompt caching' : 'Dynamic agent scratchpad with sliding window state & retrieval tools',
      guardrails: 'Hallucination citation verifier, relevance threshold gate, fallback timeout (5s)'
    },
    tradeoffs: {
      p95Latency: paradigm === 'Standard RAG' ? '480ms - 850ms' : paradigm === 'Long Context' ? '2.1s - 4.5s' : '5.8s - 12.0s',
      costPer10kQueries: paradigm === 'Standard RAG' ? '$4.20' : paradigm === 'Long Context' ? '$65.00 ($16.25 with 75% cache hit)' : '$110.00',
      operationalComplexity: paradigm === 'Standard RAG' ? 'Medium' : paradigm === 'Long Context' ? 'Low' : 'High',
      maintenanceGotcha: paradigm === 'Standard RAG' ? 'Chunk drift as documents evolve requires re-indexing' : paradigm === 'Long Context' ? 'Cache invalidation on partial document edits' : 'Agent divergence and tool invocation timeout cascading'
    }
  };
}

// Development vs Production Vite handling
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Context Architect server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
