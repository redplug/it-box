<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { createGame, continueGame, move, type Direction, type GameState } from './engine';
import { useGameLocale } from '../../composables/useGameLocale';

const STORAGE_KEY = 'game-site:2048:best';
const state = ref<GameState>(createGame());
const best = ref(readBest());
const touchStart = ref<{ x: number, y: number } | null>(null);
const { locale } = useGameLocale();

const copy = computed(() => locale.value === 'en' ? {
  title: '2048', intro: 'Join the numbers and reach the 2048 tile.', score: 'Score', best: 'Best', newGame: 'New game', keepGoing: 'Keep going', playAgain: 'Try again', won: 'You reached 2048!', over: 'Game over', controls: 'Use arrow keys, WASD, or swipe to move.', board: '2048 game board', tile: (value: number) => `Tile ${value}`,
} : {
  title: '2048 숫자 퍼즐', intro: '숫자를 합쳐 2048 타일을 만들어 보세요.', score: '점수', best: '최고 점수', newGame: '새 게임', keepGoing: '계속하기', playAgain: '다시 하기', won: '2048을 만들었어요!', over: '게임 종료', controls: '방향키, WASD 또는 스와이프로 이동하세요.', board: '2048 게임 보드', tile: (value: number) => `${value} 타일`,
});

function readBest(): number {
  if (typeof localStorage === 'undefined') return 0;
  const value = Number(localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function saveBest(score: number) {
  if (score > best.value) {
    best.value = score;
    localStorage.setItem(STORAGE_KEY, String(score));
  }
}

function play(direction: Direction) {
  const result = move(state.value, direction);
  if (!result.changed) return;
  state.value = result.state;
  saveBest(state.value.score);
}

function restart() {
  state.value = createGame();
}

function handleKey(event: KeyboardEvent) {
  const directions: Record<string, Direction> = { ArrowUp: 'up', w: 'up', W: 'up', ArrowRight: 'right', d: 'right', D: 'right', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left' };
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  play(direction);
}

function handleTouchStart(event: TouchEvent) {
  const touch = event.changedTouches[0];
  touchStart.value = { x: touch.clientX, y: touch.clientY };
}

function handleTouchEnd(event: TouchEvent) {
  if (!touchStart.value) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.value.x;
  const dy = touch.clientY - touchStart.value.y;
  touchStart.value = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) play(dx > 0 ? 'right' : 'left');
  else play(dy > 0 ? 'down' : 'up');
}

function cellValue(index: number): number {
  return state.value.board[Math.floor(index / 4)][index % 4];
}

function tileClass(value: number): string {
  return value > 2048 ? 'tile-super' : `tile-${value}`;
}

function keepGoing() {
  state.value = continueGame(state.value);
}

onMounted(() => window.addEventListener('keydown', handleKey));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey));
</script>

<template>
  <section class="game-2048" aria-labelledby="game-2048-title">
    <header class="game-2048-header">
      <div>
        <p class="eyebrow">IT-BOX · PUZZLE</p>
        <h2 id="game-2048-title">{{ copy.title }}</h2>
        <p>{{ copy.intro }}</p>
      </div>
      <button class="new-game" type="button" @click="restart">{{ copy.newGame }}</button>
    </header>

    <div class="score-row" aria-live="polite">
      <span>{{ copy.score }} <strong>{{ state.score }}</strong></span>
      <span>{{ copy.best }} <strong>{{ best }}</strong></span>
    </div>

    <div class="board-wrap">
      <div class="board-2048" role="grid" :aria-label="copy.board" @touchstart.passive="handleTouchStart" @touchend.passive="handleTouchEnd">
        <div v-for="index in 16" :key="index" class="tile tile-empty" role="gridcell" aria-hidden="true">
          <span v-if="cellValue(index - 1)" class="tile-value" :class="tileClass(cellValue(index - 1))" :aria-label="copy.tile(cellValue(index - 1))">{{ cellValue(index - 1) }}</span>
        </div>
      </div>
      <div v-if="state.status !== 'playing'" class="result-overlay" role="dialog" aria-modal="true" aria-live="polite">
        <h3>{{ state.status === 'won' ? copy.won : copy.over }}</h3>
        <div class="result-actions">
          <button v-if="state.status === 'won'" type="button" @click="keepGoing">{{ copy.keepGoing }}</button>
          <button type="button" class="primary" @click="restart">{{ copy.playAgain }}</button>
        </div>
      </div>
    </div>

    <p class="controls-help">{{ copy.controls }}</p>
  </section>
