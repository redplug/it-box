<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({ title: '사이트 정보 | it-box' });
</script>

<template>
  <c-markdown class="about-content" :markdown="$t('about.content')" mx-auto mt-50px max-w-600px />
</template>

<style scoped>
.about-content :deep(h1),
.about-content :deep(h2) {
  margin: 1.75rem 0 0.75rem;
  line-height: 1.35;
}

.about-content :deep(h1) {
  margin-top: 0;
}

.about-content :deep(p) {
  margin: 0 0 1rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
}
</style>
