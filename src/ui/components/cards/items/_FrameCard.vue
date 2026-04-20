<template>
  <v-row dense
    align="center">
    <v-col>
      <div class="heading h2">{{ item.Source }} {{ item.MechTypeString }} {{ $t('compendium.frameSuffix') }}</div>
      <div v-if="item.Variant"
        class="heading h4 text-accent">{{ item.Variant }} {{ $t('compendium.variantFrame') || 'Variant Frame' }}</div>
    </v-col>
    <v-col cols="auto">
      <cc-tooltip :icon="item.SizeIcon"
        size="65">
        <div class="heading h3">{{ $t('nav.stats.size') }} {{ item.Size === 0.5 ? '½' : item.Size }}</div>
        <v-divider class="my-1" />
        {{ glossary('size') }}
      </cc-tooltip>
    </v-col>
  </v-row>
  <v-row align="start"
    dense>
    <v-col>
      <div v-if="item.Description">
        <div class="text-cc-overline my-1 text-text">{{ $t('compendium.entry') || 'COMPENDIUM ENTRY' }}</div>
        <p v-html-safe="item.Description"
          class="flavor-text" />
      </div>
    </v-col>
    <v-col :order="mobile ? 'first' : 'last'"
      cols="12"
      md="5">
      <v-img :src="item.DefaultImage"
        max-height="100vh" />
    </v-col>
  </v-row>

  <div class="my-4">
    <div class="text-cc-overline text-text">{{ $t('compendium.combatProfile') || 'COMBAT PROFILE' }}</div>
    <frame-combat-chart :frame="item" />
  </div>

  <div class="text-cc-overline text-text">{{ $t('compendium.frameTraits') || 'FRAME TRAITS' }}</div>
  <cc-masonry-grid :items="item.Traits"
    :column-width="500"
    :gap="16"
    :min-columns="1"
    :max-columns="2">
    <template #default="{ item, index }">
      <cc-trait-item :trait="item"
        :color="mColor"
        style="height: 100%" />
    </template>
  </cc-masonry-grid>

  <br />
  <div class="text-cc-overline text-text">{{ $t('compendium.weaponMounts') || 'AVAILABLE WEAPON MOUNTS' }}</div>
  <v-row justify="space-around"
    class="mb-3">
    <v-col v-for="(m, index) in item.Mounts"
      :key="`mount-${index}`">
      <v-tooltip location="bottom"
        max-width="300">
        <template #activator="{ props }">
          <v-card color="primary"
            dark
            class="clipped"
            tile
            v-bind:="props">
            <v-card-text class="heading h3 px-8 text-uppercase">{{ m }} {{ $t('compendium.mount') || 'Mount' }}</v-card-text>
          </v-card>
        </template>
        <p v-html-safe="get_mount_tooltip(m)" />
      </v-tooltip>
    </v-col>
  </v-row>

  <div class="text-cc-overline text-text">{{ $t('compendium.coreSystem') || 'ONBOARD CORE SYSTEM' }}</div>
  <cc-core-system-panel :frame="item" />
</template>

<script lang="ts">
import { FrameCombatChart } from '../frame';
import { glossary } from '@/lancer-data-proxy';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'CcFrameCard',
  components: {
    FrameCombatChart,
  },
  mixins: [useMobile],
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: { type: Boolean },
    smallTags: { type: Boolean },
    dense: { type: Boolean },
    charts: { type: Boolean },
    collapseActions: { type: Boolean },
    tier: { type: Number },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    mColor() {
      return this.item.Manufacturer.GetColor(this.$vuetify.theme.current.dark);
    },
  },
  methods: {
    glossary(name: string) {
      const targetName = name.toLowerCase() === 'size' ? 'tamanho' : name.toLowerCase();
      const entry = glossary.find((x) => x.name.toLowerCase() === name.toLowerCase() || x.name.toLowerCase() === targetName);
      return entry ? entry.description : `[Missing glossary: ${name}]`;
    },

    get_mount_tooltip(mount_type: string) {
      if (this.$te(`compendium.mountTooltips.${mount_type}`)) {
        return this.$t(`compendium.mountTooltips.${mount_type}`);
      }
      return this.$t('compendium.mountTooltips.unknown');
    },
  },
};
</script>
