import { NextRequest, NextResponse } from 'next/server';
import { executeRetrieval, RetrievalParams } from '@/lib/retrieval-engine';

export async function POST(req: NextRequest) {
  try {
    const body: RetrievalParams = await req.json();
    const result = executeRetrieval(body);
    return NextResponse.json(result);
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
