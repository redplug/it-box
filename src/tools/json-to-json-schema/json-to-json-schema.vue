<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { jsonToSchema } from './json-to-json-schema.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = '{"name":"Ada","active":true,"tags":["developer"],"score":42,"optional":null}';
const { result, error } = useLocalResult(() => (input.value.trim() ? jsonToSchema(input.value) : ''));
</script>

<template>
  <LocalToolPanel
    v-model:input="input"
    :output="result"
    :error="error"
    :sample="sample"
    :input-label="t('tools.json-to-json-schema.inputLabel')"
    language="json"
  >
    <p class="mb-4 text-sm">
      {{ t('tools.json-to-json-schema.hint') }}
    </p>
  </LocalToolPanel>
</template>
