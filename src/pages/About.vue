<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({ title: '사이트 정보 | 코드 도구함' });
</script>

<template>
  <c-markdown :markdown="$t('about.content')" mx-auto mt-50px max-w-600px />
</template>
