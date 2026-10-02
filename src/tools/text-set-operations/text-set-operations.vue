<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { operateTextSets } from './text-set-operations.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const second = ref('');
const operation = ref('union');
const operations = ['union', 'intersection', 'difference'];
const { result, error } = useLocalResult(() => operateTextSets(input.value, second.value, operation.value).join('\n'));
function reset() {
  second.value = '';
  operation.value = 'union';
}
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="result" :error="error" sample="apple&#10;banana&#10;apple" :input-label="t('tools.text-set-operations.first')" @reset="reset">
    <label class="control">
      {{ t('tools.text-set-operations.operation') }}
      <select v-model="operation" data-test-id="operation"><option v-for="item in operations" :key="item" :value="item">{{ t(`tools.text-set-operations.${item}`) }}</option></select>
    </label>
    <p>{{ t('tools.text-set-operations.exactNote') }}</p>
    <template #inputs>
      <c-input-text v-model:value="second" :label="t('tools.text-set-operations.second')" multiline raw-text monospace rows="6" test-id="second-input" />
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.control { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
select { color: inherit; background: transparent; border: 1px solid #888; border-radius: 4px; padding: 6px; }
</style>
