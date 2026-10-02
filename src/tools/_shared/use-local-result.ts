import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useLocalResult<T>(calculate: () => T) {
  const { t } = useI18n();
  const state = computed(() => {
    try {
      return { value: calculate(), error: '', params: {} as Record<string, unknown> };
    }
    catch (error) {
      const key = error instanceof Error && error.message.startsWith('tools.')
        ? error.message
        : 'tools.local.errors.invalidInput';
      const params = error instanceof Error && 'params' in error && typeof error.params === 'object' && error.params !== null
        ? error.params as Record<string, unknown>
        : {};
      return { value: undefined, error: key, params };
    }
  });
  return {
    result: computed(() => state.value.value),
    error: computed(() => state.value.error ? t(state.value.error, state.value.params) : ''),
  };
}
