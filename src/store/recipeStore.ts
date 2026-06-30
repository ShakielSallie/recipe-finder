import { create } from 'zustand';
import { Recipe } from '@/types/recipe';

interface RecipeStore {
  query: string;
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  setQuery: (q: string) => void;
  setRecipes: (r: Recipe[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  query: '',
  recipes: [],
  loading: false,
  error: null,
  setQuery: (q) => set({ query: q }),
  setRecipes: (r) => set({ recipes: r }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
}));
