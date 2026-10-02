<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateGradient } from './css-gradient-generator.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const firstColor = ref('');
const secondColor = ref('');
const angle = ref<number | ''>(90);
const { result, error } = useLocalResult(() => firstColor.value && secondColor.value && angle.value !== ''
  ? generateGradient({ firstColor: firstColor.value, secondColor: secondColor.value, angle: angle.value })
  : undefined);

function reset() {
  firstColor.value = '';
  secondColor.value = '';
  angle.value = 90;
}
function sample() {
  firstColor.value = '#2563eb';
  secondColor.value = '#7c3aed';
  angle.value = 135;
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
    <div grid gap-4 sm:grid-cols-2>
      <c-input-text v-model:value="firstColor" :label="t('tools.css-gradient-generator.firstColor')" placeholder="#2563eb" test-id="first-color" raw-text />
      <c-input-text v-model:value="secondColor" :label="t('tools.css-gradient-generator.secondColor')" placeholder="#7c3aed" test-id="second-color" raw-text />
      <label for="gradient-angle">{{ t('tools.css-gradient-generator.angle') }}</label>
      <input id="gradient-angle" v-model.number="angle" type="number" step="any" data-test-id="angle" class="number-input">
    </div>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <template v-if="result">
      <div role="img" :aria-label="t('tools.css-gradient-generator.preview')" :style="{ background: result }" mt-5 h-40 rounded />
      <p mt-4>
        {{ t('tools.local.output') }}
      </p>
      <TextareaCopyable :value="`background: ${result};`" :copy-message="t('tools.local.copy')" />
    </template>
  </c-card>
</template>

<style scoped>
.number-input { width: 100%; min-width: 0; padding: 8px; border: 1px solid #8888; border-radius: 4px; background: transparent; color: inherit; }
</style>
