'use client';

import React, { useState } from 'react';
import { Book, RetrievalMatch } from '@/lib/retrieval-engine';
import { 
  Star, 
  Bookmark, 
  Info, 
  GitCompare, 
  Sparkles, 
  BookMarked, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ShelfCategory } from './BookshelfView';

interface BookCardProps {
  match: RetrievalMatch;
  rank: number;
  isSaved: boolean;
  isInCompare: boolean;
  onToggleSave: (book: Book, shelfCategory?: ShelfCategory) => void;
  onToggleCompare: (book: Book) => void;
  onOpenDetails: (book: Book, match?: RetrievalMatch) => void;
  onPivotSeed: (book: Book) => void;
  onReadBook?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  match,
  rank,
  isSaved,
  isInCompare,
  onToggleSave,
  onToggleCompare,
  onOpenDetails,
  onPivotSeed,
  onReadBook
}) => {
  const { book, matchPercentage, breakdown, matchedConcepts, explanation } = match;
  const [showExplanation, setShowExplanation] = useState(false);

  const p = book.palette || {
    bg: '#eff6ff',
    border: '#bfdbfe',
    spine: '#2563eb',
    text: '#1e3a8a',
    badge: '#dbeafe'
  };

  return (
    <div className="group h-full bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Top subtle highlight line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Main card body */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header: Rank, Series & Match Score */}
        <div className="flex items-center justify-between gap-2 mb-3.5 h-7">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[11px] flex items-center justify-center border border-slate-200/90 flex-shrink-0">
              #{rank}
            </span>
            {book.series ? (
              <span className="text-[11px] font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full truncate max-w-[130px]" title={book.series}>
                {book.series} {book.volume ? `#${book.volume}` : ''}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full">
                Standalone
              </span>
            )}
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 shadow-2xs flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-black text-indigo-900 tracking-tight">
              {matchPercentage}% Match
            </span>
          </div>
        </div>

        {/* Book Cover + Title Section */}
        <div className="flex gap-4 items-start mb-3">
          
          {/* 3D-styled Editorial Book Cover */}
          <div 
            onClick={() => onOpenDetails(book, match)}
            className="w-24 h-36 rounded-xl flex-shrink-0 cursor-pointer p-2.5 flex flex-col justify-between relative overflow-hidden book-cover-3d select-none shadow-xs"
            style={{
              backgroundColor: p.bg,
              border: `1.5px solid ${p.border}`
            }}
          >
            <div className="book-spine-line" />
            
            {/* Spine strip */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-2.5 opacity-90"
              style={{ backgroundColor: p.spine }}
            />

            <div className="pl-2 pt-0.5">
              <span className="text-[8px] uppercase tracking-wider font-extrabold block truncate opacity-75" style={{ color: p.text }}>
                {book.genres[0] || 'Edition'}
              </span>
              <p className="text-[11px] font-black leading-tight line-clamp-3 mt-1" style={{ color: p.text }}>
                {book.shortTitle}
              </p>
            </div>

            <div className="pl-2 pb-0.5">
              <p className="text-[9px] font-semibold truncate opacity-85" style={{ color: p.text }}>
                {book.primaryAuthor}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: p.badge, color: p.text }}>
                  ★ {book.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Book Info Text */}
          <div className="flex-1 min-w-0">
            {/* Title with standardized minimum height so cards align */}
            <div className="min-h-[44px] flex items-start">
              <h3 
                onClick={() => onOpenDetails(book, match)}
                className="font-bold text-[14px] sm:text-[15px] text-slate-900 hover:text-indigo-600 leading-snug line-clamp-2 cursor-pointer transition-colors"
                title={book.title}
              >
                {book.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 font-medium mt-1 truncate">
              by <span className="text-slate-900 font-semibold">{book.authors}</span>
            </p>

            {/* Ratings & Quality Meta */}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{book.rating.toFixed(2)}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                ({book.ratingsCount.toLocaleString()} ratings)
              </span>
            </div>

            {/* Genre and Mood Tags */}
            <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
              {book.genres.slice(0, 2).map((genre, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80"
                >
                  {genre}
                </span>
              ))}
              {book.moods[0] && (
                <span className="text-[10px] font-medium bg-indigo-50/70 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-100">
                  {book.moods[0]}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Explainability Accordion Box */}
        <div className="mt-auto pt-2">
          <div className="bg-slate-50/90 rounded-xl border border-slate-200/90 overflow-hidden">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Why Recommended?</span>
              </div>
              {showExplanation ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {showExplanation && (
              <div className="p-3 pt-1 border-t border-slate-200 text-xs space-y-2 bg-white">
                <p className="text-slate-700 leading-relaxed italic text-[11px]">
                  "{explanation}"
                </p>

                {/* Progress metrics */}
                <div className="space-y-1.5 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                      <span>Semantic & Theme Vector</span>
                      <span className="font-bold text-indigo-700">{breakdown.semanticScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: `${breakdown.semanticScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                      <span>BM25 Keyword Density</span>
                      <span className="font-bold text-indigo-700">{breakdown.lexicalScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                        style={{ width: `${breakdown.lexicalScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                      <span>Author / Lore Affinity</span>
                      <span className="font-bold text-indigo-700">{breakdown.authorAffinity}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                        style={{ width: `${breakdown.authorAffinity}%` }}
                      />
                    </div>
                  </div>
                </div>

                {matchedConcepts.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold">Matched Tokens:</span>
                    {matchedConcepts.map((tok, i) => (
                      <span key={i} className="text-[9px] bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded font-mono border border-indigo-100">
                        #{tok}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Card Action Footer: Standardized button sizes & clean alignment */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 h-11">
        
        {/* Left actions: Bookshelf, Compare, Details */}
        <div className="flex items-center gap-1.5">
          
          <button
            onClick={() => onToggleSave(book, 'Want to Read')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isSaved
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
            }`}
            title={isSaved ? "Saved in your Bookshelf" : "Save to Bookshelf"}
          >
            {isSaved ? <BookMarked className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleCompare(book)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isInCompare
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-700 border border-slate-200'
            }`}
            title={isInCompare ? "Remove from Compare" : "Add to Side-by-side Compare"}
          >
            <GitCompare className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenDetails(book, match)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            title="View Full Book Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {onReadBook && (
            <button
              onClick={() => onReadBook(book)}
              className="h-9 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 transition-all cursor-pointer shadow-2xs"
              title="Open Book Reader"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read</span>
            </button>
          )}

        </div>

        {/* Right Action: Pivot Seed */}
        <button
          onClick={() => onPivotSeed(book)}
          className="h-9 px-3.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xs shadow-indigo-600/20 flex items-center gap-1.5 group/pivot cursor-pointer"
        >
          <span>Find Similar</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/pivot:translate-x-0.5 transition-transform" />
        </button>

      </div>

    </div>
  );
};
