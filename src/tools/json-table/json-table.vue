<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { jsonToTable, tablePage } from './json-table.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const page = ref(1);
const sample = '[{"name":"Ada","score":42,"profile":{"active":true}},{"name":"Lin","tags":["developer"]}]';
const { result, error } = useLocalResult(() => (input.value.trim() ? jsonToTable(input.value) : undefined));
const pages = computed(() => Math.max(1, Math.ceil((result.value?.rows.length ?? 0) / 50)));
const rows = computed(() => tablePage(result.value?.rows ?? [], page.value));
watch(input, () => {
  page.value = 1;
});
</script>

<template>
  <LocalToolPanel
    v-model:input="input"
    :error="error"
    :sample="sample"
    :input-label="t('tools.json-table.inputLabel')"
    @reset="page = 1"
  >
    <p class="mb-4 text-sm">
      {{ t('tools.json-table.hint') }}
    </p>
    <template #result>
      <div v-if="result" class="mt-5">
        <div class="table-scroll">
          <table data-test-id="json-table">
            <caption>
              {{
                t('tools.json-table.caption')
              }}
            </caption>
            <thead>
              <tr>
                <th v-for="column in result.columns" :key="column" scope="col">
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="index">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="!result.rows.length" class="mt-3">
          {{ t('tools.json-table.empty') }}
        </p>
        <div v-if="pages > 1" class="mt-3 flex items-center gap-3">
          <c-button :disabled="page <= 1" data-test-id="previous" @click="page--">
            {{ t('tools.local.previous') }}
          </c-button>
          <span>{{ t('tools.json-table.pageStatus', { page, pages }) }}</span>
          <c-button :disabled="page >= pages" data-test-id="next" @click="page++">
            {{ t('tools.local.next') }}
          </c-button>
        </div>
      </div>
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.table-scroll {
  overflow: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
caption {
  text-align: left;
  margin-bottom: 8px;
}
th,
td {
  padding: 8px 12px;
  border: 1px solid #8886;
  vertical-align: top;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
