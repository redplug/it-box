import { computed, ref } from 'vue';

export type GameLocale = 'ko' | 'en';
export const locale = ref<GameLocale>((typeof localStorage !== 'undefined' && localStorage.getItem('game-site:locale') as GameLocale) || 'ko');

const copy = {
  ko: {
    subtitle: '간단한 웹게임', games: '게임', allGames: '모든 게임', favorites: '즐겨찾기', search: '게임 검색', language: '한국어',
    home: '홈', menu: '메뉴 열기/닫기', description: '설치 없이 즐기는 간단한 무료 웹게임 모음입니다.',
    accessibility: { directionControls: '방향 조작', up: '위로 이동', left: '왼쪽으로 이동', down: '아래로 이동', right: '오른쪽으로 이동', flap: '새 날리기', connectFourBoard: '커넥트 포 게임판', hiddenWord: '숨겨진 단어', sudokuBoard: '스도쿠 게임판', sudokuDigits: '숫자 선택', sudokuCell: (row: number, column: number) => `${row + 1}행 ${column + 1}열` },
    titles: { 'number-guessing': '숫자 맞히기', 'number-baseball': '숫자 야구', reaction: '반응속도 테스트', 'tic-tac-toe': '틱택토', snake: '뱀 게임', '2048': '2048 숫자 퍼즐', minesweeper: '지뢰찾기', 'memory-match': '카드 짝맞추기', 'connect-four': '커넥트 포', breakout: '벽돌깨기', hangman: '행맨', sokoban: '창고 밀기', sudoku: '스도쿠', flappy: '플래피 점프', typing: '타이핑 스프린트' },
    descriptions: { 'number-guessing': '열 번 안에 1부터 100 사이의 숫자를 맞혀 보세요.', 'number-baseball': '스트라이크와 볼 힌트로 숨겨진 세 자리 숫자를 맞혀 보세요.', reaction: '신호가 나타난 순간 최대한 빠르게 반응해 보세요.', 'tic-tac-toe': '한 기기에서 두 명이 번갈아 즐기는 3×3 게임입니다.', snake: '먹이를 먹고 몸을 키워 최고 점수에 도전하세요.', '2048': '같은 숫자를 합쳐 2048 타일을 만들어 보세요.', minesweeper: '안전한 칸을 열고 지뢰를 찾아 보드를 클리어하세요.', 'memory-match': '카드를 뒤집어 모든 짝을 찾아보세요.', 'connect-four': '상대보다 먼저 같은 색 말 네 개를 이어 보세요.', breakout: '패들을 움직여 모든 벽돌을 깨 보세요.', hangman: '숨겨진 단어를 한 글자씩 맞혀 보세요.', sokoban: '모든 상자를 목표 지점으로 밀어 넣으세요.', sudoku: '논리적으로 숫자를 배치해 9×9 퍼즐을 완성하세요.', flappy: '새를 날려 파이프 사이를 통과하며 점수를 올리세요.', typing: '문장을 빠르고 정확하게 입력해 기록을 세우세요.' },
  },
  en: {
    subtitle: 'Simple web games', games: 'Games', allGames: 'All games', favorites: 'Favorites', search: 'Search games', language: 'English',
    home: 'Home', menu: 'Toggle menu', description: 'A collection of simple browser games with no installation required.',
    accessibility: { directionControls: 'Direction controls', up: 'Move up', left: 'Move left', down: 'Move down', right: 'Move right', flap: 'Flap', connectFourBoard: 'Connect Four board', hiddenWord: 'Hidden word', sudokuBoard: 'Sudoku board', sudokuDigits: 'Choose a digit', sudokuCell: (row: number, column: number) => `Row ${row + 1}, column ${column + 1}` },
    titles: { 'number-guessing': 'Number Guessing', 'number-baseball': 'Number Baseball', reaction: 'Reaction Test', 'tic-tac-toe': 'Tic-Tac-Toe', snake: 'Snake', '2048': '2048 Puzzle', minesweeper: 'Minesweeper', 'memory-match': 'Memory Match', 'connect-four': 'Connect Four', breakout: 'Breakout', hangman: 'Hangman', sokoban: 'Sokoban', sudoku: 'Sudoku', flappy: 'Flappy Jump', typing: 'Type Sprint' },
    descriptions: { 'number-guessing': 'Guess a number between 1 and 100 in ten attempts.', 'number-baseball': 'Guess the hidden three-digit number with strike and ball hints.', reaction: 'React as quickly as possible when the signal appears.', 'tic-tac-toe': 'A local two-player 3×3 game.', snake: 'Eat the food, grow longer, and beat your best score.', '2048': 'Combine matching numbers and reach the 2048 tile.', minesweeper: 'Reveal safe cells and clear the minefield.', 'memory-match': 'Flip cards and find every matching pair.', 'connect-four': 'Drop four discs in a row before your opponent.', breakout: 'Move the paddle and clear every brick.', hangman: 'Guess the hidden word one letter at a time.', sokoban: 'Push every box onto a target.', sudoku: 'Fill every row, column, and box with digits 1–9.', flappy: 'Fly through the gaps and beat your high score.', typing: 'Type the phrase quickly and accurately.' },
  },
} as const;

export function getGameLocaleCopy(value: GameLocale) {
  return copy[value];
}

export function getSiteMetadata(value: GameLocale, slug?: string) {
  const localized = copy[value];
  if (!slug) return { title: value === 'ko' ? 'it-box 게임' : 'it-box games', description: localized.description };
  const title = localized.titles[slug as keyof typeof localized.titles] || slug;
  const description = localized.descriptions[slug as keyof typeof localized.descriptions] || localized.description;
  return { title: `${title} | ${value === 'ko' ? 'it-box 게임' : 'it-box games'}`, description };
}

export function useGameLocale() {
  const c = computed(() => copy[locale.value]);
  function setLocale(value: GameLocale) { locale.value = value; localStorage.setItem('game-site:locale', value); }
  return { locale, copy: c, setLocale, gameTitle: (slug: string) => c.value.titles[slug as keyof typeof copy.ko.titles], gameDescription: (slug: string) => c.value.descriptions[slug as keyof typeof copy.ko.descriptions] };
}
