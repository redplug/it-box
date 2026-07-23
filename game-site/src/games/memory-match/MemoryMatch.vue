<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useBestScore } from '../../composables/useBestScore';
import { useGameLocale } from '../../composables/useGameLocale';
import { createMemoryGame, flipCard, resolvePair } from './engine';

const { locale } = useGameLocale();
const game = ref(createMemoryGame());
const timeout = ref<ReturnType<typeof setTimeout>>();
const { best, updateBest } = useBestScore('memory-match', (score, current) => score < current);
const copy = computed(() => locale.value === 'en' ? { title: 'Memory Match', intro: 'Flip cards and find every matching pair.', moves: 'Moves', best: 'Best', reset: 'New game', hidden: 'Hidden card', matched: 'Matched', won: `Completed in ${game.value.moves} moves!` } : { title: '카드 짝맞추기', intro: '카드를 뒤집어 모든 짝을 찾아보세요.', moves: '이동', best: '최고 기록', reset: '새 게임', hidden: '숨겨진 카드', matched: '맞춘 카드', won: `${game.value.moves}번 만에 완료했습니다!` });

function clearTimeoutHandle() { if (timeout.value) { clearTimeout(timeout.value); timeout.value = undefined; } }
function reset() { clearTimeoutHandle(); game.value = createMemoryGame(); }
function flip(index: number) {
  const next = flipCard(game.value, index);
  if (next === game.value) return;
  game.value = next;
  if (next.selectedIndices.length === 2) {
    clearTimeoutHandle();
    timeout.value = setTimeout(() => { game.value = resolvePair(game.value); timeout.value = undefined; if (game.value.status === 'won') updateBest(game.value.moves); }, 550);
  }
}
function label(index: number) { const card = game.value.cards[index]; return card.matched ? `${index + 1}: ${copy.value.matched}` : card.faceUp ? `${index + 1}: ${card.pairId + 1}` : `${index + 1}: ${copy.value.hidden}`; }
onBeforeUnmount(clearTimeoutHandle);
</script>

<template>
  <section class="memory" aria-labelledby="memory-title">
    <header><p class="eyebrow">IT-BOX · MEMORY</p><h1 id="memory-title">{{ copy.title }}</h1><p>{{ copy.intro }}</p></header>
    <div class="stats"><span>{{ copy.moves }} <strong>{{ game.moves }}</strong></span><span>{{ copy.best }} <strong>{{ best ?? '—' }}</strong></span></div>
    <div class="cards" role="grid">
      <button v-for="(card, index) in game.cards" :key="card.id" type="button" role="gridcell" :aria-label="label(index)" :class="{ open: card.faceUp || card.matched, matched: card.matched }" @click="flip(index)">{{ card.faceUp || card.matched ? card.pairId + 1 : '?' }}</button>
    </div>
    <p class="status" aria-live="polite">{{ game.status === 'won' ? copy.won : '' }}</p>
    <button class="reset" type="button" @click="reset">{{ copy.reset }}</button>
  </section>
</template>

<style scoped>
.memory { display: grid; justify-items: center; gap: 1rem; width: min(100%, 38rem); margin: 0 auto; text-align: center; color: var(--text-color); } header h1 { margin: 0 0 .4rem; font-size: clamp(2rem, 7vw, 3rem); } header p:last-child { margin: 0; color: var(--muted-color); } .eyebrow { margin: 0 0 .25rem; color: #a855f7; font-size: .75rem; font-weight: 800; letter-spacing: .15em; } .stats { display: flex; justify-content: space-between; width: 100%; color: var(--muted-color); } .stats strong { color: var(--text-color); }
.cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .55rem; width: min(100%, 34rem); } .cards button { aspect-ratio: 1; border: 2px solid #a855f7; border-radius: .7rem; color: #fff; background: #6b21a8; font-size: clamp(1.4rem, 7vw, 2.4rem); font-weight: 800; cursor: pointer; transition: transform .12s, background .12s; } .cards button.open { color: #4c1d95; background: #f3e8ff; } .cards button.matched { color: #166534; border-color: #22c55e; background: #dcfce7; } .cards button:focus-visible { outline: 3px solid #fff; outline-offset: 3px; } .status { min-height: 1.5rem; color: #16a34a; } .reset { border: 0; border-radius: .6rem; padding: .7rem 1.15rem; color: #fff; background: #7e22ce; font-weight: 700; cursor: pointer; }
</style>
