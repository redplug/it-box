<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateBorderRadius } from './css-border-radius-generator.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const topLeft = ref<number | ''>('');
const topRight = ref<number | ''>('');
const bottomRight = ref<number | ''>('');
const bottomLeft = ref<number | ''>('');
const { result, error } = useLocalResult(() => topLeft.value !== '' && topRight.value !== '' && bottomRight.value !== '' && bottomLeft.value !== ''
  ? generateBorderRadius(topLeft.value, topRight.value, bottomRight.value, bottomLeft.value)
  : undefined);

function reset() {
  topLeft.value = '';
  topRight.value = '';
  bottomRight.value = '';
  bottomLeft.value = '';
}
function sample() {
  topLeft.value = 8;
  topRight.value = 24;
  bottomRight.value = 48;
  bottomLeft.value = 0;
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
      <label for="radius-top-left">{{ t('tools.css-border-radius-generator.topLeft') }}</label>
      <input id="radius-top-left" v-model.number="topLeft" type="number" min="0" step="any" data-test-id="top-left">
      <label for="radius-top-right">{{ t('tools.css-border-radius-generator.topRight') }}</label>
      <input id="radius-top-right" v-model.number="topRight" type="number" min="0" step="any" data-test-id="top-right">
      <label for="radius-bottom-right">{{ t('tools.css-border-radius-generator.bottomRight') }}</label>
      <input id="radius-bottom-right" v-model.number="bottomRight" type="number" min="0" step="any" data-test-id="bottom-right">
      <label for="radius-bottom-left">{{ t('tools.css-border-radius-generator.bottomLeft') }}</label>
      <input id="radius-bottom-left" v-model.number="bottomLeft" type="number" min="0" step="any" data-test-id="bottom-left">
    </div>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <template v-if="result">
      <div flex justify-center py-8>
        <div :style="{ borderRadius: result }" style="width: 220px; height: 150px; background: #2563eb; color: #fff; display: grid; place-items: center;">
          {{ t('tools.css-border-radius-generator.preview') }}
        </div>
      </div>
      <p>{{ t('tools.local.output') }}</p>
      <TextareaCopyable :value="`border-radius: ${result};`" :copy-message="t('tools.local.copy')" />
    </template>
  </c-card>
</template>

<style scoped>
.controls { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: center; }
.controls input { width: 100%; min-width: 0; padding: 8px; border: 1px solid #8888; border-radius: 4px; background: transparent; color: inherit; }
</style>
