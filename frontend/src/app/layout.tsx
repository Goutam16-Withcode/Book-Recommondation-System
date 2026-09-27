import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FolioMind | Advanced Multi-Vector Book Recommendation & Retrieval Engine",
  description: "Next-generation book discovery engine powered by multi-vector hybrid retrieval, BM25 indexing, Bayesian quality regularisation, and semantic atmosphere matching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased selection:bg-emerald-200 selection:text-emerald-950">
        {children}
      </body>
    </html>
  );
}
