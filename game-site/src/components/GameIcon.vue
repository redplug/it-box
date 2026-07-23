<script setup lang="ts">
defineProps<{ slug: string }>();
</script>

<template>
  <svg class="game-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
    <path v-if="slug === 'number-guessing'" d="M4 5h16v14H4zM8 9h2m4 0h2M8 13h2m4 0h2M8 17h8" />
    <path v-else-if="slug === 'number-baseball'" d="M4 5h16v14H4zM8 9h2m4 0h2M8 13h2m4 0h2M8 17h8" />
    <path v-else-if="slug === 'reaction'" d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8" />
    <path v-else-if="slug === '2048'" d="M5 5h14v14H5zM8 9h2m4 0h2M8 13h2m4 0h2M8 17h8" />
    <path v-else-if="slug === 'minesweeper'" d="M12 6v-3m0 18v-3M6 12H3m18 0h-3M5.6 5.6l2.2 2.2m8.4 8.4 2.2 2.2m0-12.6-2.2 2.2m-8.4 8.4-2.2 2.2M8 9h8v8H8z" />
    <path v-else-if="slug === 'memory-match'" d="M5 5h6v6H5zM13 13h6v6h-6zM13 5h6v6h-6zM5 13h6v6H5z" />
    <path v-else-if="slug === 'connect-four'" d="M4 5h16v14H4zM8 9h.01m4 0h.01m4 0h.01M8 14h.01m4 0h.01m4 0h.01" />
    <path v-else-if="slug === 'breakout'" d="M5 5h4v3H5zM10 5h4v3h-4zM15 5h4v3h-4zM7 17h10M12 14v-3" />
    <path v-else-if="slug === 'hangman'" d="M5 20V4h10a4 4 0 0 1 0 8H9m6 0 4 8M5 4h4" />
    <path v-else-if="slug === 'sokoban'" d="M4 4h16v16H4zM8 8h3v3H8zM13 13h3v3h-3zM10 18v-3" />
    <path v-else d="M5 5h14v14H5zM5 12h14M12 5v14" />
  </svg>
</template>
