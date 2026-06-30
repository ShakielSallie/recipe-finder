'use client';

import { RecipeCard } from '@/components/RecipeCard';
import { useRecipeStore } from '@/store/recipeStore';

function SkeletonCard({ index }: { index: number }) {
  const accents = ['from-blue-300 to-teal-300', 'from-purple-300 to-indigo-300', 'from-teal-300 to-cyan-300'];
  const accent = accents[index % accents.length];
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white dark:border-zinc-700/50 shadow-lg overflow-hidden animate-pulse">
      <div className={`h-1.5 bg-gradient-to-r ${accent} opacity-40`} />
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/30" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-1/2 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
        <div className="h-6 w-24 rounded-full bg-blue-50 dark:bg-blue-900/20" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-teal-100 dark:bg-teal-900/30" />
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-4/6 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-purple-100 dark:bg-purple-900/30" />
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="h-9 w-full rounded-xl bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/20 dark:to-teal-900/20" />
      </div>
    </div>
  );
}

export function RecipeGrid() {
  const { recipes, loading, query } = useRecipeStore();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  if (!loading && query && recipes.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-5">🍽️</div>
        <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">No recipes found</p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Try something like <span className="text-teal-500 font-medium">&ldquo;quick chicken stir fry&rdquo;</span> or <span className="text-purple-500 font-medium">&ldquo;easy pasta&rdquo;</span>
        </p>
      </div>
    );
  }

  if (recipes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {recipes.map((recipe, i) => (
        <RecipeCard key={`${recipe.title}-${i}`} recipe={recipe} index={i} />
      ))}
    </div>
  );
}
