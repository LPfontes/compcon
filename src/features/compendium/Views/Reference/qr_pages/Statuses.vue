<template>
  <v-container class="pb-12">
    <h1 id="statuses"
      class="heading">{{ $t('compendium.reference_pages.statuses_page.statuses') }}</h1>
    <cc-masonry-grid :items="statuses"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </cc-masonry-grid>

    <h1 id="conditions"
      class="heading">{{ $t('compendium.reference_pages.statuses_page.conditions') }}</h1>
    <cc-masonry-grid :items="conditions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </cc-masonry-grid>
  </v-container>
  <v-footer border
    app
    class="py-0 bg-primary">
    <v-tabs density="compact"
      center-active
      grow>
      <v-tab v-for="item in navItems"
        :key="item.id"
        @click="scrollTo(item.id)">
        {{ $t(item.label) }}
      </v-tab>
    </v-tabs>
  </v-footer>

  <v-btn size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo('statuses')">
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
import scrollTo from '@/util/scrollTo';
import * as _ from 'lodash-es';

import { CompendiumStore } from '@/stores';
import { Status } from '@/classes/Status';
import StatusCard from '../_components/StatusCard.vue';

export default {
  name: 'ActionEconomy',
  components: { StatusCard },
  props: {
    isModal: {
      type: Boolean,
    },
  },
  data: () => ({
    navItems: [
      { id: 'statuses', label: 'compendium.reference_pages.statuses_page.statuses' },
      { id: 'conditions', label: 'compendium.reference_pages.statuses_page.conditions' },
    ],
  }),
  computed: {
    widescreen() {
      return this.$vuetify.display.xlAndUp;
    },
    statuses() {
      return _.sortBy(
        CompendiumStore().Statuses.filter((s: Status) => s && s.StatusType !== 'Condition'),
        'Name'
      );
    },
    conditions() {
      return _.sortBy(
        CompendiumStore().Statuses.filter((s: Status) => s && s.StatusType === 'Condition'),
        'Name'
      );
    },
  },
  methods: {
    scrollTo(id: string): void {
      const el = document.getElementById(id);
      if (el) scrollTo(el, this.isModal);
    },
  },
};
</script>
