import { computed, ref } from 'vue';

export type GameLocale = 'ko' | 'en';
const locale = ref<GameLocale>((typeof localStorage !== 'undefined' && localStorage.getItem('game-site:locale') as GameLocale) || 'ko');

const copy = {
  ko: {
    subtitle: '간단한 웹게임', games: '게임', allGames: '모든 게임', favorites: '즐겨찾기', search: '게임 검색', language: '한국어',
    home: '홈', menu: '메뉴 열기/닫기', description: '설치 없이 즐기는 간단한 브라우저 게임 모음입니다.',
    titles: { 'number-guessing': '숫자 맞히기', 'number-baseball': '숫자 야구', reaction: '반응속도 테스트', 'tic-tac-toe': '틱택토' },
    descriptions: { 'number-guessing': '열 번 안에 1부터 100 사이의 숫자를 맞혀 보세요.', 'number-baseball': '스트라이크와 볼 힌트로 숨겨진 세 자리 숫자를 맞혀 보세요.', reaction: '신호가 나타난 순간 최대한 빠르게 반응해 보세요.', 'tic-tac-toe': '한 기기에서 두 명이 번갈아 즐기는 3×3 게임입니다.' },
  },
  en: {
    subtitle: 'Simple web games', games: 'Games', allGames: 'All games', favorites: 'Favorites', search: 'Search games', language: 'English',
    home: 'Home', menu: 'Toggle menu', description: 'A collection of simple browser games with no installation required.',
    titles: { 'number-guessing': 'Number Guessing', 'number-baseball': 'Number Baseball', reaction: 'Reaction Test', 'tic-tac-toe': 'Tic-Tac-Toe' },
    descriptions: { 'number-guessing': 'Guess a number between 1 and 100 in ten attempts.', 'number-baseball': 'Guess the hidden three-digit number with strike and ball hints.', reaction: 'React as quickly as possible when the signal appears.', 'tic-tac-toe': 'A local two-player 3×3 game.' },
  },
} as const;

export function useGameLocale() {
  const c = computed(() => copy[locale.value]);
  function setLocale(value: GameLocale) { locale.value = value; localStorage.setItem('game-site:locale', value); }
  return { locale, copy: c, setLocale, gameTitle: (slug: string) => c.value.titles[slug as keyof typeof copy.ko.titles], gameDescription: (slug: string) => c.value.descriptions[slug as keyof typeof copy.ko.descriptions] };
}
