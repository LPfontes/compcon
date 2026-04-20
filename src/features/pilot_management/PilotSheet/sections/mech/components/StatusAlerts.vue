<template>
  <div v-if="statuses.length">
    <cc-alert v-for="(status, index) in statuses"
      :key="`status-${index}`"
      class="mb-2"
      :color="status.color"
      :icon="status.icon"
      :title="status.title">
      <p v-text="status.text" />
    </cc-alert>
  </div>
</template>

<script lang="ts">
import { Mech } from '@/class';

export default {
  name: 'StatusAlerts',
  props: {
    mech: {
      status: Object,
      required: true,
    },
  },
  computed: {
    statuses(): { title: string; text: string; icon: string; color: string }[] {
      const out = [] as { title: string; text: string; icon: string; color: string }[];
      // if ((this.mech as Mech).Destroyed) out.push('destroyed')
      // if ((this.mech as Mech).MechLoadoutController.ActiveLoadout.Systems.filter(x => x.IsCascading).length)
      //   out.push('cascading')
      if ((this.mech as Mech).FreeSP < 0)
        out.push({
          title: this.$t('pilotSheet.mech.statusAlerts.systemCapacityExceededTitle'),
          text: this.$t('pilotSheet.mech.statusAlerts.systemCapacityExceededText'),
          icon: 'mdi-alert',
          color: 'error',
        });
      if ((this.mech as Mech).FreeSP > 0)
        out.push({
          title: this.$t('pilotSheet.mech.statusAlerts.systemCapacityRemainingTitle'),
          text: this.$t('pilotSheet.mech.statusAlerts.capacityImpairedText'),
          icon: 'mdi-alert-decagram-outline',
          color: 'warning',
        });
      if ((this.mech as Mech).MechLoadoutController.ActiveLoadout.HasEmptyMounts)
        out.push({
          title: this.$t('pilotSheet.mech.statusAlerts.emptyMountsTitle'),
          text: this.$t('pilotSheet.mech.statusAlerts.capacityImpairedText'),
          icon: 'mdi-alert-decagram-outline',
          color: 'warning',
        });
      if ((this.mech as Mech).RequiredLicenses.filter((x) => x.missing).length)
        out.push({
          title: this.$t('pilotSheet.mech.statusAlerts.unlicensedTitle'),
          text: this.$t('pilotSheet.mech.statusAlerts.unlicensedText'),
          icon: 'mdi-alert',
          color: 'warning',
        });
      if (!(this.mech as Mech).HasCompatibleMods())
        out.push({
          title: this.$t('pilotSheet.mech.statusAlerts.incompatibleModTitle'),
          text: this.$t('pilotSheet.mech.statusAlerts.incompatibleModText'),
          icon: 'mdi-cancel',
          color: 'warning',
        });
      return out;
    },
  },
};
</script>
