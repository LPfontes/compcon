<template>
  <cc-compendium-browser :items="sitreps"
    item-type="Sitrep"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.sitreps') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';

export default {
  name: 'Sitreps',

  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    },
  }),
  computed: {
    headers() {
      return [
        { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
      ];
    },
    sitreps() {
      return orderBy(CompendiumStore().Sitreps, 'Name');
    },
  },
};
</script>
