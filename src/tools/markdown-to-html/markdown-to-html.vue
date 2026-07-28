<script setup lang="ts">
import markdownit from 'markdown-it';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputMarkdown = ref('');
const outputHtml = computed(() => {
  const md = markdownit();
  return md.render(inputMarkdown.value);
});

function printHtml() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = outputHtml.value;
  w.print();
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      placeholder="Markdown 내용을 입력하세요..."
      rows="8"
      autofocus
      label="변환할 Markdown:"
    />

    <n-divider />

      <n-form-item label="출력 HTML:">
      <TextareaCopyable :value="outputHtml" :word-wrap="true" language="html" />
    </n-form-item>

    <div flex justify-center>
      <n-button @click="printHtml">
        Print as PDF
      </n-button>
    </div>
  </div>
</template>
