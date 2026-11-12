<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type PiiKind, maskPii } from './pii-masker.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const sample = '문의 010-1234-5678, honggildong@example.com, 카드 4111 1111 1111 1111, IP 192.168.0.10, 사업자 123-45-67890, 주민 900101-1234567';
const enabled = reactive<Record<PiiKind, boolean>>({ rrn: true, phone: true, email: true, card: true, ipv4: true, businessNo: true });
const kindLabels = computed<{ kind: PiiKind; label: string }[]>(() => [
  { kind: 'rrn', label: t('tools.pii-masker.kinds.rrn') },
  { kind: 'phone', label: t('tools.pii-masker.kinds.phone') },
  { kind: 'email', label: t('tools.pii-masker.kinds.email') },
  { kind: 'card', label: t('tools.pii-masker.kinds.card') },
  { kind: 'ipv4', label: t('tools.pii-masker.kinds.ipv4') },
  { kind: 'businessNo', label: t('tools.pii-masker.kinds.businessNo') },
]);
const { result, error } = useLocalResult(() => input.value ? maskPii(input.value, { ...enabled }) : undefined);
const output = computed(() => result.value?.text ?? '');
const total = computed(() => result.value ? Object.values(result.value.counts).reduce((sum, count) => sum + count, 0) : 0);
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" :sample="sample" :input-label="t('tools.pii-masker.inputLabel')">
    <p>{{ t('tools.pii-masker.optionsLabel') }}</p>
    <div class="kind-options">
      <n-checkbox v-for="item in kindLabels" :key="item.kind" v-model:checked="enabled[item.kind]">
        {{ item.label }}
      </n-checkbox>
    </div>
    <template #result>
      <div class="output-label">
        {{ t('tools.pii-masker.resultLabel') }}
      </div>
      <TextareaCopyable :value="output" language="txt" :copy-message="t('tools.local.copy')" />
      <div v-if="result" class="count-result">
        <h3>{{ t('tools.pii-masker.countTitle') }}</h3>
        <n-table :single-line="false">
          <thead><tr><th>{{ t('tools.pii-masker.kindColumn') }}</th><th>{{ t('tools.pii-masker.countColumn') }}</th></tr></thead>
          <tbody>
            <tr v-for="item in kindLabels" :key="item.kind">
              <td>{{ item.label }}</td><td>{{ result.counts[item.kind] }}</td>
            </tr>
            <tr>
              <td>{{ t('tools.pii-masker.totalRow') }}</td><td>{{ total }}</td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.kind-options { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 16px; }
.output-label { margin: 20px 0 8px; }
.count-result { margin: 20px 0; overflow-wrap: anywhere; }
.count-result h3 { margin: 0 0 8px; font-size: 16px; }
</style>
