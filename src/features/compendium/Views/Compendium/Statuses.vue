<template>
  <cc-compendium-browser :items="statuses"
    item-type="Status"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.statuses') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';

import { Status } from '@/classes/Status';

export default {
  name: 'Statuses',

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
        { title: this.$t('nav.stats.icon'), key: 'Icon', sortable: false },
        { title: this.$t('nav.stats.name'), key: 'Name' },
        { title: this.$t('nav.stats.type'), key: 'StatusType' },
        { title: '', key: 'Terse' },
      ];
    },
    statuses(): Status[] {
      return orderBy(CompendiumStore().Statuses, 'Name');
    },
  },
};
</script>
