<script setup lang="ts">
defineProps<{ slug: string }>();
</script>

<template>
  <svg class="game-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
    <path v-if="slug === 'number-guessing'" d="M4 5h16v14H4zM8 9h2m4 0h2M8 13h2m4 0h2M8 17h8" />
    <path v-else-if="slug === 'number-baseball'" d="M4 5h16v14H4zM8 9h2m4 0h2M8 13h2m4 0h2M8 17h8" />
    <path v-else-if="slug === 'reaction'" d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8" />
    <path v-else-if="slug === '2048'" d="M5 5h14v14H5zM8 9h2m4 0h2M8 13h2m4 0h2M8 17h8" />
    <path v-else d="M5 5h14v14H5zM5 12h14M12 5v14" />
  </svg>
</template>
