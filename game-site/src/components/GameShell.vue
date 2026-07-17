<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { games } from '../games/registry';
import AdSlot from './AdSlot.vue';
import GameIcon from './GameIcon.vue';
import ItBoxToolbar from '../shared/ItBoxToolbar.vue';
import { useGameFavorites } from '../composables/useGameFavorites';
import { useGameLocale } from '../composables/useGameLocale';

const menuOpen = ref(false);
const sidebarCollapsed = ref(typeof window !== 'undefined' && window.localStorage.getItem('isMenuCollapsed') === 'true');
const menuCollapsed = ref(false);
const isDarkTheme = ref(typeof window === 'undefined' ? true : window.localStorage.getItem('theme') !== 'light');
const favorites = useGameFavorites();
const route = useRoute();
const currentGame = computed(() => games.find(game => `/games/${game.slug}` === route.path));
const { locale, copy, setLocale, gameTitle } = useGameLocale();
function toggleSidebar() {
  if (window.matchMedia('(max-width: 760px)').matches) {
    menuOpen.value = !menuOpen.value;
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }
}
watch(sidebarCollapsed, value => window.localStorage.setItem('isMenuCollapsed', String(value)));
function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  window.localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
  document.documentElement.classList.toggle('light-theme', !isDarkTheme.value);
}
</script>

