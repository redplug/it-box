<script setup lang="ts">
import { generateKeyPair } from './rsa-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const bits = ref(2048);
const emptyCerts = { publicKeyPem: '', privateKeyPem: '' };

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: [
    {
      message: '비트 수는 256 이상 16384 이하이며 8의 배수여야 합니다',
      validator: value => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ],
});

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair({ bits: bits.value }), emptyCerts),
  emptyCerts,
);
</script>

<template>
  <div style="flex: 0 0 100%">
    <div item-style="flex: 1 1 0" style="max-width: 600px" mx-auto flex gap-3>
      <n-form-item label="비트 수:" v-bind="bitsValidationAttrs as any" label-placement="left" label-width="100">
        <n-input-number v-model:value="bits" min="256" max="16384" step="8" />
      </n-form-item>

      <c-button @click="refreshCerts">
        Refresh key-pair
      </c-button>
    </div>
  </div>

  <div>
    <h3>공개 키</h3>
    <TextareaCopyable :value="certs.publicKeyPem" />
  </div>

  <div>
    <h3>개인 키</h3>
    <TextareaCopyable :value="certs.privateKeyPem" />
  </div>
</template>
