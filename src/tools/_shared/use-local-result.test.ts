import { createApp, h, ref } from 'vue';
import { createI18n } from 'vue-i18n';
import { expect, it } from 'vitest';
import { useLocalResult } from './use-local-result';

it('clears stale results and translates error parameters and locale changes', () => {
  const input = ref('ok');
  const i18n = createI18n({
    legacy: false,
    locale: 'ko',
    messages: {
      ko: { tools: { local: { errors: { invalidInput: '입력 오류' } }, example: { bad: '{line}행 오류' } } },
      en: { tools: { example: { bad: 'Error on line {line}' } } },
    },
  });
  let state: ReturnType<typeof useLocalResult<string>>;
  const app = createApp({
    setup() {
      state = useLocalResult(() => {
        if (input.value === 'bad') {
          throw Object.assign(new Error('tools.example.bad'), { params: { line: 3 } });
        }
        return input.value.toUpperCase();
      });
      return () => h('div');
    },
  }).use(i18n);
  app.mount(document.createElement('div'));
  expect(state!.result.value).toBe('OK');
  input.value = 'bad';
  expect(state!.result.value).toBeUndefined();
  expect(state!.error.value).toBe('3행 오류');
  i18n.global.locale.value = 'en';
  expect(state!.error.value).toBe('Error on line 3');
  input.value = 'valid';
  expect(state!.result.value).toBe('VALID');
  expect(state!.error.value).toBe('');
  app.unmount();
});
