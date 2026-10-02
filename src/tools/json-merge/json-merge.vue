<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mergeJson } from './json-merge.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const { t } = useI18n();
const input = ref('');
const right = ref('');
const sample = '{"user":{"name":"Ada","roles":["reader"]},"enabled":false}';
const rightSample = '{"user":{"roles":["editor"],"age":30},"enabled":true}';
const { result, error } = useLocalResult(() =>
  input.value.trim() && right.value.trim() ? mergeJson(input.value, right.value) : '',
);
function updateInput(value: string) {
  input.value = value;
  if (value === sample) {
    right.value = rightSample;
  }
}
</script>

<template>
  <LocalToolPanel
    :input="input"
    :output="result"
    :error="error"
    :sample="sample"
    :input-label="t('tools.json-merge.leftInput')"
    language="json"
    @update:input="updateInput"
    @reset="right = ''"
  >
    <p class="mb-4 text-sm">
      {{ t('tools.json-merge.hint') }}
    </p>
    <template #inputs>
      <CInputText
        v-model:value="right"
        class="mt-4"
        :label="t('tools.json-merge.rightInput')"
        :placeholder="t('tools.json-merge.rightInput')"
        raw-text
        multiline
        monospace
        rows="8"
        test-id="right-input"
      />
    </template>
  </LocalToolPanel>
</template>
