'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Book } from '@/lib/retrieval-engine';
import { getBookReadingData, BookChapter, BookReaderData } from '@/lib/book-reader-content';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Type, 
  Sun, 
  Moon, 
  BookOpen, 
  ExternalLink, 
  Bookmark, 
  Check, 
  Maximize2, 
  Minimize2,
  ListFilter
} from 'lucide-react';

interface BookReaderModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveReadingProgress?: (bookId: string, chapterIndex: number) => void;
}

type ReaderTheme = 'white' | 'sepia' | 'dark';
type ReaderFont = 'serif' | 'sans' | 'mono';

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaveReadingProgress
}) => {
  const [readerData, setReaderData] = useState<BookReaderData | null>(null);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [theme, setTheme] = useState<ReaderTheme>('white');
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<ReaderFont>('serif');
  const [showSettings, setShowSettings] = useState(false);
  const [showChaptersMenu, setShowChaptersMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Initialize book reading data
  useEffect(() => {
    if (book) {
      const data = getBookReadingData(book);
      setReaderData(data);
      
      // Load saved chapter progress if available
      try {
        const savedProgress = localStorage.getItem(`reading_prog_${book.id}`);
        if (savedProgress) {
          const idx = parseInt(savedProgress);
          if (!isNaN(idx) && idx < data.chapters.length) {
            setCurrentChapterIdx(idx);
          }
        } else {
          setCurrentChapterIdx(0);
        }
      } catch (e) {
        setCurrentChapterIdx(0);
      }
      setBookmarked(false);
    }
  }, [book]);

  // Stop speech when closing or changing chapter
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, currentChapterIdx]);

  // Handle Text-to-Speech (Read Aloud)
  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!readerData) return;
      const chapter = readerData.chapters[currentChapterIdx];
      const textToRead = `${chapter.title}. ${chapter.paragraphs.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleNextChapter = () => {
    if (!readerData || currentChapterIdx >= readerData.chapters.length - 1) return;
    if (isSpeaking && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    const nextIdx = currentChapterIdx + 1;
    setCurrentChapterIdx(nextIdx);
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (book) {
      localStorage.setItem(`reading_prog_${book.id}`, String(nextIdx));
      onSaveReadingProgress?.(book.id, nextIdx);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx <= 0) return;
    if (isSpeaking && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    const prevIdx = currentChapterIdx - 1;
    setCurrentChapterIdx(prevIdx);
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (book) {
      localStorage.setItem(`reading_prog_${book.id}`, String(prevIdx));
      onSaveReadingProgress?.(book.id, prevIdx);
    }
  };

  const handleBookmark = () => {
    if (!book) return;
    localStorage.setItem(`bookmark_${book.id}`, String(currentChapterIdx));
    setBookmarked(true);
    setTimeout(() => setBookmarked(false), 2500);
  };

  if (!isOpen || !book || !readerData) return null;

  const currentChapter = readerData.chapters[currentChapterIdx];
  const progressPercent = Math.round(((currentChapterIdx + 1) / readerData.chapters.length) * 100);

  // Theme styles
  const themeStyles = {
    white: {
      bg: 'bg-white',
      text: 'text-slate-800',
      headerBg: 'bg-slate-50 border-slate-200',
      mutedText: 'text-slate-500',
      cardBg: 'bg-slate-50 border-slate-200'
    },
    sepia: {
      bg: 'bg-[#fbf0d9]',
      text: 'text-[#433022]',
      headerBg: 'bg-[#f5e5c7] border-[#e8d2ac]',
      mutedText: 'text-[#7a5e47]',
      cardBg: 'bg-[#f5e6cc] border-[#e4d0aa]'
    },
    dark: {
      bg: 'bg-[#0f172a]',
      text: 'text-[#e2e8f0]',
      headerBg: 'bg-[#1e293b] border-slate-800',
      mutedText: 'text-slate-400',
      cardBg: 'bg-[#1e293b] border-slate-700'
    }
  }[theme];

  const fontClass = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  }[fontFamily];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      
      {/* Reader Container */}
      <div className={`relative w-full ${isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-4xl h-[92vh] sm:rounded-2xl shadow-2xl'} ${themeStyles.bg} border border-slate-200 flex flex-col overflow-hidden transition-colors duration-200`}>
        
        {/* Reader Top Bar */}
        <header className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 ${themeStyles.headerBg} select-none`}>
          
          {/* Book Title & Chapter Select */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className={`text-sm font-bold truncate leading-snug ${themeStyles.text}`}>
                {book.title}
              </h3>
              <p className={`text-[11px] truncate ${themeStyles.mutedText}`}>
                by {book.authors}
              </p>
            </div>
          </div>

          {/* Reader Tools & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Read Aloud / Audio Voice Button */}
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSpeaking 
                  ? 'bg-amber-500 text-white animate-pulse' 
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
              title={isSpeaking ? "Pause Read Aloud" : "Listen to Book (Read Aloud)"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden md:inline">{isSpeaking ? 'Listening...' : 'Read Aloud'}</span>
            </button>

            {/* Chapters Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowChaptersMenu(!showChaptersMenu);
                  setShowSettings(false);
                }}
                className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                title="Table of Contents"
              >
                <ListFilter className="w-4 h-4" />
                <span className="hidden sm:inline">Ch. {currentChapterIdx + 1}</span>
              </button>

              {showChaptersMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div className="p-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Table of Contents ({readerData.chapters.length} Chapters)
                  </div>
                  {readerData.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setCurrentChapterIdx(idx);
                        setShowChaptersMenu(false);
                        if (contentScrollRef.current) contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full p-2.5 text-left text-xs font-medium rounded-lg transition-colors flex items-center justify-between ${
                        currentChapterIdx === idx ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{ch.title}</span>
                      {currentChapterIdx === idx && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Typography & Theme Settings Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowChaptersMenu(false);
                }}
                className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Reader Appearance & Fonts"
              >
                <Type className="w-4 h-4" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 space-y-4">
                  
                  {/* Theme Switcher */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Reading Theme:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme('white')}
                        className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                          theme === 'white' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Studio
                      </button>
                      <button
                        onClick={() => setTheme('sepia')}
                        className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                          theme === 'sepia' ? 'bg-[#433022] text-[#fbf0d9] border-[#433022] shadow-xs' : 'bg-[#fbf0d9] text-[#433022] border-[#e4d0aa]'
                        }`}
                      >
                        Parchment
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                          theme === 'dark' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-[#0f172a] text-slate-200 border-slate-700'
                        }`}
                      >
                        Night
                      </button>
                    </div>
                  </div>

                  {/* Font Size Adjuster */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Font Size</span>
                      <span>{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
                      >
                        A-
                      </button>
                      <input
                        type="range"
                        min="14"
                        max="26"
                        step="2"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <button
                        onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Typography:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setFontFamily('serif')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-serif border ${
                          fontFamily === 'serif' ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold' : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Literary Serif
                      </button>
                      <button
                        onClick={() => setFontFamily('sans')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-sans border ${
                          fontFamily === 'sans' ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold' : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Modern Sans
                      </button>
                      <button
                        onClick={() => setFontFamily('mono')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-mono border ${
                          fontFamily === 'mono' ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold' : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Mono
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                bookmarked ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
              title="Bookmark this page"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-200 transition-colors cursor-pointer hidden md:flex"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* Reader Body (Scrollable Literary Text) */}
        <div 
          ref={contentScrollRef}
          className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-20 py-8 lg:py-12"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Chapter Header */}
            <div className="text-center pb-6 border-b border-slate-200/60 space-y-2">
              <span className={`text-xs font-bold uppercase tracking-widest ${themeStyles.mutedText}`}>
                {book.title} • {book.primaryAuthor}
              </span>
              <h1 className={`text-2xl sm:text-3xl font-black ${themeStyles.text} font-serif`}>
                {currentChapter.title}
              </h1>
              <p className={`text-xs ${themeStyles.mutedText}`}>
                ~{Math.round(currentChapter.wordCount / 200)} min read • {currentChapter.wordCount} words
              </p>
            </div>

            {/* Chapter Paragraphs with Drop Cap on First Paragraph */}
            <div className={`space-y-5 leading-relaxed ${fontClass}`} style={{ fontSize: `${fontSize}px` }}>
              {currentChapter.paragraphs.map((para, idx) => {
                const isFirst = idx === 0;

                return (
                  <p 
                    key={idx} 
                    className={`${themeStyles.text} leading-[1.8] text-justify ${
                      isFirst ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-indigo-600' : ''
                    }`}
                  >
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Full Book Access Links Banner */}
            <div className={`mt-12 p-5 rounded-2xl border ${themeStyles.cardBg} space-y-3`}>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h4 className={`text-sm font-bold ${themeStyles.text}`}>
                  Looking for the Complete Unabridged Text or Physical Loan?
                </h4>
              </div>
              <p className={`text-xs leading-relaxed ${themeStyles.mutedText}`}>
                This reading preview provides the complete opening chapters. To access the entire unabridged digital copy, borrow through university and public libraries, or search full online scans:
              </p>
              
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <a
                  href={readerData.externalReadLinks.openLibraryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Borrow on Open Library</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={readerData.externalReadLinks.googleBooksUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Google Books Full View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={readerData.externalReadLinks.internetArchiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Internet Archive Scans</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Reader Footer Controls: Progress Bar & Chapter Stepper */}
        <footer className={`px-4 sm:px-6 py-3 border-t flex items-center justify-between gap-4 ${themeStyles.headerBg} select-none`}>
          
          <button
            onClick={handlePrevChapter}
            disabled={currentChapterIdx <= 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark' ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Chapter</span>
          </button>

          {/* Reading Progress Percentage */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-32 sm:w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={`text-xs font-semibold ${themeStyles.mutedText} flex-shrink-0`}>
              {progressPercent}% Complete
            </span>
          </div>

          <button
            onClick={handleNextChapter}
            disabled={currentChapterIdx >= readerData.chapters.length - 1}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark' ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </footer>

      </div>

    </div>
  );
};
