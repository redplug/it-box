<script setup lang="ts">
import { useObfuscateString } from './string-obfuscator.model';
import { useCopy } from '@/composable/copy';

const str = ref('Lorem ipsum dolor sit amet');
const keepFirst = ref(4);
const keepLast = ref(4);
const keepSpace = ref(true);

const obfuscatedString = useObfuscateString(str, { keepFirst, keepLast, keepSpace });
const { copy } = useCopy({ source: obfuscatedString });
</script>

<template>
  <div>
    <c-input-text v-model:value="str" raw-text placeholder="난독화할 문자열을 입력하세요" label="난독화할 문자열:" clearable multiline />

    <div mt-4 flex gap-10px>
      <div>
        <div>앞에서 유지할 문자 수:</div>
        <n-input-number v-model:value="keepFirst" min="0" />
      </div>

      <div>
        <div>뒤에서 유지할 문자 수:</div>
        <n-input-number v-model:value="keepLast" min="0" />
      </div>

      <div>
        <div mb-5px>
          Keep&nbsp;spaces:
        </div>
        <n-switch v-model:value="keepSpace" />
      </div>
    </div>

    <c-card v-if="obfuscatedString" mt-60px max-w-600px flex items-center gap-5px font-mono>
      <div break-anywhere text-wrap>
        {{ obfuscatedString }}
      </div>

      <c-button @click="copy()">
        <icon-mdi:content-copy />
      </c-button>
    </c-card>
  </div>
</template>
