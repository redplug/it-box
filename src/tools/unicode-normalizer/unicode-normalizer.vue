<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { normalizeUnicode } from './unicode-normalizer.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = 'Cafe\u0301 ① 한글';
const form = ref('NFC');
const forms = ['NFC', 'NFD', 'NFKC', 'NFKD'];
const { result, error } = useLocalResult(() => normalizeUnicode(input.value, form.value));
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="result?.text" :error="error" :sample="sample" @reset="form = 'NFC'">
    <label class="control">
      {{ t('tools.unicode-normalizer.form') }}
      <select v-model="form" data-test-id="form"><option v-for="item in forms" :key="item" :value="item">{{ item }}</option></select>
    </label>
    <p v-if="input && result" data-test-id="changed">
      {{ t(result.changed ? 'tools.unicode-normalizer.changed' : 'tools.unicode-normalizer.unchanged') }}
    </p>
  </LocalToolPanel>
</template>

<style scoped>
.control { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
select { color: inherit; background: transparent; border: 1px solid #888; border-radius: 4px; padding: 6px; }
</style>
