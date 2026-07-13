# 광고 운영 준비 체크리스트

광고는 `VITE_ADS_ENABLED=false` 상태로 시작합니다. 아래 항목이 모두 완료되기 전에는 `true`로 바꾸지 않습니다.

## 도메인과 검색 노출

- [ ] 도메인을 구매하고 HTTPS를 연결한다.
- [ ] `index.html`에 실제 canonical URL과 Open Graph URL을 설정한다.
- [ ] `public/robots.txt`의 sitemap URL을 실제 도메인으로 바꾸고 `sitemap.xml`을 만든다.
- [ ] Google Search Console에 사이트를 등록한다.
- [ ] 한국어 사용 가이드와 도구별 설명을 지속적으로 보강한다. 자동 생성·복제 페이지를 대량 게시하지 않는다.

## 법적 고지와 오픈소스

- [ ] `/about`에 실제 운영자 이름 또는 사업자 정보와 연락 가능한 이메일을 기재한다.
- [ ] 개인정보처리방침의 시행일과 문의처를 실제 정보로 바꾼다.
- [ ] 수정한 전체 소스를 공개 GitHub 저장소에 유지하고 `LICENSE`, `NOTICE.md`를 배포물과 함께 제공한다.
- [ ] 원본 IT-Tools의 저작권 및 GPL-3.0 고지를 삭제하지 않는다.

## AdSense

- [ ] AdSense에서 해당 도메인 승인을 받는다.
- [ ] 발급받은 publisher ID와 광고 슬롯 ID를 배포 환경 변수에만 넣는다.
- [ ] `ads.txt`에 AdSense가 발급한 정확한 한 줄을 추가한다. 예: `google.com, pub-발급된ID, DIRECT, f08c47fec0942fa0`
- [ ] 유럽경제지역(EEA), 영국, 스위스 방문자에게 광고를 제공한다면 Google 요구사항에 맞는 인증 CMP와 동의 흐름을 설정한다.
- [ ] 광고를 입력창, 결과 복사 버튼, 오류 버튼 가까이에 배치하거나 클릭을 유도하지 않는다.
- [ ] 직접 광고를 클릭하거나 자동 새로고침·인위적 트래픽을 만들지 않는다.

## 배포 환경 변수

```dotenv
VITE_VERCEL_ENV=production
VITE_ADS_ENABLED=true
VITE_ADSENSE_CLIENT=ca-pub-실제_발급값
VITE_ADSENSE_SLOT_HOME=실제_슬롯값
VITE_ADSENSE_SLOT_TOOL=실제_슬롯값
```

광고 승인 전에는 `VITE_ADS_ENABLED=false`를 유지합니다.
