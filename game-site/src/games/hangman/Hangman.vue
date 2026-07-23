<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useBestScore } from '../../composables/useBestScore';
import { useGameLocale } from '../../composables/useGameLocale';
import { createHangmanGame, guessLetter } from './engine';

const WORDS = ['VUE', 'BROWSER', 'PUZZLE', 'CODING', 'KEYBOARD', 'ARCADE'];
const { locale } = useGameLocale();
const word = ref(WORDS[Math.floor(Math.random() * WORDS.length)]);
const game = ref(createHangmanGame(word.value));
const { best, updateBest } = useBestScore('hangman', (score, current) => score < current);
const copy = computed(() => locale.value === 'en' ? { title: 'Hangman', intro: 'Guess the hidden word one letter at a time.', wrong: 'Wrong guesses', best: 'Best', reset: 'New word', won: 'You solved it!', lost: `The word was ${game.value.word}.`, keyboard: 'Letter keyboard' } : { title: '행맨', intro: '숨겨진 단어를 한 글자씩 맞혀 보세요.', wrong: '틀린 횟수', best: '최고 기록', reset: '새 단어', won: '단어를 맞혔어요!', lost: `정답은 ${game.value.word}입니다.`, keyboard: '알파벳 키보드' });
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
function chooseWord() { word.value = WORDS[Math.floor(Math.random() * WORDS.length)]; game.value = createHangmanGame(word.value); }
function play(letter: string) { game.value = guessLetter(game.value, letter); if (game.value.status === 'won') updateBest(game.value.wrongGuesses); }
function handleKey(event: KeyboardEvent) { if (/^[a-z]$/i.test(event.key)) { event.preventDefault(); play(event.key); } }
onMounted(() => window.addEventListener('keydown', handleKey));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey));
</script>

<template>
  <section class="hangman" aria-labelledby="hangman-title">
    <header><p class="eyebrow">IT-BOX · WORD</p><h1 id="hangman-title">{{ copy.title }}</h1><p>{{ copy.intro }}</p></header>
    <div class="stats"><span>{{ copy.wrong }} <strong>{{ game.wrongGuesses }} / {{ game.maxWrongGuesses }}</strong></span><span>{{ copy.best }} <strong>{{ best ?? '—' }}</strong></span></div>
    <div class="word" aria-live="polite" aria-label="Hidden word">{{ [...game.word].map(letter => game.guessedLetters.includes(letter) || game.status !== 'playing' ? letter : '_').join(' ') }}</div>
    <p class="status" aria-live="polite">{{ game.status === 'won' ? copy.won : game.status === 'lost' ? copy.lost : '' }}</p>
    <div class="keyboard" role="group" :aria-label="copy.keyboard"><button v-for="letter in alphabet" :key="letter" type="button" :disabled="game.guessedLetters.includes(letter) || game.status !== 'playing'" @click="play(letter)">{{ letter }}</button></div>
    <button class="reset" type="button" @click="chooseWord">{{ copy.reset }}</button>
  </section>
</template>

<style scoped>
.hangman { display: grid; justify-items: center; gap: 1rem; width: min(100%, 38rem); margin: 0 auto; color: var(--text-color); text-align: center; } header h1 { margin: 0 0 .4rem; font-size: clamp(2rem, 7vw, 3rem); } header p:last-child { margin: 0; color: var(--muted-color); } .eyebrow { margin: 0 0 .25rem; color: #ec4899; font-size: .75rem; font-weight: 800; letter-spacing: .15em; } .stats { display: flex; justify-content: space-between; width: 100%; color: var(--muted-color); } .stats strong { color: var(--text-color); } .word { min-height: 3rem; color: #ec4899; font-size: clamp(1.8rem, 8vw, 3rem); font-weight: 900; letter-spacing: .25em; } .status { min-height: 1.5rem; margin: 0; color: #16a34a; } .keyboard { display: flex; flex-wrap: wrap; justify-content: center; gap: .4rem; max-width: 34rem; } .keyboard button { width: 2.25rem; height: 2.5rem; border: 1px solid #f9a8d4; border-radius: .4rem; color: #831843; background: #fce7f3; font-weight: 700; cursor: pointer; } .keyboard button:disabled { opacity: .35; cursor: default; } .keyboard button:focus-visible, .reset:focus-visible { outline: 3px solid #fff; outline-offset: 3px; } .reset { border: 0; border-radius: .6rem; padding: .7rem 1.15rem; color: #fff; background: #db2777; font-weight: 700; cursor: pointer; }
</style>
