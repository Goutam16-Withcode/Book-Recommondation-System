'use client';

import React from 'react';
import { BookOpen, Sparkles, Compass, BarChart3, BookmarkCheck, GitCompare, Search } from 'lucide-react';

export type AppTab = 'explorer' | 'ai-lab' | 'analytics' | 'bookshelf';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  savedCount: number;
  compareCount: number;
  onOpenCompare: () => void;
  onQuickSearchFocus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
  onOpenCompare,
  onQuickSearchFocus
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('explorer')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Folio<span className="text-indigo-600">Mind</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Retrieval v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Multi-Vector & Semantic Book Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === 'explorer'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Hybrid Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-lab')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === 'ai-lab'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>AI Vibe Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span>Catalog Intel</span>
            </button>

            <button
              onClick={() => setActiveTab('bookshelf')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === 'bookshelf'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-600" />
              <span>My Bookshelf</span>
              {savedCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onQuickSearchFocus}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-xl transition-colors cursor-pointer hidden lg:flex font-medium"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search catalog...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
                /
              </kbd>
            </button>

            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-105 cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-indigo-50/80 border border-indigo-200/80 rounded-xl text-xs font-semibold text-indigo-900">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>11,127 Indexed</span>
            </div>
          </div>

        </div>

        {/* Mobile Submenu */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'explorer' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explorer</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-lab')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'ai-lab' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Intel</span>
          </button>
          <button
            onClick={() => setActiveTab('bookshelf')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'bookshelf' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Shelf ({savedCount})</span>
          </button>
        </div>

      </div>
    </header>
  );
};
