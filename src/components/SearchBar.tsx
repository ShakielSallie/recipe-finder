'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecipeStore } from '@/store/recipeStore';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';

const STORAGE_KEY = 'recipe-recent-searches';
const MAX_RECENT = 8;

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const prev = loadRecent().filter((q) => q.toLowerCase() !== query.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)));
}

const SUGGESTIONS = [
  '🍗 Easy chicken',
  '🥗 Vegan salad',
  '🍝 Quick pasta',
  '🥘 One-pot dinner',
];

export function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { loading, setQuery } = useRecipeStore();
  const { mutate: search } = useRecipeSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const filtered = inputValue.trim()
    ? recent.filter((q) => q.toLowerCase().includes(inputValue.toLowerCase()))
    : recent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(inputValue);
  };

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    saveRecent(trimmed);
    setRecent(loadRecent());
    setQuery(trimmed);
    search(trimmed);
    setShowDropdown(false);
    setInputValue(trimmed);
  };

  const clearRecent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  };

  return (
    <div className="w-full" ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-blue-200 dark:border-blue-800/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-900/20 px-4 py-2.5 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400 transition-all">
          <span className="text-2xl shrink-0 select-none">🔍</span>
          <input
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="e.g. easy chicken dinner under 30 minutes…"
            className="flex-1 min-w-0 bg-transparent text-base text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
            disabled={loading}
            autoCorrect="on"
            autoCapitalize="sentences"
            spellCheck={true}
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(''); setShowDropdown(true); }}
              className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-lg leading-none"
            >
              ×
            </button>
          )}
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

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 w-full max-w-2xl rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-blue-100 dark:border-blue-900/50 shadow-xl shadow-blue-100/40 dark:shadow-blue-900/30 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Recent searches
                </span>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <ul className="pb-2">
                {filtered.map((q, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); runSearch(q); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <span className="text-zinc-400 dark:text-zinc-500 shrink-0">🕐</span>
                      <span className="flex-1 truncate">{q}</span>
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = recent.filter((r) => r !== q);
                          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                          setRecent(updated);
                        }}
                        className="shrink-0 text-zinc-300 hover:text-red-400 dark:text-zinc-600 dark:hover:text-red-400 transition-colors text-base leading-none"
                      >
                        ×
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Quick suggestions — only when no recent searches and not loading */}
      {!inputValue && !loading && recent.length === 0 && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => runSearch(s.split(' ').slice(1).join(' '))}
              className="text-xs px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-800/70 border border-blue-100 dark:border-blue-900/40 text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all backdrop-blur-sm"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
