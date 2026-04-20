<template>
  <cc-compendium-browser :items="downtimeActions"
    item-type="Reserve"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.downtimeActions') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';


import { orderBy } from 'lodash-es';

export default {
  name: 'DowntimeActions',

  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'type', 'none'],
      initialGroup: 'type',
      noSource: true,
    },
  }),
  computed: {
    headers() {
      return [
        { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
        { title: this.$t('nav.stats.type'), key: 'Type' },
      ];
    },
    downtimeActions() {
      return orderBy(CompendiumStore().DowntimeActions, 'Name');
    },
  },
};
</script>
