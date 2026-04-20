<template>
  <cc-compendium-browser :items="skills"
    item-type="Skill"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.skillTriggers') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { Skill } from '@/class';

import { CompendiumStore } from '@/stores';

export default {
  name: 'Skills',

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
        { title: this.$t('nav.stats.overview'), key: 'Description' },
      ];
    },
    skills(): Skill[] {
      return orderBy(CompendiumStore().Skills, 'Name');
    },
  },
};
</script>
