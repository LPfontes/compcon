<template>
  <cc-compendium-browser :items="talents"
    item-type="Skill"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.talents') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { Talent } from '@/class';

export default {
  name: 'Talents',

  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
      hideTitle: true,
    },
  }),
  computed: {
    headers() {
      return [
        { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
        { title: this.$t('nav.stats.overview'), key: 'Terse' },
      ];
    },
    talents(): Talent[] {
      return orderBy(
        CompendiumStore().Talents.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
