'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/lib/retrieval-engine';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
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
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-800">Analyzing Catalog Telemetry...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Catalog</span>
            <p className="text-2xl font-black text-slate-900">{data.totalBooks.toLocaleString()}</p>
            <p className="text-[10px] text-indigo-600 font-medium">Indexed volumes</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Authors Network</span>
            <p className="text-2xl font-black text-slate-900">{data.totalAuthors.toLocaleString()}</p>
            <p className="text-[10px] text-violet-600 font-medium">Distinct creators</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Average Rating</span>
            <p className="text-2xl font-black text-slate-900">{data.meanRating}</p>
            <p className="text-[10px] text-amber-600 font-medium">Across all records</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Inverted Index</span>
            <p className="text-2xl font-black text-slate-900">17,793</p>
            <p className="text-[10px] text-sky-600 font-medium">Lexical & token nodes</p>
          </div>
        </div>

      </div>

      {/* Main Visuals: Rating Distribution & Top Authors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Reader Rating Distribution</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">11,127 Books</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(data.ratingBuckets).map(([bucket, count]: any) => {
              const pct = Math.round((count / data.totalBooks) * 100);

              return (
                <div key={bucket}>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>{bucket} Stars</span>
                    <span>{count.toLocaleString()} books ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Authors by Catalog Volume */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-600" />
              <span>Prolific Authors in Dataset</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Ranked by volume</span>
          </div>

          <div className="divide-y divide-slate-100">
            {data.topAuthors.slice(0, 6).map((authorData: any, idx: number) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{authorData.author}</p>
                    <p className="text-[11px] text-slate-500">{authorData.booksCount} published editions</p>
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Highest Bayesian-Rated Masterpieces in System</span>
            </h3>
            <p className="text-xs text-slate-500">
              Regularized for vote reliability (combining average rating + volume consensus)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {data.topRatedBooks.slice(0, 6).map((b: any, idx: number) => (
            <div 
              key={b.id} 
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">
                    Rank #{idx + 1}
                  </span>
                  <span className="text-xs font-black text-amber-700">★ {b.rating}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate mt-1">{b.title}</p>
                <p className="text-[11px] text-slate-500 truncate">by {b.authors}</p>
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
                    palette: { bg: '#eff6ff', border: '#bfdbfe', spine: '#2563eb', text: '#1e3a8a', badge: '#dbeafe' },
                    tokens: b.title.toLowerCase().split(' ')
                  };
                  onPivotSeed(bookMock);
                }}
                className="p-2 rounded-xl bg-white group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 border border-slate-200 group-hover:border-indigo-600 transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
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
