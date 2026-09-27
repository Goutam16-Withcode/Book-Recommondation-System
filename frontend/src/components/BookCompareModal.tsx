'use client';

import React from 'react';
import { Book } from '@/lib/retrieval-engine';
import { X, Star, Award, Clock, Trash2, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        {/* Top bar */}
        <div className="p-5 border-b border-[#e2ece5] flex items-center justify-between bg-[#f8fbf9]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0f2a1e]">
              Side-by-Side Book Comparison ({books.length} Books)
            </h3>
            <p className="text-xs text-[#52705e]">
              Direct attribute, rating quality & mood matrix comparison
            </p>
          </div>

          <div className="flex items-center gap-3">
            {books.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table / Columns */}
        <div className="p-6 overflow-x-auto overflow-y-auto">
          {books.length === 0 ? (
            <div className="py-16 text-center text-[#52705e]">
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
                    className="p-4 rounded-2xl bg-[#fafdfb] border border-[#d6e5dc] flex flex-col justify-between space-y-4"
                  >
                    {/* Header with Remove */}
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {book.genres[0]}
                      </span>
                      <button
                        onClick={() => onRemoveBook(book.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
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
                        <span className="text-[10px] uppercase font-bold text-[#698875] block">Full Title:</span>
                        <p className="font-bold text-[#102d20] leading-snug line-clamp-2">{book.title}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#698875] block">Authors:</span>
                        <p className="text-[#3b5947] truncate">{book.authors}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-center">
                          <span className="text-[9px] uppercase font-bold text-amber-800 block">Rating</span>
                          <span className="text-xs font-black text-amber-900">★ {book.rating.toFixed(2)}</span>
                        </div>

                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                          <span className="text-[9px] uppercase font-bold text-emerald-800 block">Bayesian</span>
                          <span className="text-xs font-black text-emerald-900">{book.bayesianScore}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#698875] block">Length & Time:</span>
                        <p className="text-[#3b5947] font-semibold">{book.pages} pages (~{readingHours} hours)</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#698875] block">Mood / Atmosphere:</span>
                        <span className="inline-block text-[11px] font-medium bg-[#f0fcf6] text-teal-900 px-2 py-0.5 rounded-md border border-teal-200 mt-0.5">
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
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
