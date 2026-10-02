import { checkTextSize } from '../_shared/local-tool';

export function countWordFrequency(text: string, caseSensitive = false): { word: string; count: number }[] {
  checkTextSize(text);
  const counts = new Map<string, number>();
  for (const token of text.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*/gu) ?? []) {
    const word = caseSensitive ? token : token.toLowerCase();
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts].map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count || (a.word < b.word ? -1 : a.word > b.word ? 1 : 0));
}
