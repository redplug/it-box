<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { countWordFrequency } from './word-frequency-counter.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const caseSensitive = ref(false);
const page = ref(1);
const { result, error } = useLocalResult(() => countWordFrequency(input.value, caseSensitive.value));
const rows = computed(() => result.value?.slice((page.value - 1) * 100, page.value * 100) ?? []);
watch([input, caseSensitive], () => page.value = 1);
function reset() {
  caseSensitive.value = false;
  page.value = 1;
}
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" sample="Hello hello 안녕 안녕 123" @reset="reset">
    <label class="case-control"><input v-model="caseSensitive" type="checkbox" data-test-id="case-sensitive"> {{ t('tools.word-frequency-counter.caseSensitive') }}</label>
    <p>{{ t('tools.word-frequency-counter.tokenNote') }}</p>
    <template #result>
      <div v-if="input && result" class="result" data-test-id="area-content">
        <p>{{ t('tools.word-frequency-counter.summary', { count: result.length }) }}</p>
        <n-table :single-line="false">
          <thead><tr><th>{{ t('tools.word-frequency-counter.word') }}</th><th>{{ t('tools.word-frequency-counter.count') }}</th></tr></thead>
          <tbody>
            <tr v-for="row in rows" :key="row.word">
              <td>{{ row.word }}</td><td>{{ row.count }}</td>
            </tr>
          </tbody>
        </n-table>
        <div v-if="result.length > 100" class="pagination">
          <c-button :disabled="page === 1" @click="page--">
            {{ t('tools.local.previous') }}
          </c-button>
          <span>{{ page }} / {{ Math.ceil(result.length / 100) }}</span>
          <c-button :disabled="page * 100 >= result.length" @click="page++">
            {{ t('tools.local.next') }}
          </c-button>
        </div>
      </div>
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.case-control { display: flex; align-items: center; gap: 8px; }
.result { margin-top: 20px; overflow-wrap: anywhere; }
.pagination { display: flex; gap: 12px; align-items: center; margin-top: 16px; }
</style>
