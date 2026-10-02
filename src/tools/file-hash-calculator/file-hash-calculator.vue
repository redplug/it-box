<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { HashAlgorithm } from './file-hash-calculator.models';
import { hashFile } from './file-hash-calculator.models';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();
const file = ref<File>();
const algorithm = ref<HashAlgorithm>('SHA-256');
const output = ref('');
const busy = ref(false);
const errorKey = ref('');
const error = computed(() => errorKey.value ? t(errorKey.value) : '');
const fileInput = ref<HTMLInputElement>();
let generation = 0;
function invalidate() {
  generation++;
  output.value = '';
  errorKey.value = '';
  busy.value = false;
}
watch([file, algorithm], invalidate, { flush: 'sync' });
onBeforeUnmount(invalidate);
function reset() {
  file.value = undefined;
  algorithm.value = 'SHA-256';
  invalidate();
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
function sample() {
  file.value = new File(['abc'], 'example.txt', { type: 'text/plain' });
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
async function calculate() {
  if (!file.value) {
    return;
  }
  invalidate();
  const ticket = generation;
  busy.value = true;
  try {
    const digest = await hashFile(file.value, algorithm.value);
    if (ticket === generation) {
      output.value = digest;
    }
  }
  catch (error) {
    if (ticket === generation) {
      errorKey.value = error instanceof Error && error.message.startsWith('tools.') ? error.message : 'tools.local.errors.invalidInput';
    }
  }
  finally {
    if (ticket === generation) {
      busy.value = false;
    }
  }
}
function selectFile(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0];
}
</script>

<template>
  <div class="hash-tool">
    <p>{{ t('tools.local.localNotice') }}</p>
    <c-card>
      <label>{{ t('tools.local.file') }}<input ref="fileInput" type="file" data-test-id="file" @change="selectFile"></label>
      <p>{{ t('tools.file-hash-calculator.limit') }}</p>
      <label>{{ t('tools.file-hash-calculator.algorithm') }}<select v-model="algorithm" data-test-id="algorithm"><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></label>
      <div class="actions">
        <c-button data-test-id="sample" @click="sample">
          {{ t('tools.local.sample') }}
        </c-button><c-button :disabled="!file || busy" data-test-id="calculate" @click="calculate">
          {{ busy ? t('tools.local.loading') : t('tools.file-hash-calculator.calculate') }}
        </c-button><c-button data-test-id="reset" @click="reset">
          {{ t('tools.local.reset') }}
        </c-button>
      </div>
    </c-card>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <TextareaCopyable :value="output" :copy-message="t('tools.local.copy')" />
  </div>
</template>

<style scoped>
.hash-tool { width: 100%; max-width: 760px; min-width: 0; }
label { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
input, select { color: inherit; background: transparent; padding: 8px; border: 1px solid #8888; border-radius: 4px; }
.actions { display: flex; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
[role=alert] { color: #c2410c; }
</style>
