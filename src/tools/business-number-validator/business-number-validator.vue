<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { checkNumbers } from './business-number-validator.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = '1234567891\n123-81-45672\n110111-1234569\n110111-1234567';
const { result, error } = useLocalResult(() => input.value ? checkNumbers(input.value) : undefined);
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" :sample="sample" :input-label="t('tools.business-number-validator.inputLabel')">
    <p>{{ t('tools.business-number-validator.notice') }}</p>
    <template #result>
      <div v-if="result && result.length" class="result-scroll">
        <n-table :single-line="false">
          <thead>
            <tr>
              <th>{{ t('tools.business-number-validator.original') }}</th>
              <th>{{ t('tools.business-number-validator.normalized') }}</th>
              <th>{{ t('tools.business-number-validator.kind') }}</th>
              <th>{{ t('tools.business-number-validator.status') }}</th>
              <th>{{ t('tools.business-number-validator.reason') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in result" :key="index">
              <td>{{ row.raw }}</td>
              <td>{{ row.normalized || '-' }}</td>
              <td>{{ t(`tools.business-number-validator.kinds.${row.kind}`) }}</td>
              <td>{{ row.valid ? t('tools.business-number-validator.valid') : t('tools.business-number-validator.invalid') }}</td>
              <td>
                {{ t(`tools.business-number-validator.reasons.${row.reason}`) }}
                <template v-if="row.hint">
                  <br>
                  {{ t('tools.business-number-validator.hintLabel') }}: {{ t(`tools.business-number-validator.hints.${row.hint}`) }}
                </template>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.result-scroll { margin: 20px 0; overflow-x: auto; }
</style>
