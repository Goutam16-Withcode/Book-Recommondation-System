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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2ede5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('explorer')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#0f291e]">Folio<span className="text-emerald-600">Verde</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Retrieval Engine v2.5
                </span>
              </div>
              <p className="text-xs text-[#52705e] font-medium hidden sm:block">
                Advanced Multi-Vector & Semantic Book Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#f0fdf4] rounded-2xl border border-emerald-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'explorer'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/80'
                  : 'text-[#415e4d] hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Hybrid Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-lab')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'ai-lab'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/80'
                  : 'text-[#415e4d] hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Vibe Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/80'
                  : 'text-[#415e4d] hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Catalog Intel</span>
            </button>

            <button
              onClick={() => setActiveTab('bookshelf')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'bookshelf'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/80'
                  : 'text-[#415e4d] hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>My Bookshelf</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            <button
              onClick={onQuickSearchFocus}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#52705e] bg-[#f4f8f5] hover:bg-emerald-50 border border-[#d9e5dc] hover:border-emerald-300 rounded-xl transition-colors cursor-pointer hidden lg:flex"
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jump to book...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-gray-200 rounded text-gray-500 shadow-2xs">
                /
              </kbd>
            </button>

            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-105 cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            {/* Reading goal mini badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf4] border border-emerald-200 rounded-xl text-xs font-medium text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>11,127 Books Active</span>
            </div>
          </div>

        </div>

        {/* Mobile Submenu */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-emerald-100/80 text-xs">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'explorer' ? 'text-emerald-700' : 'text-gray-500'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explorer</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-lab')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'ai-lab' ? 'text-emerald-700' : 'text-gray-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 font-semibold ${
              activeTab === 'analytics' ? 'text-emerald-700' : 'text-gray-500'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Intel</span>
          </button>
          <button
            onClick={() => setActiveTab('bookshelf')}
            className={`flex flex-col items-center gap-1 font-semibold relative ${
              activeTab === 'bookshelf' ? 'text-emerald-700' : 'text-gray-500'
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
