<template>
  <v-row dense>
    <v-col v-if="!!$slots.prepend"
      cols="12"
      md="auto"
      class="mr-3">
      <slot name="prepend" />
    </v-col>
    <v-col>
      <v-row align="center"
        no-gutters>
        <v-col>
          <v-row justify="space-between"
            no-gutters>
            <statblock-item v-if="mobile"
              cols="3"
              sm="3"
              :attr="$t('pilotSheet.mech.stats.size')"
              :icon="mech.SizeIcon"
              :val="mech.Size"
              :contributors="mech.SizeContributors"
              :bonuses="getBonuses('size')"
              :color="color" />
            <statblock-item cols="3"
              sm=""
              md="4"
              :attr="mobile ? $t('pilotSheet.mech.stats.struct') : $t('pilotSheet.mech.stats.structure')"
              icon="cc:structure"
              :val="mech.MaxStructure"
              :contributors="mech.StructureContributors"
              :bonuses="getBonuses('structure')"
              :color="color" />
            <statblock-item cols="3"
              sm=""
              md=""
              :attr="$t('pilotSheet.mech.stats.hp')"
              icon="mdi-heart"
              :val="mech.MaxHP"
              :contributors="mech.HPContributors"
              :bonuses="getBonuses('hp')"
              :color="color" />
            <statblock-item cols="3"
              sm=""
              md="4"
              :attr="$t('pilotSheet.mech.stats.armor')"
              :val="mech.Armor"
              icon="mdi-shield"
              :contributors="mech.ArmorContributors"
              :bonuses="getBonuses('armor')"
              :color="color" />
            <statblock-item cols="4"
              sm="4"
              md="4"
              :attr="$t('pilotSheet.mech.stats.stress')"
              :val="mech.MaxStress"
              icon="cc:reactor"
              :contributors="mech.StressContributors"
              :bonuses="getBonuses('stress')"
              :color="color" />
            <statblock-item cols="4"
              sm=""
              md=""
              :attr="mobile ? $t('pilotSheet.mech.stats.heatcap') : $t('pilotSheet.mech.stats.heatCapacity')"
              icon="cc:heat"
              :val="mech.HeatCapacity"
              :contributors="mech.HeatCapContributors"
              :bonuses="getBonuses('heatcap')"
              :color="color" />
            <statblock-item cols="4"
              sm="4"
              md="4"
              :attr="mobile ? $t('pilotSheet.mech.stats.repcap') : $t('pilotSheet.mech.stats.repairCapacity')"
              icon="cc:repair"
              :val="mech.RepairCapacity"
              :contributors="mech.RepCapContributors"
              :bonuses="getBonuses('repcap')"
              :color="color" />
          </v-row>
        </v-col>
        <v-col v-if="!mobile"
          cols="auto">
          <div style="position: relative">
            <v-icon size="120"
              :color="color"
              :icon="mech.SizeIcon" />
            <v-icon size="110"
              style="
                position: absolute;
                top: 50%;
                bottom: 50%;
                left: 50%;
                right: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
              "
              icon="mdi-hexagon" />
          </div>
        </v-col>
      </v-row>
      <v-row align="center"
        no-gutters
        justify="space-between">
        <statblock-item cols="3"
          sm="4"
          md="3"
          :attr="portrait ? $t('pilotSheet.mech.stats.limitedSysBonusShort') : widescreen ? $t('pilotSheet.mech.stats.limitedSystemBonus') : $t('pilotSheet.mech.stats.limitedSysBonus')"
          signed
          icon="cc:ammo"
          :val="mech.LimitedBonus"
          :contributors="mech.LimitedContributors"
          :bonuses="getBonuses('limited_bonus')"
          :color="color" />
        <statblock-item cols="4"
          sm="3"
          :attr="portrait ? $t('pilotSheet.mech.stats.attackBonusShort') : $t('pilotSheet.mech.stats.attackBonus')"
          signed
          icon="cc:weapon"
          :val="mech.AttackBonus"
          :contributors="mech.AttackBonusContributors"
          :bonuses="getBonuses('attack')"
          :color="color" />
        <statblock-item :attr="$t('pilotSheet.mech.stats.speed')"
          sm=""
          :val="mech.Speed"
          icon="mdi-arrow-right-bold-hexagon-outline"
          :contributors="mech.SpeedContributors"
          :bonuses="getBonuses('speed')"
          :color="color" />
        <statblock-item cols="4"
          sm="2"
          md="3"
          :attr="$t('pilotSheet.mech.stats.evasion')"
          icon="cc:evasion"
          :val="mech.Evasion"
          :contributors="mech.EvasionContributors"
          :bonuses="getBonuses('evasion')"
          :color="color" />
        <statblock-item cols="4"
          sm="3"
          md="3"
          :attr="portrait ? $t('pilotSheet.mech.stats.techAtkShort') : $t('pilotSheet.mech.stats.techAttack')"
          icon="cc:full_tech"
          signed
          :val="mech.TechAttack"
          :contributors="mech.TechAttackContributors"
          :bonuses="getBonuses('tech_attack')"
          :color="color" />
        <statblock-item cols="4"
          sm="3"
          md=""
          icon="cc:edef"
          :attr="portrait ? $t('pilotSheet.mech.stats.edefShort') : $t('pilotSheet.mech.stats.eDefense')"
          :val="mech.EDefense"
          :contributors="mech.EDefenseContributors"
          :bonuses="getBonuses('edef')"
          :color="color" />
        <statblock-item cols="6"
          sm="3"
          :attr="$t('pilotSheet.mech.stats.sensors')"
          icon="cc:sensor"
          :val="mech.SensorRange"
          :contributors="mech.SensorRangeContributors"
          :bonuses="getBonuses('sensor')"
          :color="color" />
        <statblock-item cols="6"
          sm=""
          md="3"
          :attr="$t('pilotSheet.mech.stats.save')"
          icon="cc:save"
          :val="mech.SaveTarget"
          :contributors="mech.SaveTargetContributors"
          :bonuses="getBonuses('save')"
          :color="color" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import StatblockItem from './StatblockItem.vue';
import { useMobile } from '@/mixins/useMobile';
import { Mech } from '@/class';
import Pilot from '@/assets/icons/svg/pilot.vue';


export default {
  name: 'AttributesBlock',
  components: { StatblockItem },
  mixins: [useMobile],
  props: {
    mech: {
      type: Mech,
      required: true,
    },
    pilot: {
      type: Pilot,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
    widescreen(): boolean {
      return this.$vuetify.display.lgAndUp;
    },
  },
  methods: {
    getBonuses(key: string): any[] {
      return this.mech.FeatureController.Bonuses.filter((x) => x.ID === key);
    },
  },
};
</script>

<style scoped>
.no-height {
  line-height: 0 !important;
}
</style>
