const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../../books_data.csv');
const outDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Reading CSV from:', csvPath);
const fileContent = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentVal.trim());
      currentVal = '';
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentVal += char;
    }
  }
  
  if (currentVal.length > 0 || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }
  
  return rows;
}

const parsed = parseCSV(fileContent);
console.log('Total parsed rows:', parsed.length);
const headers = parsed[0];
console.log('Headers:', headers);

// Genre keyword mappings
const GENRE_RULES = [
  { genre: 'Fantasy', keywords: ['harry potter', 'magic', 'wizard', 'dragon', 'lord of the rings', 'sword', 'elf', 'witch', 'narnia', 'hobbit', 'sorcerer', 'spell', 'kingdom', 'throne', 'fairy'] },
  { genre: 'Science Fiction', keywords: ['sci-fi', 'science fiction', 'space', 'galaxy', 'star', 'robot', 'dune', 'alien', 'planet', 'mars', 'cyber', 'time travel', 'asimov', 'philip k. dick', 'hitchhiker', 'solaris', 'matrix'] },
  { genre: 'Mystery & Thriller', keywords: ['murder', 'detective', 'mystery', 'crime', 'investigation', 'sherlock', 'poirot', 'agatha christie', 'thriller', 'conspiracy', 'killer', 'death', 'secrets', 'silence', 'spy'] },
  { genre: 'Classics', keywords: ['iliad', 'odyssey', 'pride and prejudice', 'jane austen', 'dostoevsky', 'tolstoy', 'shakespeare', 'dickens', 'hemingway', 'orwell', 'great gatsby', 'classic', 'odyssey', 'homer', 'plato'] },
  { genre: 'Philosophy & Thought', keywords: ['philosophy', 'ethics', 'mind', 'republic', 'nietzsche', 'kant', 'existential', 'logic', 'meditations', 'thought', 'stoic', 'epictetus', 'marcus aurelius', 'zen', 'buddha', 'tao'] },
  { genre: 'Romance', keywords: ['love', 'romance', 'heart', 'passion', 'bride', 'wedding', 'kiss', 'forever', 'darcy', 'beloved', 'sweet', 'desire', 'lover'] },
  { genre: 'History & Biography', keywords: ['history', 'biography', 'memoir', 'war', 'revolution', 'empire', 'president', 'churchill', 'lincoln', 'world war', 'roman', 'america', 'ancient', 'chronicles'] },
  { genre: 'Poetry & Plays', keywords: ['poems', 'poetry', 'sonnets', 'play', 'tragedy', 'comedy', 'rhymes', 'verse', 'iliad', 'faust'] },
  { genre: 'Young Adult & Coming of Age', keywords: ['young', 'teen', 'boy', 'girl', 'school', 'academy', 'journey', 'diary', 'growing', 'catcher in the rye', 'alchemist'] },
  { genre: 'Horror & Supernatural', keywords: ['horror', 'ghost', 'vampire', 'dracula', 'frankenstein', 'haunted', 'dark', 'demon', 'curse', 'nightmare', 'stephen king', 'shadow', 'lovecraft'] }
];

// Mood mappings
const MOOD_RULES = [
  { mood: 'Whimsical & Magical', tags: ['magic', 'enchanted', 'witty', 'lighthearted', 'fairy', 'playful'] },
  { mood: 'Epic & Grand', tags: ['quest', 'war', 'empire', 'destiny', 'galaxy', 'monumental', 'chronicle'] },
  { mood: 'Dark & Gripping', tags: ['murder', 'conspiracy', 'shadow', 'curse', 'psychological', 'killer', 'gritty'] },
  { mood: 'Thought-Provoking & Deep', tags: ['philosophy', 'mind', 'truth', 'society', 'existential', 'dystopian', 'meaning'] },
  { mood: 'Heartwarming & Cozy', tags: ['love', 'friendship', 'home', 'comfort', 'gentle', 'nostalgic', 'charm'] },
  { mood: 'Fast-Paced & Thrilling', tags: ['escape', 'chase', 'heist', 'action', 'danger', 'survival', 'hunt'] }
];

// Diverse, rich editorial book jacket palettes
const COVER_PALETTES = [
  { bg: '#eff6ff', border: '#bfdbfe', spine: '#2563eb', text: '#1e3a8a', badge: '#dbeafe' }, // Royal Blue
  { bg: '#f5f3ff', border: '#ddd6fe', spine: '#6366f1', text: '#312e81', badge: '#ede9fe' }, // Deep Indigo
  { bg: '#fffbeb', border: '#fde68a', spine: '#d97706', text: '#78350f', badge: '#fef3c7' }, // Amber Gold
  { bg: '#fff1f2', border: '#fecdd3', spine: '#e11d48', text: '#881337', badge: '#ffe4e6' }, // Crimson Rose
  { bg: '#f8fafc', border: '#cbd5e1', spine: '#334155', text: '#0f172a', badge: '#e2e8f0' }, // Classic Slate
  { bg: '#f0fdfa', border: '#99f6e4', spine: '#0d9488', text: '#115e59', badge: '#ccfbf1' }, // Deep Teal
  { bg: '#fff7ed', border: '#fed7aa', spine: '#ea580c', text: '#7c2d12', badge: '#ffedd5' }, // Terracotta
  { bg: '#faf5ff', border: '#e9d5ff', spine: '#9333ea', text: '#581c87', badge: '#f3e8ff' }, // Royal Violet
];

