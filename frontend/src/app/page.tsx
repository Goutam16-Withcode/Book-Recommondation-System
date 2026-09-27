'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, AppTab } from '@/components/Navbar';
import { RetrievalConsole } from '@/components/RetrievalConsole';
import { RetrievalPipelineBanner } from '@/components/RetrievalPipelineBanner';
import { BookCard } from '@/components/BookCard';
import { BookDetailModal } from '@/components/BookDetailModal';
import { BookCompareModal } from '@/components/BookCompareModal';
import { BookReaderModal } from '@/components/BookReaderModal';
import { BookshelfView, SavedBookItem, ShelfCategory } from '@/components/BookshelfView';
import { CatalogAnalyticsView } from '@/components/CatalogAnalyticsView';
import { AIVibeLabView } from '@/components/AIVibeLabView';
import { Book, RetrievalMatch, RetrievalParams, RetrievalResult } from '@/lib/retrieval-engine';
import { 
  Sparkles, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  BookOpen, 
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>('explorer');
  const [activeSeedBook, setActiveSeedBook] = useState<Book | null>(null);
  const [retrievalResult, setRetrievalResult] = useState<RetrievalResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // View preferences
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'bayesian' | 'pages'>('match');

  // Modals state
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);
  const [selectedMatchForDetails, setSelectedMatchForDetails] = useState<RetrievalMatch | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedBookForReading, setSelectedBookForReading] = useState<Book | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const handleOpenReader = (book: Book) => {
    setSelectedBookForReading(book);
    setIsReaderOpen(true);
  };

  // Bookshelf & Compare Collections (with localStorage persistence)
  const [savedShelf, setSavedShelf] = useState<SavedBookItem[]>([]);
  const [compareList, setCompareList] = useState<Book[]>([]);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const storedShelf = localStorage.getItem('foliomind_shelf');
      if (storedShelf) setSavedShelf(JSON.parse(storedShelf));

      const storedCompare = localStorage.getItem('foliomind_compare');
      if (storedCompare) setCompareList(JSON.parse(storedCompare));
    } catch (e) {
      console.error('Error loading stored library:', e);
    }
  }, []);

  // Save to LocalStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('foliomind_shelf', JSON.stringify(savedShelf));
    } catch (e) {
      console.error('Error saving shelf:', e);
    }
  }, [savedShelf]);

  useEffect(() => {
    try {
      localStorage.setItem('foliomind_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error('Error saving compare:', e);
    }
  }, [compareList]);

  // Execute recommendation retrieval pipeline via API
  const handleExecuteRetrieval = useCallback(async (params: RetrievalParams) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const result: RetrievalResult = await res.json();
        setRetrievalResult(result);
        if (result.queryContext.seedBook) {
          setActiveSeedBook(result.queryContext.seedBook);
        }
      } else {
        showToast('Retrieval query encountered an issue');
      }
    } catch (err) {
      console.error('Retrieval error:', err);
      showToast('Network error during retrieval');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load: start with seed book #1 (Harry Potter and the Half-Blood Prince)
  useEffect(() => {
    handleExecuteRetrieval({
      seedBookId: '1',
      maxResults: 12
    });
  }, [handleExecuteRetrieval]);

  // Pivot seed book (e.g. click "Find Books Like This")
  const handlePivotSeed = (book: Book) => {
    setActiveSeedBook(book);
    setActiveTab('explorer');
    handleExecuteRetrieval({
      seedBookId: book.id,
      maxResults: 12
    });
    showToast(`Anchor seed updated to "${book.shortTitle}"`);
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  // Toggle bookshelf item
  const handleToggleSave = (book: Book, shelfCategory?: any) => {
    const finalCategory: ShelfCategory = (shelfCategory as ShelfCategory) || 'Want to Read';
    setSavedShelf(prev => {
      const exists = prev.find(item => item.book.id === book.id);
      if (exists) {
        showToast(`Removed "${book.shortTitle}" from bookshelf`);
        return prev.filter(item => item.book.id !== book.id);
      } else {
        showToast(`Added "${book.shortTitle}" to ${finalCategory}`);
        return [...prev, { book, category: finalCategory, addedAt: new Date().toISOString() }];
      }
    });
  };

  const handleChangeShelfCategory = (bookId: string, newCategory: ShelfCategory) => {
    setSavedShelf(prev => prev.map(item => 
      item.book.id === bookId ? { ...item, category: newCategory } : item
    ));
    showToast(`Updated shelf status to ${newCategory}`);
  };

  const handleRemoveFromShelf = (bookId: string) => {
    setSavedShelf(prev => prev.filter(item => item.book.id !== bookId));
    showToast(`Book removed from bookshelf`);
  };

  // Toggle compare item
  const handleToggleCompare = (book: Book) => {
    setCompareList(prev => {
      const exists = prev.find(b => b.id === book.id);
      if (exists) {
        showToast(`Removed from comparison`);
        return prev.filter(b => b.id !== book.id);
      } else {
        if (prev.length >= 4) {
          showToast(`Maximum 4 books can be compared simultaneously`);
          return prev;
        }
        showToast(`Added "${book.shortTitle}" to comparison`);
        return [...prev, book];
      }
    });
  };

  const handleRemoveFromCompare = (bookId: string) => {
    setCompareList(prev => prev.filter(b => b.id !== bookId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
    showToast(`Comparison list cleared`);
  };

  // Open book details modal
  const handleOpenDetails = (book: Book, match?: RetrievalMatch) => {
    setSelectedBookForDetails(book);
    setSelectedMatchForDetails(match || null);
    setIsDetailOpen(true);
  };

  // Focus search box via shortcut
  const handleQuickSearchFocus = () => {
    setActiveTab('explorer');
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Keyboard shortcut listener ('/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleQuickSearchFocus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sorted matches
  const sortedMatches = retrievalResult?.matches ? [...retrievalResult.matches].sort((a, b) => {
    if (sortBy === 'rating') return b.book.rating - a.book.rating;
    if (sortBy === 'bayesian') return b.book.bayesianScore - a.book.bayesianScore;
    if (sortBy === 'pages') return a.book.pages - b.book.pages;
    return b.matchPercentage - a.matchPercentage;
  }) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-indigo-500/40 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedShelf.length}
        compareCount={compareList.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onQuickSearchFocus={handleQuickSearchFocus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        
        {/* TAB 1: HYBRID EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="space-y-7">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-2.5 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen Machine Learning Recommender</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Discover Books You'll Love With <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">Multi-Vector Precision</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Combining TF-IDF vector alignment, BM25 inverted lexical indexing, author collaborative graphs, and Bayesian quality regularization across 11,127 curated books.
              </p>
            </div>

            {/* Retrieval Console */}
            <RetrievalConsole
              onExecuteRetrieval={handleExecuteRetrieval}
              isLoading={isLoading}
              activeSeedBook={activeSeedBook}
              setActiveSeedBook={setActiveSeedBook}
            />

            {/* Execution Telemetry Pipeline Banner */}
            <RetrievalPipelineBanner
              result={retrievalResult}
              isLoading={isLoading}
            />

            {/* Recommendations Section Header & Controls */}
            {retrievalResult && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                  
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                      <span>
                        {activeSeedBook 
                          ? `Recommended Candidates for "${activeSeedBook.shortTitle}"` 
                          : 'Retrieved Recommendations'
                        }
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {sortedMatches.length} high-affinity matches scored and ranked
                    </p>
                  </div>

                  {/* View Mode & Sort Dropdowns */}
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Sort Selector */}
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
                      <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer text-xs"
                      >
                        <option value="match">Match Synergy %</option>
                        <option value="rating">Average Rating ★</option>
                        <option value="bayesian">Bayesian Score</option>
                        <option value="pages">Shortest Reads</option>
                      </select>
                    </div>

                    {/* Grid / List View Toggle */}
                    <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          viewMode === 'list' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="Compact List View"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>

                {/* Recommendations Grid / List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
                    {sortedMatches.map((match, idx) => {
                      const isSaved = savedShelf.some(item => item.book.id === match.book.id);
                      const isInCompare = compareList.some(b => b.id === match.book.id);

                      return (
                        <BookCard
                          key={match.book.id}
                          match={match}
                          rank={idx + 1}
                          isSaved={isSaved}
                          isInCompare={isInCompare}
                          onToggleSave={handleToggleSave}
                          onToggleCompare={handleToggleCompare}
                          onOpenDetails={handleOpenDetails}
                          onPivotSeed={handlePivotSeed}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {sortedMatches.map((match, idx) => {
                      const p = match.book.palette;

                      return (
                        <div 
                          key={match.book.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 shadow-2xs flex items-center justify-between gap-4 transition-all"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div 
                              className="w-10 h-14 rounded-md p-1 flex-shrink-0 select-none flex flex-col justify-between"
                              style={{ backgroundColor: p.bg, border: `1px solid ${p.border}` }}
                            >
                              <span className="text-[7px] font-bold truncate block" style={{ color: p.text }}>★ {match.book.rating}</span>
                              <span className="text-[7px] font-black line-clamp-1" style={{ color: p.text }}>{match.book.shortTitle}</span>
                            </div>
                            <div className="min-w-0">
                              <h4 
                                onClick={() => handleOpenDetails(match.book, match)}
                                className="font-bold text-sm text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                              >
                                {match.book.title}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">by {match.book.authors}</p>
                              <p className="text-[11px] text-slate-600 italic truncate mt-0.5 max-w-lg">"{match.explanation}"</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                              {match.matchPercentage}% Match
                            </span>
                            <button
                              onClick={() => handlePivotSeed(match.book)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Pivot Seed
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TAB 2: AI VIBE LAB */}
        {activeTab === 'ai-lab' && (
          <div className="space-y-7">
            <AIVibeLabView
              onRunSemanticVibe={handleExecuteRetrieval}
              isLoading={isLoading}
            />

            {/* Results Grid if Generated */}
            {retrievalResult && (
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span>Atmospheric Vibe Matches ({sortedMatches.length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sortedMatches.map((match, idx) => (
                    <BookCard
                      key={match.book.id}
                      match={match}
                      rank={idx + 1}
                      isSaved={savedShelf.some(item => item.book.id === match.book.id)}
                      isInCompare={compareList.some(b => b.id === match.book.id)}
                      onToggleSave={handleToggleSave}
                      onToggleCompare={handleToggleCompare}
                      onOpenDetails={handleOpenDetails}
                      onPivotSeed={handlePivotSeed}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATALOG INTELLIGENCE */}
        {activeTab === 'analytics' && (
          <CatalogAnalyticsView onPivotSeed={handlePivotSeed} />
        )}

        {/* TAB 4: MY BOOKSHELF */}
        {activeTab === 'bookshelf' && (
          <BookshelfView
            savedItems={savedShelf}
            onRemoveItem={handleRemoveFromShelf}
            onChangeCategory={handleChangeShelfCategory}
            onPivotSeed={handlePivotSeed}
          />
        )}

      </main>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBookForDetails}
        match={selectedMatchForDetails}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isSaved={selectedBookForDetails ? savedShelf.some(item => item.book.id === selectedBookForDetails.id) : false}
        isInCompare={selectedBookForDetails ? compareList.some(b => b.id === selectedBookForDetails.id) : false}
        onToggleSave={handleToggleSave}
        onToggleCompare={handleToggleCompare}
        onPivotSeed={handlePivotSeed}
      />

      {/* Book Compare Modal */}
      <BookCompareModal
        books={compareList}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemoveBook={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
        onPivotSeed={handlePivotSeed}
      />

      {/* Modern Editorial Slate Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">Folio<span className="text-indigo-600">Mind</span></span>
            <span className="text-xs text-slate-400">• Multi-Vector Retrieval Engine</span>
          </div>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Engineered with Next.js, TypeScript, TF-IDF Vector Spaces, BM25 Lexical Inverted Indexing, and Bayesian Quality Regularization.
          </p>

          <p className="text-[11px] text-slate-400">
            Editorial Modern Studio Palette: Royal Indigo, Deep Slate, and Warm Amber.
          </p>
        </div>
      </footer>

    </div>
  );
}
