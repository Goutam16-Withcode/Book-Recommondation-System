import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://127.0.0.1:8000/ml/status', {
      signal: AbortSignal.timeout(1000)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        connected: true,
        ...data
      });
    }
  } catch {
    // Service offline
  }

  return NextResponse.json({
    connected: false,
    framework: 'Scikit-Learn Standalone (Fallback Engine Active)',
    dataset_rows: 11127,
    vector_dimensions: 5000,
    distance_metric: 'Cosine Distance & BM25',
    unsupervised_clusters: 8
  });
}
