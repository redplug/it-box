import type { Component } from 'vue';

export interface GameDefinition {
  slug: string
  title: string
  description: string
  component: () => Promise<Component>
}

export const games: GameDefinition[] = [
  {
    slug: 'number-guessing',
    title: '숫자 맞히기',
    description: '열 번 안에 1부터 100 사이의 숫자를 맞혀 보세요.',
    component: () => import('./number-guessing/NumberGuessing.vue'),
  },
  {
    slug: 'number-baseball',
    title: '숫자 야구',
    description: '스트라이크와 볼 힌트로 숨겨진 세 자리 숫자를 맞혀 보세요.',
    component: () => import('./number-baseball/NumberBaseball.vue'),
  },
  {
    slug: 'reaction',
    title: '반응속도 테스트',
    description: '신호가 나타난 순간 최대한 빠르게 반응해 보세요.',
    component: () => import('./reaction/ReactionTest.vue'),
  },
  {
    slug: 'tic-tac-toe',
    title: '틱택토',
    description: '한 기기에서 두 명이 번갈아 즐기는 3×3 게임입니다.',
    component: () => import('./tic-tac-toe/TicTacToe.vue'),
  },
  {
    slug: 'snake',
    title: '뱀 게임',
    description: '먹이를 먹고 몸을 키워 최고 점수에 도전하세요.',
    component: () => import('./snake/Snake.vue'),
  },
  {
    slug: '2048',
    title: '2048 숫자 퍼즐',
    description: '같은 숫자를 합쳐 2048 타일을 만들어 보세요.',
    component: () => import('./2048/Number2048.vue'),
  },
  {
    slug: 'minesweeper',
    title: '지뢰찾기',
    description: '안전한 칸을 열고 지뢰를 찾아 보드를 클리어하세요.',
    component: () => import('./minesweeper/Minesweeper.vue'),
  },
  {
    slug: 'memory-match',
    title: '카드 짝맞추기',
    description: '카드를 뒤집어 모든 짝을 찾아보세요.',
    component: () => import('./memory-match/MemoryMatch.vue'),
  },
  {
    slug: 'connect-four',
    title: '커넥트 포',
    description: '상대보다 먼저 같은 색 말 네 개를 이어 보세요.',
    component: () => import('./connect-four/ConnectFour.vue'),
  },
  {
    slug: 'breakout',
    title: '벽돌깨기',
    description: '패들을 움직여 모든 벽돌을 깨 보세요.',
    component: () => import('./breakout/Breakout.vue'),
  },
  {
    slug: 'hangman',
    title: '행맨',
    description: '숨겨진 단어를 한 글자씩 맞혀 보세요.',
    component: () => import('./hangman/Hangman.vue'),
  },
  {
    slug: 'sokoban',
    title: '창고 밀기',
    description: '모든 상자를 목표 지점으로 밀어 넣으세요.',
    component: () => import('./sokoban/Sokoban.vue'),
  },
];
