<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useBestScore } from '../../composables/useBestScore';
import { useGameLocale } from '../../composables/useGameLocale';
import { createSokobanGame, movePlayer, type Direction } from './engine';

const { locale, copy: localeCopy } = useGameLocale();
const game = ref(createSokobanGame());
const { best, updateBest } = useBestScore('sokoban', (score, current) => score < current);
const copy = computed(() => locale.value === 'en' ? { title: 'Sokoban', intro: 'Push every box onto a target.', moves: 'Moves', best: 'Best', reset: 'Reset level', won: 'Level complete!', controls: 'Arrow keys or buttons' } : { title: '창고 밀기', intro: '모든 상자를 목표 지점으로 밀어 넣으세요.', moves: '이동', best: '최고 기록', reset: '레벨 다시 시작', won: '레벨을 완료했어요!', controls: '방향키 또는 버튼으로 이동하세요.' });
function play(direction: Direction) { game.value = movePlayer(game.value, direction); if (game.value.status === 'won') updateBest(game.value.moves); }
function reset() { game.value = createSokobanGame(); }
function handleKey(event: KeyboardEvent) { const directions: Record<string, Direction> = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left', w: 'up', d: 'right', s: 'down', a: 'left' }; const direction = directions[event.key]; if (direction) { event.preventDefault(); play(direction); } }
function cellClass(index: number) { return { wall: game.value.tiles[index].includes('#'), target: game.value.targets.includes(index), box: game.value.boxes.includes(index), player: game.value.player === index }; }
onMounted(() => window.addEventListener('keydown', handleKey));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey));
</script>

<template>
  <section class="sokoban" aria-labelledby="sokoban-title">
    <header><p class="eyebrow">IT-BOX · PUZZLE</p><h1 id="sokoban-title">{{ copy.title }}</h1><p>{{ copy.intro }}</p></header>
    <div class="stats"><span>{{ copy.moves }} <strong>{{ game.moves }}</strong></span><span>{{ copy.best }} <strong>{{ best ?? '—' }}</strong></span></div>
    <div class="board" role="grid" :style="{ '--columns': game.columns }" :aria-label="copy.controls"><button v-for="(_, index) in game.tiles.flatMap(row => row.split(''))" :key="index" type="button" role="gridcell" :class="cellClass(index)" :aria-label="`${index + 1}`" disabled>{{ cellClass(index).player ? '●' : cellClass(index).box ? '■' : cellClass(index).target ? '◎' : '' }}</button></div>
    <p class="status" aria-live="polite">{{ game.status === 'won' ? copy.won : copy.controls }}</p>
    <div class="controls"><button type="button" :aria-label="localeCopy.accessibility.up" @click="play('up')">↑</button><button type="button" :aria-label="localeCopy.accessibility.left" @click="play('left')">←</button><button type="button" :aria-label="localeCopy.accessibility.down" @click="play('down')">↓</button><button type="button" :aria-label="localeCopy.accessibility.right" @click="play('right')">→</button></div>
    <button class="reset" type="button" @click="reset">{{ copy.reset }}</button>
  </section>
</template>

<style scoped>
.sokoban { display: grid; justify-items: center; gap: 1rem; width: min(100%, 38rem); margin: 0 auto; color: var(--text-color); text-align: center; } header h1 { margin: 0 0 .4rem; font-size: clamp(2rem, 7vw, 3rem); } header p:last-child { margin: 0; color: var(--muted-color); } .eyebrow { margin: 0 0 .25rem; color: #22c55e; font-size: .75rem; font-weight: 800; letter-spacing: .15em; } .stats { display: flex; justify-content: space-between; width: 100%; color: var(--muted-color); } .stats strong { color: var(--text-color); }
.board { display: grid; grid-template-columns: repeat(var(--columns), 1fr); width: min(100%, 28rem); gap: 3px; padding: .5rem; border-radius: .8rem; background: #334155; } .board button { aspect-ratio: 1; border: 0; border-radius: .25rem; color: #166534; background: #dcfce7; font-size: clamp(1rem, 6vw, 2rem); } .board button.wall { color: #cbd5e1; background: #475569; } .board button.target { background: #fef08a; } .board button.box { color: #92400e; background: #f59e0b; } .board button.player { color: #fff; background: #16a34a; } .board button.box.target { background: #22c55e; } .status { min-height: 1.5rem; margin: 0; color: var(--muted-color); } .controls { display: grid; grid-template-columns: repeat(3, 3rem); gap: .35rem; } .controls button { height: 3rem; border: 1px solid var(--border-color); border-radius: .5rem; color: var(--text-color); background: var(--control-background); font-size: 1.4rem; cursor: pointer; } .controls button:first-child { grid-column: 2; } .controls button:nth-child(2) { grid-column: 1; grid-row: 2; } .controls button:nth-child(3) { grid-column: 2; grid-row: 2; } .controls button:nth-child(4) { grid-column: 3; grid-row: 2; } .reset { border: 0; border-radius: .6rem; padding: .7rem 1.15rem; color: #fff; background: #16a34a; font-weight: 700; cursor: pointer; }
</style>
