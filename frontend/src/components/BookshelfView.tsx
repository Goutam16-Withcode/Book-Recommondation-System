'use client';

import React, { useState } from 'react';
import { Book } from '@/lib/retrieval-engine';
import { 
  Bookmark, 
  BookOpen, 
  Heart, 
  CheckCircle, 
  Trash2, 
  Download, 
  Star, 
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react';

export type ShelfCategory = 'Want to Read' | 'Currently Reading' | 'Favorites' | 'Completed';

export interface SavedBookItem {
  book: Book;
  category: ShelfCategory;
  addedAt: string;
}

interface BookshelfViewProps {
  savedItems: SavedBookItem[];
  onRemoveItem: (bookId: string) => void;
  onChangeCategory: (bookId: string, newCategory: ShelfCategory) => void;
  onPivotSeed: (book: Book) => void;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  savedItems,
  onRemoveItem,
  onChangeCategory,
  onPivotSeed
}) => {
  const [activeCategory, setActiveCategory] = useState<ShelfCategory>('Want to Read');

  const categories: ShelfCategory[] = ['Want to Read', 'Currently Reading', 'Favorites', 'Completed'];

  const filteredItems = savedItems.filter(item => item.category === activeCategory);

  const completedCount = savedItems.filter(item => item.category === 'Completed').length;
  const yearlyGoal = 25;
  const goalPercent = Math.min(100, Math.round((completedCount / yearlyGoal) * 100));

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `my_foliomind_bookshelf_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Bookshelf Header & Reading Goal Banner */}
      <div className="bg-white rounded-3xl border border-[#d6e5dc] p-6 lg:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0f2a1e]">
              Personal Library & Bookshelf
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#52705e]">
            Curated reading lists with persistent local shelf tracking and export tools.
          </p>
        </div>

        {/* Reading Goal Widget */}
        <div className="w-full md:w-auto p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
            <Trophy className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center justify-between gap-4 text-xs font-bold text-emerald-950">
              <span>Annual Reading Goal:</span>
              <span>{completedCount} / {yearlyGoal} Books</span>
            </div>
            <div className="w-48 h-2 bg-[#d7edd9] rounded-full overflow-hidden mt-1.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-emerald-700 mt-1 font-medium">
              {goalPercent}% complete • {Math.max(0, yearlyGoal - completedCount)} more to target!
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#e2ede5]">
        
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const count = savedItems.filter(i => i.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#41604f] hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {savedItems.length > 0 && (
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-[#ecfdf5] hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Shelf (JSON)</span>
          </button>
        )}

      </div>

      {/* Book Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#d6e5dc] space-y-3">
          <BookOpen className="w-10 h-10 text-emerald-300 mx-auto" />
          <h3 className="text-base font-bold text-[#143224]">
            No books in "{activeCategory}" yet
          </h3>
          <p className="text-xs text-[#52705e] max-w-md mx-auto">
            Browse the Hybrid Explorer or AI Vibe Lab and click the bookmark icon on any book to add it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(({ book, category, addedAt }) => {
            const p = book.palette;

            return (
              <div 
                key={book.id}
                className="bg-white rounded-3xl border border-[#dce8df] p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category switcher */}
                  <div className="flex items-center justify-between mb-3">
                    <select
                      value={category}
                      onChange={(e) => onChangeCategory(book.id, e.target.value as ShelfCategory)}
                      className="text-xs font-semibold bg-[#f0fdf4] text-emerald-900 border border-emerald-200 rounded-lg px-2 py-1 outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => onRemoveItem(book.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove from Shelf"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Book Card Visual */}
                  <div className="flex gap-3 items-start">
                    <div 
                      className="w-18 h-26 rounded-xl p-2 flex flex-col justify-between select-none relative overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: p.bg, border: `1.5px solid ${p.border}` }}
                    >
                      <div className="book-spine-line" />
                      <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: p.spine }} />
                      <p className="pl-1.5 text-[10px] font-black line-clamp-2" style={{ color: p.text }}>
                        {book.shortTitle}
                      </p>
                      <span className="pl-1.5 text-[8px] font-bold" style={{ color: p.text }}>
                        ★ {book.rating}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0f291e] line-clamp-2 leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-xs text-[#52705e] truncate mt-0.5">
                        {book.authors}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs font-bold text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{book.rating.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#edf4ef] flex items-center justify-between">
                  <span className="text-[10px] text-[#799484]">
                    Added {new Date(addedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => onPivotSeed(book)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Find Similar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
