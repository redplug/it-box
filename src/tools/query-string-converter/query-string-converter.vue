<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { jsonToQuery, queryToJson } from './query-string-converter.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const direction = ref('toJson');
const sample = computed(() => direction.value === 'toJson' ? '?tag=one&tag=two&message=hello+world&number=003' : '{"tag":["one","two"],"message":"hello world","number":"003"}');
const { result, error } = useLocalResult(() => input.value ? direction.value === 'toJson' ? JSON.stringify(queryToJson(input.value), null, 2) : jsonToQuery(input.value) : '');
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="result" :error="error" :sample="sample" :language="direction === 'toJson' ? 'json' : 'txt'" @reset="direction = 'toJson'">
    <label class="control">
      {{ t('tools.query-string-converter.direction') }}
      <select v-model="direction" data-test-id="direction">
        <option value="toJson">{{ t('tools.query-string-converter.toJson') }}</option>
        <option value="toQuery">{{ t('tools.query-string-converter.toQuery') }}</option>
      </select>
    </label>
  </LocalToolPanel>
</template>

<style scoped>
.control { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
select { color: inherit; background: transparent; border: 1px solid #888; border-radius: 4px; padding: 6px; }
</style>
