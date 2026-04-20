<template>
  <v-container class="pb-12">
    <v-row dense>
      <v-col>
        <h1 id="mechactions"
          class="heading">
          {{ $t('compendium.reference_pages.actions_page.mechActions') }}
        </h1>
      </v-col>
      <v-col v-if="!mobile"
        cols="auto">
        <cc-switch v-model="expanded"
          :label="$t('compendium.reference_pages.actions_page.showFull')" />
      </v-col>
    </v-row>
    <cc-masonry-grid :items="actions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="pilotactions"
      class="heading">
      {{ $t('compendium.reference_pages.actions_page.pilotActions') }}
    </h1>
    <cc-masonry-grid :items="pilotActions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="downtimeactions"
      class="heading">
      {{ $t('compendium.reference_pages.actions_page.downtimeActions') }}
    </h1>
    <cc-masonry-grid :items="downtimeActions"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <cc-dense-card :item="item" />
      </template>
    </cc-masonry-grid>
  </v-container>

  <v-footer v-if="!isModal"
    border
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
    @click="scrollTo('mechactions')">
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
import ActionCard from '../_components/ActionCard.vue'
import scrollTo from '@/util/scrollTo'

import { CompendiumStore } from '@/stores'
import { useMobile } from '@/mixins/useMobile';

export default {
  name: 'ActionEconomy',
  components: { ActionCard },
  mixins: [useMobile],
  props: {
    isModal: {
      type: Boolean,
    },
  },
  data: () => ({
    navItems: [
      { id: 'mechactions', label: 'compendium.reference_pages.actions_page.mechActions' },
      { id: 'pilotactions', label: 'compendium.reference_pages.actions_page.pilotActions' },
      { id: 'downtimeactions', label: 'compendium.reference_pages.actions_page.downtimeActions' },
    ],
    expanded: false,
  }),
  computed: {
    widescreen() {
      return this.$vuetify.display.lgAndUp
    },
    allActions() {
      return CompendiumStore().Actions.filter(a => a && !a.Hidden)
    },
    actions() {
      return this.allActions.filter(a => a && !a.IsDowntimeAction && !a.IsPilotAction)
    },
    pilotActions() {
      return this.allActions.filter(a => a && a.IsPilotAction)
    },
    downtimeActions() {
      return CompendiumStore().DowntimeActions
    },
  },
  created() {
    this.expanded = this.widescreen
  },
  methods: {
    scrollTo(id: string): void {
      const el = document.getElementById(id)
      if (el) scrollTo(el, this.isModal)
    },
  },
}
</script>
