<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type DataSizeUnit, convertDataSize, dataSizeUnits, formatDataSize } from './data-size-converter.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const value = ref<number | ''>('');
const unit = ref<DataSizeUnit>('byte');
const { result, error } = useLocalResult(() => value.value !== '' ? convertDataSize(value.value, unit.value) : undefined);
function reset() {
  value.value = '';
  unit.value = 'byte';
}
function sample() {
  value.value = 1;
  unit.value = 'KiB';
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
      <label for="data-size-value">{{ t('tools.data-size-converter.value') }}</label>
      <input id="data-size-value" v-model.number="value" type="number" min="0" step="any" data-test-id="input">
      <label for="data-size-unit">{{ t('tools.data-size-converter.unit') }}</label>
      <select id="data-size-unit" v-model="unit" data-test-id="unit">
        <option v-for="row in dataSizeUnits" :key="row.unit" :value="row.unit">
          {{ row.unit }}
        </option>
      </select>
    </div>
    <p mt-4>
      {{ t('tools.data-size-converter.systemNotice') }}
    </p>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <table v-if="result" data-test-id="area-content" mt-5 w-full text-left>
      <caption mb-2>
        {{ t('tools.local.output') }}
      </caption>
      <thead>
        <tr>
          <th scope="col">
            {{ t('tools.data-size-converter.unit') }}
          </th><th scope="col">
            {{ t('tools.data-size-converter.system') }}
          </th><th scope="col">
            {{ t('tools.data-size-converter.value') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in result" :key="row.unit">
          <th scope="row">
            {{ row.unit }}
          </th><td>{{ t(`tools.data-size-converter.${row.system}`) }}</td><td>{{ formatDataSize(row.value) }}</td>
        </tr>
      </tbody>
    </table>
  </c-card>
</template>

<style scoped>
.controls { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: center; }
.controls input, .controls select { width: 100%; min-width: 0; padding: 8px; border: 1px solid #8888; border-radius: 4px; background: transparent; color: inherit; }
th, td { padding: 6px; border-bottom: 1px solid #8884; overflow-wrap: anywhere; }
</style>
