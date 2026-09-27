'use client';

import React from 'react';
import { GitCompare, Search } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity: Custom Geometric Monogram & Editorial Logo */}
          <div 
            onClick={() => setActiveTab('explorer')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 group-hover:bg-indigo-600 transition-colors flex items-center justify-center text-white shadow-xs">
              {/* Bespoke Geometric Book & Folio Glyph */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h7" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  Folio<span className="text-indigo-600 font-extrabold">Mind</span>
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block">
                Multi-Vector Retrieval Architecture
              </p>
            </div>
          </div>

          {/* Center Navigation: Clean Segmented Tab Control */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'explorer'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {/* Clean Radial Search Glyph */}
              <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Hybrid Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-lab')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ai-lab'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {/* Unique Dial / Atmospheric Vibe Glyph */}
              <svg className="w-3.5 h-3.5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Atmosphere Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {/* Clean Telemetry / Index Metrics Glyph */}
              <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <span>Catalog Intel</span>
            </button>

            <button
              onClick={() => setActiveTab('bookshelf')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bookshelf'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {/* Clean Ribbon Bookmark Glyph */}
              <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              <span>My Bookshelf</span>
              {savedCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            
            {/* Clean Integrated Search Trigger */}
            <button
              onClick={onQuickSearchFocus}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer hidden lg:flex font-medium"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search titles...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
                /
              </kbd>
            </button>

            {/* Compare Drawer Action */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-105 cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            {/* Minimalist Catalog Metric Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>11,127 Books</span>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Submenu */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'explorer' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Explorer</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-lab')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'ai-lab' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <span>Atmosphere</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <span>Intel</span>
          </button>
          <button
            onClick={() => setActiveTab('bookshelf')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'bookshelf' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <span>Shelf ({savedCount})</span>
          </button>
        </div>

      </div>
    </header>
  );
};
