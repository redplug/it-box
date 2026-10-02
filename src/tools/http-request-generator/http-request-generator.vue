<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateHttpRequest } from './http-request-generator.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { checkTextSize } from '@/tools/_shared/local-tool';
import { useLocalResult } from '@/tools/_shared/use-local-result';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();
const input = ref('');
const method = ref('GET');
const headers = ref('');
const body = ref('');
const methods = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const { result, error } = useLocalResult(() => {
  if (!input.value) {
    checkTextSize(headers.value);
    checkTextSize(body.value);
    return undefined;
  }
  return generateHttpRequest(method.value, input.value, headers.value, body.value);
});
function reset() {
  method.value = 'GET';
  headers.value = '';
  body.value = '';
}
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" sample="https://example.com/api?name=hello" :input-label="t('tools.http-request-generator.url')" @reset="reset">
    <label class="control">
      {{ t('tools.http-request-generator.method') }}
      <select v-model="method" data-test-id="method"><option v-for="item in methods" :key="item" :value="item">{{ item }}</option></select>
    </label>
    <p>{{ t('tools.http-request-generator.snippetsOnly') }}</p>
    <template #inputs>
      <c-input-text v-model:value="headers" :label="t('tools.http-request-generator.headers')" raw-text multiline monospace rows="4" test-id="headers" />
      <c-input-text v-model:value="body" :label="t('tools.http-request-generator.body')" multiline raw-text monospace rows="4" test-id="body" />
    </template>
    <template #result>
      <p>{{ t('tools.http-request-generator.fetchLabel') }}</p>
      <TextareaCopyable :value="result?.fetch ?? ''" :copy-message="t('tools.local.copy')" />
      <p>{{ t('tools.http-request-generator.curlLabel') }}</p>
      <TextareaCopyable :value="result?.curl ?? ''" :copy-message="t('tools.local.copy')" />
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.control { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
select { color: inherit; background: transparent; border: 1px solid #888; border-radius: 4px; padding: 6px; }
</style>
