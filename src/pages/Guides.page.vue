<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({
  title: '개발 도구 사용 가이드 | it-box',
  meta: [
    { name: 'description', content: 'JSON, JWT, Base64, 정규식, Cron을 안전하게 사용하는 방법을 정리했습니다.' },
  ],
});

const guides = [
  {
    title: 'JSON 포맷터: 오류를 빠르게 찾는 순서',
    tool: '/json-prettify',
    body: 'JSON 오류는 쉼표 누락, 큰따옴표 대신 작은따옴표 사용, 마지막 항목 뒤의 쉼표에서 자주 발생합니다. 먼저 포맷터에 붙여 넣어 오류 위치를 확인하고, 민감한 토큰·이메일·주문 정보는 지운 뒤 사용하세요. 정상 JSON이라면 들여쓰기를 적용해 중첩 구조를 읽기 쉽게 만들 수 있습니다.',
  },
  {
    title: 'JWT를 디코딩해도 검증되는 것은 아닙니다',
    tool: '/jwt-parser',
    body: 'JWT 디코더는 헤더와 페이로드를 사람이 읽을 수 있게 보여줄 뿐, 서명이 유효하다는 뜻은 아닙니다. 만료 시간과 발급자 정보를 확인하는 데 쓰되, 실제 인증은 서버에서 서명과 알고리즘을 검증해야 합니다. 운영 토큰이나 다른 사람의 토큰을 온라인 입력창에 넣지 않는 것이 안전합니다.',
  },
  {
    title: 'Base64는 암호화가 아니라 표현 방식입니다',
    tool: '/base64-string-converter',
    body: 'Base64는 바이너리 데이터를 텍스트로 옮기기 위한 인코딩입니다. 누구나 쉽게 되돌릴 수 있으므로 비밀번호, API 키, 개인정보를 숨기는 용도로 사용하면 안 됩니다. 이메일 첨부, 데이터 URL, 간단한 전송 형식 확인 같은 목적에 적합합니다.',
  },
  {
    title: '정규식은 작은 입력부터 테스트하세요',
    tool: '/regex-tester',
    body: '정규식은 정상 예시 하나만 통과시키는 것으로 충분하지 않습니다. 빈 문자열, 공백, 줄바꿈, 너무 긴 입력, 한글과 특수문자를 함께 넣어 확인하세요. 서버 검증 규칙을 만들 때는 복잡한 정규식이 성능 문제를 만들지 않는지도 점검해야 합니다.',
  },
  {
    title: 'Cron 일정은 시간대와 실행 중복을 함께 확인하세요',
    tool: '/crontab-generator',
    body: 'Cron 표현식이 맞아도 서버의 시간대가 한국 시간이 아니면 다른 시각에 실행됩니다. 배포 환경의 시간대, 작업 실패 시 재시도 방식, 이전 작업이 끝나기 전에 다음 작업이 시작되는 경우를 함께 설계하세요. 먼저 사람이 읽을 수 있는 설명으로 일정을 확인한 뒤 운영에 적용하는 편이 안전합니다.',
  },
  {
    title: 'URL 인코딩은 전체 URL과 파라미터를 구분해야 합니다',
    tool: '/url-encoder',
    body: 'URL을 만들 때는 전체 주소를 한 번에 인코딩할지, 쿼리 파라미터의 값만 인코딩할지 먼저 구분해야 합니다. 전체 URL을 잘못 인코딩하면 슬래시와 물음표까지 데이터로 바뀌어 링크가 동작하지 않을 수 있습니다. 실제 요청에 적용하기 전 브라우저와 서버에서 같은 값으로 해석되는지 확인하세요.',
  },
  {
    title: '해시는 비밀번호 암호화와 같은 뜻이 아닙니다',
    tool: '/hash-text',
    body: '해시는 입력을 고정 길이 값으로 바꾸는 과정이며, 일반 해시를 다시 원문으로 복원하는 기능은 없습니다. 그렇다고 SHA-256 같은 일반 해시를 비밀번호 저장에 바로 사용해도 안전한 것은 아닙니다. 비밀번호는 서버에서 salt와 전용 비밀번호 해시 알고리즘을 사용해야 하며, 브라우저 도구에는 실제 비밀값을 입력하지 않는 편이 좋습니다.',
  },
  {
    title: 'QR 코드는 링크의 안전성을 보장하지 않습니다',
    tool: '/qrcode-generator',
    body: 'QR 코드는 텍스트나 URL을 이미지로 전달하는 형식일 뿐, 연결 대상이 안전하다는 인증서가 아닙니다. 생성 전에 최종 도메인을 확인하고, 공유 후에는 다른 기기로 직접 스캔해 표시되는 주소를 점검하세요. 결제나 로그인 링크는 QR 이미지보다 도메인을 직접 확인하는 습관이 안전합니다.',
  },
  {
    title: 'Timestamp는 초 단위와 밀리초 단위를 먼저 확인하세요',
    tool: '/date-converter',
    body: '로그와 API에서 사용하는 Unix timestamp는 초 단위와 밀리초 단위가 함께 쓰입니다. 자릿수만 보고 단정하지 말고 API 문서와 샘플 값을 함께 확인하세요. UTC와 한국 표준시를 혼동하면 장애 발생 시각과 배포 시각의 순서가 달라 보일 수 있으므로 원본 값과 시간대를 함께 기록하는 것이 좋습니다.',
  },
  {
    title: 'SQL 포맷팅은 쿼리 안전성 검증이 아닙니다',
    tool: '/sql-prettify',
    body: 'SQL 포맷터는 긴 쿼리의 구조를 읽기 쉽게 만들지만 실행 계획이나 권한을 검사하지 않습니다. 실행 전 WHERE와 JOIN 조건을 확인하고, 운영 데이터베이스에서는 읽기 전용 권한과 트랜잭션을 사용하세요. 특히 UPDATE와 DELETE는 영향을 받는 행을 먼저 SELECT로 확인하는 절차가 필요합니다.',
  },
  {
    title: 'YAML 설정은 들여쓰기와 타입을 함께 검토하세요',
    tool: '/yaml-to-json-converter',
    body: 'YAML은 들여쓰기와 값의 형태에 따라 문자열, 숫자, 불리언이 다르게 해석될 수 있습니다. 변환 후 중첩 객체와 배열의 구조를 비교하고, 배포 환경변수와 비밀값은 샘플 값으로 바꿔 테스트하세요. 주석과 앵커처럼 YAML에만 있는 표현은 변환 과정에서 보존되지 않을 수 있습니다.',
  },
  {
    title: 'HTML 편집 결과는 저장 전에 정제해야 합니다',
    tool: '/html-wysiwyg-editor',
    body: '브라우저에서 안전해 보이는 HTML도 서버에 저장하거나 다른 사용자의 브라우저에서 렌더링할 때는 위험할 수 있습니다. 편집 결과를 실제 서비스에 넣기 전 허용 태그와 속성을 정하고 서버 측 sanitization을 적용하세요. `innerHTML`을 그대로 사용하는 방식은 XSS 위험을 만들 수 있으므로 미리보기와 저장 처리를 분리하는 것이 좋습니다.',
  },
];
</script>

