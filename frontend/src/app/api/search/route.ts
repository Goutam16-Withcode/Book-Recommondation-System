import { NextRequest, NextResponse } from 'next/server';
import { searchBooksAutocomplete, getBookById } from '@/lib/retrieval-engine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const book = getBookById(id);
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    return NextResponse.json(book);
  }

  const query = searchParams.get('q') || '';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12;
  const results = searchBooksAutocomplete(query, limit);
  return NextResponse.json(results);
}
