<script setup lang="ts">
import { config } from '@/config';

const props = defineProps<{ placement: 'home-bottom' | 'tool-bottom' }>();

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

const slot = computed(() => props.placement === 'home-bottom' ? config.ads.homeSlot : config.ads.toolSlot);
const enabled = computed(() => config.app.env === 'production' && config.ads.enabled && config.ads.client && slot.value);

onMounted(() => {
  if (!enabled.value) {
    return;
  }
  const scriptId = 'adsense-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.ads.client}`;
    script.crossOrigin = 'anonymous';
    document.head.append(script);
  }
  window.setTimeout(() => (window.adsbygoogle ??= []).push({}), 250);
});
</script>

<template>
  <aside v-if="enabled" class="ad-slot" aria-label="광고">
    <ins class="adsbygoogle" style="display: block" :data-ad-client="config.ads.client" :data-ad-slot="slot" data-ad-format="auto" data-full-width-responsive="true" />
  </aside>
</template>

<style scoped>
.ad-slot { width: 100%; max-width: 970px; min-height: 90px; margin: 40px auto 0; overflow: hidden; }
</style>
