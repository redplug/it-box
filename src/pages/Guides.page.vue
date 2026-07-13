<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({
  title: '개발 도구 사용 가이드 | DevToolbox',
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
