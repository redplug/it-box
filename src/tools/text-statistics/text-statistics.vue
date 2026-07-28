<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline placeholder="텍스트를 입력하세요..." rows="5" />

    <div mt-5 flex>
      <n-statistic label="문자 수" :value="text.length" flex-1 />
      <n-statistic label="단어 수" :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 />
      <n-statistic label="줄 수" :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 />
      <n-statistic label="바이트 크기" :value="formatBytes(getStringSizeInBytes(text))" flex-1 />
    </div>
  </c-card>
</template>
