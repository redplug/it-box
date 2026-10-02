<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { extractHtmlLinks } from './html-link-extractor.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const base = ref('');
const sample = '<a href="/docs?x=1&amp;y=2">Docs &amp; help</a><a href="https://example.com">Example</a>';
const { result, error } = useLocalResult(() => extractHtmlLinks(input.value, base.value));
const output = computed(() => input.value && result.value ? JSON.stringify(result.value, null, 2) : '');
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="output" :error="error" :sample="sample" :input-label="t('tools.html-link-extractor.inputLabel')" language="json" @reset="base = ''">
    <template #inputs>
      <c-input-text v-model:value="base" :label="t('tools.html-link-extractor.baseLabel')" :placeholder="t('tools.html-link-extractor.basePlaceholder')" raw-text test-id="base-url" />
    </template>
  </LocalToolPanel>
</template>
