<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateBoxShadow } from './css-box-shadow-generator.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const x = ref<number | ''>('');
const y = ref<number | ''>(8);
const blur = ref<number | ''>(24);
const spread = ref<number | ''>(0);
const color = ref('#000000');
const opacity = ref<number | ''>(0.25);
const inset = ref(false);
const { result, error } = useLocalResult(() => x.value !== '' && y.value !== '' && blur.value !== '' && spread.value !== '' && opacity.value !== '' && color.value
  ? generateBoxShadow({ x: x.value, y: y.value, blur: blur.value, spread: spread.value, color: color.value, opacity: opacity.value, inset: inset.value })
  : undefined);

function reset() {
  x.value = '';
  y.value = 8;
  blur.value = 24;
  spread.value = 0;
  color.value = '#000000';
  opacity.value = 0.25;
  inset.value = false;
}
function sample() {
  reset();
  x.value = 4;
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
      <label for="shadow-x">{{ t('tools.css-box-shadow-generator.x') }}</label>
      <input id="shadow-x" v-model.number="x" type="number" step="any" data-test-id="offset-x">
      <label for="shadow-y">{{ t('tools.css-box-shadow-generator.y') }}</label>
      <input id="shadow-y" v-model.number="y" type="number" step="any" data-test-id="offset-y">
      <label for="shadow-blur">{{ t('tools.css-box-shadow-generator.blur') }}</label>
      <input id="shadow-blur" v-model.number="blur" type="number" min="0" step="any" data-test-id="blur">
      <label for="shadow-spread">{{ t('tools.css-box-shadow-generator.spread') }}</label>
      <input id="shadow-spread" v-model.number="spread" type="number" step="any" data-test-id="spread">
      <label for="shadow-opacity">{{ t('tools.css-box-shadow-generator.opacity') }}</label>
      <input id="shadow-opacity" v-model.number="opacity" type="number" min="0" max="1" step="0.01" data-test-id="opacity">
    </div>
    <c-input-text v-model:value="color" :label="t('tools.css-box-shadow-generator.color')" placeholder="#000000" test-id="shadow-color" raw-text mt-4 />
    <label mt-4 flex items-center gap-2>
      <input v-model="inset" type="checkbox" data-test-id="inset">
      {{ t('tools.css-box-shadow-generator.inset') }}
    </label>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <template v-if="result">
      <div flex justify-center py-12>
        <div :style="{ boxShadow: result }" style="width: 160px; height: 120px; background: #f1f5f9; color: #0f172a; border-radius: 8px; display: grid; place-items: center;">
          {{ t('tools.css-box-shadow-generator.preview') }}
        </div>
      </div>
      <p>{{ t('tools.local.output') }}</p>
      <TextareaCopyable :value="`box-shadow: ${result};`" :copy-message="t('tools.local.copy')" />
    </template>
  </c-card>
</template>

<style scoped>
.controls { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: center; }
.controls input { width: 100%; min-width: 0; padding: 8px; border: 1px solid #8888; border-radius: 4px; background: transparent; color: inherit; }
</style>
