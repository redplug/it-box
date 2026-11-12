<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { LimitMode, LineBreak } from './korean-byte-counter.models';
import { measureText, truncateToLimit } from './korean-byte-counter.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const lineBreak = ref<LineBreak>('lf');
const limit = ref<number | null>(null);
const limitMode = ref<LimitMode>('chars');
const sample = '안녕하세요. 자기소개서 글자수를 확인합니다. 👨‍👩‍👧';
const { result, error } = useLocalResult(() => measureText(input.value, lineBreak.value));

const lineBreakOptions = computed(() => [
  { label: t('tools.korean-byte-counter.lineBreaks.lf'), value: 'lf' },
  { label: t('tools.korean-byte-counter.lineBreaks.crlf'), value: 'crlf' },
]);
const modeOptions = computed(() => [
  { label: t('tools.korean-byte-counter.modes.chars'), value: 'chars' },
  { label: t('tools.korean-byte-counter.modes.charsNoSpace'), value: 'charsNoSpace' },
  { label: t('tools.korean-byte-counter.modes.utf8'), value: 'utf8' },
  { label: t('tools.korean-byte-counter.modes.eucKr'), value: 'eucKr' },
]);

const current = computed(() => {
  const value = result.value;
  if (!value) {
    return 0;
  }
  const byMode: Record<LimitMode, number> = {
    chars: value.chars,
    charsNoSpace: value.charsNoSpace,
    utf8: value.utf8Bytes,
    eucKr: value.eucKrBytes,
  };
  return byMode[limitMode.value];
});
const excess = computed(() => limit.value === null ? 0 : Math.max(0, current.value - limit.value));
const truncated = computed(() => limit.value === null ? '' : truncateToLimit(input.value, limit.value, limitMode.value, lineBreak.value));

const rows = computed(() => {
  const value = result.value;
  if (!value) {
    return [];
  }
  return [
    { label: t('tools.korean-byte-counter.metrics.chars'), value: value.chars },
    { label: t('tools.korean-byte-counter.metrics.charsNoSpace'), value: value.charsNoSpace },
    { label: t('tools.korean-byte-counter.metrics.utf8Bytes'), value: value.utf8Bytes },
    { label: t('tools.korean-byte-counter.metrics.eucKrBytes'), value: value.eucKrBytes },
    { label: t('tools.korean-byte-counter.metrics.utf16Units'), value: value.utf16Units },
    { label: t('tools.korean-byte-counter.metrics.lines'), value: value.lines },
    { label: t('tools.korean-byte-counter.metrics.hangul'), value: value.hangul },
    { label: t('tools.korean-byte-counter.metrics.latin'), value: value.latin },
    { label: t('tools.korean-byte-counter.metrics.digits'), value: value.digits },
    { label: t('tools.korean-byte-counter.metrics.unrepresentable'), value: value.unrepresentable },
  ];
});

const smsLabel = computed(() => {
  const verdict = result.value?.sms;
  const labels = {
    sms: t('tools.korean-byte-counter.sms.sms'),
    lms: t('tools.korean-byte-counter.sms.lms'),
    over: t('tools.korean-byte-counter.sms.over'),
  };
  return verdict ? labels[verdict] : '';
});
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" :sample="sample" :input-label="t('tools.korean-byte-counter.inputLabel')">
    <template #inputs>
      <div class="options">
        <n-form-item :label="t('tools.korean-byte-counter.lineBreakLabel')" label-placement="top" :show-feedback="false">
          <n-select v-model:value="lineBreak" :options="lineBreakOptions" />
        </n-form-item>
        <n-form-item :label="t('tools.korean-byte-counter.limitLabel')" label-placement="top" :show-feedback="false">
          <n-input-number v-model:value="limit" min="0" :precision="0" clearable w-full :placeholder="t('tools.korean-byte-counter.limitPlaceholder')" />
        </n-form-item>
        <n-form-item :label="t('tools.korean-byte-counter.limitModeLabel')" label-placement="top" :show-feedback="false">
          <n-select v-model:value="limitMode" :options="modeOptions" />
        </n-form-item>
      </div>
    </template>
    <template #result>
      <div v-if="result" class="stats">
        <n-table :single-line="false">
          <thead><tr><th>{{ t('tools.korean-byte-counter.metricHeader') }}</th><th>{{ t('tools.korean-byte-counter.valueHeader') }}</th></tr></thead>
          <tbody>
            <tr v-for="row in rows" :key="row.label">
              <td>{{ row.label }}</td><td>{{ row.value }}</td>
            </tr>
          </tbody>
        </n-table>
        <p data-test-id="sms-verdict">
          {{ t('tools.korean-byte-counter.smsLabel') }}: {{ smsLabel }}
        </p>
        <p v-if="result.unrepresentable > 0" class="note">
          {{ t('tools.korean-byte-counter.unrepresentableNote') }}
        </p>
      </div>
      <template v-if="limit !== null && result">
        <p data-test-id="limit-status" :class="{ warn: excess > 0 }">
          {{ t('tools.korean-byte-counter.limitStatus', { current, limit }) }}
          <template v-if="excess > 0">
            ({{ t('tools.korean-byte-counter.overLimit', { excess }) }})
          </template>
        </p>
        <div class="output-label">
          {{ t('tools.korean-byte-counter.truncatedLabel') }}
        </div>
        <TextareaCopyable :value="truncated" :copy-message="t('tools.local.copy')" />
      </template>
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.options { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px; }
.stats { margin: 20px 0; }
.note { font-size: 13px; opacity: .8; }
.output-label { margin: 20px 0 8px; }
.warn { color: #b42318; font-weight: 600; }
:global(.dark) .warn { color: #ffb4ab; }
</style>
