<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { RouterLink } from 'vue-router';
import { guides } from '@/content/guides.loader';

useHead({
  title: '개발 도구 사용 가이드 | it-box',
  meta: [
    { name: 'description', content: 'JSON, JWT, Base64, 정규식, Cron을 안전하게 사용하는 방법을 정리했습니다.' },
  ],
});
</script>

<template>
  <main class="guide-page">
    <p class="eyebrow">
      DEVELOPER GUIDE
    </p>
    <h1>도구를 안전하게 쓰는 법</h1>
    <p class="intro">
      빠른 변환 도구는 편리하지만, 입력 데이터의 성격과 결과의 한계를 알고 사용해야 합니다.
    </p>
    <article v-for="guide in guides" :key="guide.slug" class="guide-card">
      <h2>
        <RouterLink :to="`/guides/${guide.slug}`">
          {{ guide.title }}
        </RouterLink>
      </h2>
      <time class="date" :datetime="guide.date">{{ guide.date }}</time>
      <p>{{ guide.description }}</p>
      <RouterLink :to="`/guides/${guide.slug}`">
        가이드 읽기 →
      </RouterLink>
    </article>
  </main>
</template>

<style scoped>
.guide-page { max-width: 760px; margin: 0 auto; padding: 54px 24px 80px; }
.eyebrow { color: #18a058; font-size: 12px; font-weight: 700; letter-spacing: .12em; }
h1 { font-size: 42px; letter-spacing: -.05em; margin: 8px 0; }
.intro { color: #687076; margin-bottom: 36px; }
.guide-card { border-top: 1px solid #d9dfe2; padding: 26px 0; }
h2 { font-size: 22px; letter-spacing: -.03em; margin: 0 0 6px; }
h2 a { color: inherit; text-decoration: none; }
.date { color: #8a949c; font-size: 13px; }
.guide-card p { line-height: 1.8; color: #4b5560; margin: 8px 0 12px; }
a { color: #18a058; font-weight: 700; text-decoration: none; }
</style>
