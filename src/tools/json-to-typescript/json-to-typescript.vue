<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { jsonToTypescript } from './json-to-typescript.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = '{"name":"Ada","active":true,"tags":["developer"],"profile":{"score":42},"optional":null}';
const { result, error } = useLocalResult(() => (input.value.trim() ? jsonToTypescript(input.value) : ''));
</script>

<template>
  <LocalToolPanel
    v-model:input="input"
    :output="result"
    :error="error"
    :sample="sample"
    :input-label="t('tools.json-to-typescript.inputLabel')"
    language="typescript"
  >
    <p class="mb-4 text-sm">
      {{ t('tools.json-to-typescript.hint') }}
    </p>
  </LocalToolPanel>
</template>