</template>

<style scoped>
.game-2048 { width: min(100%, 34rem); margin: 0 auto; color: var(--text-color, #f4f7fb); }
.game-2048-header { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.game-2048 h2 { margin: .15rem 0 .35rem; font-size: clamp(1.8rem, 5vw, 2.4rem); letter-spacing: -.04em; }
.game-2048-header p:last-child { margin: 0; color: var(--muted-color, #9ca9ba); }
.new-game, .result-actions button { border: 0; border-radius: .55rem; padding: .65rem .9rem; color: #fff; background: #168dcc; font-weight: 800; cursor: pointer; white-space: nowrap; }
.new-game:hover, .result-actions button:hover { filter: brightness(1.1); }
.score-row { display: flex; justify-content: space-between; margin: 0 0 .55rem; color: var(--muted-color, #9ca9ba); font-size: .9rem; }
.score-row strong { margin-left: .25rem; color: var(--text-color, #f4f7fb); font-size: 1.15rem; }
.board-wrap { position: relative; width: 100%; aspect-ratio: 1; }
.board-2048 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3%; width: 100%; height: 100%; padding: 3%; border-radius: .7rem; background: #a99b8b; touch-action: none; }
.tile { display: grid; place-items: center; min-width: 0; border-radius: .4rem; background: #c8bbae; }
.tile-value { display: grid; width: 100%; height: 100%; place-items: center; border-radius: .4rem; color: #776e65; font-size: clamp(1.2rem, 8vw, 2.4rem); font-weight: 900; line-height: 1; animation: appear .12s ease-out; }
.tile-2 { background: #eee4da; } .tile-4 { background: #ede0c8; } .tile-8 { color: #f9f6f2; background: #f2b179; } .tile-16 { color: #f9f6f2; background: #f59563; } .tile-32 { color: #f9f6f2; background: #f67c5f; } .tile-64 { color: #f9f6f2; background: #f65e3b; } .tile-128 { color: #f9f6f2; background: #edcf72; font-size: clamp(1rem, 6vw, 2rem); } .tile-256 { color: #f9f6f2; background: #edcc61; font-size: clamp(1rem, 6vw, 2rem); } .tile-512 { color: #f9f6f2; background: #edc850; font-size: clamp(1rem, 6vw, 2rem); } .tile-1024, .tile-2048, .tile-super { color: #f9f6f2; background: #edc53f; font-size: clamp(.85rem, 5vw, 1.7rem); } .tile-2048 { box-shadow: 0 0 1.3rem #f5d76e; }
.result-overlay { position: absolute; inset: 0; display: grid; place-content: center; gap: 1rem; border-radius: .7rem; background: rgba(238, 228, 218, .88); color: #776e65; text-align: center; backdrop-filter: blur(3px); }
.result-overlay h3 { margin: 0; font-size: 1.8rem; } .result-actions { display: flex; justify-content: center; gap: .5rem; } .result-actions .primary { background: #8f7a66; }
.controls-help { margin: 1rem 0 0; color: var(--muted-color, #9ca9ba); font-size: .9rem; text-align: center; }
button:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
@keyframes appear { from { transform: scale(.7); opacity: .4; } to { transform: scale(1); opacity: 1; } }
@media (max-width: 480px) { .game-2048-header { align-items: start; flex-direction: column; } .new-game { align-self: stretch; } }
</style>
