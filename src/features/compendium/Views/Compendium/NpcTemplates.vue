<template>
  <cc-compendium-browser :items="templates"
    :item-type="'NpcTemplate'"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.npcTemplates') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { NpcTemplate } from '@/classes/npc/template/NpcTemplate';

export default {
  name: 'NpcTemplates',

  data: () => ({
    options: {
      views: ['single', 'table', 'list'],
      initialView: 'single',
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
        { title: '', key: 'Terse' },
      ];
    },
    templates(): NpcTemplate[] {
      return orderBy(CompendiumStore().NpcTemplates, 'Name');
    },
  },
};
</script>
