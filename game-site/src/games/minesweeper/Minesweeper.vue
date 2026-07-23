<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useBestScore } from '../../composables/useBestScore';
import { useGameLocale } from '../../composables/useGameLocale';
import { createMinesweeperGame, revealCell, toggleFlag } from './engine';

const { locale } = useGameLocale();
const game = ref(createMinesweeperGame());
const elapsed = ref(0);
const timer = ref<ReturnType<typeof setInterval>>();
const { best, updateBest } = useBestScore('minesweeper', (score, current) => score < current);
const copy = computed(() => locale.value === 'en'
  ? { title: 'Minesweeper', intro: 'Reveal safe cells, flag mines, and clear the board.', reset: 'New game', flag: 'Flag', mine: 'Mine', hidden: 'Hidden cell', status: 'Status', playing: 'Find the mines.', won: `Cleared in ${elapsed.value} seconds!`, lost: 'You hit a mine.', best: 'Best time', seconds: 'seconds' }
  : { title: '지뢰찾기', intro: '안전한 칸을 열고 지뢰를 표시해 보드를 클리어하세요.', reset: '새 게임', flag: '지뢰 표시', mine: '지뢰', hidden: '숨겨진 칸', status: '상태', playing: '지뢰를 찾아보세요.', won: `${elapsed.value}초 만에 클리어했습니다!`, lost: '지뢰를 밟았습니다.', best: '최고 기록', seconds: '초' });

function clearTimer() { if (timer.value) { clearInterval(timer.value); timer.value = undefined; } }
function startTimer() { if (!timer.value) timer.value = setInterval(() => { elapsed.value += 1; }, 1000); }
function reset() { clearTimer(); elapsed.value = 0; game.value = createMinesweeperGame(); }
function open(index: number) { if (!game.value.started) startTimer(); game.value = revealCell(game.value, index); }
function flag(index: number) { game.value = toggleFlag(game.value, index); }
function cellLabel(index: number) { const cell = game.value.cells[index]; if (cell.flagged) return `${index + 1}: ${copy.value.flag}`; if (!cell.revealed) return `${index + 1}: ${copy.value.hidden}`; if (cell.mine) return `${index + 1}: ${copy.value.mine}`; return `${index + 1}: ${cell.adjacent || ''}`; }
watch(() => game.value.status, status => { if (status !== 'playing') { clearTimer(); if (status === 'won') updateBest(elapsed.value); } });
onBeforeUnmount(clearTimer);
</script>

<template>
  <section class="minesweeper" aria-labelledby="minesweeper-title">
    <header><p class="eyebrow">IT-BOX · PUZZLE</p><h1 id="minesweeper-title">{{ copy.title }}</h1><p>{{ copy.intro }}</p></header>
    <div class="stats"><span>{{ copy.best }} <strong>{{ best ?? '—' }}</strong> {{ best === null ? '' : copy.seconds }}</span><span>{{ elapsed }} {{ copy.seconds }}</span></div>
    <div class="board" role="grid" :style="{ '--columns': game.columns }">
      <button v-for="(cell, index) in game.cells" :key="index" type="button" role="gridcell" :aria-label="cellLabel(index)" :class="{ revealed: cell.revealed, mine: cell.revealed && cell.mine, flagged: cell.flagged }" @click="open(index)" @contextmenu.prevent="flag(index)">{{ cell.flagged ? '⚑' : cell.revealed ? (cell.mine ? '✹' : cell.adjacent || '') : '' }}</button>
    </div>
    <p class="status" aria-live="polite">{{ copy.status }}: {{ game.status === 'won' ? copy.won : game.status === 'lost' ? copy.lost : copy.playing }}</p>
    <button class="reset" type="button" @click="reset">{{ copy.reset }}</button>
  </section>
</template>

<style scoped>
.minesweeper { display: grid; justify-items: center; gap: 1rem; width: min(100%, 38rem); margin: 0 auto; color: var(--text-color); text-align: center; }
header h1 { margin: 0 0 .4rem; font-size: clamp(2rem, 7vw, 3rem); } header p:last-child { margin: 0; color: var(--muted-color); } .eyebrow { margin: 0 0 .25rem; color: #168dcc; font-size: .75rem; font-weight: 800; letter-spacing: .15em; }
.stats { display: flex; justify-content: space-between; width: 100%; color: var(--muted-color); } .stats strong { color: var(--text-color); }
.board { display: grid; grid-template-columns: repeat(var(--columns), 1fr); width: min(100%, 34rem); gap: 3px; padding: 6px; border-radius: .7rem; background: #52677d; } .board button { aspect-ratio: 1; min-width: 0; border: 0; border-radius: 3px; color: #1d4f72; background: #b9d4e8; font-weight: 800; cursor: pointer; } .board button:hover, .board button:focus-visible { outline: 3px solid #168dcc; outline-offset: 1px; } .board button.revealed { background: #e8eef3; } .board button.mine { color: #b42318; background: #fecaca; } .board button.flagged { color: #b42318; }
.status { min-height: 1.5rem; margin: 0; color: var(--muted-color); } .reset { border: 0; border-radius: .6rem; padding: .7rem 1.15rem; color: #fff; background: #1570ef; font-weight: 700; cursor: pointer; }
</style>
