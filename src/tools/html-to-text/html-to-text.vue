<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { htmlToText } from './html-to-text.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = '<h1>Hello &amp; 안녕</h1><p>First line<br>Second line</p>';
const { result, error } = useLocalResult(() => htmlToText(input.value));
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="result" :error="error" :sample="sample" :input-label="t('tools.html-to-text.inputLabel')" />
</template>
