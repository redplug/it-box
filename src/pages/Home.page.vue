<script setup lang="ts">
import { IconDragDrop } from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import Draggable from 'vuedraggable';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';

const toolStore = useToolStore();

const { t } = useI18n();
useHead({ title: t('site.homeTitle') });

const favoriteTools = computed(() => toolStore.favoriteTools);

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper">
      <section class="home-introduction" aria-labelledby="home-introduction-title">
        <p class="eyebrow">KOREAN DEVELOPER TOOLS</p>
        <h1 id="home-introduction-title">개발 작업을 빠르게 확인하고 안전하게 정리하는 온라인 도구</h1>
        <p>it-box는 JSON, JWT, Base64, 정규식, URL, SQL처럼 개발 중 자주 만나는 형식을 브라우저에서 확인할 수 있도록 모은 무료 도구 모음입니다. 각 도구의 결과만 보여주는 데서 끝나지 않고, 언제 사용하면 좋은지와 어떤 입력을 피해야 하는지도 함께 안내합니다.</p>
        <div class="home-principles">
          <div><strong>브라우저 우선 처리</strong><span>가능한 기능은 입력을 서버에 보내지 않고 현재 브라우저에서 처리합니다.</span></div>
          <div><strong>결과를 직접 확인</strong><span>변환 결과가 보안 검증이나 사실 확인을 대신하지 않는 경우를 설명합니다.</span></div>
          <div><strong>사용 가이드 제공</strong><span>도구별 예제와 한계를 확인한 뒤 실제 작업에 적용할 수 있습니다.</span></div>
        </div>
        <RouterLink class="guide-link" to="/guides">개발 도구 사용 가이드 읽기 →</RouterLink>
      </section>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4" />

      <transition name="height">
        <div v-if="toolStore.favoriteTools.length > 0">
          <h3 class="mb-5px mt-25px text-neutral-400 font-500">
            {{ $t('home.categories.favoriteTools') }}
            <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
              <n-icon :component="IconDragDrop" size="18" />
            </c-tooltip>
          </h3>
          <Draggable
            :list="favoriteTools"
            class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
            ghost-class="ghost-favorites-draggable"
            item-key="name"
            @end="onUpdateFavoriteTools"
          >
            <template #item="{ element: tool }">
              <ToolCard :tool="tool" />
            </template>
          </Draggable>
        </div>
      </transition>

      <div v-if="toolStore.newTools.length > 0">
        <h3 class="mb-5px mt-25px text-neutral-400 font-500">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <h3 class="mb-5px mt-25px text-neutral-400 font-500">
        {{ $t('home.categories.allTools') }}
      </h3>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in toolStore.tools" :key="tool.name" :tool="tool" />
      </div>
      <AdSlot class="mt-8" placement="home-bottom" />
    </div>
  </div>
</template>

<style scoped lang="less">
.home-introduction {
  max-width: 900px;
  margin: 0 auto 36px;
  padding: 28px 30px;
  border: 1px solid #dfe7e2;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(24, 160, 88, .07), rgba(255, 255, 255, .4));
  color: #4b5560;
  line-height: 1.75;
}
.home-introduction h1 { margin: 5px 0 10px; color: #26313a; font-size: clamp(28px, 4vw, 42px); line-height: 1.2; letter-spacing: -.04em; }
.eyebrow { margin: 0; color: #16834a; font-size: 12px; font-weight: 700; letter-spacing: .12em; }
.home-introduction p { margin: 0; }
.home-principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 22px 0; }
.home-principles div { display: flex; flex-direction: column; gap: 4px; padding: 14px; border-radius: 10px; background: rgba(255, 255, 255, .7); }
.home-principles strong { color: #26313a; font-size: 15px; }
.home-principles span { font-size: 14px; line-height: 1.55; }
.guide-link { color: #16834a; font-weight: 700; text-decoration: none; }
@media (max-width: 700px) { .home-introduction { padding: 22px 18px; } .home-principles { grid-template-columns: 1fr; } }
.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.ghost-favorites-draggable {
  opacity: 0.4;
  background-color: #ccc;
  border: 2px dashed #666;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
  animation: ghost-favorites-draggable-animation 0.2s ease-out;
}

@keyframes ghost-favorites-draggable-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.0);
  }
}
</style>
