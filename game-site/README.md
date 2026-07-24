# it-box games

`game.it-box.dev`용 독립 웹게임 앱입니다. 서버나 로그인 없이 실행되며 최고 기록과 틱택토 전적은 현재 브라우저의 `localStorage`에만 저장됩니다.

신규 게임과 큰 기능 변경은 저장소 루트의 [게임 개발 표준 워크플로우](../docs/GAME_DEVELOPMENT_WORKFLOW.md)를 먼저 확인하세요. 기획과 구현 계획을 각각 승인받은 뒤 구현·디자인·테스트·Preview 검증을 진행하며, 최종 승인 전에는 `main` 머지나 Production 배포를 하지 않습니다.

## 로컬 실행

Node.js와 pnpm을 준비한 뒤 이 디렉터리에서 실행합니다.

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

빌드 결과는 `dist/`에 생성됩니다. 광고 관련 환경변수가 없는 기본 설정에서는 광고 컴포넌트와 AdSense 스크립트가 로드되지 않습니다.

## 저장소 구성

기존 `redplug/it-box` 저장소를 그대로 연결해 Vercel 프로젝트를 하나 더 만듭니다. 기존 `it-box.dev` 프로젝트와 GitHub 저장소는 공유하지만, Vercel 프로젝트·환경변수·도메인은 분리됩니다.

- Framework Preset: `Vite`
- Root Directory: `game-site`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Production Branch: 팀에서 사용하는 안정 브랜치(일반적으로 `main`)

기존 사이트 프로젝트의 Root Directory는 비워 두고, 게임 프로젝트만 `game-site`로 지정합니다. 같은 커밋이 두 프로젝트에 반영되므로 게임 변경은 `game-site/` 아래에서만 진행합니다.

## Vercel 도메인과 환경변수

새 Vercel 프로젝트의 Project Settings → Domains에서 `game.it-box.dev`를 추가합니다. 외부 DNS를 사용한다면 Vercel 도메인 화면이 제시하는 CNAME 값을 DNS의 `game` 레코드에 그대로 설정합니다. 기존 `it-box.dev` 프로젝트의 도메인과 설정은 변경하지 않습니다.

Vercel CLI를 사용할 수 있다면 도메인을 추가한 뒤 아래 명령으로 프로젝트에 필요한 정확한 값을 확인합니다. 프로젝트별 값이 있을 수 있으므로 CNAME 대상을 추측해 입력하지 않습니다.

```sh
vercel domains add game.it-box.dev
vercel domains inspect game.it-box.dev
```

Production 환경에는 먼저 다음 값만 설정합니다.

```dotenv
VITE_SITE_URL=https://game.it-box.dev
VITE_ADS_ENABLED=false
```

AdSense 승인과 `ads.txt` 구성이 끝난 뒤에만 Production 값을 아래처럼 변경합니다. Preview와 Development에서는 광고를 비활성화합니다.

```dotenv
VITE_SITE_URL=https://game.it-box.dev
VITE_ADS_ENABLED=true
VITE_ADSENSE_CLIENT=ca-pub-실제_발급값
VITE_ADSENSE_SLOT_GAME=실제_슬롯값
```

광고는 게임 조작 영역과 떨어진 하단 예약 영역에만 표시됩니다. `public/ads.txt`에는 예시 ID를 넣지 말고 AdSense가 발급한 정확한 값을 사용하세요. 상위 도메인과 서브도메인의 `ads.txt` 운영 방식도 AdSense 계정 구성에 맞춰 확인해야 합니다.

## 출시 확인

- `pnpm test`와 `pnpm build`가 성공하는지 확인합니다.
- `dist/`에서 AdSense 도메인을 검색해 광고 비활성 기본 빌드에 외부 광고 스크립트 태그가 없는지 확인합니다.
- `/`, `/games/number-guessing`, `/games/reaction`, `/games/tic-tac-toe`, `/games/2048` 직접 접속과 새로고침이 정상인지 확인합니다.
- `https://game.it-box.dev/robots.txt`와 `/sitemap.xml`이 공개되는지 확인합니다.
- 실제 도메인에서 canonical URL, HTTPS, 모바일 키보드 조작, 광고와 게임 컨트롤 사이 간격을 점검합니다.
