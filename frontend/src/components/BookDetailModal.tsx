'use client';

import React from 'react';
import { Book, RetrievalMatch } from '@/lib/retrieval-engine';
import { 
  X, 
  Star, 
  Sparkles, 
  Clock, 
  Bookmark, 
  GitCompare, 
  ArrowRight, 
  Award,
  BookOpen
} from 'lucide-react';
import { ShelfCategory } from './BookshelfView';

interface BookDetailModalProps {
  book: Book | null;
  match?: RetrievalMatch | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isInCompare: boolean;
  onToggleSave: (book: Book, shelfCategory?: ShelfCategory) => void;
  onToggleCompare: (book: Book) => void;
  onPivotSeed: (book: Book) => void;
  onReadBook?: (book: Book) => void;
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
  onPivotSeed,
  onReadBook
}) => {
  if (!isOpen || !book) return null;

  const p = book.palette || {
    bg: '#eff6ff',
    border: '#bfdbfe',
    spine: '#2563eb',
    text: '#1e3a8a',
    badge: '#dbeafe'
  };

  const readingHours = Math.round(book.pages / 55);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        {/* Header accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400" />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              Folio Dossier
            </span>
            {book.series && (
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {book.series} {book.volume ? `#${book.volume}` : ''}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
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
              className="w-32 h-48 rounded-xl flex-shrink-0 p-3 flex flex-col justify-between relative overflow-hidden book-cover-3d select-none shadow-xl"
              style={{
                backgroundColor: p.bg,
                border: `2px solid ${p.border}`
              }}
            >
              <div className="book-spine-line" />
              <div 
                className="absolute top-0 bottom-0 left-0 w-3 opacity-90"
                style={{ backgroundColor: p.spine }}
              />

              <div className="pl-2 pt-1">
                <span className="text-[8px] uppercase tracking-wider font-extrabold block truncate opacity-75" style={{ color: p.text }}>
                  {book.genres[0]}
                </span>
                <p className="text-xs font-black leading-tight line-clamp-4 mt-1.5" style={{ color: p.text }}>
                  {book.shortTitle}
                </p>
              </div>

              <div className="pl-2 pb-1">
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
            <div className="flex-1 space-y-2.5 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {book.title}
              </h2>

              <p className="text-sm font-semibold text-slate-600">
                by <span className="text-slate-900 font-bold">{book.authors}</span>
              </p>

              {/* Quick Metrics Bar */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap pt-1">
                <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{book.rating.toFixed(2)} Avg</span>
                </div>

                <div className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-xs font-bold">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Bayesian Score: {book.bayesianScore}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>~{readingHours}h read ({book.pages} pages)</span>
                </div>
              </div>

              {/* Genre & Mood Tags */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap pt-1">
                {book.genres.map((g, i) => (
                  <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {g}
                  </span>
                ))}
                {book.moods.map((m, i) => (
                  <span key={i} className="text-xs font-medium bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {m}
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* Match Retrieval Breakdown if Opened From Search */}
          {match && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Retrieval Affinity Score Breakdown
                  </span>
                </div>
                <span className="text-sm font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                  {match.matchPercentage}% Total Match
                </span>
              </div>

              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{match.explanation}"
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Semantic Vector Cosine</span>
                    <span className="font-bold text-indigo-700">{match.breakdown.semanticScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${match.breakdown.semanticScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>BM25 Keyword Density</span>
                    <span className="font-bold text-indigo-700">{match.breakdown.lexicalScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-600 rounded-full" style={{ width: `${match.breakdown.lexicalScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Author & Lore Affinity</span>
                    <span className="font-bold text-indigo-700">{match.breakdown.authorAffinity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-600 rounded-full" style={{ width: `${match.breakdown.authorAffinity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Quality Bayesian Confidence</span>
                    <span className="font-bold text-indigo-700">{match.breakdown.qualityBoost}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${match.breakdown.qualityBoost}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Book Synopsis & Themes */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Thematic Essence & Atmosphere
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This work stands prominently within <strong className="text-slate-900">{book.genres.join(' and ')}</strong>, recognized for its <strong className="text-indigo-800">{book.moods.join(' & ')}</strong> cadence. With over {book.ratingsCount.toLocaleString()} community reviews, it reflects enduring resonance across literary circles.
            </p>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(book, 'Want to Read')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'In Bookshelf' : 'Add to Shelf'}</span>
            </button>

            <button
              onClick={() => onToggleCompare(book)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isInCompare
                  ? 'bg-violet-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>{isInCompare ? 'In Comparison' : 'Compare'}</span>
            </button>

            {onReadBook && (
              <button
                onClick={() => {
                  onReadBook(book);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Full Book</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onPivotSeed(book);
              onClose();
            }}
            className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Set as Seed & Find Similar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
