<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useGameLocale } from '../../composables/useGameLocale';
import { createSnakeGame, queueDirection, startSnakeGame, tick, togglePause, type Direction } from './engine';

const STORAGE_KEY = 'game-site:snake:best';
const state = ref(createSnakeGame());
const best = ref(readBest());
const { locale } = useGameLocale();
let timer: ReturnType<typeof setInterval> | undefined;
let touchStart: { x: number; y: number } | null = null;

const copy = computed(() => locale.value === 'en' ? {
  title: 'Snake', intro: 'Eat the food, grow longer, and beat your best score.', score: 'Score', best: 'Best', start: 'Start game', pause: 'Pause', resume: 'Resume', restart: 'Play again', over: 'Game over', won: 'You filled the board!', controls: 'Arrow keys / WASD, or swipe to move.', paused: 'Paused',
} : {
  title: '뱀 게임', intro: '먹이를 먹고 몸을 키워 최고 점수에 도전하세요.', score: '점수', best: '최고 점수', start: '게임 시작', pause: '일시정지', resume: '계속하기', restart: '다시 하기', over: '게임 오버', won: '보드를 모두 채웠어요!', controls: '방향키 / WASD 또는 스와이프로 이동하세요.', paused: '일시정지',
});

function readBest() { const value = Number(localStorage.getItem(STORAGE_KEY)); return Number.isFinite(value) && value > 0 ? value : 0; }
function saveBest() { if (state.value.score > best.value) { best.value = state.value.score; localStorage.setItem(STORAGE_KEY, String(best.value)); } }
function clearTimer() { if (timer) { clearInterval(timer); timer = undefined; } }
function startTimer() { clearTimer(); timer = setInterval(() => { state.value = tick(state.value); if (state.value.status === 'game-over' || state.value.status === 'won') { saveBest(); clearTimer(); } }, 150); }
function begin() { state.value = startSnakeGame(createSnakeGame()); startTimer(); }
function pause() { state.value = togglePause(state.value); if (state.value.status === 'paused') clearTimer(); else startTimer(); }
function change(direction: Direction) { state.value = queueDirection(state.value, direction); }
function handleKey(event: KeyboardEvent) {
  const keys: Record<string, Direction> = { ArrowUp: 'up', w: 'up', W: 'up', ArrowRight: 'right', d: 'right', D: 'right', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left' };
  const direction = keys[event.key];
  if (direction) { event.preventDefault(); change(direction); }
  if (event.key === ' ' && (state.value.status === 'playing' || state.value.status === 'paused')) { event.preventDefault(); pause(); }
}
function handleTouchStart(event: TouchEvent) { const touch = event.touches[0]; touchStart = { x: touch.clientX, y: touch.clientY }; }
function handleTouchEnd(event: TouchEvent) {
  if (!touchStart) return;
  const touch = event.changedTouches[0]; const dx = touch.clientX - touchStart.x; const dy = touch.clientY - touchStart.y; touchStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
  change(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
}
onMounted(() => window.addEventListener('keydown', handleKey));
onBeforeUnmount(() => { clearTimer(); window.removeEventListener('keydown', handleKey); });
</script>

<template>
  <section class="snake-game" aria-labelledby="snake-title">
    <header><p class="eyebrow">IT-BOX · ARCADE</p><h2 id="snake-title">{{ copy.title }}</h2><p>{{ copy.intro }}</p></header>
    <div class="score-row"><span>{{ copy.score }} <strong>{{ state.score }}</strong></span><span>{{ copy.best }} <strong>{{ best }}</strong></span></div>
    <div class="board-wrap">
      <div class="board" role="grid" :style="{ '--size': state.size }" @touchstart.passive="handleTouchStart" @touchend.passive="handleTouchEnd">
        <div v-for="(_, index) in state.size * state.size" :key="index" class="cell" :class="{ snake: state.snake.some(segment => segment.y * state.size + segment.x === index), head: state.snake[0]?.y * state.size + state.snake[0]?.x === index, food: state.food.y * state.size + state.food.x === index }" role="gridcell" aria-hidden="true" />
      </div>
      <div v-if="state.status === 'idle' || state.status === 'paused' || state.status === 'game-over' || state.status === 'won'" class="overlay">
        <h3>{{ state.status === 'game-over' ? copy.over : state.status === 'won' ? copy.won : state.status === 'paused' ? copy.paused : copy.title }}</h3>
        <p v-if="state.status === 'idle'">{{ copy.controls }}</p>
        <button type="button" class="primary" @click="state.status === 'paused' ? pause() : begin()">{{ state.status === 'paused' ? copy.resume : state.status === 'idle' ? copy.start : copy.restart }}</button>
      </div>
    </div>
    <div class="controls" aria-label="Direction controls"><button v-for="control in [{ d: 'up', label: '↑' }, { d: 'left', label: '←' }, { d: 'down', label: '↓' }, { d: 'right', label: '→' }]" :key="control.d" type="button" :aria-label="control.d" @click="change(control.d as Direction)">{{ control.label }}</button></div>
    <button v-if="state.status === 'playing' || state.status === 'paused'" type="button" class="pause" @click="pause">{{ state.status === 'paused' ? copy.resume : copy.pause }}</button>
    <p class="help" aria-live="polite">{{ copy.controls }}</p>
  </section>
</template>

<style scoped>
.snake-game { width: min(100%, 34rem); margin: 0 auto; text-align: center; color: var(--text, #f4f7fb); }
header { margin-bottom: 1.25rem; } h2 { margin: 0 0 .4rem; font-size: clamp(2rem, 7vw, 3rem); letter-spacing: -.04em; } header p { margin: 0; color: var(--muted, #9ca9ba); } .eyebrow { color: #67e8c7; font-size: .72rem; font-weight: 800; letter-spacing: .15em; }
.score-row { display: flex; justify-content: space-between; margin: 0 auto .7rem; width: min(100%, 30rem); color: var(--muted, #9ca9ba); font-size: .9rem; } .score-row strong { color: #f4f7fb; font-size: 1.2rem; margin-left: .25rem; }
.board-wrap { position: relative; width: 100%; aspect-ratio: 1; padding: .6rem; border-radius: 1.15rem; background: linear-gradient(145deg, #162439, #0d1726); box-shadow: 0 20px 50px #02061180, inset 0 0 0 1px #ffffff12; }
.board { display: grid; grid-template-columns: repeat(var(--size), 1fr); width: 100%; height: 100%; gap: 2px; padding: 2px; border-radius: .75rem; background: #07101d; touch-action: none; }
.cell { border-radius: 3px; background: #0d1b2b; } .cell.snake { background: #4ddbb5; box-shadow: 0 0 8px #4ddbb580; } .cell.head { background: #b5ffe9; } .cell.food { background: #ff7d78; border-radius: 50%; box-shadow: 0 0 12px #ff7d7899; }
.overlay { position: absolute; inset: .6rem; display: grid; place-content: center; gap: .6rem; border-radius: .75rem; background: #07101ddd; backdrop-filter: blur(5px); } .overlay h3 { margin: 0; font-size: 1.5rem; } .overlay p { margin: 0; color: var(--muted, #b8c3d0); } button { font: inherit; cursor: pointer; touch-action: manipulation; } .primary { justify-self: center; border: 0; border-radius: 999px; padding: .7rem 1.4rem; background: #67e8c7; color: #062119; font-weight: 800; } .primary:focus-visible, .controls button:focus-visible, .pause:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
.controls { display: grid; grid-template-columns: repeat(3, 3.2rem); grid-template-rows: repeat(2, 3.2rem); justify-content: center; gap: .45rem; margin: 1rem auto .7rem; } .controls button { border: 1px solid #ffffff1c; border-radius: .75rem; background: #142238; color: #fff; font-size: 1.5rem; } .controls button:first-child { grid-column: 2; } .controls button:nth-child(2) { grid-column: 1; grid-row: 2; } .controls button:nth-child(3) { grid-column: 2; grid-row: 2; } .controls button:nth-child(4) { grid-column: 3; grid-row: 2; }
.pause { border: 0; background: none; color: #67e8c7; font-weight: 700; } .help { margin: .7rem 0 0; color: var(--muted, #8795a7); font-size: .85rem; }
</style>
