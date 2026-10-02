<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { convertJsonLines } from './json-lines-converter.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const direction = ref<'to-json' | 'to-lines'>('to-json');
const sample = computed(() =>
  direction.value === 'to-json'
    ? '{"name":"Ada","id":1}\n{"name":"Lin","id":2}'
    : '[{"name":"Ada","id":1},{"name":"Lin","id":2}]',
);
const { result, error } = useLocalResult(() =>
  input.value.trim() ? convertJsonLines(input.value, direction.value) : '',
);
</script>

<template>
  <LocalToolPanel
    v-model:input="input"
    :output="result"
    :error="error"
    :sample="sample"
    :input-label="
      t(direction === 'to-json' ? 'tools.json-lines-converter.linesInput' : 'tools.json-lines-converter.arrayInput')
    "
    :language="direction === 'to-json' ? 'json' : 'txt'"
    @reset="direction = 'to-json'"
  >
    <div class="mb-4 flex items-center gap-3">
      <label for="jsonl-direction">{{ t('tools.json-lines-converter.direction') }}</label>
      <select id="jsonl-direction" v-model="direction" data-test-id="direction">
        <option value="to-json">
          {{ t('tools.json-lines-converter.toJson') }}
        </option>
        <option value="to-lines">
          {{ t('tools.json-lines-converter.toLines') }}
        </option>
      </select>
    </div>
  </LocalToolPanel>
</template>
