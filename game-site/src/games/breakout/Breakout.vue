<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useBestScore } from '../../composables/useBestScore';
import { useGameLocale } from '../../composables/useGameLocale';
import { createBreakoutGame, movePaddle, stepBreakout } from './engine';

const { locale } = useGameLocale();
const game = ref(createBreakoutGame());
const frame = ref<number>();
const keys = new Set<string>();
const { best, updateBest } = useBestScore('breakout');
const copy = computed(() => locale.value === 'en' ? { title: 'Breakout', intro: 'Move the paddle and clear every brick.', start: 'Start game', pause: 'Pause', resume: 'Resume', reset: 'New game', score: 'Score', best: 'Best', lives: 'Lives', won: 'You cleared the wall!', over: 'Game over', controls: 'Use ← → or A / D.' } : { title: '벽돌깨기', intro: '패들을 움직여 모든 벽돌을 깨 보세요.', start: '게임 시작', pause: '일시정지', resume: '계속하기', reset: '새 게임', score: '점수', best: '최고 점수', lives: '목숨', won: '벽돌을 모두 깼어요!', over: '게임 오버', controls: '← → 또는 A / D 키를 사용하세요.' });
function clearFrame() { if (frame.value !== undefined) { cancelAnimationFrame(frame.value); frame.value = undefined; } }
function loop(time: number) { const previous = (loop as typeof loop & { last?: number }).last ?? time; (loop as typeof loop & { last?: number }).last = time; moveWithKeys(); game.value = stepBreakout(game.value, time - previous); if (game.value.status === 'playing') frame.value = requestAnimationFrame(loop); else { clearFrame(); if (game.value.status === 'won') updateBest(game.value.score); } }
function start() { if (game.value.status === 'idle' || game.value.status === 'game-over' || game.value.status === 'won') game.value = createBreakoutGame(); game.value = { ...game.value, status: 'playing' }; clearFrame(); (loop as typeof loop & { last?: number }).last = undefined; frame.value = requestAnimationFrame(loop); }
function pause() { if (game.value.status === 'playing') { game.value = { ...game.value, status: 'paused' }; clearFrame(); } else if (game.value.status === 'paused') start(); }
function reset() { clearFrame(); game.value = createBreakoutGame(); }
function handleKey(event: KeyboardEvent) { if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', ' '].includes(event.key)) event.preventDefault(); if (event.key === ' ') pause(); else keys.add(event.key); }
function releaseKey(event: KeyboardEvent) { keys.delete(event.key); }
function moveWithKeys() { const direction = keys.has('ArrowLeft') || keys.has('a') || keys.has('A') ? -1 : keys.has('ArrowRight') || keys.has('d') || keys.has('D') ? 1 : 0; if (direction) game.value = movePaddle(game.value, direction); }
onMounted(() => { window.addEventListener('keydown', handleKey); window.addEventListener('keyup', releaseKey); });
onBeforeUnmount(() => { clearFrame(); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', releaseKey); });
</script>

<template>
  <section class="breakout" aria-labelledby="breakout-title">
    <header><p class="eyebrow">IT-BOX · ARCADE</p><h1 id="breakout-title">{{ copy.title }}</h1><p>{{ copy.intro }}</p></header>
    <div class="stats"><span>{{ copy.score }} <strong>{{ game.score }}</strong></span><span>{{ copy.best }} <strong>{{ best ?? '—' }}</strong></span><span>{{ copy.lives }} <strong>{{ game.lives }}</strong></span></div>
    <div class="arena" :style="{ aspectRatio: `${game.width} / ${game.height}` }" role="img" :aria-label="copy.controls"><span v-for="(brick, index) in game.bricks" :key="index" v-show="brick.alive" class="brick" :style="{ left: `${brick.x / game.width * 100}%`, top: `${brick.y / game.height * 100}%`, width: `${brick.width / game.width * 100}%`, height: `${brick.height / game.height * 100}%` }" /><span class="paddle" :style="{ left: `${game.paddle.x / game.width * 100}%`, width: `${game.paddle.width / game.width * 100}%` }" /><span class="ball" :style="{ left: `${game.ball.x / game.width * 100}%`, top: `${game.ball.y / game.height * 100}%` }" /></div>
    <p class="status" aria-live="polite">{{ game.status === 'won' ? copy.won : game.status === 'game-over' ? copy.over : game.status === 'paused' ? copy.pause : copy.controls }}</p>
    <div class="actions"><button type="button" @click="game.status === 'playing' || game.status === 'paused' ? pause() : start()">{{ game.status === 'playing' ? copy.pause : game.status === 'paused' ? copy.resume : copy.start }}</button><button type="button" @click="reset">{{ copy.reset }}</button></div>
  </section>
</template>

<style scoped>
.breakout { display: grid; justify-items: center; gap: 1rem; width: min(100%, 38rem); margin: 0 auto; color: var(--text-color); text-align: center; } header h1 { margin: 0 0 .4rem; font-size: clamp(2rem, 7vw, 3rem); } header p:last-child { margin: 0; color: var(--muted-color); } .eyebrow { margin: 0 0 .25rem; color: #f97316; font-size: .75rem; font-weight: 800; letter-spacing: .15em; } .stats { display: flex; justify-content: space-between; width: 100%; color: var(--muted-color); } .stats strong { color: var(--text-color); }
.arena { position: relative; width: min(100%, 22rem); overflow: hidden; border: 4px solid #334155; border-radius: .8rem; background: #0f172a; } .brick, .paddle, .ball { position: absolute; display: block; } .brick { border: 1px solid #fed7aa; border-radius: 3px; background: #f97316; } .paddle { bottom: 6%; height: 2.5%; border-radius: 99px; background: #67e8f9; } .ball { width: 3.5%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%; background: #fff; box-shadow: 0 0 10px #fff; } .status { min-height: 1.5rem; margin: 0; color: var(--muted-color); } .actions { display: flex; gap: .6rem; } button { border: 0; border-radius: .6rem; padding: .7rem 1.15rem; color: #fff; background: #ea580c; font-weight: 700; cursor: pointer; } button:last-child { color: var(--text-color); background: var(--control-background); } button:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
</style>
