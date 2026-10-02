<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { csvToJson } from './csv-to-json.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const delimiter = ref<',' | '\t'>(',');
const sample = computed(() =>
  delimiter.value === ',' ? 'name,note\nAda,"hello, world"\nLin,"quoted ""text"""' : 'name\tnote\nAda\t"hello\tworld"',
);
const { result, error } = useLocalResult(() => (input.value.trim() ? csvToJson(input.value, delimiter.value) : ''));
</script>

<template>
  <LocalToolPanel
    v-model:input="input"
    :output="result"
    :error="error"
    :sample="sample"
    :input-label="t('tools.csv-to-json.inputLabel')"
    language="json"
    @reset="delimiter = ','"
  >
    <div class="mb-4 flex items-center gap-3">
      <label for="csv-delimiter">{{ t('tools.csv-to-json.delimiter') }}</label>
      <select id="csv-delimiter" v-model="delimiter" data-test-id="delimiter">
        <option value=",">
          {{ t('tools.csv-to-json.csv') }}
        </option>
        <option value="&#9;">
          {{ t('tools.csv-to-json.tsv') }}
        </option>
      </select>
    </div>
    <p class="mb-4 text-sm">
      {{ t('tools.csv-to-json.hint') }}
    </p>
  </LocalToolPanel>
</template>
