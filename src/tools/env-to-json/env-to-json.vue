<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { envToJson, jsonToEnv } from './env-to-json.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const direction = ref<'to-json' | 'to-env'>('to-json');
const sample = computed(() =>
  direction.value === 'to-json'
    ? '# Local settings\nexport APP_NAME="IT Box"\nPORT=3000\nMESSAGE="hello\\nworld"'
    : '{"APP_NAME":"IT Box","PORT":"3000","MESSAGE":"hello\\nworld"}',
);
const { result, error } = useLocalResult(() =>
  input.value.trim() ? (direction.value === 'to-json' ? envToJson(input.value) : jsonToEnv(input.value)) : '',
);
</script>

<template>
  <LocalToolPanel
    v-model:input="input"
    :output="result"
    :error="error"
    :sample="sample"
    :input-label="t(direction === 'to-json' ? 'tools.env-to-json.envInput' : 'tools.env-to-json.jsonInput')"
    :language="direction === 'to-json' ? 'json' : 'txt'"
    @reset="direction = 'to-json'"
  >
    <div class="mb-4 flex items-center gap-3">
      <label for="env-direction">{{ t('tools.env-to-json.direction') }}</label>
      <select id="env-direction" v-model="direction" data-test-id="direction">
        <option value="to-json">
          {{ t('tools.env-to-json.toJson') }}
        </option>
        <option value="to-env">
          {{ t('tools.env-to-json.toEnv') }}
        </option>
      </select>
    </div>
    <p class="mb-4 text-sm">
      {{ t('tools.env-to-json.hint') }}
    </p>
  </LocalToolPanel>
</template>
