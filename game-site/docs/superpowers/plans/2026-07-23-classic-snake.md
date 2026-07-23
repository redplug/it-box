# Classic Snake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 게임 사이트에 키보드와 터치로 즐기는 클래식 20×20 뱀 게임을 추가한다.

**Architecture:** 순수 함수 기반 `engine.ts`가 상태와 한 틱 이동을 관리하고, `Snake.vue`가 타이머·입력·저장소·표시를 담당한다. 게임 레지스트리와 로케일 사전에 항목을 추가해 기존 홈/라우팅을 재사용한다.

**Tech Stack:** Vue 3 + TypeScript, Vitest, 기존 game-site CSS 및 composables.

## Global Constraints

- 보드 크기는 20×20이다.
- 뱀은 중앙 3칸에서 오른쪽을 향해 시작한다.
- 이동 간격은 약 150ms다.
- 먹이 점수는 10점이며 최고 점수는 `game-site:snake:best`에 저장한다.
- 키보드 방향키/WASD, 모바일 방향 버튼과 스와이프를 지원한다.

### Task 1: 순수 게임 엔진

**Files:**
- Create: `game-site/src/games/snake/engine.ts`
- Create: `game-site/src/games/snake/engine.test.ts`

**Interfaces:** `createSnakeGame(size?: number): SnakeState`, `queueDirection(state, direction): SnakeState`, `tick(state, random?): SnakeState`, `togglePause(state): SnakeState`.

- [ ] 상태 타입(`Point`, `Direction`, `SnakeStatus`, `SnakeState`)과 초기화 함수를 만든다.
- [ ] 방향 반전 방지, 벽/몸 충돌, 먹이 섭취·점수 증가, 승리 조건을 순수 함수로 구현한다.
- [ ] 초기 상태·이동·먹이·충돌·일시정지·반전 입력 테스트를 작성하고 `pnpm vitest run src/games/snake/engine.test.ts`로 검증한다.

### Task 2: Vue 게임 화면

**Files:**
- Create: `game-site/src/games/snake/Snake.vue`

**Interfaces:** Task 1의 `SnakeState`와 함수를 사용한다.

- [ ] 150ms `setInterval`을 `playing` 상태에서만 실행하고 unmount 시 해제한다.
- [ ] 키보드, 방향 버튼, 스와이프 입력을 `queueDirection`으로 연결한다.
- [ ] 보드 셀을 렌더링하고 점수/최고 점수/상태를 표시한다.
- [ ] 시작, 일시정지/재개, 게임 오버, 다시 하기 UI와 한국어/영어 문구를 구현한다.
- [ ] `game-site:snake:best`를 읽고 새 기록일 때 저장한다.

### Task 3: 게임 등록 및 스타일 검증

**Files:**
- Modify: `game-site/src/games/registry.ts`
- Modify: `game-site/src/composables/useGameLocale.ts`

- [ ] `snake` 레지스트리 항목과 한국어/영어 제목·설명을 추가한다.
- [ ] `pnpm test`와 `pnpm build`를 실행해 기존 회귀와 타입 오류를 확인한다.
- [ ] `pnpm dev --host 0.0.0.0`으로 테스트 사이트를 띄우고 출력된 URL을 전달한다.
