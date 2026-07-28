<script setup lang="ts">
import { parse as parseToml } from 'iarna-toml-esm';
import { stringify as stringifyToYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from '../toml-to-json/toml.services';
import type { UseValidationRule } from '@/composable/validation';

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => stringifyToYaml(parseToml(value)), '');

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
    output-label="YAML from your TOML"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
