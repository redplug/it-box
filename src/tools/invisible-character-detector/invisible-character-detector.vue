<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { detectInvisibleCharacters } from './invisible-character-detector.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const page = ref(1);
const sample = '😀A\u200B\u00A0\u202E\n';
const { result, error } = useLocalResult(() => detectInvisibleCharacters(input.value));
const rows = computed(() => result.value?.slice((page.value - 1) * 100, page.value * 100) ?? []);
watch(input, () => page.value = 1);
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" :sample="sample" @reset="page = 1">
    <p>{{ t('tools.invisible-character-detector.positionNote') }}</p>
    <template #result>
      <div v-if="input && result" class="result" data-test-id="area-content">
        <p>{{ t('tools.invisible-character-detector.summary', { count: result.length }) }}</p>
        <n-table :single-line="false">
          <thead><tr><th>{{ t('tools.invisible-character-detector.position') }}</th><th>{{ t('tools.invisible-character-detector.codePoint') }}</th><th>{{ t('tools.invisible-character-detector.name') }}</th></tr></thead>
          <tbody>
            <tr v-for="row in rows" :key="row.position">
              <td>{{ row.position }}</td><td>{{ row.codePoint }}</td><td>{{ row.name }}</td>
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
.result { margin-top: 20px; overflow-wrap: anywhere; }
.pagination { display: flex; gap: 12px; align-items: center; margin-top: 16px; }
</style>
