<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const encodeInput = ref('Hello world :)');
const encodeOutput = computed(() => withDefaultOnError(() => encodeURIComponent(encodeInput.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => encodeURIComponent(value)),
      message: '이 문자열을 해석할 수 없습니다',
    },
  ],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: '인코딩된 문자열을 클립보드에 복사했습니다' });

const decodeInput = ref('Hello%20world%20%3A)');
const decodeOutput = computed(() => withDefaultOnError(() => decodeURIComponent(decodeInput.value), ''));

const decodeValidation = useValidation({
  source: decodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => decodeURIComponent(value)),
      message: '이 문자열을 해석할 수 없습니다',
    },
  ],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: '디코딩된 문자열을 클립보드에 복사했습니다' });
</script>

<template>
  <c-card title="Encode">
    <c-input-text
      v-model:value="encodeInput"
      label="문자열:"
      :validation="encodedValidation"
      multiline
      autosize
      placeholder="인코딩할 문자열"
      rows="2"
      mb-3
    />

    <c-input-text
      label="인코딩된 문자열:"
      :value="encodeOutput"
      multiline
      autosize
      readonly
      placeholder="인코딩된 문자열"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyEncoded()">
        Copy
      </c-button>
    </div>
  </c-card>
  <c-card title="Decode">
    <c-input-text
      v-model:value="decodeInput"
      label="인코딩된 문자열:"
      :validation="decodeValidation"
      multiline
      autosize
      placeholder="디코딩할 문자열"
      rows="2"
      mb-3
    />

    <c-input-text
      label="디코딩된 문자열:"
      :value="decodeOutput"
      multiline
      autosize
      readonly
      placeholder="디코딩된 문자열"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyDecoded()">
        Copy
      </c-button>
    </div>
  </c-card>
</template>
