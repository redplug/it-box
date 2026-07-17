<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { activateReactionGame, createReactionGame, markReady, startReactionGame } from './engine';
import { useGameLocale } from '../../composables/useGameLocale';

const storageKey = 'game-site:reaction:best';
const state = ref(createReactionGame());
const best = ref(readBest());
let timer: ReturnType<typeof setTimeout> | undefined;
const { locale } = useGameLocale();

const label = computed(() => ({
  idle: locale.value === 'en' ? 'Click to start' : '시작하려면 누르세요',
  waiting: locale.value === 'en' ? 'Wait for green…' : '초록색이 될 때까지 기다리세요…',
  ready: locale.value === 'en' ? 'Click now!' : '지금 누르세요!',
  result: `${state.value.reactionMs}ms · ${locale.value === 'en' ? 'Click to retry' : '다시 하려면 누르세요'}`,
  'false-start': locale.value === 'en' ? 'Too early! Click to retry' : '너무 빨랐어요! 다시 하려면 누르세요',
}[state.value.status]));

function readBest(): number | null {
  if (typeof localStorage === 'undefined') return null;
  const value = Number(localStorage.getItem(storageKey));
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function saveBest(result: number) {
  if (best.value === null || result < best.value) {
    best.value = result;
    localStorage.setItem(storageKey, String(result));
  }
}

function begin() {
  state.value = startReactionGame(state.value);
  timer = setTimeout(() => {
    state.value = markReady(state.value);
    timer = undefined;
  }, 1500 + Math.floor(Math.random() * 3001));
}

function activate() {
  if (state.value.status === 'idle' || state.value.status === 'result' || state.value.status === 'false-start') {
    begin();
    return;
  }
  state.value = activateReactionGame(state.value);
  if (state.value.status === 'false-start' && timer) {
    clearTimeout(timer);
    timer = undefined;
  }
  if (state.value.status === 'result' && state.value.reactionMs !== null) saveBest(state.value.reactionMs);
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <section class="reaction-game" aria-labelledby="reaction-title">
    <h2 id="reaction-title">{{ locale === 'en' ? 'Reaction Test' : '반응 속도 테스트' }}</h2>
    <p>{{ locale === 'en' ? 'Best' : '최고 기록' }} {{ best === null ? (locale === 'en' ? 'none' : '없음') : `${best}ms` }}</p>
    <button type="button" class="reaction-pad" :class="state.status" @click="activate">
      <span role="status" aria-live="polite">{{ label }}</span>
    </button>
    <p class="help">{{ locale === 'en' ? 'Use mouse, touch, Enter, or Space to play.' : '마우스, 터치, Enter 또는 Space 키로 플레이할 수 있습니다.' }}</p>
  </section>
</template>

<style scoped>
.reaction-game { max-width: 42rem; margin: 0 auto; text-align: center; }
.reaction-pad { width: 100%; min-height: 18rem; padding: 2rem; border: 0; border-radius: 1rem; background: #1570ef; color: white; font: inherit; font-size: clamp(1.2rem, 4vw, 2rem); font-weight: 800; cursor: pointer; touch-action: manipulation; }
.reaction-pad.waiting { background: #b42318; }
.reaction-pad.ready { background: #067647; }
.reaction-pad.false-start { background: #b54708; }
.reaction-pad:focus-visible { outline: 4px solid #84adff; outline-offset: 4px; }
.help { color: var(--muted, #667085); font-size: .9rem; }
@media (max-width: 600px) { .reaction-pad { min-height: 14rem; } }
</style>
