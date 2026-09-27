import { NextResponse } from 'next/server';
import { getAllBooks, getMetadata } from '@/lib/retrieval-engine';

export async function GET() {
  const books = getAllBooks();
  const meta = getMetadata();

  // Rating distribution buckets
  const ratingBuckets: Record<string, number> = {
    '4.5 - 5.0': 0,
    '4.0 - 4.49': 0,
    '3.5 - 3.99': 0,
    '3.0 - 3.49': 0,
    '< 3.0': 0
  };

  // Top authors by volume and quality
  const authorCounts: Record<string, { count: number; totalRating: number }> = {};
  const genreCounts: Record<string, number> = {};

  for (const b of books) {
    if (b.rating >= 4.5) ratingBuckets['4.5 - 5.0']++;
    else if (b.rating >= 4.0) ratingBuckets['4.0 - 4.49']++;
    else if (b.rating >= 3.5) ratingBuckets['3.5 - 3.99']++;
    else if (b.rating >= 3.0) ratingBuckets['3.0 - 3.49']++;
    else ratingBuckets['< 3.0']++;

    if (!authorCounts[b.primaryAuthor]) {
      authorCounts[b.primaryAuthor] = { count: 0, totalRating: 0 };
    }
    authorCounts[b.primaryAuthor].count++;
    authorCounts[b.primaryAuthor].totalRating += b.rating;

    for (const g of b.genres) {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    }
  }

  const topAuthors = Object.entries(authorCounts)
    .filter(([_, data]) => data.count >= 3)
    .map(([author, data]) => ({
      author,
      booksCount: data.count,
      avgRating: Number((data.totalRating / data.count).toFixed(2))
    }))
    .sort((a, b) => b.booksCount - a.booksCount)
    .slice(0, 10);

  const topRatedBooks = [...books]
    .sort((a, b) => b.bayesianScore - a.bayesianScore)
    .slice(0, 10)
    .map(b => ({
      id: b.id,
      title: b.title,
      authors: b.authors,
      rating: b.rating,
      bayesianScore: b.bayesianScore,
      genres: b.genres
    }));

  return NextResponse.json({
    totalBooks: books.length,
    totalAuthors: meta.totalAuthors,
    meanRating: meta.meanRating,
    ratingBuckets,
    topAuthors,
    genreCounts,
    topRatedBooks
  });
}
