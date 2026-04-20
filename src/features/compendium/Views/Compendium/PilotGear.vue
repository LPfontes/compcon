<template>
  <cc-compendium-browser :items="gear"
    item-type="PilotGear"
    :multi-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.pilotGear') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';

export default {
  name: 'PilotGear',

  data: () => ({
    options: {
      views: ['single', 'list', 'table', 'cards'],
      initialView: 'list',
      groups: ['lcp', 'type', 'none'],
      initialGroup: 'type',
      noSource: true,
    },
  }),
  computed: {
    headers() {
      return {
        PilotArmor: [
          { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
          { title: this.$t('nav.stats.type'), key: 'Type' },
          { title: this.$t('nav.stats.item'), key: 'Name' },
          { title: this.$t('nav.stats.armor'), key: 'ArmorString' },
          { title: this.$t('nav.stats.hpBonus'), key: 'HpString' },
          { title: this.$t('nav.stats.edef'), key: 'EdefString' },
          { title: this.$t('nav.stats.evasion'), key: 'EvasionString' },
          { title: this.$t('nav.stats.speed'), key: 'SpeedString' },
          { title: this.$t('nav.stats.tags'), align: 'center', key: 'Tags' },
        ],
        PilotWeapon: [
          { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
          { title: this.$t('nav.stats.type'), key: 'Type' },
          { title: this.$t('nav.stats.item'), key: 'Name' },
          { title: this.$t('nav.stats.range'), key: 'Range' },
          { title: this.$t('nav.stats.damage'), key: 'Damage' },
          { title: this.$t('nav.stats.tags'), align: 'center', key: 'Tags' },
        ],
        PilotGear: [
          { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
          { title: this.$t('nav.stats.type'), key: 'Type' },
          { title: this.$t('nav.stats.item'), key: 'Name' },
          { title: this.$t('nav.stats.uses'), key: 'MaxUses' },
          { title: this.$t('nav.stats.tags'), align: 'center', key: 'Tags' },
        ],
      };
    },
    gear(): any[] {
      return orderBy(
        CompendiumStore().PilotGear.filter((x: any) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