<template>
  <div class="app-shell">
    <header class="mobile-header">
      <RouterLink class="brand compact" to="/">it-box</RouterLink>
      <button class="menu-toggle" type="button" aria-label="게임 메뉴 열기" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        메뉴
      </button>
    </header>

    <aside class="sidebar" :class="{ open: menuOpen, collapsed: sidebarCollapsed }">
      <RouterLink class="hero-wrapper" to="/" @click="menuOpen = false">
        <svg class="gradient" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 275" aria-hidden="true">
          <defs>
            <linearGradient id="game-hero-gradient" x1="13.74" y1="183.7" x2="303.96" y2="45.59" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#244b6b" />
              <stop offset=".6" stop-color="#2f6f9f" />
              <stop offset="1" stop-color="#168dcc" />
            </linearGradient>
          </defs>
          <path fill="#168dcc" opacity=".49" d="M0 187.5v25s0 37.5 50 50S300 225 300 225v-37.5Z" />
          <path fill="#168dcc" opacity=".49" d="M300 237.5S287.5 275 250 275s-128.95-37.5-188.6-75 134.21 0 134.21 0Z" />
          <path fill="#168dcc" opacity=".38" d="M0 200v12.5a241.47 241.47 0 0 0 112.5 50c73.6 11.69 130.61-14.86 150-25L300 200Z" />
          <path fill="url(#game-hero-gradient)" d="M0 0v212.5s62.5-12.5 150 25 150 0 150 0V0Z" />
        </svg>
        <div class="text-wrapper">
          <div class="title">it-box</div>
          <div class="subtitle">{{ copy.subtitle }}</div>
        </div>
      </RouterLink>

      <div class="sidebar-content">
        <button class="itbox-menu-category" :aria-expanded="!menuCollapsed" type="button" @click="menuCollapsed = !menuCollapsed">
          <svg class="chevron" :class="{ collapsed: menuCollapsed }" viewBox="0 0 24 24" aria-hidden="true"><path d="m8.59 16.58 4.58-4.58-4.58-4.59L10 6l6 6-6 6z" /></svg>
          <span>{{ copy.games }}</span>
        </button>
        <div v-if="!menuCollapsed" class="itbox-menu-wrapper">
          <div class="itbox-menu-toggle-bar" />
          <nav class="itbox-game-menu" aria-label="게임 목록">
              <RouterLink v-for="game in games" :key="game.slug" :to="`/games/${game.slug}`" @click="menuOpen = false">
              <GameIcon :slug="game.slug" /><span>{{ gameTitle(game.slug) }}</span>
            </RouterLink>
          </nav>
        </div>
        <div class="footer">
          <div>it-box · GPL-3.0</div>
          <div>© {{ new Date().getFullYear() }}</div>
          <div><a href="https://it-box.dev/about">오픈소스 고지 및 개인정보처리방침</a></div>
        </div>
      </div>
    </aside>

    <button v-if="menuOpen" class="menu-backdrop" type="button" aria-label="게임 메뉴 닫기" @click="menuOpen = false" />

    <main :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <ItBoxToolbar :menu-label="copy.menu" :home-label="copy.home" :search-label="copy.search" :locale="locale" @toggle-menu="toggleSidebar" @update-locale="setLocale">
        <template #utilities>
          <div>
            <div class="navbar-buttons">
              <a class="c-button circle" href="https://it-box.dev" aria-label="it-box 도구로 이동" title="it-box 도구">
                <i class="n-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" /><path d="M14.5 5.5l4 4" /><path d="M12 8l-5 -5l-4 4l5 5" /><path d="M7 8l-1.5 1.5" /><path d="M16 12l5 5l-4 4l-5 -5" /><path d="M16 17l-1.5 1.5" /></svg>
                </i>
              </a>
              <button class="c-button circle" type="button" aria-label="다크/라이트 모드 전환" @click="toggleTheme">
                <i class="n-icon">
                  <svg v-if="isDarkTheme" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c.132 0 .263 0 .393.005a7.5 7.5 0 1 0 8.602 8.602A9 9 0 1 1 12 3Z" /></svg>
                </i>
              </button>
            </div>
          </div>
        </template>
      </ItBoxToolbar>
      <div class="topbar legacy-topbar">
        <button class="icon-button" type="button" :aria-label="copy.menu" @click="toggleSidebar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></g></svg>
        </button>
        <RouterLink class="icon-button" to="/" :aria-label="copy.home">
          <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12H3l9-9l9 9h-2" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path d="M10 12h4v4h-4z" /></g></svg>
        </RouterLink>
        <button class="search-button" type="button" :aria-label="copy.search">
          <span class="search-content">
            <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5Z" /></svg>
            <span>{{ copy.search }}</span>
            <kbd>Cmd&nbsp;+&nbsp;K</kbd>
          </span>
        </button>
        <div class="locale-wrap">
          <select class="locale-select" aria-label="언어 선택" :value="locale" @change="setLocale(($event.target as HTMLSelectElement).value as 'ko' | 'en')"><option value="ko">한국어</option><option value="en">English</option></select>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
        </div>
        <button v-if="currentGame" class="favorite-button" type="button" :aria-pressed="favorites.isFavorite(currentGame.slug)" @click="favorites.toggleFavorite(currentGame.slug)">{{ favorites.isFavorite(currentGame.slug) ? '★' : '☆' }}</button>
        <div class="navbar-buttons">
        <a class="utility-button" href="https://it-box.dev/guides" aria-label="사용 가이드"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Zm0 0v13a3 3 0 0 0 3 3h13M8 8h8m-8 4h8" /></svg></a>
        <a class="utility-button" href="https://github.com/redplug/it-box" aria-label="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 1.5-4-2-5.5-2m11 4v-3.5c0-1 .1-1.4-.5-2 2.5-.3 5-1.2 5-5.5a4.3 4.3 0 0 0-1.1-3c.1-.3.5-1.5-.1-3 0 0-1-.3-3.3 1.1a11.4 11.4 0 0 0-6 0C6.2 5.7 5.2 6 5.2 6c-.6 1.5-.2 2.7-.1 3a4.3 4.3 0 0 0-1.1 3c0 4.3 2.5 5.2 5 5.5-.6.6-.6 1.1-.5 2V21" /></svg></a>
        <a class="utility-button" href="https://it-box.dev/about" aria-label="정보"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8v.01" /></svg></a>
        <button class="utility-button" type="button" aria-label="테마"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg></button>
        </div>
        </div>
      <div class="page-content"><RouterView /></div>
      <AdSlot />
    </main>
  </div>
</template>
