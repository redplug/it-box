<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { createGame, playMove, resetGame } from './engine';
import { useGameLocale } from '../../composables/useGameLocale';

interface Results {
  X: number
  O: number
  draws: number
}

const STORAGE_KEY = 'game-site:tic-tac-toe:results';
const game = ref(createGame());
const results = ref<Results>({ X: 0, O: 0, draws: 0 });
const { locale } = useGameLocale();

const statusMessage = computed(() => {
  if (game.value.status === 'won') {
    return locale.value === 'en' ? `${game.value.winner} wins!` : `${game.value.winner} 승리!`;
  }
  if (game.value.status === 'draw') {
    return locale.value === 'en' ? 'It is a draw.' : '무승부입니다.';
  }
  return locale.value === 'en' ? `${game.value.currentPlayer}'s turn.` : `${game.value.currentPlayer} 차례입니다.`;
});

function selectCell(index: number) {
  game.value = playMove(game.value, index);
}

function restart() {
  game.value = resetGame();
}

onMounted(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<Results>;
      results.value = {
        X: Number.isFinite(parsed.X) ? Number(parsed.X) : 0,
        O: Number.isFinite(parsed.O) ? Number(parsed.O) : 0,
        draws: Number.isFinite(parsed.draws) ? Number(parsed.draws) : 0,
      };
    }
  }
  catch {
    localStorage.removeItem(STORAGE_KEY);
  }
});

watch(() => game.value.status, (status, previousStatus) => {
  if (previousStatus !== 'playing' || status === 'playing') {
    return;
  }
  if (status === 'won' && game.value.winner) {
    results.value[game.value.winner] += 1;
  }
  else if (status === 'draw') {
    results.value.draws += 1;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results.value));
});
</script>

<template>
  <section class="tic-tac-toe" aria-labelledby="tic-tac-toe-title">
    <header>
    <h1 id="tic-tac-toe-title">{{ locale === 'en' ? 'Tic-Tac-Toe' : '틱택토' }}</h1>
      <p>{{ locale === 'en' ? 'Take turns completing three cells in a row, column, or diagonal.' : '두 사람이 번갈아 칸을 선택해 가로, 세로 또는 대각선 세 칸을 먼저 완성하세요.' }}</p>
    </header>

    <p class="status" aria-live="polite">{{ statusMessage }}</p>

    <div class="board" role="grid" aria-label="틱택토 게임판">
      <button
        v-for="(cell, index) in game.board"
        :key="index"
        class="cell"
        :class="{ winner: game.winningLine?.includes(index) }"
        type="button"
        role="gridcell"
        :aria-label="cell ? `${index + 1}번 칸: ${cell}` : `${index + 1}번 빈 칸`"
        :disabled="cell !== null || game.status !== 'playing'"
        @click="selectCell(index)"
      >
        {{ cell }}
      </button>
    </div>

    <button class="restart" type="button" @click="restart">{{ locale === 'en' ? 'New game' : '새 게임' }}</button>

    <dl class="results" aria-label="이 브라우저의 경기 기록">
      <div><dt>X 승</dt><dd>{{ results.X }}</dd></div>
      <div><dt>O 승</dt><dd>{{ results.O }}</dd></div>
      <div><dt>무승부</dt><dd>{{ results.draws }}</dd></div>
    </dl>
  </section>
</template>

<style scoped>
.tic-tac-toe { display: grid; justify-items: center; gap: 1.25rem; width: min(100%, 34rem); margin-inline: auto; }
.tic-tac-toe header { text-align: center; }
.tic-tac-toe h1 { margin: 0 0 .5rem; }
.tic-tac-toe p { margin: 0; line-height: 1.6; }
.status { min-height: 1.5rem; font-size: 1.125rem; font-weight: 700; }
.board { display: grid; grid-template-columns: repeat(3, minmax(4.5rem, 7rem)); gap: .5rem; }
.cell { aspect-ratio: 1; border: 1px solid var(--border-color, #cbd5e1); border-radius: .75rem; background: var(--surface-color, #fff); color: inherit; font: 700 clamp(2rem, 10vw, 3.5rem)/1 sans-serif; cursor: pointer; }
.cell:hover:not(:disabled), .cell:focus-visible { border-color: var(--accent-color, #2563eb); outline: 3px solid color-mix(in srgb, var(--accent-color, #2563eb) 25%, transparent); }
.cell:disabled { cursor: default; opacity: 1; }
.cell.winner { border-color: #16a34a; background: #dcfce7; color: #166534; }
.restart { min-height: 2.75rem; padding: .65rem 1.25rem; border: 0; border-radius: .65rem; background: var(--accent-color, #2563eb); color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
.results { display: flex; gap: 1.5rem; margin: 0; text-align: center; }
.results div { display: grid; gap: .2rem; }
.results dt { color: var(--muted-color, #64748b); font-size: .875rem; }
.results dd { margin: 0; font-weight: 700; }
</style>
