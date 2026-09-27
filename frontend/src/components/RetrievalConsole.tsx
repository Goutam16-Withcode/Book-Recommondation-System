'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Book, RetrievalParams } from '@/lib/retrieval-engine';
import { 
  Search, 
  Sparkles, 
  Sliders, 
  Filter, 
  X, 
  RefreshCw, 
  Zap, 
  BookOpen, 
  ArrowRight,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RetrievalConsoleProps {
  onExecuteRetrieval: (params: RetrievalParams) => void;
  isLoading: boolean;
  activeSeedBook: Book | null;
  setActiveSeedBook: (book: Book | null) => void;
  initialQuery?: string;
}

const PRESET_SEEDS = [
  { id: '1', title: 'Harry Potter and the Half-Blood Prince', author: 'J.K. Rowling', tag: 'Fantasy / Magic' },
  { id: '12', title: 'The Ultimate Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', tag: 'Sci-Fi Comedy' },
  { id: '34', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', tag: 'High Fantasy' },
  { id: '10', title: 'Harry Potter Collection', author: 'J.K. Rowling', tag: 'Series' }
];

const GENRE_OPTIONS = [
  'Fantasy',
  'Science Fiction',
  'Mystery & Thriller',
  'Classics',
  'Philosophy & Thought',
  'Romance',
  'History & Biography',
  'Horror & Supernatural'
];

const MOOD_OPTIONS = [
  'Whimsical & Magical',
  'Epic & Grand',
  'Dark & Gripping',
  'Thought-Provoking & Deep',
  'Heartwarming & Cozy',
  'Fast-Paced & Thrilling'
];

export const RetrievalConsole: React.FC<RetrievalConsoleProps> = ({
  onExecuteRetrieval,
  isLoading,
  activeSeedBook,
  setActiveSeedBook,
  initialQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [autocompleteResults, setAutocompleteResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAdvancedTuning, setShowAdvancedTuning] = useState(false);

  // Retrieval Engine Weights & Hyperparameters
  const [weights, setWeights] = useState({
    semantic: 0.35,
    lexical: 0.30,
    authorBonus: 0.20,
    qualityBonus: 0.15,
    diversity: 0.65
  });

  const [minRating, setMinRating] = useState<number>(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [maxResults, setMaxResults] = useState<number>(12);
  const [enginePreset, setEnginePreset] = useState<'balanced' | 'continuity' | 'thematic' | 'critical' | 'diverse'>('balanced');

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete fetcher with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setAutocompleteResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setAutocompleteResults(data);
          setDropdownOpen(true);
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle preset engine weight configurations
  const applyPreset = (preset: typeof enginePreset) => {
    setEnginePreset(preset);
    switch (preset) {
      case 'balanced':
        setWeights({ semantic: 0.35, lexical: 0.30, authorBonus: 0.20, qualityBonus: 0.15, diversity: 0.65 });
        break;
      case 'continuity':
        setWeights({ semantic: 0.20, lexical: 0.20, authorBonus: 0.45, qualityBonus: 0.15, diversity: 0.40 });
        break;
      case 'thematic':
        setWeights({ semantic: 0.50, lexical: 0.25, authorBonus: 0.10, qualityBonus: 0.15, diversity: 0.70 });
        break;
      case 'critical':
        setWeights({ semantic: 0.25, lexical: 0.25, authorBonus: 0.15, qualityBonus: 0.35, diversity: 0.55 });
        break;
      case 'diverse':
        setWeights({ semantic: 0.30, lexical: 0.30, authorBonus: 0.10, qualityBonus: 0.10, diversity: 0.90 });
        break;
    }
  };

  const handleSelectBook = (book: Book) => {
    setActiveSeedBook(book);
    setSearchQuery('');
    setDropdownOpen(false);
    onExecuteRetrieval({
      seedBookId: book.id,
      weights,
      minRating,
      genres: selectedGenres,
      moods: selectedMoods,
      maxResults
    });
  };

  const handleRunRetrieval = () => {
    onExecuteRetrieval({
      seedBookId: activeSeedBook ? activeSeedBook.id : undefined,
      query: searchQuery.trim() || undefined,
      weights,
      minRating,
      genres: selectedGenres,
      moods: selectedMoods,
      maxResults
    });
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-extrabold text-slate-800">
            Multi-Vector Retrieval Console
          </span>
        </div>

        {/* Engine Tuning Toggle */}
        <button
          onClick={() => setShowAdvancedTuning(!showAdvancedTuning)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showAdvancedTuning
              ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          <span>{showAdvancedTuning ? 'Hide Parameters' : 'Tune Retrieval Engine'}</span>
          {showAdvancedTuning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Seed Selector & Search Bar */}
      <div className="space-y-3.5">
        
        {/* Active Seed Book Banner if Selected */}
        {activeSeedBook && (
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                <BookOpen className="w-4 h-4 text-indigo-100" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-200 text-indigo-900 px-2 py-0.2 rounded-full">
                    Anchor Seed Book
                  </span>
                  <span className="text-xs font-bold text-amber-700">★ {activeSeedBook.rating}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 truncate mt-0.5">
                  {activeSeedBook.title}
                </h4>
                <p className="text-xs text-slate-600 truncate">
                  by {activeSeedBook.authors}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSeedBook(null)}
              className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer flex-shrink-0"
              title="Clear Seed Book"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Container */}
        <div ref={searchBoxRef} className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-indigo-600 absolute left-4.5 pointer-events-none" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (autocompleteResults.length > 0) setDropdownOpen(true);
              }}
              placeholder={activeSeedBook 
                ? "Refine with keywords (e.g. 'magic academy', 'philosophical', 'humor')..." 
                : "Search across 11,127 books or type a theme (e.g. 'Harry Potter', 'Hitchhiker', 'Dune')..."
              }
              className="w-full pl-12 pr-32 py-3.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white focus:outline-none text-slate-900 placeholder-slate-400 text-sm font-medium transition-all shadow-inner"
            />

            {/* Clear button if text */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-30 p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Run Button Inside Bar */}
            <button
              onClick={handleRunRetrieval}
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-white" />
              )}
              <span className="hidden sm:inline">Retrieve</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {dropdownOpen && autocompleteResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto">
              <div className="p-2.5 bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Select a Book as Seed:</span>
                <span className="text-[10px] text-slate-500 font-normal">{autocompleteResults.length} matches</span>
              </div>
              {autocompleteResults.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className="p-3 hover:bg-indigo-50/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div 
                      className="w-8 h-10 rounded flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: book.palette.bg, color: book.palette.text, border: `1px solid ${book.palette.border}` }}
                    >
                      ★ {book.rating}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{book.title}</p>
                      <p className="text-xs text-slate-500 truncate">by {book.authors}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                      {book.genres[0] || 'Fiction'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Sample Seed Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-slate-600 font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Quick Seeds:</span>
          </span>
          {PRESET_SEEDS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                const bookMock: Book = {
                  id: preset.id,
                  numId: parseInt(preset.id),
                  title: preset.title,
                  shortTitle: preset.title,
                  authors: preset.author,
                  authorsList: [preset.author],
                  primaryAuthor: preset.author,
                  rating: 4.5,
                  ratingsCount: 15000,
                  bayesianScore: 4.4,
                  series: null,
                  volume: null,
                  genres: ['Fantasy'],
                  moods: ['Whimsical & Magical'],
                  pages: 350,
                  palette: { bg: '#eff6ff', border: '#bfdbfe', spine: '#2563eb', text: '#1e3a8a', badge: '#dbeafe' },
                  tokens: preset.title.toLowerCase().split(' ')
                };
                handleSelectBook(bookMock);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 font-medium transition-all cursor-pointer"
            >
              {preset.title.slice(0, 24)}...
            </button>
          ))}
        </div>

      </div>

      {/* Advanced Algorithm Parameters Drawer */}
      {showAdvancedTuning && (
        <div className="mt-5 pt-5 border-t border-slate-200 space-y-4">
          
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Algorithmic Retrieval Strategy Presets:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'balanced', label: '⚖️ Balanced Hybrid', desc: 'Standard blend' },
                { id: 'continuity', label: '🔗 Series Continuity', desc: 'Author & Lore focus' },
                { id: 'thematic', label: '✨ Deep Thematic', desc: 'Vector cosine bias' },
                { id: 'critical', label: '⭐ Critical Acclaim', desc: 'Bayesian rating boost' },
                { id: 'diverse', label: '🌐 High Diversity', desc: 'MMR Serendipity' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    enginePreset === p.id
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 hover:bg-indigo-50/50 text-slate-700 border-slate-200'
                  }`}
                >
                  <p className="font-bold text-xs truncate">{p.label}</p>
                  <p className={`text-[10px] truncate ${enginePreset === p.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            
            {/* Semantic Vector Weight */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Semantic Theme Weight</span>
                <span className="text-indigo-600">{Math.round(weights.semantic * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.semantic}
                onChange={(e) => setWeights({ ...weights, semantic: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Captures latent themes, narrative mood & concepts.</p>
            </div>

            {/* Lexical BM25 Weight */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Lexical BM25 Exactness</span>
                <span className="text-indigo-600">{Math.round(weights.lexical * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.lexical}
                onChange={(e) => setWeights({ ...weights, lexical: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Rewards exact terminology, names & keywords.</p>
            </div>

            {/* Author & Universe Affinity */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Author & Universe Affinity</span>
                <span className="text-indigo-600">{Math.round(weights.authorBonus * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.authorBonus}
                onChange={(e) => setWeights({ ...weights, authorBonus: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Boosts shared series, volumes, and author bibliography.</p>
            </div>

            {/* Quality Bayesian Bias */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Quality Bayesian Regularization</span>
                <span className="text-indigo-600">{Math.round(weights.qualityBonus * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.qualityBonus}
                onChange={(e) => setWeights({ ...weights, qualityBonus: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Protects against obscure low-sample outliers.</p>
            </div>

            {/* MMR Diversity Factor */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>MMR Catalogue Diversity (λ)</span>
                <span className="text-indigo-600">{Math.round(weights.diversity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={weights.diversity}
                onChange={(e) => setWeights({ ...weights, diversity: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">High = diversified genres; Low = strict clones.</p>
            </div>

            {/* Number of Books */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Candidate Pool Size</span>
                <span className="text-indigo-600">{maxResults} Books</span>
              </div>
              <input
                type="range"
                min="6"
                max="30"
                step="6"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Top-K retrieved books returned to grid.</p>
            </div>

          </div>

          {/* Genre & Mood Filter Pills */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1.5">Filter by Genres:</span>
              <div className="flex flex-wrap gap-1.5">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedGenres.includes(g)
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
                {selectedGenres.length > 0 && (
                  <button 
                    onClick={() => setSelectedGenres([])}
                    className="text-xs text-red-600 hover:underline px-2 py-1 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1.5">Filter by Mood & Tone:</span>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleMood(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedMoods.includes(m)
                        ? 'bg-violet-700 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-violet-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                {selectedMoods.length > 0 && (
                  <button 
                    onClick={() => setSelectedMoods([])}
                    className="text-xs text-red-600 hover:underline px-2 py-1 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Apply & Re-run */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleRunRetrieval}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Apply Parameters & Run Retrieval</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
