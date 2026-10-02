<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type DurationUnit, convertDuration, durationUnits } from './duration-converter.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const value = ref<number | ''>('');
const unit = ref<DurationUnit>('s');
const { result, error } = useLocalResult(() => value.value !== '' ? convertDuration(value.value, unit.value) : undefined);
function reset() {
  value.value = '';
  unit.value = 's';
}
function sample() {
  value.value = 1;
  unit.value = 'week';
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
      <label for="duration-value">{{ t('tools.duration-converter.value') }}</label>
      <input id="duration-value" v-model.number="value" type="number" min="0" step="any" data-test-id="input">
      <label for="duration-unit">{{ t('tools.duration-converter.unit') }}</label>
      <select id="duration-unit" v-model="unit" data-test-id="unit">
        <option v-for="row in durationUnits" :key="row.unit" :value="row.unit">
          {{ t(`tools.duration-converter.units.${row.unit}`) }}
        </option>
      </select>
    </div>
    <p mt-4>
      {{ t('tools.duration-converter.durationNotice') }}
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
            {{ t('tools.duration-converter.unit') }}
          </th><th scope="col">
            {{ t('tools.duration-converter.value') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in result" :key="row.unit">
          <th scope="row">
            {{ t(`tools.duration-converter.units.${row.unit}`) }}
          </th><td>{{ String(row.value) }}</td>
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
