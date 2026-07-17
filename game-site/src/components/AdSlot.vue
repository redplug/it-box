<script setup lang="ts">
import { computed, onMounted } from 'vue';

declare global {
  interface Window { adsbygoogle?: Record<string, unknown>[] }
}

const client = import.meta.env.VITE_ADSENSE_CLIENT || '';
const slot = import.meta.env.VITE_ADSENSE_SLOT_GAME || '';
const enabled = computed(() => import.meta.env.PROD && import.meta.env.VITE_ADS_ENABLED === 'true' && Boolean(client && slot));

onMounted(() => {
  if (!enabled.value) return;
  if (!document.querySelector('script[data-it-box-adsense]')) {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.itBoxAdsense = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    document.head.append(script);
  }
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.push({});
});
</script>

<template>
  <aside v-if="enabled" class="ad-slot" aria-label="광고">
    <ins class="adsbygoogle" :data-ad-client="client" :data-ad-slot="slot" data-ad-format="auto" data-full-width-responsive="true" />
  </aside>
</template>
