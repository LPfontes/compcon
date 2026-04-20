<template>
  <v-container v-if="!bonds.length"
    class="px-12">
    <v-alert icon="mdi-vector-link"
      :title="$t('compendium.noBondData')"
      variant="tonal">
      <p v-html-safe="$t('compendium.bondsDescription')" />
      <br />
      <p v-html-safe="$t('compendium.bondsLcpNotice')" />
    </v-alert>
    <br />
    <v-row align="center"
      justify="center">
      <v-col cols="auto">
        <cc-button color="accent"
          to="/srd">{{ $t('compendium.returnToCompendium') }}</cc-button>
      </v-col>
    </v-row>
  </v-container>
  <cc-compendium-browser v-else
    :items="bonds"
    item-type="Bond"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.bonds') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { Bond } from '@/class';

export default {
  name: 'Bonds',
  data: () => ({
    options: {
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
      hideTitle: true,
    },
  }),
  computed: {
    bonds(): Bond[] {
      return orderBy(CompendiumStore().Bonds, 'Name');
    },
  },
};
</script>
