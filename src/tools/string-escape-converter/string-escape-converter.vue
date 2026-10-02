<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { decodeJsonString, encodeJsonString } from './string-escape-converter.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const direction = ref('encode');
const sample = computed(() => direction.value === 'encode' ? 'Hello "world"\n안녕' : '"Hello \\"world\\"\\n안녕"');
const { result, error } = useLocalResult(() => input.value ? direction.value === 'encode' ? encodeJsonString(input.value) : decodeJsonString(input.value) : '');
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="result" :error="error" :sample="sample" :language="direction === 'encode' ? 'json' : 'txt'" @reset="direction = 'encode'">
    <label class="control">
      {{ t('tools.string-escape-converter.direction') }}
      <select v-model="direction" data-test-id="direction">
        <option value="encode">{{ t('tools.string-escape-converter.encode') }}</option>
        <option value="decode">{{ t('tools.string-escape-converter.decode') }}</option>
      </select>
    </label>
  </LocalToolPanel>
</template>

<style scoped>
.control { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
select { color: inherit; background: transparent; border: 1px solid #888; border-radius: 4px; padding: 6px; }
</style>
