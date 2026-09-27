'use client';

import React from 'react';
import { GitCompare } from 'lucide-react';

export type AppTab = 'explorer' | 'ai-lab' | 'analytics' | 'bookshelf';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  savedCount: number;
  compareCount: number;
  onOpenCompare: () => void;
  onQuickSearchFocus: () => void;
  isMLConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
  onOpenCompare,
  onQuickSearchFocus,
  isMLConnected = true
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
              {/* Bespoke Geometric Book & Folio Glyph (Handcrafted SVG) */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Scikit-Learn ML
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block">
                TF-IDF & Cosine Vector Retrieval Engine
              </p>
            </div>
          </div>

          {/* Center Navigation: Segmented Tab Control with 100% Unique, Non-AI SVG Glyphs */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            
            {/* TAB 1: HYBRID EXPLORER - Bespoke Intersecting Dual-Orbital Vector Glyph */}
            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'explorer'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="12" r="5" />
                <circle cx="16" cy="12" r="5" />
                <path d="M8 7a5 5 0 0 1 8 0" strokeDasharray="2 2" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
              <span>Hybrid Explorer</span>
            </button>

            {/* TAB 2: ML VECTOR LAB - Bespoke 3D Cartesian Tensor Axis Glyph */}
            <button
              onClick={() => setActiveTab('ai-lab')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ai-lab'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20h16" />
                <path d="M4 20V4" />
                <path d="m4 20 8-8" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <path d="M12 12h7" strokeDasharray="2 2" />
                <path d="M12 12V5" strokeDasharray="2 2" />
              </svg>
              <span>ML Vector Lab</span>
            </button>

            {/* TAB 3: CATALOG INTEL - Bespoke Discrete Spectral Frequency Distribution Glyph */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20h18" />
                <rect x="5" y="14" width="2.5" height="6" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                <rect x="9.5" y="8" width="2.5" height="12" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                <rect x="14" y="5" width="2.5" height="15" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                <rect x="18.5" y="11" width="2.5" height="9" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                <path d="M5 14c4-10 10-10 16-2" strokeWidth="1.5" />
              </svg>
              <span>Catalog Intel</span>
            </button>

            {/* TAB 4: MY BOOKSHELF - Bespoke Hardcover Folio Spine Vault Glyph */}
            <button
              onClick={() => setActiveTab('bookshelf')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bookshelf'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H9v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M9 2h4v20H9z" />
                <path d="m13 2 5 2.5v17.5l-5-2z" />
                <line x1="6.5" y1="6" x2="6.5" y2="10" strokeWidth="1.5" />
              </svg>
              <span>My Bookshelf</span>
              {savedCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

          </nav>

          {/* Right Action Cluster: Cleanly Integrated Search & 11,127 Indexed Badge */}
          <div className="flex items-center gap-2.5">
            
            {/* Unified Search Capsule (Search catalog... /) */}
            <button
              onClick={onQuickSearchFocus}
              className="group flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-2xs font-medium cursor-pointer"
              title="Search book catalog (Press '/' to focus)"
            >
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="hidden sm:inline text-slate-600 group-hover:text-slate-800 font-semibold">
                Search catalog...
              </span>
              <span className="sm:hidden text-slate-600 font-semibold">Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white border border-slate-200 rounded text-slate-400 group-hover:text-slate-700 shadow-2xs">
                /
              </kbd>
            </button>

            {/* Compare Drawer Action (if items selected) */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-105 cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compare</span>
                <span>({compareCount})</span>
              </button>
            )}

            {/* Cleanly Aligned 11,127 Indexed Badge */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/90 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs select-none"
              title="11,127 Books Indexed into Scikit-Learn TF-IDF 5,000-dimensional vector space"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono font-bold text-slate-900 tracking-tight">11,127</span>
              <span className="text-[11px] text-slate-500 font-medium">Indexed</span>
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
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="12" r="5" />
              <circle cx="16" cy="12" r="5" />
            </svg>
            <span>Explorer</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-lab')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'ai-lab' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 20h16" />
              <path d="M4 20V4" />
              <path d="m4 20 8-8" />
            </svg>
            <span>ML Vectors</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 20h18" />
              <rect x="5" y="14" width="2.5" height="6" />
              <rect x="10" y="8" width="2.5" height="12" />
              <rect x="15" y="5" width="2.5" height="15" />
            </svg>
            <span>Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab('bookshelf')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'bookshelf' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H9v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M9 2h4v20H9z" />
            </svg>
            <span>Shelf ({savedCount})</span>
          </button>
        </div>

      </div>
    </header>
  );
};
