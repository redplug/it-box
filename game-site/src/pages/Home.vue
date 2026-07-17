<script setup lang="ts">
import { computed } from 'vue';
import { games } from '../games/registry';
import GameIcon from '../components/GameIcon.vue';
import { useGameFavorites } from '../composables/useGameFavorites';
import { useGameLocale } from '../composables/useGameLocale';

const favorites = useGameFavorites();
const favoriteGames = computed(() => games.filter(game => favorites.favoriteSlugs.value.includes(game.slug)));
const { copy, gameTitle, gameDescription } = useGameLocale();
</script>

<template>
  <div class="home-page pt-50px">
    <div class="grid-wrapper">
      <div class="grid game-grid-placeholder" aria-hidden="true" />
      <section v-if="favoriteGames.length">
        <h3>{{ copy.favorites }}</h3>
        <div class="game-grid">
        <RouterLink v-for="game in favoriteGames" :key="game.slug" class="game-card" :to="`/games/${game.slug}`">
          <div class="c-card"><div class="card-top"><GameIcon :slug="game.slug" /><button class="card-favorite" :class="{ active: favorites.isFavorite(game.slug) }" type="button" @click.prevent="favorites.toggleFavorite(game.slug)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" /></svg></button></div><div class="card-title">{{ gameTitle(game.slug) }}</div><div class="card-description">{{ gameDescription(game.slug) }}</div></div>
        </RouterLink>
        </div>
      </section>

      <h3>{{ copy.allGames }}</h3>
      <div class="game-grid">
        <RouterLink v-for="game in games" :key="game.slug" class="game-card" :to="`/games/${game.slug}`">
          <div class="c-card"><div class="card-top"><GameIcon :slug="game.slug" /><button class="card-favorite" :class="{ active: favorites.isFavorite(game.slug) }" type="button" :aria-label="copy.favorites" @click.prevent="favorites.toggleFavorite(game.slug)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" /></svg></button></div><div class="card-title">{{ gameTitle(game.slug) }}</div><div class="card-description">{{ gameDescription(game.slug) }}</div></div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
