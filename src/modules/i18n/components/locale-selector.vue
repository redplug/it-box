<script setup lang="ts">
const { availableLocales, locale } = useI18n();

const localesLong: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  no: 'Norwegian',
  pt: 'Português',
  ru: 'Русский',
  uk: 'Українська',
  zh: '中文',
  vi: 'Tiếng Việt',
};

const localeOptions = computed(() =>
  availableLocales.map(locale => ({
    label: localesLong[locale] ?? locale,
    value: locale,
  })),
);
</script>

<template>
  <c-select
    v-model:value="locale"
    :options="localeOptions"
    placeholder="언어 선택"
    w-100px
  />
</template>
