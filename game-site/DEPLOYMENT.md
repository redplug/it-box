# game.it-box.dev 배포 런북

이 문서는 `game.it-box.dev` 변경 배포를 요청받았을 때 Codex가 따라야 할 절차다.
루트 사이트(`it-box.dev`)와 게임 사이트는 같은 GitHub 저장소를 쓰지만 **서로 다른 Vercel 프로젝트**다. 루트에서 배포하면 게임 도메인에는 반영되지 않는다.

## 대상과 원칙

| 항목 | 값 |
| --- | --- |
| 서비스 도메인 | `https://game.it-box.dev` |
| 앱 디렉터리 | `game-site/` |
| Vercel 프로젝트 | `game-site` |
| Vercel 팀/스코프 | `redplugs-projects` |
| Production 브랜치 | `main` |

- 게임 변경만 포함한 커밋/PR을 `main`에 병합한 뒤 배포한다.
- 루트 프로젝트의 Vercel 배포 성공만으로 게임 도메인 배포 성공으로 판단하지 않는다.
- 배포 전에는 기존의 사용자가 만든 변경을 덮어쓰거나 제거하지 않는다.
- Production 주소가 아니라 고유 배포 URL만 Ready인 상태도 충분하지 않다. `game.it-box.dev` 별칭 반영까지 확인한다.

## 1. 배포 전 확인

저장소 루트에서 현재 작업 트리와 병합 상태를 확인한다.

```sh
git status --short
git fetch origin
git log -1 --oneline origin/main
```

게임 앱 디렉터리에서 테스트와 Production 빌드를 실행한다.

```sh
cd game-site
pnpm test
pnpm build
```

두 명령이 모두 성공해야 한다. 실패하면 배포하지 말고 원인을 수정·재검증한다.

## 2. 게임 전용 Production 배포

반드시 `game-site/`에서 아래 명령을 실행한다. 이 명령은 Vercel CLI를 일회성으로 사용하므로 전역 설치가 필요 없다.

```sh
npm exec --yes --package=vercel@latest -- \
  vercel --prod --yes --scope redplugs-projects --project game-site
```

출력의 `Production:` URL을 기록한다. 이 URL은 상태 확인에 사용하며, 서비스 반영 확인은 다음 단계의 도메인 별칭으로 한다.

## 3. Vercel 배포 상태와 도메인 반영 확인

배포 명령이 출력한 Production URL로 상태를 조회한다.

```sh
npm exec --yes --package=vercel@latest -- \
  vercel inspect <production-deployment-url> --scope redplugs-projects
```

다음 두 조건이 모두 충족될 때까지 확인한다.

1. `status`가 `Ready`다. `Queued` 또는 `Building`이면 Vercel 대기열/빌드가 끝날 때까지 기다린 뒤 다시 조회한다.
2. `Aliases`에 `https://game.it-box.dev`가 표시된다.

`Error` 또는 `Canceled`이면 Vercel의 해당 배포 로그를 확인하고, 원인을 해결한 새 배포만 다시 요청한다. 실패한 배포 URL을 성공으로 보고하지 않는다.

## 4. 운영 도메인 기능 확인

별칭이 반영된 뒤 실제 도메인이 응답하는지 확인한다.

```sh
curl -sS -I https://game.it-box.dev/
curl -sS -I https://game.it-box.dev/games/tic-tac-toe
curl -sS -I https://game.it-box.dev/robots.txt
curl -sS -I https://game.it-box.dev/sitemap.xml
```

첫 두 요청은 `200`이어야 한다. 브라우저로 다음 항목도 점검한다.

- 홈과 각 게임 경로(`/games/number-guessing`, `/games/reaction`, `/games/tic-tac-toe`)의 직접 접속·새로고침
- 라이트/다크 모드 전환, 사이드바 텍스트, 언어 선택 드롭다운 색상
- 틱택토 다크 모드에서 보드 셀 배경은 어둡고 X/O 표시는 충분한 대비로 보이는지

## 5. 완료 보고 형식

배포가 Ready이고 `game.it-box.dev` 별칭 및 실제 화면 확인까지 끝난 경우에만 아래 정보를 보고한다.

- 병합된 PR 또는 커밋
- 실행한 게임 전용 Production 배포 URL
- `game.it-box.dev` 별칭 반영 여부
- 테스트·빌드·운영 화면 확인 결과

Vercel 대기열 또는 빌드가 끝나지 않았다면, 배포 요청은 제출됐다고만 보고하고 상태를 명확히 `Queued` 또는 `Building`으로 표기한다. 이 경우 운영 반영 완료라고 말하지 않는다.
