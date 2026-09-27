'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/lib/retrieval-engine';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
  Layers, 
  Award,
  ArrowRight,
  Database
} from 'lucide-react';

interface CatalogAnalyticsViewProps {
  onPivotSeed: (book: Book) => void;
}

export const CatalogAnalyticsView: React.FC<CatalogAnalyticsViewProps> = ({ onPivotSeed }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-emerald-900">Crunching Catalog Telemetry...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-[#dce8df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#698875] tracking-wider block">Total Catalog</span>
            <p className="text-2xl font-black text-[#0f291e]">{data.totalBooks.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-700 font-medium">Indexed volumes</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#dce8df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#698875] tracking-wider block">Authors Network</span>
            <p className="text-2xl font-black text-[#0f291e]">{data.totalAuthors.toLocaleString()}</p>
            <p className="text-[10px] text-teal-700 font-medium">Distinct creators</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#dce8df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#698875] tracking-wider block">Average Rating</span>
            <p className="text-2xl font-black text-[#0f291e]">{data.meanRating}</p>
            <p className="text-[10px] text-amber-700 font-medium">Across all records</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#dce8df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#698875] tracking-wider block">Inverted Index</span>
            <p className="text-2xl font-black text-[#0f291e]">17,793</p>
            <p className="text-[10px] text-green-700 font-medium">Lexical & token nodes</p>
          </div>
        </div>

      </div>

      {/* Main Visuals: Rating Distribution & Top Authors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-[#dce8df] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#0f291e] flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
              <span>Reader Rating Distribution</span>
            </h3>
            <span className="text-xs text-[#52705e] font-semibold">11,127 Books</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(data.ratingBuckets).map(([bucket, count]: any) => {
              const pct = Math.round((count / data.totalBooks) * 100);

              return (
                <div key={bucket}>
                  <div className="flex justify-between text-xs font-bold text-[#204030] mb-1">
                    <span>{bucket} Stars</span>
                    <span>{count.toLocaleString()} books ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-[#e2ede5] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Authors by Catalog Volume */}
        <div className="bg-white p-6 rounded-3xl border border-[#dce8df] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#0f291e] flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-teal-600" />
              <span>Prolific Authors in Dataset</span>
            </h3>
            <span className="text-xs text-[#52705e] font-semibold">Ranked by volume</span>
          </div>

          <div className="divide-y divide-gray-100">
            {data.topAuthors.slice(0, 6).map((authorData: any, idx: number) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#102d20]">{authorData.author}</p>
                    <p className="text-[11px] text-[#52705e]">{authorData.booksCount} published editions</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    ★ {authorData.avgRating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Bayesian Acclaimed Masterpieces */}
      <div className="bg-white p-6 rounded-3xl border border-[#dce8df] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#0f291e] flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Highest Bayesian-Rated Masterpieces in System</span>
            </h3>
            <p className="text-xs text-[#52705e]">
              Regularized for vote reliability (combining average rating + volume consensus)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {data.topRatedBooks.slice(0, 6).map((b: any, idx: number) => (
            <div 
              key={b.id} 
              className="p-3.5 rounded-2xl bg-[#f8faf8] hover:bg-[#ecfdf5] border border-[#d6e5dc] hover:border-emerald-300 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Rank #{idx + 1}
                  </span>
                  <span className="text-xs font-black text-amber-700">★ {b.rating}</span>
                </div>
                <p className="text-xs font-bold text-[#0f291e] truncate mt-1">{b.title}</p>
                <p className="text-[11px] text-[#52705e] truncate">by {b.authors}</p>
              </div>

              <button
                onClick={() => {
                  const bookMock: Book = {
                    id: b.id,
                    numId: parseInt(b.id) || 1,
                    title: b.title,
                    shortTitle: b.title,
                    authors: b.authors,
                    authorsList: [b.authors],
                    primaryAuthor: b.authors.split('/')[0],
                    rating: b.rating,
                    ratingsCount: 20000,
                    bayesianScore: b.bayesianScore,
                    series: null,
                    volume: null,
                    genres: b.genres || ['Fantasy'],
                    moods: ['Epic & Grand'],
                    pages: 400,
                    palette: { bg: '#e8f5e9', border: '#a5d6a7', spine: '#4caf50', text: '#1b5e20', badge: '#c8e6c9' },
                    tokens: b.title.toLowerCase().split(' ')
                  };
                  onPivotSeed(bookMock);
                }}
                className="p-2 rounded-xl bg-white group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 border border-emerald-200 transition-colors flex-shrink-0 cursor-pointer"
                title="Use as seed for recommendations"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
