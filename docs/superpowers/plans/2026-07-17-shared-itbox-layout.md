# Shared it-box Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `it-box.dev` and `game.it-box.dev` render the same toolbar, sidebar, hero, footer, spacing, and card shell from one shared implementation.

**Architecture:** Extract the visual layout contract into `src/shared/itbox-layout/` inside the repository. The tools app and game app import the same CSS tokens and structural components; each app supplies only navigation items, locale copy, and page content. Remove duplicate game-only toolbar/sidebar CSS after migration.

**Tech Stack:** Vue 3, TypeScript, Vite, shared CSS, existing Naive UI layout values from the tools app.

## Global Constraints

- The tools app remains the visual source of truth.
- Game content and translations remain game-site-specific.
- No guessed spacing or substitute SVGs where the original markup/path is available.
- Both apps must pass typecheck/build; game-site tests must pass before deployment.

### Task 1: Shared layout contract

**Files:**
- Create: `src/shared/itbox-layout/itbox-layout.css`
- Create: `src/shared/itbox-layout/itbox-icons.ts`
- Modify: `src/main.ts`
- Modify: `game-site/src/main.ts`

- [ ] Copy the original toolbar, sidebar, card, footer, and responsive values into the shared CSS and expose the exact icon path constants used by the tools app.
- [ ] Import the shared CSS from both application entrypoints.
- [ ] Run both app typechecks to catch selector and import errors.

### Task 2: Shared shell migration

**Files:**
- Create: `src/shared/itbox-layout/ItBoxShell.vue`
- Modify: `src/layouts/base.layout.vue`
- Modify: `game-site/src/components/GameShell.vue`

- [ ] Move the shared toolbar/sidebar DOM shape into `ItBoxShell.vue` with slots for navigation, locale options, utilities, and page content.
- [ ] Make the tools layout use the shared shell without changing tool routes.
- [ ] Make the game layout use the same shell and pass only game navigation/content/locale data.
- [ ] Remove game-only duplicate toolbar layout rules.

### Task 3: Verification and deployment

**Files:**
- Modify: `game-site/src/pages/Home.vue` only if shared card slot integration requires it.

- [ ] Run `npm run build` and `npm test` in `game-site`.
- [ ] Run `npm run typecheck` or `npm run build` in the tools app.
- [ ] Inspect generated DOM for the shared toolbar/sidebar class structure.
- [ ] Deploy game-site with `npx --yes vercel deploy --prod --yes` and verify the production alias.
