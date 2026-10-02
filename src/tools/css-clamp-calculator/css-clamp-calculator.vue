<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { calculateClamp } from './css-clamp-calculator.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const minFont = ref<number | ''>('');
const maxFont = ref<number | ''>('');
const minWidth = ref<number | ''>(320);
const maxWidth = ref<number | ''>(1280);
const rootFont = ref<number | ''>(16);
const { result, error } = useLocalResult(() => minFont.value !== '' && maxFont.value !== '' && minWidth.value !== '' && maxWidth.value !== '' && rootFont.value !== ''
  ? calculateClamp({ minFont: minFont.value, maxFont: maxFont.value, minWidth: minWidth.value, maxWidth: maxWidth.value, rootFont: rootFont.value })
  : undefined);

function reset() {
  minFont.value = '';
  maxFont.value = '';
  minWidth.value = 320;
  maxWidth.value = 1280;
  rootFont.value = 16;
}
function sample() {
  reset();
  minFont.value = 16;
  maxFont.value = 32;
}
</script>

<template>
  <c-card>
    <p mb-4>
      {{ t('tools.local.localNotice') }}
    </p>
    <div mb-4 flex gap-2>
      <c-button data-test-id="sample" @click="sample">
        {{ t('tools.local.sample') }}
      </c-button>
      <c-button data-test-id="reset" @click="reset">
        {{ t('tools.local.reset') }}
      </c-button>
    </div>
    <div class="controls">
      <label for="clamp-min-font">{{ t('tools.css-clamp-calculator.minFont') }}</label>
      <input id="clamp-min-font" v-model.number="minFont" type="number" min="0" step="any" data-test-id="min-font">
      <label for="clamp-max-font">{{ t('tools.css-clamp-calculator.maxFont') }}</label>
      <input id="clamp-max-font" v-model.number="maxFont" type="number" min="0" step="any" data-test-id="max-font">
      <label for="clamp-min-width">{{ t('tools.css-clamp-calculator.minWidth') }}</label>
      <input id="clamp-min-width" v-model.number="minWidth" type="number" min="0" step="any" data-test-id="min-width">
      <label for="clamp-max-width">{{ t('tools.css-clamp-calculator.maxWidth') }}</label>
      <input id="clamp-max-width" v-model.number="maxWidth" type="number" min="0" step="any" data-test-id="max-width">
      <label for="clamp-root-font">{{ t('tools.css-clamp-calculator.rootFont') }}</label>
      <input id="clamp-root-font" v-model.number="rootFont" type="number" min="0" step="any" data-test-id="root-font">
    </div>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <template v-if="result">
      <p mt-5>
        {{ t('tools.local.output') }}
      </p>
      <TextareaCopyable :value="`font-size: ${result.css};`" :copy-message="t('tools.local.copy')" />
      <p mt-4>
        {{ t('tools.css-clamp-calculator.rootNotice') }}
      </p>
    </template>
  </c-card>
</template>

<style scoped>
.controls { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: center; }
.controls input { width: 100%; min-width: 0; padding: 8px; border: 1px solid #8888; border-radius: 4px; background: transparent; color: inherit; }
</style>
