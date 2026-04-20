<template>
  <cc-compendium-browser :items="licenses"
    item-type="License"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.licenses') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { License } from '@/class';

export default {
  name: 'Licenses',

  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
      noSource: true,
    },
  }),
  computed: {
    headers() {
      return [
        { title: this.$t('nav.stats.manufacturer'), key: 'Source' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
        { title: `${this.$t('nav.stats.tier')} I`, key: 'T1', sortable: false },
        { title: `${this.$t('nav.stats.tier')} II`, key: 'T2', sortable: false },
        { title: `${this.$t('nav.stats.tier')} III`, key: 'T3', sortable: false },
      ];
    },
    licenses() {
      return CompendiumStore()
        .Licenses.filter((x) => !x.Hidden)
        .sort((a, b) => License.LicenseSort(a, b));
    },
  },
};
</script>