function extractSeries(title) {
  const match = title.match(/\(([^#)]+)(?:#\s*(\d+(?:\.\d+)?))?\)/);
  if (match) {
    const seriesName = match[1].trim().replace(/\s+#\d+.*$/, '');
    const vol = match[2] ? parseFloat(match[2]) : null;
    return { series: seriesName, volume: vol };
  }
  const match2 = title.match(/#(\d+)/);
  if (match2) {
    return { series: null, volume: parseFloat(match2[1]) };
  }
  return { series: null, volume: null };
}

function cleanTitle(title) {
  return title.replace(/\s*\([^)]*\)\s*$/, '').trim() || title;
}

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

const books = [];
let idCounter = 1;

for (let i = 1; i < parsed.length; i++) {
  const row = parsed[i];
  if (!row || row.length < 3) continue;
  
  const rawId = row[0] || String(idCounter);
  const rawTitle = row[1];
  const rawAuthors = row[2];
  const rawRating = parseFloat(row[3]);
  
  if (!rawTitle || !rawAuthors) continue;
  
  const rating = isNaN(rawRating) ? 3.90 : Math.min(5, Math.max(1, rawRating));
  const seriesInfo = extractSeries(rawTitle);
  const shortTitle = cleanTitle(rawTitle);
  
  const authorsList = rawAuthors.split('/').map(a => a.trim()).filter(Boolean);
  const primaryAuthor = authorsList[0] || 'Unknown Author';
  
  const fullText = (rawTitle + ' ' + rawAuthors).toLowerCase();
  
  // Detect genres
  const matchedGenres = [];
  for (const rule of GENRE_RULES) {
    if (rule.keywords.some(k => fullText.includes(k))) {
      matchedGenres.push(rule.genre);
    }
  }
  if (matchedGenres.length === 0) {
    matchedGenres.push('Literary & General Fiction');
  }
  
  // Detect moods
  const matchedMoods = [];
  for (const rule of MOOD_RULES) {
    if (rule.tags.some(t => fullText.includes(t))) {
      matchedMoods.push(rule.mood);
    }
  }
  if (matchedMoods.length === 0) {
    // Default mood based on first genre
    matchedMoods.push(matchedGenres[0] === 'Fantasy' ? 'Whimsical & Magical' : 'Thought-Provoking & Deep');
  }
  
  const hash = Math.abs((rawTitle.length * 31 + primaryAuthor.length * 17 + i) % COVER_PALETTES.length);
  const palette = COVER_PALETTES[hash];
  
  // Simulated page count and rating count
  const pages = Math.floor(180 + (Math.abs(rawTitle.length * 13) % 450));
  const ratingsCount = Math.floor(500 + (Math.abs(i * 179) % 85000));
  
  // Compute tokens for search index
  const tokens = Array.from(new Set([
    ...tokenize(rawTitle),
    ...tokenize(rawAuthors),
    ...matchedGenres.flatMap(g => tokenize(g)),
    ...matchedMoods.flatMap(m => tokenize(m))
  ]));

  books.push({
    id: rawId,
    numId: idCounter++,
    title: rawTitle,
    shortTitle,
    authors: rawAuthors,
    authorsList,
    primaryAuthor,
    rating: Number(rating.toFixed(2)),
    ratingsCount,
    series: seriesInfo.series,
    volume: seriesInfo.volume,
    genres: matchedGenres,
    moods: matchedMoods,
    pages,
    palette,
    tokens
  });
}

console.log(`Processed ${books.length} books successfully!`);

// Calculate Bayesian weighted ratings
// Bayesian Rating = (v / (v + m)) * R + (m / (v + m)) * C
const totalRatingSum = books.reduce((acc, b) => acc + b.rating, 0);
const meanRating = totalRatingSum / books.length;
const minVotesThreshold = 2000;

books.forEach(b => {
  const v = b.ratingsCount;
  const m = minVotesThreshold;
  const R = b.rating;
  const C = meanRating;
  const bayesianScore = (v / (v + m)) * R + (m / (v + m)) * C;
  b.bayesianScore = Number(bayesianScore.toFixed(3));
});

// Build inverted search index for top tokens
console.log('Building inverted search index...');
const tokenIndex = {};
books.forEach((b, idx) => {
  b.tokens.forEach(tok => {
    if (!tokenIndex[tok]) tokenIndex[tok] = [];
    tokenIndex[tok].push(idx);
  });
});

console.log(`Indexed ${Object.keys(tokenIndex).length} unique tokens.`);

// Write the compiled dataset
const outputPath = path.resolve(outDir, 'books.json');
fs.writeFileSync(outputPath, JSON.stringify(books, null, 2), 'utf8');
console.log('Saved books database to:', outputPath);

// Write metadata summary
const meta = {
  totalBooks: books.length,
  totalAuthors: new Set(books.map(b => b.primaryAuthor)).size,
  meanRating: Number(meanRating.toFixed(2)),
  genres: Array.from(new Set(books.flatMap(b => b.genres))),
  moods: Array.from(new Set(books.flatMap(b => b.moods))),
  generatedAt: new Date().toISOString()
};

fs.writeFileSync(path.resolve(outDir, 'metadata.json'), JSON.stringify(meta, null, 2), 'utf8');
console.log('Saved metadata to:', path.resolve(outDir, 'metadata.json'));
console.log('Dataset build complete!');
