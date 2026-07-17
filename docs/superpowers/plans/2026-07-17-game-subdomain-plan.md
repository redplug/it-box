# game.it-box.dev MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a self-contained `game-site/` Vue app with three browser games and ad-safe deployment configuration.

**Architecture:** Keep the existing root app untouched. `game-site/` owns its Vite entrypoint, game registry, shared shell, localStorage records, and lazy game routes. Each game has a pure engine module plus a Vue view.

**Tech Stack:** Vue 3, Vite, TypeScript, Vue Router, Vitest, CSS, localStorage.

## Global Constraints

- No backend, authentication, multiplayer, or external game assets in MVP.
- Ads disabled by default and never placed over controls.
- Existing GPL-3.0 and NOTICE files remain authoritative.

### Task 1: Scaffold independent game-site app

**Files:** Create `game-site/package.json`, `game-site/index.html`, `game-site/tsconfig.json`, `game-site/vite.config.ts`, `game-site/src/main.ts`, `game-site/src/App.vue`, `game-site/src/style.css`.

- [ ] Add Vue/Vite scripts and minimal dependencies.
- [ ] Add hostname-independent SPA fallback and `VITE_SITE_URL` metadata.
- [ ] Render shared shell from a registry.

### Task 2: Shared registry, routing, persistence, and ads

**Files:** Create `game-site/src/games/registry.ts`, `game-site/src/router.ts`, `game-site/src/components/GameShell.vue`, `game-site/src/components/AdSlot.vue`, `game-site/src/composables/useBestScore.ts`.

- [ ] Define `GameDefinition` with `slug`, `title`, `description`, `component`.
- [ ] Build sidebar links and lazy routes from registry.
- [ ] Store numeric records under `game-site:${slug}:best`.
- [ ] Render reserved ad space only when production + configured.

### Task 3: Number guessing game

**Files:** Create `game-site/src/games/number-guessing/engine.ts`, `.test.ts`, `NumberGuessing.vue`.

- [ ] Implement deterministic injectable target, validation, attempts, and win/loss state.
- [ ] Add keyboard-friendly form and best-attempt persistence.

### Task 4: Reaction test game

**Files:** Create `game-site/src/games/reaction/engine.ts`, `.test.ts`, `ReactionTest.vue`.

- [ ] Implement idle/waiting/ready/result/false-start state transitions with injectable clock.
- [ ] Add pointer and keyboard activation, result persistence, and cleanup.

### Task 5: Tic-tac-toe game

**Files:** Create `game-site/src/games/tic-tac-toe/engine.ts`, `.test.ts`, `TicTacToe.vue`.

- [ ] Implement board moves, win lines, draw detection, and reset.
- [ ] Add accessible 3x3 buttons, turn status, and result persistence.

### Task 6: Verification and deployment docs

**Files:** Modify `README.md`; create `game-site/README.md`, `game-site/public/robots.txt`, `game-site/public/sitemap.xml`.

- [ ] Document nested-repo extraction, Vercel Root Directory, domain, and Production env values.
- [ ] Run `pnpm install`, `pnpm build`, and game unit tests.
- [ ] Verify no ad script loads with default env.
