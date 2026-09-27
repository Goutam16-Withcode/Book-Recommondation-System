'use client';

import React from 'react';
import { Book } from '@/lib/retrieval-engine';
import { X, Trash2, ArrowRight } from 'lucide-react';

interface BookCompareModalProps {
  books: Book[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveBook: (bookId: string) => void;
  onClearAll: () => void;
  onPivotSeed: (book: Book) => void;
}

export const BookCompareModal: React.FC<BookCompareModalProps> = ({
  books,
  isOpen,
  onClose,
  onRemoveBook,
  onClearAll,
  onPivotSeed
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        {/* Top bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Side-by-Side Comparison ({books.length} Books)
            </h3>
            <p className="text-xs text-slate-500">
              Attribute, quality score & mood matrix comparison
            </p>
          </div>

          <div className="flex items-center gap-3">
            {books.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table / Columns */}
        <div className="p-5 sm:p-6 overflow-x-auto overflow-y-auto">
          {books.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="font-bold text-sm">No books selected for comparison yet.</p>
              <p className="text-xs mt-1">Click the comparison icon on any book card to compare their attributes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-[600px]">
              {books.map((book) => {
                const p = book.palette;
                const readingHours = Math.round(book.pages / 55);

                return (
                  <div 
                    key={book.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
                  >
                    {/* Header with Remove */}
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {book.genres[0]}
                      </span>
                      <button
                        onClick={() => onRemoveBook(book.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove from compare"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Book Mini Cover */}
                    <div 
                      className="h-28 rounded-xl p-2.5 flex flex-col justify-between select-none relative overflow-hidden"
                      style={{ backgroundColor: p.bg, border: `1.5px solid ${p.border}` }}
                    >
                      <div className="book-spine-line" />
                      <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: p.spine }} />
                      <p className="pl-2 text-xs font-black line-clamp-2" style={{ color: p.text }}>
                        {book.shortTitle}
                      </p>
                      <p className="pl-2 text-[10px] font-semibold truncate" style={{ color: p.text }}>
                        {book.primaryAuthor}
                      </p>
                    </div>

                    {/* Comparison rows */}
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Full Title:</span>
                        <p className="font-bold text-slate-900 leading-snug line-clamp-2">{book.title}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Authors:</span>
                        <p className="text-slate-700 truncate">{book.authors}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-center">
                          <span className="text-[9px] uppercase font-bold text-amber-800 block">Rating</span>
                          <span className="text-xs font-black text-amber-900">★ {book.rating.toFixed(2)}</span>
                        </div>

                        <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                          <span className="text-[9px] uppercase font-bold text-indigo-800 block">Bayesian</span>
                          <span className="text-xs font-black text-indigo-900">{book.bayesianScore}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Length:</span>
                        <p className="text-slate-700 font-semibold">{book.pages} pages (~{readingHours}h)</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Mood:</span>
                        <span className="inline-block text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 mt-0.5">
                          {book.moods[0]}
                        </span>
                      </div>
                    </div>

                    {/* Pivot Seed Button */}
                    <button
                      onClick={() => {
                        onPivotSeed(book);
                        onClose();
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Find Similar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
