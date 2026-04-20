<template>
  <cc-compendium-browser :items="systems"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.mechSystems') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';

import { CompendiumStore, UserStore } from '@/stores';
import { MechEquipment } from '@/class';

export default {
  name: 'Systems',

  data: () => ({
    options: {
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license', 'none'],
      initialGroup: 'source',
    },
  }),
  computed: {
    headers() {
      return [
        { title: '', align: 'left', key: 'Source' },
        { title: this.$t('nav.stats.system'), align: 'left', key: 'Name' },
        { title: this.$t('nav.stats.license'), key: 'License' },
        { title: this.$t('nav.stats.licenseLevel'), align: 'center', key: 'LicenseLevel' },
        { title: this.$t('nav.stats.tags'), align: 'center', key: 'Tags' },
        { title: this.$t('nav.stats.spCost'), align: 'center', key: 'SP' },
      ];
    },
    systems(): MechEquipment[] {
      return orderBy(
        [...CompendiumStore().MechSystems, ...CompendiumStore().WeaponMods].filter(
          (x) => !x.IsHidden
        ),
        'Name'
      );
    },
  },
};
</script>
