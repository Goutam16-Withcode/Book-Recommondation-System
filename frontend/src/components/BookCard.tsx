'use client';

import React, { useState } from 'react';
import { Book, RetrievalMatch } from '@/lib/retrieval-engine';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
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

  const formattedRank = rank < 10 ? `0${rank}` : `${rank}`;

  return (
    <div className="group h-full bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Card Header Strip: Clean Editorial Indexing & Bespoke Affinity Meter */}
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold text-slate-500 tracking-tight">
            #{formattedRank}
          </span>
          {book.series ? (
            <span className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded truncate max-w-[130px]" title={book.series}>
              {book.series} {book.volume ? `#${book.volume}` : ''}
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {book.genres[0] || 'Edition'}
            </span>
          )}
        </div>

        {/* Bespoke Precision Affinity Meter (NO generic AI sparkles!) */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
          {/* Custom Geometric Target Reticle Glyph */}
          <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v3" />
            <path d="M12 18v3" />
            <path d="M3 12h3" />
            <path d="M18 12h3" />
          </svg>
          <span className="text-xs font-black text-slate-900 tracking-tight font-mono">
            {matchPercentage}%
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
            Synergy
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Book Jacket & Metadata Row */}
        <div className="flex gap-4 items-start mb-3">
          
          {/* Tangible Book Jacket Presentation */}
          <div 
            onClick={() => onOpenDetails(book, match)}
            className="w-24 h-36 rounded-xl flex-shrink-0 cursor-pointer p-2.5 flex flex-col justify-between relative overflow-hidden book-cover-3d select-none shadow-xs border"
            style={{
              backgroundColor: p.bg,
              borderColor: p.border
            }}
          >
            {/* Book spine texture crease */}
            <div className="book-spine-line" />
            <div 
              className="absolute top-0 bottom-0 left-0 w-2.5 opacity-90"
              style={{ backgroundColor: p.spine }}
            />

            <div className="pl-2 pt-0.5">
              <span className="text-[8px] uppercase tracking-wider font-extrabold block truncate opacity-75" style={{ color: p.text }}>
                {book.genres[0]}
              </span>
              <p className="text-[11px] font-black leading-tight line-clamp-3 mt-1" style={{ color: p.text }}>
                {book.shortTitle}
              </p>
            </div>

            <div className="pl-2 pb-0.5">
              <p className="text-[9px] font-semibold truncate opacity-85" style={{ color: p.text }}>
                {book.primaryAuthor}
              </p>
              <div className="mt-1">
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: p.badge, color: p.text }}>
                  ★ {book.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Book Information Text */}
          <div className="flex-1 min-w-0">
            {/* Standardized Title Box */}
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

            {/* Ratings & Consensus */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{book.rating.toFixed(2)}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                ({book.ratingsCount.toLocaleString()})
              </span>
            </div>

            {/* Clean Category Chips */}
            <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
              {book.genres.slice(0, 2).map((genre, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/80"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bespoke Retrieval Rationale Box (NO generic AI sparkles!) */}
        <div className="mt-auto pt-2">
          <div className="bg-slate-50 rounded-xl border border-slate-200/90 overflow-hidden">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full px-3 py-1.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                {/* Clean Custom Link / Network Node Glyph */}
                <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span>Retrieval Rationale</span>
              </div>
              {showExplanation ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
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
                      <span>Semantic Theme Vector</span>
                      <span className="font-bold text-indigo-700">{breakdown.semanticScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${breakdown.semanticScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                      <span>BM25 Inverted Index Match</span>
                      <span className="font-bold text-indigo-700">{breakdown.lexicalScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-600 rounded-full"
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
                        className="h-full bg-violet-600 rounded-full"
                        style={{ width: `${breakdown.authorAffinity}%` }}
                      />
                    </div>
                  </div>
                </div>

                {matchedConcepts.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold">Matched Tokens:</span>
                    {matchedConcepts.map((tok, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono border border-slate-200">
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

      {/* Integrated Action Dock */}
      <div className="px-4 py-3 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between gap-2">
        
        {/* Left Tools: Bookmark, Compare, Info */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleSave(book, 'Want to Read')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isSaved
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
            title={isSaved ? "Saved in Bookshelf" : "Bookmark to Shelf"}
          >
            {/* Custom Ribbon Glyph */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </button>

          <button
            onClick={() => onToggleCompare(book)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isInCompare
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
            title={isInCompare ? "Remove from Compare" : "Side-by-Side Compare"}
          >
            {/* Custom Balance Scales Glyph */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" />
              <path d="M12 3v18" />
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </button>

          <button
            onClick={() => onOpenDetails(book, match)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            title="Book Dossier & Metadata"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
        </div>

        {/* Right Primary Actions: Read + Pivot Seed */}
        <div className="flex items-center gap-1.5">
          {onReadBook && (
            <button
              onClick={() => onReadBook(book)}
              className="h-8 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Read Full Book Chapters"
            >
              <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Read</span>
            </button>
          )}

          <button
            onClick={() => onPivotSeed(book)}
            className="h-8 px-3 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Re-anchor recommendations with this seed"
          >
            <span>Similar</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  );
};
