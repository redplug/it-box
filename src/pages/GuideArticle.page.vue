<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import NotFound from './404.page.vue';
import { guides } from '@/content/guides.loader';
import { tools } from '@/tools';

const route = useRoute();
const guide = computed(() => guides.find(item => item.slug === route.params.slug));
const relatedTools = computed(() => (guide.value?.tools ?? []).map(path => ({
  path,
  name: tools.find(tool => tool.path === path)?.name ?? path,
})));

useHead({
  title: computed(() => (guide.value ? `${guide.value.title} | it-box` : '페이지를 찾을 수 없습니다 | it-box')),
  meta: [{ name: 'description', content: computed(() => guide.value?.description ?? '') }],
});
</script>

<template>
  <NotFound v-if="!guide" />
  <main v-else class="guide-article">
    <RouterLink class="back" to="/guides">
      ← 가이드 목록
    </RouterLink>
    <h1>{{ guide.title }}</h1>
    <time class="date" :datetime="guide.date">{{ guide.date }}</time>
    <p class="description">
      {{ guide.description }}
    </p>

    <c-markdown class="article-body" :markdown="guide.body" />

    <section v-if="relatedTools.length > 0" class="related">
      <h2>관련 도구</h2>
      <ul>
        <li v-for="tool in relatedTools" :key="tool.path">
          <RouterLink :to="tool.path">
            {{ tool.name }}
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.guide-article { max-width: 760px; margin: 0 auto; padding: 54px 24px 80px; color: #39424e; line-height: 1.8; }
.back, .related a { color: #18a058; font-weight: 700; text-decoration: none; }
h1 { font-size: 36px; letter-spacing: -.04em; margin: 16px 0 8px; color: #26313a; }
.date { color: #687076; font-size: 14px; }
.description { color: #4b5560; margin: 12px 0 28px; }
.article-body :deep(p) { margin: 0 0 1rem; }
.related { margin-top: 36px; padding-top: 20px; border-top: 1px solid #d9dfe2; }
.related h2 { font-size: 20px; margin: 0 0 10px; color: #26313a; }
.related ul { padding-left: 20px; }
</style>
