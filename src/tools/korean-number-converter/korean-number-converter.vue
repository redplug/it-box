<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  normalizeAmount,
  parseKoreanNumber,
  toCommaSeparated,
  toKoreanAmount,
  toKoreanReading,
  toMixedUnits,
} from './korean-number-converter.models';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const numberInput = ref('');
const koreanInput = ref('');
const sample = '1234000';

function convertNumber(text: string) {
  const digits = normalizeAmount(text);
  return {
    reading: toKoreanReading(digits),
    amount: toKoreanAmount(digits),
    mixed: toMixedUnits(digits),
    comma: toCommaSeparated(digits),
  };
}

const { result: forward, error: forwardError } = useLocalResult(() => numberInput.value.trim() ? convertNumber(numberInput.value) : undefined);
const { result: backward, error: backwardError } = useLocalResult(() => koreanInput.value.trim() ? parseKoreanNumber(koreanInput.value) : undefined);

const forwardRows = computed(() => forward.value
  ? [
      { key: 'reading', label: t('tools.korean-number-converter.reading'), value: forward.value.reading },
      { key: 'amount', label: t('tools.korean-number-converter.amount'), value: forward.value.amount },
      { key: 'mixed', label: t('tools.korean-number-converter.mixed'), value: forward.value.mixed },
      { key: 'comma', label: t('tools.korean-number-converter.comma'), value: forward.value.comma },
    ]
  : []);

function reset() {
  numberInput.value = '';
  koreanInput.value = '';
}
</script>

<template>
  <div class="korean-number-converter">
    <p class="local-notice">
      {{ t('tools.local.localNotice') }}
    </p>
    <c-card>
      <div class="actions">
        <c-button data-test-id="sample" @click="numberInput = sample">
          {{ t('tools.local.sample') }}
        </c-button>
        <c-button data-test-id="reset" @click="reset">
          {{ t('tools.local.reset') }}
        </c-button>
      </div>
      <CInputText
        :value="numberInput"
        :label="t('tools.korean-number-converter.numberLabel')"
        :placeholder="t('tools.korean-number-converter.numberLabel')"
        raw-text monospace test-id="input"
        @update:value="numberInput = $event"
      />
    </c-card>
    <p v-if="forwardError" role="alert" data-test-id="tool-error" class="error">
      {{ forwardError }}
    </p>
    <section v-for="row in forwardRows" :key="row.key" class="output-row">
      <div class="output-label">
        {{ row.label }}
      </div>
      <TextareaCopyable :value="row.value" language="txt" :copy-message="t('tools.local.copy')" />
    </section>

    <c-card class="reverse">
      <CInputText
        :value="koreanInput"
        :label="t('tools.korean-number-converter.koreanLabel')"
        :placeholder="t('tools.korean-number-converter.koreanPlaceholder')"
        raw-text monospace test-id="korean-input"
        @update:value="koreanInput = $event"
      />
    </c-card>
    <p v-if="backwardError" role="alert" data-test-id="korean-error" class="error">
      {{ backwardError }}
    </p>
    <section v-if="backward" class="output-row">
      <div class="output-label">
        {{ t('tools.korean-number-converter.parsed') }}
      </div>
      <TextareaCopyable :value="backward" language="txt" :copy-message="t('tools.local.copy')" />
    </section>
  </div>
</template>

<style scoped>
.korean-number-converter { width: 100%; max-width: 900px; min-width: 0; }
.local-notice { margin: 0 0 12px; font-size: 13px; opacity: .8; }
.actions { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.reverse { margin-top: 24px; }
.output-row { margin-top: 20px; }
.output-label { margin: 0 0 8px; }
.error { color: #b42318; overflow-wrap: anywhere; }
:global(.dark) .error { color: #ffb4ab; }
</style>
