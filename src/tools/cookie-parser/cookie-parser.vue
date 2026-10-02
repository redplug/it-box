<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { parseCookieHeader } from './cookie-parser.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = 'Cookie: session=abc==; theme=dark; session=xyz; empty=';
const { result, error } = useLocalResult(() => input.value ? parseCookieHeader(input.value) : undefined);
const output = computed(() => result.value ? JSON.stringify(result.value, null, 2) : '');
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" :sample="sample" :input-label="t('tools.cookie-parser.inputLabel')">
    <p>{{ t('tools.cookie-parser.requestOnly') }}</p>
    <template #result>
      <div v-if="result" class="cookie-result">
        <n-table :single-line="false">
          <thead><tr><th>{{ t('tools.cookie-parser.name') }}</th><th>{{ t('tools.cookie-parser.value') }}</th></tr></thead>
          <tbody>
            <tr v-for="(pair, index) in result" :key="index">
              <td>{{ pair.name }}</td><td>{{ pair.value }}</td>
            </tr>
          </tbody>
        </n-table>
      </div>
      <TextareaCopyable :value="output" language="json" :copy-message="t('tools.local.copy')" />
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.cookie-result { margin: 20px 0; overflow-wrap: anywhere; }
</style>
