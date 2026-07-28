<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import { parse as parseYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const convertYamlToToml = (value: string) => [stringifyToml(parseYaml(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertYamlToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || parseYaml(v),
    message: '입력한 YAML이 유효하지 않습니다.',
  },
];
</script>

<template>
  <format-transformer
    input-label="YAML"
    input-placeholder="YAML을 여기에 붙여 넣으세요..."
    output-label="YAML에서 변환된 TOML"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
