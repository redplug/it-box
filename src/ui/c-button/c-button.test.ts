import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { expect, it } from 'vitest';
import CButton from './c-button.vue';

it('uses native disabled behavior and re-enables with its prop', async () => {
  const wrapper = mount(CButton, { props: { disabled: true }, global: { plugins: [createPinia()] } });
  expect(wrapper.get('button').element.disabled).toBe(true);
  await wrapper.get('button').trigger('click');
  expect(wrapper.emitted('click')).toBeUndefined();
  await wrapper.setProps({ disabled: false });
  expect(wrapper.get('button').element.disabled).toBe(false);
  await wrapper.get('button').trigger('click');
  expect(wrapper.emitted('click')).toHaveLength(1);
});
