# Six New Games Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 6개 게임과 규칙이 겹치지 않는 정적 브라우저 게임 6개를 `game-site`에 추가해 총 12개 게임을 제공한다.

**Architecture:** 각 게임은 `engine.ts` 순수 TypeScript 규칙 모듈, `*.test.ts` 단위 테스트, `*.vue` UI 컴포넌트로 분리한다. 기존 게임 레지스트리가 라우팅·사이드바·홈 카드를 생성하므로 게임별 파일을 추가한 뒤 레지스트리, 다국어 문구, 아이콘만 갱신한다. 시간 기반 게임은 컴포넌트에서 타이머를 소유하고 `onBeforeUnmount`에서 정리하며, 점수·기록은 `useBestScore` 또는 게임별 localStorage 키를 사용한다.

**Tech Stack:** Vue 3 Composition API, TypeScript, Vue Router, Vitest, Vite.

## Global Constraints

- 기존 게임 6개(`number-guessing`, `number-baseball`, `reaction`, `tic-tac-toe`, `snake`, `2048`)의 핵심 규칙을 재사용하거나 변형하지 않는다.
- 서버·로그인·외부 API·추가 런타임 의존성을 도입하지 않는다.
- 게임 규칙은 DOM과 localStorage에 의존하지 않는 순수 함수로 구현하고 Vitest로 테스트한다.
- 한국어와 영어 UI 문구를 모두 제공하고, 게임 상태는 `aria-live`, 조작 요소는 키보드 포커스를 제공한다.
- 라우트와 사이드바는 `game-site/src/games/registry.ts` 단일 레지스트리에서 계속 생성한다.
- 게임 종료·페이지 이동·컴포넌트 해제 시 interval, timeout, animation frame을 반드시 정리한다.

## Existing Games and Non-Overlap Decision

현재 등록 게임은 `game-site/src/games/registry.ts`의 다음 6개다.

| 기존 게임 | 핵심 규칙 | 추가 게임과의 경계 |
| --- | --- | --- |
| 숫자 맞히기 | 범위 안 숫자 추측 | 행맨은 문자·단어 추론이며 숫자 힌트를 사용하지 않음 |
| 숫자 야구 | 숫자 위치·포함 추론 | 행맨은 고정 단어의 글자 공개 방식 |
| 반응속도 | 신호 후 입력 시간 측정 | 벽돌깨기는 연속 조작·충돌·생명 규칙 |
| 틱택토 | 3×3 한 줄 완성 | 커넥트 포는 7×6 중력 낙하와 4목 |
| 뱀 게임 | 격자 이동·먹이·성장 | 지뢰찾기는 공개·깃발·주변 지뢰 추론 |
| 2048 | 격자 이동·동일 숫자 병합 | 카드 짝맞추기는 뒤집기·기억·쌍 제거 |

추가할 6개는 다음으로 확정한다.

1. **지뢰찾기** — 정보 공개와 인접 지뢰 수 추론
2. **카드 짝맞추기** — 제한된 공개 카드 기억과 매칭
3. **커넥트 포** — 7열 보드에 말을 떨어뜨려 4목 완성, 로컬 2인
4. **벽돌깨기** — 패들·공 물리와 벽돌 제거, 점수·목숨
5. **행맨** — 단어의 글자를 추측하고 실패 횟수 제한
6. **창고 밀기** — 상자를 목표 지점으로 미는 경로 계획 퍼즐

## File Map

Create one directory per game under `game-site/src/games/`:

- `minesweeper/engine.ts`, `engine.test.ts`, `Minesweeper.vue`
- `memory-match/engine.ts`, `engine.test.ts`, `MemoryMatch.vue`
- `connect-four/engine.ts`, `engine.test.ts`, `ConnectFour.vue`
- `breakout/engine.ts`, `engine.test.ts`, `Breakout.vue`
- `hangman/engine.ts`, `engine.test.ts`, `Hangman.vue`
- `sokoban/engine.ts`, `engine.test.ts`, `Sokoban.vue`

Modify only shared integration files:

- `game-site/src/games/registry.ts`: six definitions and lazy imports
- `game-site/src/composables/useGameLocale.ts`: Korean/English titles and descriptions
- `game-site/src/components/GameIcon.vue`: six deterministic SVG icons
- `game-site/src/pages/Home.vue` and `game-site/src/components/GameShell.vue`: no structural changes expected; verify registry-driven rendering

