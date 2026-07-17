# it-box

한국어 개발자 도구 사이트입니다.

- 서비스: [it-box.dev](https://it-box.dev)
- 소스: [redplug/it-box](https://github.com/redplug/it-box)

## 원본 및 라이선스

이 프로젝트는 [IT-Tools](https://it-tools.tech)와 [CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)를 기반으로 수정했습니다. 전체 프로젝트는 GNU GPL-3.0으로 배포하며, 원본 저작권 및 변경 고지는 [NOTICE.md](NOTICE.md), 라이선스 전문은 [LICENSE](LICENSE)에서 확인할 수 있습니다.

## 개발

```sh
cp .env.example .env
```

`.env`의 `VITE_SITE_URL`을 운영 도메인으로 바꿉니다. 이 값은 빌드 시 canonical 및 Open Graph URL에 반영됩니다.

```sh
pnpm install
pnpm dev
pnpm build
```

## 게임 사이트

`game-site/`는 [game.it-box.dev](https://game.it-box.dev)에 배포할 수 있는 독립 Vue/Vite 앱입니다. 숫자 맞히기, 반응속도 테스트, 틱택토를 제공하며 게임 기록은 사용자의 브라우저에만 저장합니다.

```sh
cd game-site
pnpm install
pnpm test
pnpm build
```

기존 저장소를 그대로 사용해 Vercel 프로젝트를 하나 더 만들고, 새 프로젝트의 Root Directory를 `game-site`로 지정합니다. 도메인·광고 환경변수 설정은 [게임 사이트 README](game-site/README.md)를 참고하세요.
