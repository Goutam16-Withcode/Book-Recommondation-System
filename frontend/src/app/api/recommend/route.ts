import { NextRequest, NextResponse } from 'next/server';
import { executeRetrieval, RetrievalParams, RetrievalResult, RetrievalMatch, Book } from '@/lib/retrieval-engine';
import booksData from '@/data/books.json';

const booksMap = new Map<string, Book>();
for (const b of (booksData as Book[])) {
  booksMap.set(b.id, b);
}

export async function POST(req: NextRequest) {
  try {
    const body: RetrievalParams = await req.json();

    // 1. Try querying the Python Scikit-Learn Machine Learning microservice
    try {
      const mlResponse = await fetch('http://127.0.0.1:8000/ml/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: body.seedBookId,
          query: body.query,
          top_n: body.maxResults || 12,
          min_rating: body.minRating || 0
        }),
        signal: AbortSignal.timeout(1200) // fast 1.2s timeout
      });

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        
        // Map Python Scikit-Learn recommendations to full frontend RetrievalMatch structures
        const matches: RetrievalMatch[] = [];

        for (const item of mlData.recommendations) {
          const book = booksMap.get(item.book_id) || {
            id: item.book_id,
            numId: parseInt(item.book_id) || 0,
            title: item.title,
            shortTitle: item.title.slice(0, 40),
            authors: item.authors,
            authorsList: item.authors.split('/').map((a: string) => a.trim()),
            primaryAuthor: item.authors.split('/')[0].trim(),
            rating: item.rating,
            ratingsCount: 5000,
            bayesianScore: item.bayesian_score,
            series: null,
            volume: null,
            genres: [item.cluster_name || 'Literature'],
            moods: ['Thought-Provoking & Deep'],
            pages: 320,
            palette: {
              bg: '#f8fafc',
              border: '#e2e8f0',
              spine: '#4f46e5',
              text: '#0f172a',
              badge: '#e0e7ff'
            },
            tokens: item.top_contributing_terms
          };

          const cosineSim = item.cosine_similarity;
          const matchPercentage = item.match_percentage;

          matches.push({
            book,
            totalScore: Math.round(cosineSim * 100),
            matchPercentage,
            breakdown: {
              semanticScore: Math.round(cosineSim * 100),
              lexicalScore: Math.round(cosineSim * 85),
              authorAffinity: item.authors.includes(mlData.query_context?.seed_title?.split(' ')[0] || '') ? 95 : 50,
              qualityBoost: Math.min(100, Math.round(item.rating * 20)),
              genreOverlap: 90
            },
            matchedConcepts: item.top_contributing_terms.length > 0 ? item.top_contributing_terms : ['vector-affinity'],
            explanation: item.explanation,
            pipelineLatencyMs: mlData.execution_time_ms
          });
        }

        const seedBook = body.seedBookId ? booksMap.get(body.seedBookId) : null;

        const result: RetrievalResult = {
          matches,
          queryContext: {
            seedBook: seedBook || undefined,
            rawQuery: body.query || mlData.query_context?.seed_title,
            tokensParsed: mlData.recommendations[0]?.top_contributing_terms || [],
            candidatesEvaluated: mlData.total_candidates,
            pipelineLatencyMs: mlData.execution_time_ms,
            strategy: 'SEED_HYBRID'
          }
        };

        return NextResponse.json({
          ...result,
          mlBackend: {
            active: true,
            framework: 'Scikit-Learn 1.3+ TF-IDF & NearestNeighbors',
            model: 'Brute-Force Cosine Distance Index',
            executionTimeMs: mlData.execution_time_ms
          }
        });
      }
    } catch {
      // Python microservice not reached; proceed with local high-performance vector retrieval engine
    }

    // Fallback: Local vector retrieval engine
    const localResult = executeRetrieval(body);
    return NextResponse.json({
      ...localResult,
      mlBackend: {
        active: false,
        framework: 'Embedded Vector Retrieval Pipeline (Local In-Memory)',
        model: 'TF-IDF Cosine Similarity & BM25 Inverted Index'
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Retrieval failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seedBookId = searchParams.get('seedBookId') || undefined;
  const query = searchParams.get('q') || undefined;
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
  const maxResults = searchParams.get('maxResults') ? parseInt(searchParams.get('maxResults')!) : 12;

  const result = executeRetrieval({
    seedBookId,
    query,
    minRating,
    maxResults
  });

  return NextResponse.json(result);
}
