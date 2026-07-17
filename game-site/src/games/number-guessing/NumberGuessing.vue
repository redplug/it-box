<script setup lang="ts">
import { computed, ref } from 'vue';
import { createNumberGuessingGame, submitGuess } from './engine';
import { useGameLocale } from '../../composables/useGameLocale';

const storageKey = 'game-site:number-guessing:best';
const state = ref(createNumberGuessingGame());
const guess = ref<number | null>(null);
const best = ref(readBest());
const { locale } = useGameLocale();

const message = computed(() => {
  if (state.value.error) return state.value.error;
  if (state.value.status === 'won') return locale.value === 'en' ? `Correct! You got it in ${state.value.attempts} attempts.` : `정답입니다! ${state.value.attempts}번 만에 맞혔어요.`;
  if (state.value.status === 'lost') return locale.value === 'en' ? `No attempts left. The answer was ${state.value.target}.` : `기회를 모두 사용했습니다. 정답은 ${state.value.target}입니다.`;
  if (state.value.hint === 'higher') return locale.value === 'en' ? `Higher than ${state.value.lastGuess}.` : `${state.value.lastGuess}보다 큰 수입니다.`;
  if (state.value.hint === 'lower') return locale.value === 'en' ? `Lower than ${state.value.lastGuess}.` : `${state.value.lastGuess}보다 작은 수입니다.`;
  return locale.value === 'en' ? 'Guess a number between 1 and 100.' : '1부터 100 사이의 숫자를 맞혀 보세요.';
});

function readBest(): number | null {
  if (typeof localStorage === 'undefined') return null;
  const value = Number(localStorage.getItem(storageKey));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function saveBest(attempts: number) {
  if (best.value === null || attempts < best.value) {
    best.value = attempts;
    localStorage.setItem(storageKey, String(attempts));
  }
}

function submit() {
  if (guess.value === null) return;
  state.value = submitGuess(state.value, Number(guess.value));
  if (state.value.status === 'won') saveBest(state.value.attempts);
  guess.value = null;
}

function restart() {
  state.value = createNumberGuessingGame();
  guess.value = null;
}
</script>

<template>
  <section class="number-game" aria-labelledby="number-title">
    <h2 id="number-title">{{ locale === 'en' ? 'Number Guessing' : '숫자 맞히기' }}</h2>
    <p class="record">{{ locale === 'en' ? 'Attempts' : '도전' }} {{ state.attempts }}/{{ state.maxAttempts }} · {{ locale === 'en' ? 'Best' : '최고 기록' }} {{ best ? `${best}${locale === 'en' ? '' : '회'}` : (locale === 'en' ? 'none' : '없음') }}</p>
    <p class="message" role="status" aria-live="polite">{{ message }}</p>
    <form v-if="state.status === 'playing'" @submit.prevent="submit">
      <label for="number-guess">{{ locale === 'en' ? 'Enter a number' : '숫자 입력' }}</label>
      <div class="controls">
        <input id="number-guess" v-model.number="guess" type="number" min="1" max="100" step="1" required autofocus>
        <button type="submit">{{ locale === 'en' ? 'Guess' : '확인' }}</button>
      </div>
    </form>
    <button v-else type="button" class="restart" @click="restart">{{ locale === 'en' ? 'Play again' : '다시 하기' }}</button>
  </section>
</template>

<style scoped>
.number-game { max-width: 34rem; margin: 0 auto; text-align: center; }
.record { color: var(--muted, #667085); }
.message { min-height: 3rem; font-size: 1.15rem; font-weight: 600; }
form { display: grid; gap: .5rem; text-align: left; }
.controls { display: flex; gap: .65rem; }
input { min-width: 0; flex: 1; padding: .8rem; border: 1px solid #98a2b3; border-radius: .6rem; font: inherit; }
button { padding: .8rem 1.1rem; border: 0; border-radius: .6rem; background: #1570ef; color: white; font: inherit; font-weight: 700; cursor: pointer; }
button:focus-visible, input:focus-visible { outline: 3px solid #84adff; outline-offset: 2px; }
.restart { margin-top: .75rem; }
</style>
