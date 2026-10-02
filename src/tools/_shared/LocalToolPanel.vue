<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

withDefaults(defineProps<{
  input: string
  output?: string
  error?: string
  sample?: string
  inputLabel?: string
  language?: string
}>(), { output: '', error: '', sample: '', inputLabel: '', language: 'txt' });
const emit = defineEmits<{
  (event: 'update:input', value: string): void
  (event: 'reset'): void
}>();
const { t } = useI18n();

function reset() {
  emit('update:input', '');
  emit('reset');
}
</script>

<template>
  <div class="local-tool-panel">
    <p class="local-notice">
      {{ t('tools.local.localNotice') }}
    </p>
    <c-card>
      <slot />
      <div class="actions">
        <c-button v-if="sample" data-test-id="sample" @click="emit('update:input', sample)">
          {{ t('tools.local.sample') }}
        </c-button>
        <c-button data-test-id="reset" @click="reset">
          {{ t('tools.local.reset') }}
        </c-button>
      </div>
      <CInputText
        :value="input"
        :label="inputLabel || t('tools.local.input')"
        :placeholder="inputLabel || t('tools.local.input')"
        raw-text multiline monospace rows="8" test-id="input"
        @update:value="emit('update:input', $event)"
      />
      <slot name="inputs" />
    </c-card>
    <p v-if="error" role="alert" data-test-id="tool-error" class="error">
      {{ error }}
    </p>
    <slot name="result">
      <div class="output-label">
        {{ t('tools.local.output') }}
      </div>
      <TextareaCopyable :value="error ? '' : output" :language="language" :copy-message="t('tools.local.copy')" />
    </slot>
  </div>
</template>

<style scoped>
.local-tool-panel { width: 100%; max-width: 900px; min-width: 0; }
.local-notice { margin: 0 0 12px; font-size: 13px; opacity: .8; }
.actions { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.output-label { margin: 20px 0 8px; }
.error { color: #b42318; overflow-wrap: anywhere; }
:global(.dark) .error { color: #ffb4ab; }
</style>
