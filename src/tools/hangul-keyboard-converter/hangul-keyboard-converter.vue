<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { convertKeyboard } from './hangul-keyboard-converter.models';
import type { Direction } from './hangul-keyboard-converter.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const direction = ref<Direction>('en-to-ko');
const sample = 'dkssudgktpdy';
const { result, error } = useLocalResult(() => input.value ? convertKeyboard(input.value, direction.value) : undefined);
const output = computed(() => result.value ?? '');
</script>

<template>
  <LocalToolPanel v-model:input="input" :output="output" :error="error" :sample="sample" :input-label="t('tools.hangul-keyboard-converter.inputLabel')">
    <div class="direction">
      <p>{{ t('tools.hangul-keyboard-converter.direction') }}</p>
      <n-radio-group v-model:value="direction">
        <n-radio value="en-to-ko">
          {{ t('tools.hangul-keyboard-converter.enToKo') }}
        </n-radio>
        <n-radio value="ko-to-en">
          {{ t('tools.hangul-keyboard-converter.koToEn') }}
        </n-radio>
      </n-radio-group>
    </div>
  </LocalToolPanel>
</template>

<style scoped>
.direction { margin-bottom: 16px; }
.direction p { margin: 0 0 8px; }
</style>
