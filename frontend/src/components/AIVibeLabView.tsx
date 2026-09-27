'use client';

import React, { useState } from 'react';
import { Book, RetrievalParams } from '@/lib/retrieval-engine';
import { 
  Sparkles, 
  Compass, 
  Send, 
  Lightbulb, 
  Wind, 
  Flame, 
  BookMarked, 
  Moon, 
  Sun,
  Coffee,
  Sword,
  Wand2
} from 'lucide-react';

interface AIVibeLabProps {
  onRunSemanticVibe: (params: RetrievalParams) => void;
  isLoading: boolean;
}

const CURATED_VIBE_RECIPES = [
  {
    title: 'Autumn Tea & English Countryside Murder',
    desc: 'Cozy, intellectual, classic whodunit with eccentric village detectives.',
    query: 'murder mystery detective village england tea crime secrets classic',
    mood: 'Heartwarming & Cozy',
    genre: 'Mystery & Thriller',
    icon: Coffee
  },
  {
    title: 'Ancient Wizard Guilds & Hidden Relics',
    desc: 'Wondrous spellcraft, arcane libraries, magical academies, and companion quests.',
    query: 'magic wizard academy spells potion sorcerer kingdom fantasy',
    mood: 'Whimsical & Magical',
    genre: 'Fantasy',
    icon: Wand2
  },
  {
    title: 'Existential Voyage Across Silent Cosmos',
    desc: 'Deep philosophical reflections on human consciousness, time dilation, and artificial minds.',
    query: 'space galaxy time travel universe robot mind consciousness philosophy',
    mood: 'Thought-Provoking & Deep',
    genre: 'Science Fiction',
    icon: Moon
  },
  {
    title: 'Bloodlines, Forgotten Thrones & Dragons',
    desc: 'High stakes dynasties, political court intrigue, and sweeping continent wars.',
    query: 'sword kingdom dragon empire throne battle warrior destiny',
    mood: 'Epic & Grand',
    genre: 'Fantasy',
    icon: Sword
  },
  {
    title: 'Rainy City Noir & Psychological Suspense',
    desc: 'Gritty detectives navigating betrayal, morally gray secrets, and clock-ticking danger.',
    query: 'crime thriller conspiracy dark shadow killer secrets gritty psychological',
    mood: 'Dark & Gripping',
    genre: 'Mystery & Thriller',
    icon: Wind
  },
  {
    title: 'Quiet Mid-Century Philosophical Reflections',
    desc: 'Classic literature pondering morality, the human condition, and inner truth.',
    query: 'classic literature society truth meaning philosophy human soul',
    mood: 'Thought-Provoking & Deep',
    genre: 'Classics',
    icon: Sun
  }
];

export const AIVibeLabView: React.FC<AIVibeLabProps> = ({ onRunSemanticVibe, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedVibeIndex, setSelectedVibeIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onRunSemanticVibe({
      query: prompt.trim(),
      weights: {
        semantic: 0.50,
        lexical: 0.25,
        authorBonus: 0.10,
        qualityBonus: 0.15,
        diversity: 0.70
      },
      maxResults: 16
    });
  };

  const handleSelectRecipe = (recipe: typeof CURATED_VIBE_RECIPES[0], idx: number) => {
    setSelectedVibeIndex(idx);
    setPrompt(recipe.query);
    onRunSemanticVibe({
      query: recipe.query,
      moods: [recipe.mood],
      genres: [recipe.genre],
      weights: {
        semantic: 0.45,
        lexical: 0.25,
        authorBonus: 0.15,
        qualityBonus: 0.15,
        diversity: 0.75
      },
      maxResults: 16
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#d6e5dc] p-6 lg:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Semantic & Vibe Retrieval Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#0f291e] tracking-tight">
            Discover by Atmosphere, Narrative Mood & Latent Tropes
          </h2>

          <p className="text-xs sm:text-sm text-[#486b57] mt-2 leading-relaxed">
            Unlike traditional keyword lookups, our semantic retrieval vectorizes emotional tone, atmospheric tropes, and thematic descriptors to unearth hidden gems matching your desired reading vibe.
          </p>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your desired reading vibe in natural words (e.g. 'A melancholic yet humorous journey with eccentric traveling companions, gentle wit, and a cozy ending')..."
              className="w-full p-4 pr-32 rounded-2xl bg-[#fafdfa] border-2 border-[#cce0d2] focus:border-emerald-500 focus:bg-white focus:outline-none text-[#0f2a1e] placeholder-[#799484] text-sm font-medium resize-none shadow-inner"
            />

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute right-3 bottom-4 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Query Vibe</span>
            </button>
          </div>
        </form>
      </div>

      {/* Curated Vibe Recipes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-[#0f291e] uppercase tracking-wider">
              Curated Vibe Archetypes & Presets
            </h3>
          </div>
          <span className="text-xs text-[#52705e]">Click any recipe to activate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED_VIBE_RECIPES.map((recipe, idx) => {
            const IconComponent = recipe.icon;
            const isSelected = selectedVibeIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => handleSelectRecipe(recipe, idx)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-[#ecfdf5] border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-white hover:bg-[#f6fbf8] border-[#d8e6dc] hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {recipe.genre}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0f291e] leading-snug">
                    {recipe.title}
                  </h4>
                  <p className="text-xs text-[#52705e] mt-1 line-clamp-2 leading-relaxed">
                    {recipe.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e8f1ea] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-teal-800">
                    Mood: {recipe.mood}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    Retrieve →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
