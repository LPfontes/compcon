<template>
  <cc-compendium-browser :items="tags"
    item-type="Tag"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.tags') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { sortBy } from 'lodash-es';

import { CompendiumStore } from '@/stores';

export default {
  name: 'Tags',

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
    tags() {
      return sortBy(
        CompendiumStore().Tags.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
