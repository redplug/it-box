<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useGameLocale } from '../../composables/useGameLocale';
import { createConnectFourGame, dropDisc, type ConnectPlayer } from './engine';

interface Results { red: number; yellow: number; draws: number }
const { locale, copy: localeCopy } = useGameLocale();
const game = ref(createConnectFourGame());
const results = ref<Results>({ red: 0, yellow: 0, draws: 0 });
const copy = computed(() => locale.value === 'en' ? { title: 'Connect Four', intro: 'Drop four discs in a row before your opponent.', red: 'Red', yellow: 'Yellow', turn: 'turn', win: 'wins!', draw: 'Draw game.', reset: 'New game', column: (n: number) => `Drop in column ${n}` } : { title: '커넥트 포', intro: '상대보다 먼저 같은 색 말 네 개를 이어 보세요.', red: '빨강', yellow: '노랑', turn: '차례', win: '승리!', draw: '무승부입니다.', reset: '새 게임', column: (n: number) => `${n}번 열에 놓기` });
function play(column: number) { game.value = dropDisc(game.value, column); }
function reset() { game.value = createConnectFourGame(); }
function cellLabel(index: number) { const value = game.value.board[index]; return `${Math.floor(index / game.value.columns) + 1},${index % game.value.columns + 1}: ${value ?? 'empty'}`; }
watch(() => game.value.status, status => { if (status === 'won' && game.value.winner) results.value[game.value.winner] += 1; else if (status === 'draw') results.value.draws += 1; });
onMounted(() => { try { const stored = localStorage.getItem('game-site:connect-four:results'); if (stored) results.value = { ...results.value, ...JSON.parse(stored) }; } catch { localStorage.removeItem('game-site:connect-four:results'); } });
watch(results, value => localStorage.setItem('game-site:connect-four:results', JSON.stringify(value)), { deep: true });
</script>

<template>
  <section class="connect" aria-labelledby="connect-title">
    <header><p class="eyebrow">IT-BOX · TWO PLAYER</p><h1 id="connect-title">{{ copy.title }}</h1><p>{{ copy.intro }}</p></header>
    <p class="status" aria-live="polite">{{ game.status === 'won' ? `${game.winner === 'red' ? copy.red : copy.yellow} ${copy.win}` : game.status === 'draw' ? copy.draw : `${game.currentPlayer === 'red' ? copy.red : copy.yellow} ${copy.turn}` }}</p>
    <div class="drop-row"><button v-for="column in game.columns" :key="column" type="button" :aria-label="copy.column(column)" :disabled="game.status !== 'playing'" @click="play(column - 1)">↓</button></div>
    <div class="board" role="grid" :aria-label="localeCopy.accessibility.connectFourBoard">
      <button v-for="(cell, index) in game.board" :key="index" type="button" role="gridcell" :aria-label="cellLabel(index)" :class="[cell ?? 'empty', { winner: game.winningCells.includes(index) }]" disabled>{{ cell ? '' : '·' }}</button>
    </div>
    <button class="reset" type="button" @click="reset">{{ copy.reset }}</button>
    <dl class="results"><div><dt>{{ copy.red }}</dt><dd>{{ results.red }}</dd></div><div><dt>{{ copy.yellow }}</dt><dd>{{ results.yellow }}</dd></div><div><dt>{{ copy.draw }}</dt><dd>{{ results.draws }}</dd></div></dl>
  </section>
</template>

<style scoped>
.connect { display: grid; justify-items: center; gap: 1rem; width: min(100%, 40rem); margin: 0 auto; color: var(--text-color); text-align: center; } header h1 { margin: 0 0 .4rem; font-size: clamp(2rem, 7vw, 3rem); } header p:last-child { margin: 0; color: var(--muted-color); } .eyebrow { margin: 0 0 .25rem; color: #f59e0b; font-size: .75rem; font-weight: 800; letter-spacing: .15em; } .status { min-height: 1.5rem; margin: 0; font-weight: 700; }
.drop-row, .board { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: .35rem; width: min(100%, 35rem); } .drop-row button { border: 0; border-radius: .4rem; color: var(--text-color); background: var(--control-background); font-size: 1.2rem; cursor: pointer; } .drop-row button:disabled { opacity: .45; cursor: default; } .board { padding: .65rem; border-radius: 1rem; background: #155e9b; } .board button { aspect-ratio: 1; border: 0; border-radius: 50%; color: transparent; background: #dbeafe; } .board button.red { background: #ef4444; } .board button.yellow { background: #facc15; } .board button.winner { outline: 4px solid #fff; outline-offset: -7px; } .reset { border: 0; border-radius: .6rem; padding: .7rem 1.15rem; color: #fff; background: #1570ef; font-weight: 700; cursor: pointer; } .results { display: flex; gap: 1.5rem; margin: 0; } .results div { display: grid; gap: .2rem; } .results dt { color: var(--muted-color); font-size: .8rem; } .results dd { margin: 0; font-weight: 700; }
</style>
