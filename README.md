# 📚 FolioMind — Advanced Multi-Vector Book Recommendation & Retrieval Engine

> **A high-performance Next.js 16 + React 19 + TypeScript web application** featuring an editorial **Deep Indigo, Midnight Slate, and Warm Amber** aesthetic, multi-vector hybrid retrieval (BM25 + TF-IDF Vector Spaces), Bayesian quality regularization, MMR catalog diversification, and explainable AI diagnostics.

[![Next.js](https://img.shields.io/badge/Next.js-16%2B-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-indigo?style=flat-square)](LICENSE)

---

## 🌟 Key Highlights & Engineering Features

```mermaid
flowchart LR
    A[Seed Book or Natural Query] --> B[Token & Latency Ingestion]
    B --> C[BM25 Lexical Inverted Index]
    B --> D[Semantic Vector Cosine Space]
    B --> E[Author & Series Continuity Graph]
    C --> F[Multi-Score Fusion & Bayesian Weighting]
    D --> F
    E --> F
    F --> G[MMR Diversity Re-ranking]
    G --> H[Top-K Recommendations + XAI Diagnostics]
```

### 🧠 1. Multi-Vector Hybrid Retrieval Architecture
- **BM25 Lexical Inverted Index**: Evaluates exact term frequencies and inverse document frequencies (IDF) across **17,793 unique vocabulary tokens**.
- **Semantic & Thematic Vector Space**: Computes cosine alignment across book n-grams, literary tropes, and mood descriptors.
- **Collaborative Author & Series Continuity Graph**: Rewards sequels, prequels, and same-author universe bibliography.
- **Bayesian Rating Regularization**: Balances average ratings with vote consensus:
  $$\text{Weighted Score} = \left(\frac{v}{v+m} \cdot R\right) + \left(\frac{m}{v+m} \cdot C\right)$$
  Prevents obscure low-vote books from unfairly outranking timeless masterpieces like *Harry Potter*, *The Lord of the Rings*, or *Douglas Adams*.
- **MMR (Maximal Marginal Relevance) Diversity Re-Ranking**: Dynamic parameter ($\lambda$) preventing repetitive recommendations and ensuring catalog diversity.
- **Explainable AI (XAI) Diagnostics**: Mathematical breakdown of why each recommendation was retrieved (semantic synergy %, lexical density %, author affinity %, and matching concept tokens).

### 🎨 2. Modern Editorial UI Design
- **Refined Color Palette**: Deep Indigo (`#4f46e5`), Midnight Slate (`#0f172a`), and Warm Amber (`#f59e0b`) accents on a clean pearl-white studio background.
- **Proportional 3D Book Jackets**: Custom cover palettes across genres (Royal Blue, Deep Indigo, Amber Gold, Slate, Royal Violet) with realistic spine creases and depth.
- **Standardized Box Architecture**: Aligned title heights, uniform card footprints, and baseline button alignments across all rows.
- **Responsive Navigation**: Sticky header with live comparison counter, fast search shortcut (`/`), and reading goal progress.

### 🧩 3. Comprehensive Feature Suite
- **Hybrid Explorer Console**: Real-time fuzzy autocomplete across **11,127 books**, quick seed chips, and collapsible hyperparameter sliders (Semantic Weight, Lexical Weight, Author Affinity, Quality Boost, MMR Diversity).
- **AI Vibe Lab**: Natural language atmospheric discovery (*"Cozy Victorian countryside murder with tea"*, *"Deep philosophical sci-fi exploring consciousness"*).
- **Retrieval Pipeline Telemetry Banner**: Displays real-time query latency in milliseconds, candidate count evaluated in memory, and active strategy.
- **Interactive Book Dossier (Modal)**: In-depth reading time estimates, series volume continuity, and radar metric breakdowns.
- **Side-by-Side Book Comparison Drawer**: Compare up to 4 books simultaneously across ratings, Bayesian score, page count, and mood atmosphere.
- **Personal Bookshelf & Annual Goal Tracker**: Categorize books into *"Want to Read"*, *"Currently Reading"*, *"Favorites"*, and *"Completed"* with LocalStorage persistence and JSON export.
- **Catalog Intelligence Dashboard**: Live analytics showing distribution charts across rating buckets, most prolific authors, and top 10 Bayesian masterpieces.

### 📖 4. Immersive E-Reader & Full Book Access
- **Interactive Fullscreen E-Reader**: Read chapters directly inside the web app with customizable reading themes (Studio White, Warm Parchment/Sepia, Midnight OLED Dark Mode).
- **Audiobook / Text-to-Speech Engine**: Native SpeechSynthesis audio playback allowing users to listen to any chapter read aloud with play/pause controls.
- **Customizable Typography & Layout**: Adjust font size (14px–26px), switch font families (Literary Serif, Modern Sans, Mono), and toggle fullscreen distraction-free mode.
- **Progress Tracking & Bookmarks**: Automatic reading position saving per book in LocalStorage with progress bar and chapter switcher.
- **Full Book Library Integrations**: Direct links to borrow or read the complete unabridged digital copies via Open Library, Google Books, Internet Archive, and Project Gutenberg.

---

## ⚡ Quick Start

### 1. Requirements
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### 2. Run the Next.js Web App

From the project root:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🗂️ Project Directory Structure

```text
Book-Recommondation-System/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── recommend/route.ts  # Multi-vector retrieval endpoint
│   │   │   │   ├── search/route.ts     # Fast fuzzy autocomplete
│   │   │   │   └── analytics/route.ts  # Catalog telemetry & stats
│   │   │   ├── globals.css             # Deep Indigo, Slate & Amber design tokens
│   │   │   ├── layout.tsx              # Root HTML & typography
│   │   │   └── page.tsx                # Master responsive application
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Sticky header & tab switching
│   │   │   ├── RetrievalConsole.tsx    # Search, seeds & hyperparameter tuning
│   │   │   ├── RetrievalPipelineBanner.tsx # Latency & pipeline telemetry
│   │   │   ├── BookCard.tsx            # Standardized 3D cover cards & XAI accordion
│   │   │   ├── BookDetailModal.tsx     # Full dossier & series continuity
│   │   │   ├── BookCompareModal.tsx    # Side-by-side attribute comparison
│   │   │   ├── BookshelfView.tsx       # Personal shelf & reading goals
│   │   │   ├── CatalogAnalyticsView.tsx # Visual charts & dataset intel
│   │   │   └── AIVibeLabView.tsx       # Natural language atmospheric matching
│   │   ├── data/
│   │   │   ├── books.json              # Processed 11,127 books dataset
│   │   │   └── metadata.json           # Aggregated catalog stats
│   │   └── lib/
│   │       └── retrieval-engine.ts     # Core multi-vector retrieval algorithm
│   └── scripts/
│       └── build-dataset.js            # CSV to indexed JSON converter
├── books_data.csv                      # 11,128 original Goodreads records
├── app.py                              # Legacy Streamlit prototype
├── requirements.txt                    # Legacy Python dependencies
└── package.json                        # Root helper scripts
```

---

## 🧪 Algorithmic Strategies & Presets

| Strategy Preset | Primary Focus | Best For |
| :--- | :--- | :--- |
| **⚖️ Balanced Hybrid** | 35% Semantic, 30% Lexical, 20% Author, 15% Quality | General discovery with high all-round accuracy |
| **🔗 Series Continuity** | 45% Author & Lore, 20% Semantic, 20% Lexical | Finding sequels, prequels, and same-author bibliography |
| **✨ Deep Thematic** | 50% Semantic Vector, 25% Lexical, 10% Author | Locating hidden thematic twins from different authors |
| **⭐ Critical Acclaim** | 35% Bayesian Rating, 25% Semantic, 25% Lexical | Surfacing consensus masterpieces and award winners |
| **🌐 High Diversity** | MMR $\lambda = 0.90$, balanced weights | Serendipitous exploration across unexpected genres |

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).