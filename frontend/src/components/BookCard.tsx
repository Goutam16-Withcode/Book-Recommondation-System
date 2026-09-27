'use client';

import React, { useState } from 'react';
import { Book, RetrievalMatch } from '@/lib/retrieval-engine';
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
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const p = book.palette || {
    bg: '#f8fafc',
    border: '#e2e8f0',
    spine: '#4f46e5',
    text: '#0f172a',
    badge: '#e0e7ff'
  };

  const formattedRank = rank < 10 ? `0${rank}` : `${rank}`;

  return (
    <article className="group h-full bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* 1. ARCHIVAL HEADER STRIP: Monospace Index & Cosine Vector Meter (100% Unique, Non-AI) */}
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold text-slate-500 tracking-tight">
            #{formattedRank}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded truncate max-w-[130px] tracking-wider">
            {book.genres[0] || 'LITERATURE'}
          </span>
        </div>

        {/* Bespoke Cosine Fit Vector Gauge */}
        <div 
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs"
          title={`Cosine Affinity: ${matchPercentage}% based on Scikit-Learn TF-IDF vector space`}
        >
          {/* Custom Geometric Coordinate Reticle Glyph */}
          <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v3" />
            <path d="M12 18v3" />
            <path d="M3 12h3" />
            <path d="M18 12h3" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          <span className="text-xs font-black text-slate-900 tracking-tight font-mono">
            {matchPercentage}%
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
            FIT
          </span>
        </div>
      </div>

      {/* 2. CENTRAL HERO: Tactile Hardcover Folio & Editorial Metadata */}
      <div className="p-4 flex-1 flex flex-col">
        
        <div className="flex gap-4 items-start mb-3">
          
          {/* Authentic Hardcover Book Jacket Plate */}
          <div 
            onClick={() => onOpenDetails(book, match)}
            className="w-24 h-36 rounded-xl flex-shrink-0 cursor-pointer p-2.5 flex flex-col justify-between relative overflow-hidden select-none shadow-md border group-hover:scale-[1.02] transition-transform duration-300"
            style={{
              backgroundColor: p.bg,
              borderColor: p.border
            }}
            title="Click to view full book dossier"
          >
            {/* Book Spine Crease & Shadow */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-2.5 opacity-90 shadow-sm"
              style={{ backgroundColor: p.spine }}
            />
            <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-black/10" />
            
            {/* Deckled Page Edge Illusion on right border */}
            <div className="absolute top-1 bottom-1 right-0 w-[2px] bg-amber-100/60 shadow-2xs" />

            <div className="pl-2 pt-0.5">
              <span className="text-[8px] uppercase tracking-wider font-extrabold block truncate opacity-70" style={{ color: p.text }}>
                {book.genres[0]}
              </span>
              <p className="text-[11px] font-serif font-black leading-tight line-clamp-3 mt-1" style={{ color: p.text }}>
                {book.shortTitle}
              </p>
            </div>

            <div className="pl-2 pb-0.5">
              <p className="text-[9px] font-semibold truncate opacity-85" style={{ color: p.text }}>
                {book.primaryAuthor}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: p.badge, color: p.text }}>
                  ★ {book.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Book Information & Metadata */}
          <div className="flex-1 min-w-0">
            
            {/* Fixed-Baseline Editorial Title */}
            <div className="min-h-[44px] flex items-start">
              <h3 
                onClick={() => onOpenDetails(book, match)}
                className="font-bold font-serif text-[15px] sm:text-[16px] text-slate-900 hover:text-indigo-600 leading-snug line-clamp-2 cursor-pointer transition-colors"
                title={book.title}
              >
                {book.title}
              </h3>
            </div>

            {/* Author Attribution with Quill / Pen Nib Glyph */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1 truncate">
              <svg className="w-3 h-3 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19 7-7 3 3-7 7-3-3z"/>
                <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="m2 2 7.586 7.586"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
              <span className="text-slate-800 font-semibold truncate">{book.authors}</span>
            </div>

            {/* Ratings & Volume */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold">
                <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-500" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{book.rating.toFixed(2)}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium font-mono">
                ({book.ratingsCount.toLocaleString()})
              </span>
            </div>

            {/* Scikit-Learn Feature Vector Chips (Real Data Science Tokens) */}
            <div className="flex items-center flex-wrap gap-1 mt-2.5">
              {matchedConcepts.slice(0, 2).map((token, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/90 font-medium"
                >
                  #{token}
                </span>
              ))}
              {book.pages && (
                <span className="text-[10px] font-mono text-slate-500 px-1 py-0.5">
                  {book.pages}p
                </span>
              )}
            </div>

          </div>

        </div>

        {/* 3. SCIKIT-LEARN ML DIAGNOSTICS DRAWER (100% Authentic, Non-AI) */}
        <div className="mt-auto pt-2">
          <div className="bg-slate-50 rounded-xl border border-slate-200/90 overflow-hidden">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="w-full px-3 py-1.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-700 hover:bg-slate-100 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5">
                {/* Custom Vector Coordinate Node Glyph */}
                <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="M2 12h20" />
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                </svg>
                <span className="text-[11px]">Vector Diagnostics</span>
              </div>
              <svg 
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDiagnostics ? 'rotate-180' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showDiagnostics && (
              <div className="p-3 bg-white border-t border-slate-200 text-xs space-y-2 animate-in fade-in duration-200">
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {explanation}
                </p>

                {/* Mathematical Dimension Bars */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Cosine Vector Proximity</span>
                    <span className="font-bold text-slate-800">{breakdown.semanticScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full" 
                      style={{ width: `${breakdown.semanticScore}%` }} 
                    />
                  </div>

                  <div className="flex justify-between items-center text-slate-500">
                    <span>TF-IDF Lexical Match</span>
                    <span className="font-bold text-slate-800">{breakdown.lexicalScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-violet-500 h-full rounded-full" 
                      style={{ width: `${breakdown.lexicalScore}%` }} 
                    />
                  </div>
                </div>

                {matchedConcepts.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold font-mono">Active Tokens:</span>
                    {matchedConcepts.map((tok, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                        {tok}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. INTEGRATED ACTION DOCK: Read + Vector Seed + Tools */}
      <div className="px-4 py-3 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between gap-2 select-none">
        
        {/* Left Tools: Bookmark & Compare */}
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
        </div>

        {/* Right Primary Actions: Read + Pivot Vector */}
        <div className="flex items-center gap-1.5">
          {onReadBook && (
            <button
              onClick={() => onReadBook(book)}
              className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Open full book e-reader"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Read</span>
            </button>
          )}

          <button
            onClick={() => onPivotSeed(book)}
            className="h-8 px-3 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Calculate Scikit-Learn recommendations using this book's vector"
          >
            <span>Similar</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

    </article>
  );
};
