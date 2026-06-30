'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Recipe } from '@/types/recipe';

const INGREDIENTS_PREVIEW = 4;

const CARD_ACCENTS = [
  'from-blue-400 to-teal-400',
  'from-purple-400 to-indigo-400',
  'from-teal-400 to-cyan-400',
  'from-indigo-500 to-purple-400',
  'from-cyan-400 to-blue-500',
  'from-violet-400 to-teal-400',
];

export function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const visibleIngredients = ingredientsExpanded
    ? recipe.ingredients
    : recipe.ingredients.slice(0, INGREDIENTS_PREVIEW);

  const hasMore = recipe.ingredients.length > INGREDIENTS_PREVIEW;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div className="h-full flex flex-col rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white dark:border-zinc-700/50 shadow-lg shadow-blue-100/60 dark:shadow-blue-900/30 active:shadow-md transition-all duration-300 overflow-hidden">

        {/* Colored top accent bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${accent} shrink-0`} />

        {/* Header */}
        <div className="px-4 sm:px-5 pt-4 pb-3">
          <div className="flex items-start gap-3">
            <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white text-sm font-black shadow-sm`}>
              {index + 1}
            </span>
            <h2 className="text-base font-bold leading-snug text-zinc-900 dark:text-zinc-50 pt-1">
              {recipe.title}
            </h2>
          </div>

          {recipe.cookTime && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>⏱</span>
              {recipe.cookTime}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 px-4 sm:px-5 pb-4 space-y-5">

          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal-500 dark:text-teal-400 mb-2.5">
                <span>🥕</span> Ingredients
              </p>
              <ul className="space-y-2">
                {visibleIngredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-br ${accent} shrink-0`} />
                    {ing}
                  </li>
                ))}
              </ul>
              {hasMore && (
                <button
                  onClick={() => setIngredientsExpanded((v) => !v)}
                  className="mt-3 text-xs font-semibold text-teal-500 hover:text-teal-700 dark:hover:text-teal-300 transition-colors py-1"
                >
                  {ingredientsExpanded
                    ? '↑ Show less'
                    : `+ ${recipe.ingredients.length - INGREDIENTS_PREVIEW} more ingredients`}
                </button>
              )}
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-2.5">
                <span>📋</span> Instructions
              </p>
              <ol className="space-y-3">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-xs font-black text-white shadow-sm mt-0.5`}>
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer — 44px min touch target */}
        {recipe.source && (
          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
            <a
              href={recipe.source}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl text-sm font-bold text-white bg-gradient-to-r ${accent} hover:opacity-90 active:scale-95 transition-all shadow-sm`}
            >
              View Full Recipe →
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
