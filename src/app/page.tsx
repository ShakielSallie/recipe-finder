'use client';

import { SearchBar } from '@/components/SearchBar';
import { RecipeGrid } from '@/components/RecipeGrid';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRecipeStore } from '@/store/recipeStore';
import { useRecipeSearch } from '@/hooks/useRecipeSearch';

export default function Home() {
  const { error, query, setError } = useRecipeStore();
  const { mutate: search } = useRecipeSearch();

  const handleRetry = () => {
    if (!query) return;
    setError(null);
    search(query);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-blue-950/30 transition-colors">

      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-300 opacity-25 blur-3xl dark:opacity-10" />
        <div className="animate-blob animation-delay-2000 absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-purple-400 opacity-20 blur-3xl dark:opacity-10" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-teal-300 opacity-25 blur-3xl dark:opacity-10" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">

        {/* Theme toggle */}
        <div className="absolute top-6 right-4 sm:right-0">
          <ThemeToggle />
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-300 mb-6 uppercase tracking-widest">
            ✨ Powered by Local AI
          </div>

          <h1 className="animate-gradient-x text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 bg-clip-text text-transparent leading-none pb-2">
            Smart Recipe<br />Finder
          </h1>

          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Describe what you&apos;re craving — AI searches the web and builds your recipe card instantly.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar />
        </div>

        {/* Error banner */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-red-200 bg-red-50/80 dark:bg-red-950/30 dark:border-red-800/50 backdrop-blur-sm px-5 py-4 text-sm text-red-700 dark:text-red-400 flex items-start justify-between gap-4">
            <span>{error}</span>
            {query && (
              <button
                onClick={handleRetry}
                className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline transition-all"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <RecipeGrid />
      </div>
    </main>
  );
}
