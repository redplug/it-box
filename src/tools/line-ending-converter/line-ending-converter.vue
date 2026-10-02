<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { convertLineEndings } from './line-ending-converter.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { downloadBlob } from '@/tools/_shared/local-tool';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = 'first\r\nsecond\rthird\n';
const ending = ref('LF');
const endings = ['LF', 'CRLF', 'CR'];
const { result, error } = useLocalResult(() => convertLineEndings(input.value, ending.value));
function download() {
  if (result.value !== undefined) {
    downloadBlob(new Blob([result.value], { type: 'text/plain;charset=utf-8' }), `text-${ending.value.toLowerCase()}.txt`);
  }
}
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="result" :error="error" :sample="sample" @reset="ending = 'LF'">
    <label class="control">
      {{ t('tools.line-ending-converter.ending') }}
      <select v-model="ending" data-test-id="ending"><option v-for="item in endings" :key="item" :value="item">{{ item }}</option></select>
    </label>
    <p>{{ t('tools.line-ending-converter.downloadNote') }}</p>
    <c-button :disabled="!input || result === undefined" data-test-id="download" @click="download">
      {{ t('tools.local.download') }}
    </c-button>
  </LocalToolPanel>
</template>

<style scoped>
.control { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
select { color: inherit; background: transparent; border: 1px solid #888; border-radius: 4px; padding: 6px; }
</style>
