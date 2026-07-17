<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{ menuLabel: string; homeLabel: string; searchLabel: string; locale: 'ko' | 'en' }>();
const emit = defineEmits<{ toggleMenu: []; updateLocale: [value: 'ko' | 'en'] }>();
const localeValue = computed(() => props.locale);
const localeOpen = ref(false);

function chooseLocale(value: 'ko' | 'en') {
  emit('updateLocale', value);
  localeOpen.value = false;
}
</script>

<template>
  <div class="itbox-toolbar">
    <button class="c-button circle" type="button" :aria-label="menuLabel" @click="emit('toggleMenu')">
      <i class="n-icon"><svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></g></svg></i>
    </button>

    <div class="relative inline-block">
      <div>
        <RouterLink to="/" class="c-button circle" :aria-label="homeLabel">
          <i class="n-icon"><svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12H3l9-9l9 9h-2" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path d="M10 12h4v4h-4z" /></g></svg></i>
        </RouterLink>
      </div>
      <div class="toolbar-tooltip" />
    </div>

    <div class="itbox-search-wrap">
      <button class="c-button search-button" type="button" :aria-label="searchLabel">
        <span class="search-content">
          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true"><path fill="currentColor" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5Z" /></svg>
          {{ searchLabel }}
          <span class="shortcut">Cmd&nbsp;+&nbsp;K</span>
        </span>
      </button>
    </div>

    <slot name="locale">
      <div class="locale-control">
        <div class="c-select">
          <div class="c-select-input" role="combobox" aria-label="언어 선택" :aria-expanded="localeOpen" tabindex="0" @click="localeOpen = !localeOpen" @keydown.enter.prevent="localeOpen = !localeOpen">
            <div class="c-select-value"><span>{{ localeValue === 'ko' ? '한국어' : 'English' }}</span></div>
            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="chevron"><path fill="currentColor" d="m7 10 5 5 5-5" /></svg>
          </div>
          <div v-if="localeOpen" class="c-select-menu" role="listbox">
            <div class="c-select-option" role="option" :aria-selected="localeValue === 'ko'" @click.stop="chooseLocale('ko')">한국어</div>
            <div class="c-select-option" role="option" :aria-selected="localeValue === 'en'" @click.stop="chooseLocale('en')">English</div>
          </div>
        </div>
      </div>
    </slot>

    <slot name="utilities" />
  </div>
</template>

<style>
.itbox-toolbar { display:flex; width:100%; height:36px; align-items:center; justify-content:center; gap:8px; color:rgba(255,255,255,.82); font:14px/14px v-sans, system-ui, -apple-system, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }
.itbox-toolbar .c-button { display:inline-flex; height:34px; min-width:34px; align-items:center; justify-content:center; flex-shrink:0; padding:0 14px; border:0; border-radius:4px; outline:none; color:#ffffffd1; background:transparent; font:14px/14px v-sans, system-ui, -apple-system, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; cursor:pointer; }
.itbox-toolbar .c-button.circle { width:34px; padding:0; border-radius:34px; }
.itbox-toolbar .c-button:hover { background:rgba(255,255,255,.12); }
.itbox-toolbar .n-icon { display:inline-flex; width:25px; height:25px; align-items:center; justify-content:center; font-style:normal; line-height:1; }
.itbox-toolbar .n-icon svg { display:block; width:25px; height:25px; }
.itbox-search-wrap { display:flex; min-width:0; flex:1; }
.itbox-toolbar .search-button { width:100%; justify-content:flex-start; background:rgba(255,255,255,.08); line-height:14px; }
.itbox-toolbar .search-content { display:flex; align-items:center; gap:12px; color:inherit; opacity:.4; line-height:14px; }
.itbox-toolbar .search-content > svg { flex:0 0 auto; }
.itbox-toolbar .shortcut { display:none; border:1px solid currentColor; border-radius:4px; padding:3px 5px; white-space:nowrap; line-height:14px; vertical-align:middle; }
.itbox-toolbar .relative { position:relative; }
.itbox-toolbar .inline-block { display:flex; height:34px; align-items:center; line-height:0; }
.itbox-toolbar > .relative.inline-block:first-of-type .c-button { transform:translateY(-1px); }
.itbox-toolbar .locale-control { width:100px; color:rgba(255,255,255,.5); font-size:14px; line-height:normal; }
.itbox-toolbar .c-select { position:relative; width:100%; }
.itbox-toolbar .c-select-input { display:flex; width:100%; height:34px; align-items:center; padding:0 8px; border-radius:4px; outline:none; color:rgba(255,255,255,.5); background:#333; font-size:14px; line-height:normal; }
.itbox-toolbar .c-select-value { min-width:0; flex:1; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.itbox-toolbar .c-select-input .chevron { width:1.2em; height:1.2em; flex:0 0 auto; }
.itbox-toolbar .c-select-menu { position:absolute; z-index:30; top:calc(100% + 4px); left:0; width:100%; max-width:100%; box-sizing:border-box; overflow-x:hidden; overflow-y:auto; border-radius:4px; padding:4px 0; color:rgba(255,255,255,.82); background:#333; box-shadow:0 8px 24px rgba(0,0,0,.2); }
.itbox-toolbar .c-select-option { width:100%; height:32px; box-sizing:border-box; overflow:hidden; padding:7px 10px; cursor:pointer; font-size:14px; line-height:18px; white-space:nowrap; text-overflow:ellipsis; }
.itbox-toolbar .c-select-option:hover, .itbox-toolbar .c-select-option[aria-selected="true"] { color:#fff; background:rgba(255,255,255,.09); }
.itbox-toolbar .toolbar-tooltip { position:absolute; z-index:10; display:none; }
.navbar-buttons { display:flex; align-items:center; justify-content:flex-end; gap:5px; margin:0; flex:0 0 auto; }
.utility-button { display:inline-flex; width:34px; height:34px; flex:0 0 34px; align-items:center; justify-content:center; border:0; border-radius:34px; padding:0; color:rgba(255,255,255,.82); background:transparent; font-size:14px; line-height:1; cursor:pointer; }
.utility-button svg { width:25px; height:25px; fill:none; stroke:currentColor; stroke-linecap:round; stroke-linejoin:round; stroke-width:2; }
@media (min-width:640px) { .itbox-toolbar .shortcut { display:inline; } }
</style>
