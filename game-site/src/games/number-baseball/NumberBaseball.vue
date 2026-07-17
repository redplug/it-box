<script setup lang="ts">
import { computed, ref } from 'vue';
import { evaluateGuess, generateSecretNumber, validateGuess, type GuessValidationError } from './engine';
import { useGameLocale } from '../../composables/useGameLocale';

interface Attempt {
  guess: string
  strikes: number
  balls: number
}

const { locale } = useGameLocale();
const secret = ref(generateSecretNumber());
const guess = ref('');
const attempts = ref<Attempt[]>([]);
const validationError = ref<GuessValidationError | null>(null);
const isWon = computed(() => attempts.value.some(attempt => attempt.strikes === 3));

const copy = computed(() => locale.value === 'en'
  ? {
      instructions: 'Guess three unique digits. A strike is a correct digit in the correct position; a ball is a correct digit in the wrong position.',
      label: 'Your guess', placeholder: 'Enter 3 unique digits', submit: 'Check guess', newGame: 'New game', history: 'Guess history', guess: 'Guess', strikes: 'Strikes', balls: 'Balls', attempts: 'Attempts', won: `You won in ${attempts.value.length} attempts!`, answer: `The answer was ${secret.value}.`,
      errors: { length: 'Enter exactly three digits.', digits: 'Use digits only.', duplicate: 'Each digit must be unique.', leadingZero: 'The first digit cannot be zero.' },
    }
  : {
      instructions: '서로 다른 세 자리 숫자를 맞혀 보세요. 숫자와 위치가 모두 맞으면 스트라이크, 숫자만 맞고 위치가 다르면 볼입니다.',
      label: '추측한 숫자', placeholder: '서로 다른 숫자 3개 입력', submit: '확인', newGame: '새 게임', history: '시도 기록', guess: '입력', strikes: '스트라이크', balls: '볼', attempts: '시도', won: `${attempts.value.length}번 만에 맞혔습니다!`, answer: `정답은 ${secret.value}입니다.`,
      errors: { length: '숫자 3개를 입력하세요.', digits: '숫자만 입력할 수 있습니다.', duplicate: '같은 숫자를 중복해서 사용할 수 없습니다.', leadingZero: '첫 번째 숫자는 0이 될 수 없습니다.' },
    });

function updateGuess(value: string) {
  guess.value = value.replace(/\D/g, '').slice(0, 3);
  validationError.value = null;
}

function submitGuess() {
  const error = validateGuess(guess.value);
  if (error) {
    validationError.value = error;
    return;
  }

  attempts.value.unshift({ guess: guess.value, ...evaluateGuess(secret.value, guess.value) });
  guess.value = '';
  validationError.value = null;
}

function startNewGame() {
  secret.value = generateSecretNumber();
  guess.value = '';
  attempts.value = [];
  validationError.value = null;
}
</script>

<template>
  <section class="number-baseball" aria-labelledby="number-baseball-title">
    <header>
      <h1 id="number-baseball-title">{{ locale === 'en' ? 'Number Baseball' : '숫자 야구' }}</h1>
      <p>{{ copy.instructions }}</p>
    </header>

    <div class="scoreboard" aria-live="polite">
      <div><span>{{ copy.strikes }}</span><strong>{{ attempts[0]?.strikes ?? 0 }}</strong></div>
      <div><span>{{ copy.balls }}</span><strong>{{ attempts[0]?.balls ?? 0 }}</strong></div>
      <div><span>{{ copy.attempts }}</span><strong>{{ attempts.length }}</strong></div>
    </div>

    <form v-if="!isWon" class="guess-form" @submit.prevent="submitGuess">
      <label for="number-baseball-guess">{{ copy.label }}</label>
      <div class="controls">
        <input id="number-baseball-guess" :value="guess" :placeholder="copy.placeholder" inputmode="numeric" autocomplete="off" maxlength="3" autofocus @input="updateGuess(($event.target as HTMLInputElement).value)">
        <button type="submit">{{ copy.submit }}</button>
      </div>
      <p v-if="validationError" class="validation" role="alert">{{ copy.errors[validationError] }}</p>
    </form>

    <div v-if="isWon" class="result" role="status">
      <strong>{{ copy.won }}</strong>
      <span>{{ copy.answer }}</span>
    </div>

    <div v-if="attempts.length" class="history">
      <h2>{{ copy.history }}</h2>
      <div class="history-row history-header"><span>{{ copy.guess }}</span><span>{{ copy.strikes }}</span><span>{{ copy.balls }}</span></div>
      <div v-for="attempt in attempts" :key="`${attempt.guess}-${attempts.length}`" class="history-row"><strong>{{ attempt.guess }}</strong><span>{{ attempt.strikes }}</span><span>{{ attempt.balls }}</span></div>
    </div>

    <button class="restart" type="button" @click="startNewGame">{{ copy.newGame }}</button>
  </section>
</template>

<style scoped>
.number-baseball { display: grid; justify-items: center; gap: 1.25rem; width: min(100%, 38rem); margin-inline: auto; }
header { text-align: center; }
h1 { margin: 0 0 .5rem; }
header p { max-width: 34rem; margin: 0; color: var(--muted, #667085); line-height: 1.6; }
.scoreboard { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; width: 100%; }
.scoreboard div { display: grid; gap: .25rem; justify-items: center; padding: .8rem; border: 1px solid var(--border, #344054); border-radius: .7rem; }
.scoreboard span, .history-header { color: var(--muted, #667085); font-size: .8rem; }
.scoreboard strong { font-size: 1.6rem; }
.guess-form, .history { width: 100%; }
.guess-form { display: grid; gap: .5rem; }
.controls { display: flex; gap: .65rem; }
input { min-width: 0; flex: 1; padding: .8rem; border: 1px solid #98a2b3; border-radius: .6rem; font: inherit; letter-spacing: .25em; text-align: center; }
button { padding: .8rem 1.1rem; border: 0; border-radius: .6rem; background: #1570ef; color: white; font: inherit; font-weight: 700; cursor: pointer; }
button:focus-visible, input:focus-visible { outline: 3px solid #84adff; outline-offset: 2px; }
.validation { margin: 0; color: #b42318; }
.result { display: grid; gap: .35rem; width: 100%; padding: 1rem; border-radius: .7rem; color: #067647; background: rgba(6, 118, 71, .12); text-align: center; }
.history h2 { margin: 0 0 .5rem; font-size: 1rem; }
.history-row { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: .65rem .75rem; border-top: 1px solid var(--border, #344054); text-align: center; }
.restart { background: transparent; color: #1570ef; }
@media (max-width: 480px) { .controls { flex-direction: column; } }
</style>
