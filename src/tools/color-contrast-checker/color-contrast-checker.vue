<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { checkContrast } from './color-contrast-checker.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const foreground = ref('');
const background = ref('');
const { result, error } = useLocalResult(() => foreground.value && background.value
  ? checkContrast(foreground.value, background.value)
  : undefined);

function reset() {
  foreground.value = '';
  background.value = '';
}
function sample() {
  foreground.value = '#777777';
  background.value = '#ffffff';
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
      <c-input-text v-model:value="foreground" :label="t('tools.color-contrast-checker.foreground')" placeholder="#777777" test-id="foreground" raw-text />
      <c-input-text v-model:value="background" :label="t('tools.color-contrast-checker.background')" placeholder="#ffffff" test-id="background" raw-text />
    </div>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <div v-if="result" data-test-id="area-content" mt-5>
      <p text-lg font-bold>
        {{ t('tools.color-contrast-checker.ratio') }}: {{ result.ratio }}:1
      </p>
      <div :style="{ color: result.foreground, backgroundColor: result.background }" my-4 rounded p-5>
        <p>{{ t('tools.color-contrast-checker.normalPreview') }}</p>
        <p style="font-size: 24px;">
          {{ t('tools.color-contrast-checker.largePreview') }}
        </p>
      </div>
      <table w-full text-left>
        <caption mb-2>
          {{ t('tools.color-contrast-checker.requirements') }}
        </caption>
        <thead>
          <tr>
            <th scope="col">
              {{ t('tools.color-contrast-checker.level') }}
            </th><th scope="col">
              {{ t('tools.color-contrast-checker.minimum') }}
            </th><th scope="col">
              {{ t('tools.color-contrast-checker.status') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              {{ t('tools.color-contrast-checker.aaNormal') }}
            </th><td>4.5:1</td><td>{{ t(result.aaNormal ? 'tools.color-contrast-checker.pass' : 'tools.color-contrast-checker.fail') }}</td>
          </tr>
          <tr>
            <th scope="row">
              {{ t('tools.color-contrast-checker.aaLarge') }}
            </th><td>3:1</td><td>{{ t(result.aaLarge ? 'tools.color-contrast-checker.pass' : 'tools.color-contrast-checker.fail') }}</td>
          </tr>
          <tr>
            <th scope="row">
              {{ t('tools.color-contrast-checker.aaaNormal') }}
            </th><td>7:1</td><td>{{ t(result.aaaNormal ? 'tools.color-contrast-checker.pass' : 'tools.color-contrast-checker.fail') }}</td>
          </tr>
          <tr>
            <th scope="row">
              {{ t('tools.color-contrast-checker.aaaLarge') }}
            </th><td>4.5:1</td><td>{{ t(result.aaaLarge ? 'tools.color-contrast-checker.pass' : 'tools.color-contrast-checker.fail') }}</td>
          </tr>
        </tbody>
      </table>
      <p mt-4>
        {{ t('tools.color-contrast-checker.largeNotice') }}
      </p>
    </div>
  </c-card>
</template>

<style scoped>
th, td { padding: 6px; border-bottom: 1px solid #8884; }
</style>
