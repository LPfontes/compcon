<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import * as Vue from 'vue'
  import { NavStore } from '@/stores'

  const { watch } = Vue

  const { locale } = useI18n()

  // Watch for locale changes to persist and update document lang
  watch(locale, newLocale => {
    localStorage.setItem('cc_locale', newLocale)
    document.querySelector('html')?.setAttribute('lang', newLocale)
    NavStore().setLanguage(newLocale)
  })

  const items = [
    { title: 'English', value: 'en' },
    { title: 'Português (BR)', value: 'pt-BR' },
  ]
</script>

<template>
  <cc-select
    v-model="locale"
    :items="items"
    item-title="title"
    item-value="value"
  ></cc-select>
</template>

<style scoped></style>