### Task 1: Add the Minesweeper engine and UI

**Files:**
- Create: `game-site/src/games/minesweeper/engine.ts`
- Create: `game-site/src/games/minesweeper/engine.test.ts`
- Create: `game-site/src/games/minesweeper/Minesweeper.vue`

**Interfaces:**
- `createMinesweeperGame(options?: { rows?: number; columns?: number; mines?: number; random?: () => number }): MinesweeperState`
- `revealCell(state: MinesweeperState, index: number): MinesweeperState`
- `toggleFlag(state: MinesweeperState, index: number): MinesweeperState`
- `resetMinesweeper(options?: CreateMinesweeperOptions): MinesweeperState`
- State contains `cells`, `status: 'playing' | 'won' | 'lost'`, `rows`, `columns`, `mines`, `flags`, `revealed`, and `elapsedSeconds`-independent board data. The engine must generate a deterministic board when `random` is injected.

- [ ] **Step 1: Write failing engine tests** for mine count, safe reveal flood-fill, flag protection, mine loss, win detection, invalid/repeated cell actions, and deterministic random placement.
- [ ] **Step 2: Run `pnpm --dir game-site vitest run src/games/minesweeper/engine.test.ts` and verify it fails because the engine is absent.**
- [ ] **Step 3: Implement the pure board generator and transitions.** Guarantee the first requested reveal is safe by placing mines only after the first-cell choice, or document and test the selected first-click-safe behavior in the state transition.
- [ ] **Step 4: Run the focused test and verify all Minesweeper engine tests pass.**
- [ ] **Step 5: Build `Minesweeper.vue` with a 9×9 beginner board, reveal/flag controls, reset button, elapsed timer, local best time via `useBestScore('minesweeper', (score, current) => score < current)`, keyboard-focusable cell buttons, and `aria-live` status.** Use one timeout/interval and clear it on win, loss, reset, and unmount.
- [ ] **Step 6: Run `pnpm --dir game-site typecheck` and verify the component compiles.**

### Task 2: Add the Memory Match engine and UI

**Files:**
- Create: `game-site/src/games/memory-match/engine.ts`
- Create: `game-site/src/games/memory-match/engine.test.ts`
- Create: `game-site/src/games/memory-match/MemoryMatch.vue`

**Interfaces:**
- `createMemoryGame(options?: { pairCount?: number; random?: () => number }): MemoryGameState`
- `flipCard(state: MemoryGameState, index: number): MemoryGameState`
- `resolvePair(state: MemoryGameState): MemoryGameState`
- `resetMemoryGame(options?: CreateMemoryGameOptions): MemoryGameState`
- State contains unique `cards` with `id`, `pairId`, and `faceUp/matched` flags, `selectedIndices`, `moves`, and `status: 'playing' | 'won'`.

- [ ] **Step 1: Write failing tests** for shuffled pairs, no third card while two cards are pending, matching pairs, mismatches, duplicate/repeated flips, move counting, and win detection.
- [ ] **Step 2: Run `pnpm --dir game-site vitest run src/games/memory-match/engine.test.ts` and verify failure.**
- [ ] **Step 3: Implement deterministic shuffle and immutable card transitions; keep delayed mismatch timing in the Vue component rather than the engine.**
- [ ] **Step 4: Run the focused tests and verify they pass.**
- [ ] **Step 5: Build a responsive 4×4 card grid with keyboard buttons, a short mismatch timeout cleared on reset/unmount, moves counter, new-game control, win announcement, and local best score measured as fewest moves.**
- [ ] **Step 6: Run `pnpm --dir game-site typecheck`.**

### Task 3: Add the Connect Four engine and UI

**Files:**
- Create: `game-site/src/games/connect-four/engine.ts`
- Create: `game-site/src/games/connect-four/engine.test.ts`
- Create: `game-site/src/games/connect-four/ConnectFour.vue`

