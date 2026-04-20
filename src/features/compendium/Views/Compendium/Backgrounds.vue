<template>
  <cc-compendium-browser :items="backgrounds"
    item-type="Background"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.backgrounds') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { Background } from '@/class';

import { CompendiumStore } from '@/stores';

export default {
  name: 'Backgrounds',

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
        { title: '', key: 'Terse' },
      ];
    },
    backgrounds(): Background[] {
      return orderBy(CompendiumStore().Backgrounds, 'Name');
    },
  },
};
</script>
