<template>
  <cc-compendium-browser ref="browser"
    :items="features"
    item-type="NpcFeature"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.npcFeatures') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';

import { CompendiumStore } from '@/stores';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';

export default {
  name: 'NpcFeatures',

  data: () => ({
    selectedTier: 1,
    tieredView: false,
    options: {
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['lcp', 'featureType', 'origin', 'none'],
      initialGroup: 'origin',
    },
  }),

  computed: {
    features(): NpcFeature[] {
      return orderBy(CompendiumStore().NpcFeatures, ['FeatureType', 'Origin.Name', 'Name']);
    },
    headers() {
      return [
        { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
        { title: this.$t('nav.stats.origin'), key: 'Origin' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
        { title: this.$t('nav.stats.tags'), key: 'Tags' },
      ];
    },
  },
};
</script>
