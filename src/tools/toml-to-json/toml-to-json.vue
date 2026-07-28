<script setup lang="ts">
import { parse as parseToml } from 'iarna-toml-esm';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from './toml.services';
import type { UseValidationRule } from '@/composable/validation';

const transformer = (value: string) => value === '' ? '' : withDefaultOnError(() => JSON.stringify(parseToml(value), null, 3), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidToml,
    message: '입력한 TOML이 유효하지 않습니다.',
  },
];
</script>

<template>
  <format-transformer
    input-label="TOML"
    input-placeholder="TOML을 여기에 붙여 넣으세요..."
    output-label="TOML에서 변환된 JSON"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
