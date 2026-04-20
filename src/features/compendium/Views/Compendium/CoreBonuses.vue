<template>
  <cc-compendium-browser :items="bonuses"
    :item-type="'CoreBonus'"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.coreBonuses') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { CoreBonus } from '@/class';

export default {
  name: 'CoreBonuses',

  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
    },
  }),
  computed: {
    headers() {
      return [
        { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
        { title: this.$t('nav.stats.manufacturer'), key: 'Source' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
        { title: this.$t('nav.stats.effect'), key: 'Effect' },
      ];
    },
    bonuses(): CoreBonus[] {
      return orderBy(
        CompendiumStore().CoreBonuses.filter((x: CoreBonus) => !x.IsHidden),
        'Manufacturer'
      );
    },
  },
};
</script>
