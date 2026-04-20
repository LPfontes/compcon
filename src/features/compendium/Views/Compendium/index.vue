<template>
  <v-container>
    <div
      v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
      {{ $t('compendium.title').toUpperCase() }}
    </div>
    <v-row justify="center">
      <v-col lg="8" xs="12">
        <search-bar />
      </v-col>
    </v-row>
  </v-container>
  <v-container class="mt-0 pt-0">
    <v-row
      :dense="mobile"
      :justify="$vuetify.display.smAndDown ? 'space-between' : 'space-around'"
      align="center">
      <compendium-page-button
        icon="cc:manufacturer"
        :name="$t('compendium.manufacturers')"
        to="/srd/compendium/manufacturers" />
      <compendium-page-button
        color="primary"
        icon="cc:license"
        :name="$t('compendium.licenses')"
        to="/srd/compendium/licenses" />
      <compendium-page-button
        icon="cc:corebonus"
        :name="$t('compendium.coreBonuses')"
        to="/srd/compendium/corebonuses" />
      <compendium-page-button
        color="frame"
        icon="cc:frame"
        :name="$t('compendium.frames')"
        to="/srd/compendium/frames" />
      <compendium-page-button
        color="weapon"
        icon="cc:melee"
        :name="$t('compendium.mechWeapons')"
        to="/srd/compendium/weapons" />
      <compendium-page-button
        color="system"
        icon="mdi-chip"
        :name="$t('compendium.mechSystems')"
        to="/srd/compendium/systems" />
      <compendium-page-button
        color="secondary"
        icon="cc:pilot"
        :name="$t('compendium.pilotGear')"
        to="/srd/compendium/pilot_gear" />
      <compendium-page-button
        color="secondary"
        icon="cc:orbit"
        :name="$t('compendium.backgrounds')"
        to="/srd/compendium/backgrounds" />
      <compendium-page-button
        color="secondary"
        icon="cc:accuracy"
        :name="$t('compendium.skillTriggers')"
        to="/srd/compendium/skills" />
      <compendium-page-button
        color="secondary"
        icon="cc:rank_3"
        :name="$t('compendium.talents')"
        to="/srd/compendium/talents" />
      <compendium-page-button
        color="secondary"
        icon="mdi-vector-link"
        :name="$t('compendium.bonds')"
        to="/srd/compendium/bonds" />
    </v-row>
    <cc-icon-divider icon="cc:campaign" class="mb-n4" />
    <v-row :dense="mobile">
      <compendium-page-button
        color="error"
        icon="cc:npc_class"
        :name="$t('compendium.npcClasses')"
        to="/srd/compendium/npc_classes" />
      <compendium-page-button
        color="error"
        icon="cc:npc_feature"
        :name="$t('compendium.npcFeatures')"
        to="/srd/compendium/npc_features" />
      <compendium-page-button
        color="error"
        icon="cc:npc_template"
        :name="$t('compendium.npcTemplates')"
        to="/srd/compendium/npc_templates" />
      <compendium-page-button
        color="exotic"
        icon="cc:monist"
        :name="$t('compendium.eidolonLayers')"
        to="/srd/compendium/eidolon_layers" />
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
