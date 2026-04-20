<template>
  <v-row justify="center"
    dense>
    <cc-statblock-panel icon="cc:structure"
      :name="$t('nav.stats.structure')"
      :value="frame.Structure"
      cols="5" />
    <cc-statblock-panel icon="mdi-heart-outline"
      :name="$t('nav.stats.hp')"
      :value="frame.HP"
      cols="3" />
    <cc-statblock-panel icon="mdi-shield-outline"
      :name="$t('nav.stats.armor')"
      :value="frame.Armor"
      cols="4" />
    <cc-statblock-panel icon="cc:reactor"
      :name="$t('nav.stats.stress')"
      :value="frame.HeatStress"
      cols="4" />
    <cc-statblock-panel icon="cc:heat"
      :name="$t('nav.stats.heatCapacity')"
      :value="frame.HeatCap"
      cols="8" />
    <cc-statblock-panel icon="cc:evasion"
      :name="$t('nav.stats.evasion')"
      :value="frame.Evasion"
      cols="6" />
    <cc-statblock-panel icon="mdi-arrow-right-bold-hexagon-outline"
      :name="$t('nav.stats.speed')"
      :value="frame.Speed"
      cols="6" />
    <cc-statblock-panel icon="cc:edef"
      :name="$t('nav.stats.edef')"
      :value="frame.EDefense"
      cols="5" />
    <cc-statblock-panel icon="cc:full_tech"
      :name="$t('nav.stats.techAttack')"
      :value="frame.TechAttack"
      cols="7" />
    <cc-statblock-panel icon="cc:sensor"
      :name="$t('nav.stats.sensors')"
      :value="frame.SensorRange"
      cols="4" />
    <cc-statblock-panel icon="cc:repair"
      :name="$t('nav.stats.repairCapacity')"
      :value="frame.RepCap"
      cols="8" />
    <cc-statblock-panel icon="cc:save"
      :name="$t('nav.stats.saveTarget')"
      :value="frame.SaveTarget"
      cols="6" />
    <cc-statblock-panel icon="cc:system_point"
      :name="$t('nav.stats.systemPoints')"
      :value="frame.SP"
      cols="6" />
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'CcFrameStatblock',
  props: {
    frame: {
      type: Object,
      required: true,
    },
  },
};
</script>
