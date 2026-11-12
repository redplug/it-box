<script setup lang="ts">
import { toSlug } from './slugify-string.service';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const input = ref('');
const slug = computed(() => withDefaultOnError(() => toSlug(input.value), ''));
const { copy } = useCopy({ source: slug, text: 'Slug을 클립보드에 복사했습니다' });
</script>

<template>
  <div>
    <c-input-text v-model:value="input" placeholder="Put your string here (ex: My file path)" label="Your string to slugify" autofocus raw-text multiline mb-5 />

    <c-input-text :value="slug" multiline readonly placeholder="You slug will be generated here (ex: my-file-path)" label="Your slug" mb-5 />

    <div flex justify-center>
      <c-button :disabled="slug.length === 0" @click="copy()">
        Copy slug
      </c-button>
    </div>
  </div>
</template>
