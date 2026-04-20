<template>
  <cc-compendium-browser :items="frames"
    item-type="Frame"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.frames') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '../../store';

export default {
  name: 'Frames',

  data: () => ({
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'cards',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
    },
  }),
  computed: {
    headers() {
      return [
        { title: '', key: 'Source' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
        { title: this.$t('nav.stats.size'), key: 'SizeIcon', align: 'center' },
        { title: this.$t('nav.stats.mounts'), key: 'Mounts' },
        { title: this.$t('nav.stats.armor'), key: 'Armor', align: 'center' },
        { title: this.$t('nav.stats.hp'), key: 'HP', align: 'center' },
        { title: this.$t('nav.stats.evasion'), key: 'Evasion', align: 'center' },
        { title: this.$t('nav.stats.edef'), key: 'EDefense', align: 'center' },
        { title: this.$t('nav.stats.heatCap'), key: 'HeatCap', align: 'center' },
        { title: this.$t('nav.stats.repCap'), key: 'RepCap', align: 'center' },
        { title: this.$t('nav.stats.sensors'), key: 'SensorRange', align: 'center' },
        { title: this.$t('nav.stats.techAtk'), key: 'TechAttack', align: 'center' },
        { title: this.$t('nav.stats.save'), key: 'SaveTarget', align: 'center' },
        { title: this.$t('nav.stats.speed'), key: 'Speed', align: 'center' },
        { title: this.$t('nav.stats.sp'), key: 'SP', align: 'center' },
      ];
    },
    frames() {
      const items = CompendiumStore().Frames;
      return orderBy(
        items.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>

<style>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
