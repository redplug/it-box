<script setup lang="ts">
import { compareSync, hashSync } from 'bcryptjs';
import { useThemeVars } from 'naive-ui';
import { useCopy } from '@/composable/copy';

const themeVars = useThemeVars();

const input = ref('');
const saltCount = ref(10);
const hashed = computed(() => hashSync(input.value, saltCount.value));
const { copy } = useCopy({ source: hashed, text: '해시 문자열을 클립보드에 복사했습니다' });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computed(() => compareSync(compareString.value, compareHash.value));
</script>

<template>
  <c-card title="Hash">
    <c-input-text
      v-model:value="input"
      placeholder="bcrypt로 처리할 문자열을 입력하세요..."
      raw-text
      label="문자열: "
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item label="솔트 횟수: " label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" placeholder="솔트 라운드..." :max="100" :min="0" w-full />
    </n-form-item>

    <c-input-text :value="hashed" readonly text-center />

    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        해시 복사
      </c-button>
    </div>
  </c-card>

  <c-card title="문자열과 해시 비교">
    <n-form label-width="120">
      <n-form-item label="문자열: " label-placement="left">
        <c-input-text v-model:value="compareString" placeholder="비교할 문자열을 입력하세요..." raw-text />
      </n-form-item>
      <n-form-item label="해시: " label-placement="left">
        <c-input-text v-model:value="compareHash" placeholder="비교할 해시를 입력하세요..." raw-text />
      </n-form-item>
      <n-form-item label="일치하나요? " label-placement="left" :show-feedback="false">
        <div class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? '예' : '아니요' }}
        </div>
      </n-form-item>
    </n-form>
  </c-card>
</template>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}
</style>
