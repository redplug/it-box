<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { extractChosung, matchesChosung, separateJamo, syllableTable } from './hangul-jamo-tool.models';
import LocalToolPanel from '@/tools/_shared/LocalToolPanel.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const input = ref('');
const expandJamo = ref(false);
const query = ref('');
const sample = '한글 값 과를 입력하세요. 대한민국 Korea 2026';
const { result: separated, error } = useLocalResult(() => input.value ? separateJamo(input.value, expandJamo.value) : undefined);
const { result: chosung } = useLocalResult(() => input.value ? extractChosung(input.value) : undefined);
const { result: syllables } = useLocalResult(() => input.value ? syllableTable(input.value) : undefined);
const { result: matched } = useLocalResult(() => input.value && query.value ? matchesChosung(input.value, query.value) : undefined);
</script>

<template>
  <LocalToolPanel v-model:input="input" :error="error" :sample="sample" :input-label="t('tools.hangul-jamo-tool.inputLabel')">
    <n-checkbox v-model:checked="expandJamo">
      {{ t('tools.hangul-jamo-tool.expandJamo') }}
    </n-checkbox>
    <template #inputs>
      <div class="search-label">
        {{ t('tools.hangul-jamo-tool.searchLabel') }}
      </div>
      <n-input v-model:value="query" clearable :placeholder="t('tools.hangul-jamo-tool.searchPlaceholder')" :aria-label="t('tools.hangul-jamo-tool.searchLabel')" />
      <p v-if="matched !== undefined" role="status" class="match-result">
        {{ matched ? t('tools.hangul-jamo-tool.matched') : t('tools.hangul-jamo-tool.notMatched') }}
      </p>
    </template>
    <template #result>
      <template v-if="separated !== undefined">
        <div class="result-label">
          {{ t('tools.hangul-jamo-tool.separatedLabel') }}
        </div>
        <TextareaCopyable :value="separated" language="txt" :copy-message="t('tools.local.copy')" />
        <div class="result-label">
          {{ t('tools.hangul-jamo-tool.chosungLabel') }}
        </div>
        <TextareaCopyable :value="chosung ?? ''" language="txt" :copy-message="t('tools.local.copy')" />
        <div class="result-label">
          {{ t('tools.hangul-jamo-tool.syllableLabel') }}
        </div>
        <div v-if="syllables?.length" class="table-wrap">
          <n-table :single-line="false">
            <thead>
              <tr>
                <th>{{ t('tools.hangul-jamo-tool.columns.syllable') }}</th>
                <th>{{ t('tools.hangul-jamo-tool.columns.cho') }}</th>
                <th>{{ t('tools.hangul-jamo-tool.columns.jung') }}</th>
                <th>{{ t('tools.hangul-jamo-tool.columns.jong') }}</th>
                <th>{{ t('tools.hangul-jamo-tool.columns.codePoint') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in syllables" :key="index">
                <td>{{ row.syllable }}</td>
                <td>{{ row.cho }}</td>
                <td>{{ row.jung }}</td>
                <td>{{ row.jong }}</td>
                <td>{{ row.codePoint }}</td>
              </tr>
            </tbody>
          </n-table>
        </div>
        <p v-else>
          {{ t('tools.hangul-jamo-tool.noSyllables') }}
        </p>
      </template>
    </template>
  </LocalToolPanel>
</template>

<style scoped>
.search-label { margin: 12px 0 8px; font-size: 14px; }
.match-result { margin: 8px 0 0; font-size: 14px; }
.result-label { margin: 20px 0 8px; }
.table-wrap { max-width: 100%; overflow-x: auto; margin-top: 8px; }
</style>