**Interfaces:**
- `createConnectFourGame(): ConnectFourGame`
- `dropDisc(game: ConnectFourGame, column: number): ConnectFourGame`
- `resetConnectFour(): ConnectFourGame`
- State contains a 6×7 board, `currentPlayer: 'red' | 'yellow'`, `status: 'playing' | 'won' | 'draw'`, `winner`, and `winningCells`.

- [ ] **Step 1: Write failing tests** for gravity, full-column rejection, horizontal/vertical/diagonal four-in-a-row, draw, turn switching, and moves after terminal state.
- [ ] **Step 2: Run the focused Vitest file and verify failure.**
- [ ] **Step 3: Implement immutable column drops and four-direction win scanning.**
- [ ] **Step 4: Run the focused tests and verify they pass.**
- [ ] **Step 5: Build a 7×6 button-based board with column controls, turn/status `aria-live`, winning-cell styling, restart, local two-player results in `localStorage`, and a mobile-friendly layout.**
- [ ] **Step 6: Run `pnpm --dir game-site typecheck`.**

### Task 4: Add the Breakout engine and UI

**Files:**
- Create: `game-site/src/games/breakout/engine.ts`
- Create: `game-site/src/games/breakout/engine.test.ts`
- Create: `game-site/src/games/breakout/Breakout.vue`

**Interfaces:**
- `createBreakoutGame(options?: { width?: number; height?: number }): BreakoutState`
- `movePaddle(state: BreakoutState, direction: -1 | 1 | 0): BreakoutState`
- `stepBreakout(state: BreakoutState, deltaMs: number): BreakoutState`
- `resetBreakout(): BreakoutState`
- State contains normalized or pixel `ball`, `paddle`, `bricks`, `score`, `lives`, and `status: 'idle' | 'playing' | 'paused' | 'won' | 'game-over'`.

- [ ] **Step 1: Write failing tests** for deterministic paddle movement bounds, wall/paddle bounce, brick collision/removal, score increment, life loss, win, pause behavior, and large-delta stability.
- [ ] **Step 2: Run the focused Vitest file and verify failure.**
- [ ] **Step 3: Implement a deterministic fixed-layout brick field and pure fixed-step collision update.** Keep collision rules simple and testable; do not introduce a physics library.
- [ ] **Step 4: Run the focused tests and verify they pass.**
- [ ] **Step 5: Build a canvas-free CSS/SVG or positioned-element board so it remains accessible, with keyboard/drag controls, `requestAnimationFrame` lifecycle cleanup, pause/restart, score/lives, `aria-live` status, and best score persistence.**
- [ ] **Step 6: Run `pnpm --dir game-site typecheck` and manually verify the game remains responsive on a narrow viewport.**

### Task 5: Add the Hangman engine and UI

**Files:**
- Create: `game-site/src/games/hangman/engine.ts`
- Create: `game-site/src/games/hangman/engine.test.ts`
- Create: `game-site/src/games/hangman/Hangman.vue`

**Interfaces:**
- `createHangmanGame(word: string): HangmanState`
- `guessLetter(state: HangmanState, letter: string): HangmanState`
- `resetHangman(word: string): HangmanState`
- State contains normalized `word`, `guessedLetters`, `wrongGuesses`, `maxWrongGuesses`, and `status: 'playing' | 'won' | 'lost'`.

- [ ] **Step 1: Write failing tests** for case normalization, repeated-letter reveal, repeated guess no-op, wrong-guess limit, win, loss, and terminal-state no-op.
- [ ] **Step 2: Run the focused Vitest file and verify failure.**
- [ ] **Step 3: Implement pure letter transitions and expose a small built-in Korean/English-safe word list in the component or a typed constant; keep the engine able to accept an explicit word for deterministic tests.**
- [ ] **Step 4: Run the focused tests and verify they pass.**
- [ ] **Step 5: Build the masked-word UI with on-screen keyboard and physical keyboard support, wrong-guess counter, reset, `aria-live` result, and a best score based on fewest wrong guesses.**
- [ ] **Step 6: Run `pnpm --dir game-site typecheck`.**

### Task 6: Add the Sokoban engine and UI

**Files:**
- Create: `game-site/src/games/sokoban/engine.ts`
- Create: `game-site/src/games/sokoban/engine.test.ts`
- Create: `game-site/src/games/sokoban/Sokoban.vue`

