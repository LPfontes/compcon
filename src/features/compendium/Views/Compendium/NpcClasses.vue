<template>
  <cc-compendium-browser ref="browser"
    :items="classes"
    item-type="NpcClass"
    :table-headers="headers"
    :tier="selectedTier"
    :options="options"
    @view-change="toggleTieredView">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.npcClasses') }}</div>
      <v-slide-y-transition>
        <div v-if="tieredView"
          class="text-center my-n1">
          <v-btn-toggle v-model="selectedTier"
            density="compact"
            color="secondary-darken-3"
            mandatory
            style="height: 15px">
            <v-btn size="x-small"
              :value="1">{{ $t('nav.stats.tier') }} 1</v-btn>
            <v-btn size="x-small"
              :value="2">{{ $t('nav.stats.tier') }} 2</v-btn>
            <v-btn size="x-small"
              :value="3">{{ $t('nav.stats.tier') }} 3</v-btn>
          </v-btn-toggle>
        </div>
      </v-slide-y-transition>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';

import { CompendiumStore } from '@/stores';
import { NpcClass } from '@/classes/npc/class/NpcClass';

const keymap = {
  hull: 'nav.stats.hull',
  agi: 'nav.stats.agi',
  sys: 'nav.stats.sys',
  eng: 'nav.stats.eng',
  armor: 'nav.stats.armor',
  hp: 'nav.stats.hp',
  heat: 'nav.stats.heatCap',
  evasion: 'nav.stats.evasion',
  edef: 'nav.stats.edef',
  speed: 'nav.stats.speed',
  sensorRange: 'nav.stats.sensors',
  saveTarget: 'nav.stats.save',
  sizes: 'nav.stats.size',
};

export default {
  name: 'NpcClasses',

  data: () => ({
    selectedTier: 1,
    tieredView: false,
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['lcp', 'role', 'none'],
      initialGroup: 'role',
    },
  }),

  computed: {
    classes(): NpcClass[] {
      return orderBy(CompendiumStore().NpcClasses, ['Role', 'Name']);
    },
    headers() {
      const h = [
        { title: this.$t('nav.stats.contentPack'), key: 'LcpName' },
        { title: this.$t('nav.stats.role'), key: 'Icon' },
        { title: this.$t('nav.stats.name'), key: 'Name' },
      ] as any[];
      for (const key in keymap) {
        h.push({
          title: this.$t(keymap[key]),
          key,
          tier: this.selectedTier,
          sortRaw: (a: NpcClass, b: NpcClass) =>
            Number(a.Stats.Stat(key, this.selectedTier)) -
            Number(b.Stats.Stat(key, this.selectedTier)),
          align: 'center',
        });
      }
      return h;
    },
  },
  methods: {
    toggleTieredView(evt) {
      this.tieredView = evt === 'table' || evt === 'scatter' || evt === 'bar' || evt === 'compare';
    },
  },
};
</script>
