<template>
  <v-container fluid>
    <div
      v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
      {{ $t('compendium.reference') }}
    </div>
    <v-row density="compact" justify="center">
      <v-col lg="8" xs="12">
        <search-bar reference />
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row
      density="compact"
      :justify="$vuetify.display.mdAndDown ? 'space-between' : 'space-around'"
      align="center">
      <compendium-page-button
        color="exotic"
        icon="mdi-search-web"
        :name="$t('compendium.reference_pages.quickReference')"
        to="srd/reference/reference" />
      <compendium-page-button
        color="exotic"
        icon="cc:save"
        :name="$t('compendium.reference_pages.basics')"
        to="srd/reference/basics" />
      <compendium-page-button
        color="exotic"
        icon="cc:pilot"
        :name="$t('compendium.reference_pages.pilots')"
        to="srd/reference/pilots" />
      <compendium-page-button
        color="exotic"
        icon="cc:frame"
        :name="$t('compendium.reference_pages.mechs')"
        to="srd/reference/mechs" />
      <compendium-page-button
        color="exotic"
        icon="cc:ammo"
        :name="$t('compendium.reference_pages.combat')"
        to="srd/reference/combat" />
      <compendium-page-button
        color="exotic"
        icon="cc:downtime"
        :name="$t('compendium.reference_pages.narrativePlay')"
        to="srd/reference/narrative" />
      <compendium-page-button
        color="exotic"
        icon="cc:repair"
        :name="$t('compendium.reference_pages.errata')"
        to="srd/reference/errata" />
      <compendium-page-button
        color="exotic"
        icon="cc:compendium"
        :name="$t('compendium.reference_pages.glossary')"
        to="srd/reference/glossary" />
      <compendium-page-button
        color="exotic"
        icon="cc:system_point"
        :name="$t('compendium.reference_pages.usingCompcon')"
        to="srd/reference/compcon"
        disabled />
    </v-row>
    <cc-icon-divider icon="cc:compendium" class="mb-n4" />

    <v-row>
      <compendium-page-button
        icon="cc:reserve_mech"
        :name="$t('compendium.reserves')"
        to="/srd/compendium/reserves" />
      <compendium-page-button
        icon="cc:status_exposed"
        :name="$t('compendium.statuses')"
        to="/srd/compendium/statuses" />
      <compendium-page-button icon="mdi-tag" :name="$t('compendium.tags')" to="/srd/compendium/tags" />
      <compendium-page-button
        color="primary"
        icon="mdi-map"
        :name="$t('compendium.environments')"
        to="/srd/compendium/environments" />
      <compendium-page-button
        color="primary"
        icon="mdi-timeline-text-outline"
        :name="$t('compendium.sitreps')"
        to="/srd/compendium/sitreps" />
      <compendium-page-button
        color="primary"
        icon="cc:downtime"
        :name="$t('compendium.downtimeActions')"
        to="/srd/compendium/downtime" />
      <compendium-page-button
        color="primary"
        icon="mdi-table-multiple"
        :name="$t('compendium.reference_pages.tableBrowser')"
        to="/srd/compendium/tables" />
      <compendium-page-button
        color="primary"
        icon="mdi-list-box-outline"
        :name="$t('compendium.reference_pages.listBrowser')"
        to="/srd/compendium/lists" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import SearchBar from '../../SearchBar.vue';
import CompendiumPageButton from '../../components/CompendiumPageButton.vue';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'CompendiumHome',
  components: { SearchBar, CompendiumPageButton },
  mixins: [useMobile],
};
</script>
