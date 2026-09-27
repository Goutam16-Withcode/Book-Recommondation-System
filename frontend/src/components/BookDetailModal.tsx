'use client';

import React from 'react';
import { Book, RetrievalMatch } from '@/lib/retrieval-engine';
import { 
  X, 
  Star, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Bookmark, 
  GitCompare, 
  ArrowRight, 
  Layers,
  Award,
  Share2,
  Check
} from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  match?: RetrievalMatch | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isInCompare: boolean;
  onToggleSave: (book: Book, shelfCategory?: string) => void;
  onToggleCompare: (book: Book) => void;
  onPivotSeed: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  match,
  isOpen,
  onClose,
  isSaved,
  isInCompare,
  onToggleSave,
  onToggleCompare,
  onPivotSeed
}) => {
  if (!isOpen || !book) return null;

  const p = book.palette || {
    bg: '#f0fdf4',
    border: '#a7f3d0',
    spine: '#10b981',
    text: '#064e3b',
    badge: '#d1fae5'
  };

  const readingHours = Math.round(book.pages / 55);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-fadeIn">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        {/* Header accent strip */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-[#e8f5ed] border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Folio Intelligence Dossier
            </span>
            {book.series && (
              <span className="text-[11px] font-semibold text-[#30533f] bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                {book.series} {book.volume ? `#${book.volume}` : ''}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main Book Presentation */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            
            {/* Large 3D Book Cover Presentation */}
            <div 
              className="w-36 h-52 rounded-2xl flex-shrink-0 p-3.5 flex flex-col justify-between relative overflow-hidden book-cover-3d select-none shadow-xl"
              style={{
                backgroundColor: p.bg,
                border: `2px solid ${p.border}`
              }}
            >
              <div className="book-spine-line" />
              <div 
                className="absolute top-0 bottom-0 left-0 w-3.5 opacity-90"
                style={{ backgroundColor: p.spine }}
              />

              <div className="pl-3 pt-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold block truncate opacity-75" style={{ color: p.text }}>
                  {book.genres[0]}
                </span>
                <p className="text-xs font-black leading-tight line-clamp-4 mt-1.5" style={{ color: p.text }}>
                  {book.shortTitle}
                </p>
              </div>

              <div className="pl-3 pb-1">
                <p className="text-[10px] font-semibold truncate opacity-85" style={{ color: p.text }}>
                  {book.primaryAuthor}
                </p>
                <div className="mt-1">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: p.badge, color: p.text }}>
                    ★ {book.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black text-[#0f2a1e] leading-snug">
                {book.title}
              </h2>

              <p className="text-sm font-semibold text-[#486b57]">
                Written by <span className="text-[#102d20] font-bold">{book.authors}</span>
              </p>

              {/* Quick Metrics Bar */}
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap pt-1">
                <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{book.rating.toFixed(2)} Avg</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 text-xs font-bold">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Bayesian Score: {book.bayesianScore}</span>
                </div>

                <div className="flex items-center gap-1 text-[#41604f] bg-[#f0f6f2] px-2.5 py-1 rounded-xl border border-[#d6e5dc] text-xs font-medium">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>~{readingHours}h read ({book.pages} pages)</span>
                </div>
              </div>

              {/* Genre & Mood Tags */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap pt-1">
                {book.genres.map((g, i) => (
                  <span key={i} className="text-xs font-semibold bg-emerald-100/70 text-emerald-900 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {g}
                  </span>
                ))}
                {book.moods.map((m, i) => (
                  <span key={i} className="text-xs font-medium bg-[#f0fcf6] text-teal-900 px-2.5 py-0.5 rounded-lg border border-teal-200">
                    {m}
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* Match Retrieval Breakdown if Opened From Search */}
          {match && (
            <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    Retrieval Affinity Score Breakdown
                  </span>
                </div>
                <span className="text-sm font-black text-emerald-800 bg-white px-2.5 py-0.5 rounded-xl border border-emerald-300">
                  {match.matchPercentage}% Total Synergy
                </span>
              </div>

              <p className="text-xs text-[#2c4d3b] italic leading-relaxed">
                "{match.explanation}"
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#52705e] mb-1">
                    <span>Semantic Cosine Vector</span>
                    <span className="font-bold text-emerald-800">{match.breakdown.semanticScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${match.breakdown.semanticScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#52705e] mb-1">
                    <span>BM25 Lexical Keyword</span>
                    <span className="font-bold text-emerald-800">{match.breakdown.lexicalScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${match.breakdown.lexicalScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#52705e] mb-1">
                    <span>Author & Universe Affinity</span>
                    <span className="font-bold text-emerald-800">{match.breakdown.authorAffinity}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: `${match.breakdown.authorAffinity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#52705e] mb-1">
                    <span>Quality Bayesian Confidence</span>
                    <span className="font-bold text-emerald-800">{match.breakdown.qualityBoost}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${match.breakdown.qualityBoost}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Book Synopsis & Themes */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#143324]">
              Thematic Essence & Atmosphere
            </h4>
            <p className="text-xs sm:text-sm text-[#3b5947] leading-relaxed">
              This work stands prominently within <strong className="text-[#0f291e]">{book.genres.join(' and ')}</strong>, recognized for its <strong className="text-emerald-800">{book.moods.join(' & ')}</strong> cadence. With over {book.ratingsCount.toLocaleString()} community reviews, it reflects enduring resonance across literary circles.
            </p>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-[#f8faf8] border-t border-[#e2ece5] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(book, 'Want to Read')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'In Bookshelf' : 'Add to Shelf'}</span>
            </button>

            <button
              onClick={() => onToggleCompare(book)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isInCompare
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white hover:bg-teal-50 text-teal-800 border border-teal-300'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>{isInCompare ? 'In Comparison' : 'Compare'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onPivotSeed(book);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Set as Seed & Find Similar Books</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
