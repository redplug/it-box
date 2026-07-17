import { ref, type Ref } from 'vue';

export interface BestScore {
  best: Ref<number | null>
  updateBest: (score: number) => boolean
  clearBest: () => void
}

export function useBestScore(slug: string, isBetter: (score: number, current: number) => boolean = (score, current) => score > current): BestScore {
  const key = `game-site:${slug}:best`;
  const stored = localStorage.getItem(key);
  const parsed = stored === null ? null : Number(stored);
  const best = ref<number | null>(parsed !== null && Number.isFinite(parsed) ? parsed : null);

  function updateBest(score: number) {
    if (!Number.isFinite(score) || (best.value !== null && !isBetter(score, best.value))) return false;
    best.value = score;
    localStorage.setItem(key, String(score));
    return true;
  }

  function clearBest() {
    best.value = null;
    localStorage.removeItem(key);
  }

  return { best, updateBest, clearBest };
}
