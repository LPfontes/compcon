<template>
  <cc-compendium-browser :items="weapons"
    item-type="MechWeapon"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.mechWeapons') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '../../store';

export default {
  name: 'Weapons',

  data: () => ({
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license', 'none'],
      initialGroup: 'license',
    },
  }),
  computed: {
    headers() {
      return [
        { title: '', align: 'left', key: 'Source' },
        { title: this.$t('nav.stats.weapon'), align: 'left', key: 'Name' },
        { title: this.$t('nav.stats.license'), align: 'left', key: 'LicenseString' },
        { title: this.$t('nav.stats.size'), align: 'left', key: 'Size' },
        {
          title: this.$t('nav.stats.type'),
          align: 'left',
          key: 'WeaponTypes',
          sortRaw(a, b) {
            if (a.SizeInt < b.SizeInt) return -1;
            if (a.SizeInt > b.SizeInt) return 1;
          },
        },
        { title: this.$t('nav.stats.tags'), align: 'center', key: 'Tags' },
        { title: this.$t('nav.stats.range'), align: 'left', key: 'Range' },
        { title: this.$t('nav.stats.damage'), align: 'left', key: 'Damage' },
      ];
    },
    weapons() {
      const items = CompendiumStore().MechWeapons;

      return orderBy(
        items.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
