<script setup lang="ts">
import convert from 'xml-js';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const defaultValue = '{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}';
function transformer(value: string) {
  return withDefaultOnError(() => {
    return convert.js2xml(JSON5.parse(value), { compact: true });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: '입력한 JSON이 유효하지 않습니다.',
  },
];
</script>

<template>
  <format-transformer
    input-label="JSON 내용"
    :input-default="defaultValue"
    input-placeholder="JSON 내용을 여기에 붙여 넣으세요..."
    output-label="변환된 XML"
    output-language="xml"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
