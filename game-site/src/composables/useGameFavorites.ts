import { computed, ref } from 'vue';

const favoriteSlugs = ref<string[]>(readFavorites());

function readFavorites(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('game-site:favorites') || '[]'); } catch { return []; }
}

function persist() { localStorage.setItem('game-site:favorites', JSON.stringify(favoriteSlugs.value)); }

export function useGameFavorites() {
  return {
    favoriteSlugs: computed(() => favoriteSlugs.value),
    isFavorite: (slug: string) => favoriteSlugs.value.includes(slug),
    toggleFavorite(slug: string) {
      favoriteSlugs.value = favoriteSlugs.value.includes(slug)
        ? favoriteSlugs.value.filter(item => item !== slug)
        : [...favoriteSlugs.value, slug];
      persist();
    },
  };
}