<template>
  <main class="guide-page">
    <p class="eyebrow">DEVELOPER GUIDE</p>
    <h1>도구를 안전하게 쓰는 법</h1>
    <p class="intro">빠른 변환 도구는 편리하지만, 입력 데이터의 성격과 결과의 한계를 알고 사용해야 합니다.</p>
    <article v-for="guide in guides" :key="guide.tool" class="guide-card">
      <h2>{{ guide.title }}</h2>
      <p>{{ guide.body }}</p>
      <RouterLink :to="guide.tool">도구 열기 →</RouterLink>
    </article>
  </main>
</template>

<style scoped>
.guide-page { max-width: 760px; margin: 0 auto; padding: 54px 24px 80px; }
.eyebrow { color: #18a058; font-size: 12px; font-weight: 700; letter-spacing: .12em; }
h1 { font-size: 42px; letter-spacing: -.05em; margin: 8px 0; }
.intro { color: #687076; margin-bottom: 36px; }
.guide-card { border-top: 1px solid #d9dfe2; padding: 26px 0; }
h2 { font-size: 22px; letter-spacing: -.03em; margin: 0 0 10px; }
.guide-card p { line-height: 1.8; color: #4b5560; }
a { color: #18a058; font-weight: 700; text-decoration: none; }
</style>
