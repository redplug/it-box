<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { resolveJsonPointer } from './json-pointer.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const { t } = useI18n();
const input = ref('');
const pointer = ref('');
const sample = '{"users":[{"name":"Ada"}],"a/b":{"~key":42}}';
const { result, error } = useLocalResult(() =>
  input.value.trim() ? resolveJsonPointer(input.value, pointer.value) : '',
);
function updateInput(value: string) {
  input.value = value;
  if (value === sample) {
    pointer.value = '/users/0/name';
  }
}
</script>

<template>
  <LocalToolPanel
    :input="input"
    :output="result"
    :error="error"
    :sample="sample"
    :input-label="t('tools.json-pointer.inputLabel')"
    language="json"
    @update:input="updateInput"
    @reset="pointer = ''"
  >
    <template #inputs>
      <CInputText
        v-model:value="pointer"
        class="mt-4"
        :label="t('tools.json-pointer.pointer')"
        placeholder="/users/0/name"
        raw-text
        monospace
        test-id="pointer"
      />
      <p class="mt-2 text-sm">
        {{ t('tools.json-pointer.hint') }}
      </p>
    </template>
  </LocalToolPanel>
</template>
