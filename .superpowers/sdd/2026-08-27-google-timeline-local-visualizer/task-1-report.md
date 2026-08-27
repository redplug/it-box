# Task 1 report

## Changed files

- `src/tools/google-timeline-visualizer/timeline.models.ts`
  - Added `TimelinePoint` and `TimelineParseResult` types.
  - Added normalization for current Timeline arrays and `semanticSegments` activity paths.
  - Added coordinate/time validation, duplicate removal, timestamp sorting, local-date filtering, and Haversine distance calculation.
- `src/tools/google-timeline-visualizer/timeline.models.test.ts`
  - Added six focused unit tests covering the required behavior.

## RED/GREEN verification

- RED command requested: `pnpm vitest run src/tools/google-timeline-visualizer/timeline.models.test.ts`
  - Could not start because `pnpm` is not installed (`zsh: command not found: pnpm`).
- Equivalent RED command: `npm exec -- vitest run src/tools/google-timeline-visualizer/timeline.models.test.ts`
  - Failed as expected because `timeline.models.ts` did not exist.
- GREEN command (equivalent): `npm exec -- vitest run src/tools/google-timeline-visualizer/timeline.models.test.ts`
  - Passed: 1 test file, 6 tests.
- Typecheck (equivalent): `npm exec -- vue-tsc --noEmit -p tsconfig.vitest.json --composite false`
  - Failed on existing unrelated errors in other tools/UI files; no errors were reported for the new timeline files.

## Commit

`3ed7b1737664b927a63b6a64247a0505c2df24c1` (`feat: parse local Google Timeline exports`)

## Concerns

- `pnpm` is unavailable in this environment, so verification used the equivalent `npm exec` commands.
- Repository-wide typecheck remains red due to pre-existing unrelated errors.
- Date filtering uses the runtime's local calendar timezone, as required; behavior therefore depends on the user's configured timezone.

## Review fix round 1

- Added regression coverage for empty coordinate tokens (``, ` , ``, `37.5,``) and non-ISO timestamp strings (`01/02/2025`, `January 2, 2025`).
- Updated parsing to require decimal coordinate tokens and ISO timestamps with an explicit timezone before constructing `Date` values.
- RED: `./node_modules/.bin/vitest run src/tools/google-timeline-visualizer/timeline.models.test.ts` — 2 failed, 6 passed, exposing both reviewed defects.
- GREEN: `./node_modules/.bin/vitest run src/tools/google-timeline-visualizer/timeline.models.test.ts` — 1 file passed, 8 tests passed.
- Fix commit: `aa45924539c9cd9ddccf0bd4c8cce361ab4144c7` (`fix: validate timeline coordinates and timestamps`).