**Interfaces:**
- `createSokobanGame(level?: SokobanLevel): SokobanState`
- `movePlayer(state: SokobanState, direction: Direction): SokobanState`
- `resetSokoban(level?: SokobanLevel): SokobanState`
- State contains an immutable `tiles` layout, `player`, `boxes`, `targets`, `moves`, `status: 'playing' | 'won'`, and a stable level identifier. The level must be a small built-in solvable map, with walls, floor, targets, player, and boxes represented explicitly.

- [ ] **Step 1: Write failing tests** for wall blocking, ordinary movement, pushing one box, blocking two-box pushes, target occupancy, move counting, win detection, terminal-state no-op, and reset.
- [ ] **Step 2: Run `pnpm --dir game-site vitest run src/games/sokoban/engine.test.ts` and verify failure.**
- [ ] **Step 3: Implement immutable movement and box-push transitions; use a fixed level first so every test and browser run is deterministic.**
- [ ] **Step 4: Run the focused tests and verify they pass.**
- [ ] **Step 5: Build a keyboard and button-control board with focus-visible player controls, restart, move counter, `aria-live` completion status, and local best score measured as fewest moves.**
- [ ] **Step 6: Run `pnpm --dir game-site typecheck`.**

### Task 7: Register all six games and complete shared presentation

**Files:**
- Modify: `game-site/src/games/registry.ts`
- Modify: `game-site/src/composables/useGameLocale.ts`
- Modify: `game-site/src/components/GameIcon.vue`
- Test/verify: `game-site/src/pages/Home.vue`, `game-site/src/components/GameShell.vue`

- [ ] **Step 1: Add registry entries** with slugs `minesweeper`, `memory-match`, `connect-four`, `breakout`, `hangman`, and `sokoban`, Korean/English-neutral default descriptions, and lazy imports.
- [ ] **Step 2: Add both locale maps** so `gameTitle(slug)` and `gameDescription(slug)` return non-empty values for all 12 registry entries.
- [ ] **Step 3: Add unique SVG icon branches** for all six new slugs and verify unknown-slug fallback remains intact.
- [ ] **Step 4: Add a registry consistency test or equivalent type-level check** asserting every registry slug has a title, description, lazy component, and icon branch; verify home cards, sidebar links, favorites, and router routes are generated without per-game route edits.
- [ ] **Step 5: Run `pnpm --dir game-site test`, `pnpm --dir game-site typecheck`, and `pnpm --dir game-site build`.** Expected: all unit tests pass, typecheck exits 0, and Vite emits the production bundle.
- [ ] **Step 6: Start the app with `pnpm --dir game-site dev --host 127.0.0.1`, manually verify all 6 new routes from home and sidebar, then stop the dev server.** Check mobile width, theme toggle, language toggle, favorite toggle, reset controls, and no console errors.

### Task 8: End-to-end regression verification

**Files:**
- Create or modify: `game-site/e2e/six-new-games.spec.ts` (if the project adopts a Playwright config for `game-site`)
- Modify: `game-site/package.json` only if an e2e script is needed

- [ ] **Step 1: Add browser checks** for home-to-route navigation for each new slug, reset behavior, keyboard focus, and mobile viewport layout.
- [ ] **Step 2: Add game-specific checks**: Minesweeper flag/reveal, Memory Match two-card interaction, Connect Four column drop and win, Breakout start/pause, Hangman letter selection, and Sokoban move/push/win.
- [ ] **Step 3: Run the browser suite against the local Vite server.** Expected: all new-game smoke tests pass without changing existing-game behavior.
- [ ] **Step 4: Run the complete verification commands one final time:**

```bash
pnpm --dir game-site test
pnpm --dir game-site typecheck
pnpm --dir game-site build
```

Expected: all commands exit with status 0.

## Self-Review Checklist

- [ ] The six new game mechanics do not duplicate the six existing mechanics listed above.
- [ ] Every pure engine has deterministic tests for normal play and terminal/invalid states.
- [ ] Every game is reachable from the registry-generated router, sidebar, and home grid.
- [ ] All timers and animation frames are cleaned up on reset, terminal state, route change, and unmount.
- [ ] Korean/English labels, focus states, and `aria-live` status are present.
- [ ] No new dependency, server endpoint, or personally identifying storage is introduced.
