import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { SearchResponse } from '@/types/recipe';
import { useRecipeStore } from '@/store/recipeStore';

export function useRecipeSearch() {
  const { setRecipes, setLoading, setError } = useRecipeStore();

  return useMutation({
    mutationFn: async (query: string) => {
      const { data } = await axios.post<SearchResponse>('/api/search', { query });
      return data;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
      setRecipes([]);
    },
    onSuccess: (data) => {
      setRecipes(data.recipes ?? []);
      setLoading(false);
      if (data.warning) setError(data.warning);
    },
    onError: (err: unknown) => {
      const message =
        axios.isAxiosError(err)
          ? (err.response?.data?.error ?? err.message)
          : 'Something went wrong';
      setError(message);
      setLoading(false);
    },
  });
}
