<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { parseHttpHeaders } from './http-headers-parser.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = 'HTTP/1.1 200 OK\nContent-Type: application/json\nX-Trace: first:part\nX-Trace: second';
const { result, error } = useLocalResult(() => input.value ? parseHttpHeaders(input.value) : undefined);
const output = computed(() => result.value ? JSON.stringify(result.value, null, 2) : '');
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" :sample="sample" :input-label="t('tools.http-headers-parser.inputLabel')">
    <template #result>
      <div v-if="result" class="header-result">
        <p v-if="result.startLine">
          {{ result.startLine }}
        </p>
        <n-table :single-line="false">
          <thead><tr><th>{{ t('tools.http-headers-parser.name') }}</th><th>{{ t('tools.http-headers-parser.values') }}</th></tr></thead>
          <tbody>
            <tr v-for="(values, name) in result.headers" :key="name">
              <td>{{ name }}</td><td class="values">
                {{ values.join('\n') }}
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
      <TextareaCopyable :value="output" language="json" :copy-message="t('tools.local.copy')" />
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.header-result { margin: 20px 0; overflow-wrap: anywhere; }
.values { white-space: pre-wrap; }
</style>
