<script setup lang="ts">
import type { ToolGuide } from '@/content/tool-guides';

defineProps<{ guide: ToolGuide }>();
</script>

<template>
  <section class="tool-usage-guide" aria-labelledby="tool-usage-guide-title">
    <h2 id="tool-usage-guide-title">이 도구를 안전하게 사용하는 방법</h2>
    <p class="purpose">{{ guide.purpose }}</p>

    <h3>사용 순서</h3>
    <ol>
      <li v-for="step in guide.steps" :key="step">{{ step }}</li>
    </ol>

    <h3>예시와 한계</h3>
    <p>{{ guide.example }}</p>
    <p>{{ guide.limitations }}</p>

    <div class="safety-note">
      <strong>보안 주의</strong>
      <p>{{ guide.safety }}</p>
    </div>
  </section>
</template>

<style scoped>
.tool-usage-guide {
  width: 100%;
  max-width: 760px;
  margin: 38px auto 0;
  padding: 26px 28px;
  border: 1px solid rgba(24, 160, 88, .2);
  border-radius: 12px;
  background: rgba(24, 160, 88, .045);
  color: #39424e;
  line-height: 1.75;
  box-sizing: border-box;
}

h2 { margin: 0 0 10px; font-size: 22px; color: #26313a; }
h3 { margin: 22px 0 6px; font-size: 16px; color: #26313a; }
p { margin: 0; }
.purpose { color: #4f5c68; }
ol { margin: 8px 0 0; padding-left: 22px; }
.safety-note { margin-top: 22px; padding: 14px 16px; border-left: 3px solid #18a058; background: rgba(255, 255, 255, .65); }
.safety-note strong { color: #137a45; }
.safety-note p { margin-top: 3px; }
</style>
