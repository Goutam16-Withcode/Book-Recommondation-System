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
  Layers, 
  BookOpen,
  ArrowRight,
  Check
} from 'lucide-react';

interface BookCardProps {
  match: RetrievalMatch;
  rank: number;
  isSaved: boolean;
  isInCompare: boolean;
  onToggleSave: (book: Book, shelfCategory?: string) => void;
  onToggleCompare: (book: Book) => void;
  onOpenDetails: (book: Book, match?: RetrievalMatch) => void;
  onPivotSeed: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  match,
  rank,
  isSaved,
  isInCompare,
  onToggleSave,
  onToggleCompare,
  onOpenDetails,
  onPivotSeed
}) => {
  const { book, matchPercentage, breakdown, matchedConcepts, explanation } = match;
  const [showExplanation, setShowExplanation] = useState(false);
  const [shelfMenuOpen, setShelfMenuOpen] = useState(false);

  // Fallback cover gradient
  const p = book.palette || {
    bg: '#f0fdf4',
    border: '#a7f3d0',
    spine: '#10b981',
    text: '#064e3b',
    badge: '#d1fae5'
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#dce8df] hover:border-emerald-400 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Main card body */}
      <div>
        {/* Top Header: Rank, Match Score & Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100/90 text-emerald-800 font-extrabold text-xs flex items-center justify-center border border-emerald-200">
              #{rank}
            </span>
            {book.series && (
              <span className="text-[11px] font-semibold text-emerald-800 bg-[#ecfdf5] border border-emerald-200/80 px-2 py-0.5 rounded-full truncate max-w-[130px]">
                {book.series} {book.volume ? `#${book.volume}` : ''}
              </span>
            )}
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-black text-emerald-900 tracking-tight">
              {matchPercentage}% Match
            </span>
          </div>
        </div>

        {/* Book Cover + Title Section */}
        <div className="flex gap-4 items-start mb-4">
          
          {/* 3D-styled Artistic Book Cover */}
          <div 
            onClick={() => onOpenDetails(book, match)}
            className="w-22 h-32 rounded-xl flex-shrink-0 cursor-pointer p-2 flex flex-col justify-between relative overflow-hidden book-cover-3d select-none"
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

            <div className="pl-2 pt-1">
              <span className="text-[8px] uppercase tracking-wider font-bold block truncate opacity-75" style={{ color: p.text }}>
                {book.genres[0] || 'Folio'}
              </span>
              <p className="text-[11px] font-bold leading-tight line-clamp-3 mt-1" style={{ color: p.text }}>
                {book.shortTitle}
              </p>
            </div>

            <div className="pl-2 pb-1">
              <p className="text-[9px] font-medium truncate opacity-85" style={{ color: p.text }}>
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
            <h3 
              onClick={() => onOpenDetails(book, match)}
              className="font-bold text-base text-[#112d20] hover:text-emerald-700 leading-snug line-clamp-2 cursor-pointer transition-colors"
              title={book.title}
            >
              {book.title}
            </h3>

            <p className="text-xs text-[#52705e] font-medium mt-1 truncate">
              by <span className="text-[#132a1c] font-semibold">{book.authors}</span>
            </p>

            {/* Ratings & Quality Meta */}
            <div className="flex items-center flex-wrap gap-2 mt-2.5">
              <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{book.rating.toFixed(2)}</span>
              </div>
              <span className="text-[11px] text-[#698875] font-medium">
                ({book.ratingsCount.toLocaleString()} ratings)
              </span>
            </div>

            {/* Genre and Mood Tags */}
            <div className="flex items-center flex-wrap gap-1.5 mt-3">
              {book.genres.slice(0, 2).map((genre, idx) => (
                <span 
                  key={idx}
                  className="text-[11px] font-medium bg-[#f0fdf4] text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100"
                >
                  {genre}
                </span>
              ))}
              {book.moods[0] && (
                <span className="text-[10px] font-medium bg-[#fafcfb] text-[#52705e] px-2 py-0.5 rounded-md border border-gray-200">
                  {book.moods[0]}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Explainability Accordion */}
        <div className="mt-2 bg-[#f9fbf9] rounded-2xl border border-[#e5eee7] overflow-hidden">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-[#3b5847] hover:text-emerald-800 hover:bg-emerald-50/50 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Why Recommended?</span>
            </div>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showExplanation && (
            <div className="p-3.5 pt-1 border-t border-[#e8f1ea] text-xs space-y-2.5">
              <p className="text-[#3b5847] leading-relaxed italic">
                "{explanation}"
              </p>

              {/* Progress metrics */}
              <div className="space-y-1.5 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#52705e] mb-0.5">
                    <span>Semantic & Theme Alignment</span>
                    <span className="font-bold text-emerald-800">{breakdown.semanticScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                      style={{ width: `${breakdown.semanticScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#52705e] mb-0.5">
                    <span>Lexical Keyword Density</span>
                    <span className="font-bold text-emerald-800">{breakdown.lexicalScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
                      style={{ width: `${breakdown.lexicalScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#52705e] mb-0.5">
                    <span>Author / Universe Affinity</span>
                    <span className="font-bold text-emerald-800">{breakdown.authorAffinity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                      style={{ width: `${breakdown.authorAffinity}%` }}
                    />
                  </div>
                </div>
              </div>

              {matchedConcepts.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  <span className="text-[10px] text-[#698875] font-semibold">Matched Tokens:</span>
                  {matchedConcepts.map((tok, i) => (
                    <span key={i} className="text-[10px] bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                      #{tok}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-3 border-t border-[#edf4ef] flex items-center justify-between gap-2">
        
        {/* Left actions: Bookshelf & Compare */}
        <div className="flex items-center gap-1.5 relative">
          
          <button
            onClick={() => onToggleSave(book, 'Want to Read')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#f0fdf4] text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title={isSaved ? "Saved in your Bookshelf" : "Save to Bookshelf"}
          >
            {isSaved ? <BookMarked className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleCompare(book)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              isInCompare
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-[#f4f8f5] text-[#415e4d] hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200'
            }`}
            title={isInCompare ? "Remove from Compare" : "Add to Side-by-side Compare"}
          >
            <GitCompare className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenDetails(book, match)}
            className="p-2 rounded-xl text-xs text-[#415e4d] bg-[#f4f8f5] hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 transition-all"
            title="View Full Book Details"
          >
            <Info className="w-4 h-4" />
          </button>

        </div>

        {/* Right Action: Pivot Seed */}
        <button
          onClick={() => onPivotSeed(book)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-[#ecfdf5] hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 rounded-xl transition-all shadow-2xs group/pivot cursor-pointer"
        >
          <span>Find Like This</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/pivot:translate-x-0.5 transition-transform" />
        </button>

      </div>

    </div>
  );
};
