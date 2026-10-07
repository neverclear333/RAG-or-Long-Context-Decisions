import React from 'react';
import { Layers, Compass, GitCommitHorizontal, Calculator, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'use-cases' | 'wizard' | 'traces' | 'calculator' | 'evaluator' | 'taxonomy';
  setActiveTab: (tab: 'use-cases' | 'wizard' | 'traces' | 'calculator' | 'evaluator' | 'taxonomy') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'use-cases', label: 'Enterprise Matrix', icon: Layers },
    { id: 'wizard', label: 'Architecture Navigator', icon: Compass },
    { id: 'traces', label: 'Execution Traces', icon: GitCommitHorizontal },
    { id: 'calculator', label: 'Economics & Scale', icon: Calculator },
    { id: 'evaluator', label: 'Custom Evaluator', icon: Sparkles },
    { id: 'taxonomy', label: 'Engineering Guide', icon: BookOpen },
  ] as const;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Editorial Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm shadow-indigo-500/20">
              CA
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-100 text-base tracking-tight">Context Architect</span>
                <span className="text-slate-500 text-xs hidden sm:inline" aria-hidden="true">·</span>
                <span className="text-slate-400 text-xs hidden sm:inline">Enterprise Retrieval Framework</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                RAG vs Long Context vs Agentic RAG Decision Matrix
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-indigo-300 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
