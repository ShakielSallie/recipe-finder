'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRecipeStore } from '@/store/recipeStore';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';

export function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const { loading, setQuery } = useRecipeStore();
  const { mutate: search } = useRecipeSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || loading) return;
    setQuery(trimmed);
    search(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-blue-200 dark:border-blue-800/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-900/20 px-4 py-2.5 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400 transition-all">
        <span className="text-2xl shrink-0 select-none">🔍</span>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. easy chicken dinner under 30 minutes…"
          className="flex-1 min-w-0 bg-transparent text-base text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="shrink-0 h-11 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 hover:from-blue-600 hover:via-teal-600 hover:to-purple-600 shadow-lg shadow-blue-300/40 dark:shadow-blue-700/30 transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed active:scale-95"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Searching
            </motion.span>
          ) : (
            'Find Recipes'
          )}
        </button>
      </div>

      {/* Quick suggestions */}
      {!inputValue && !loading && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {['🍗 Easy chicken', '🥗 Vegan salad', '🍝 Quick pasta', '🥘 One-pot dinner'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInputValue(s.split(' ').slice(1).join(' '))}
              className="text-xs px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-800/70 border border-blue-100 dark:border-blue-900/40 text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all backdrop-blur-sm"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
