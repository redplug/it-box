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
];
