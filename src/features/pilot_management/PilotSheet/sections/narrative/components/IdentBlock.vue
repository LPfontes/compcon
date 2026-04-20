<template>
  <v-row dense
    class="stat-text text-center mb-2"
    :justify="mobile ? 'start' : 'space-between'"
    align="center">
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.Callsign"
        :readonly="pilot.IsRemote"
        :label="$t('pilotSheet.narrative.callsignLabel')" />
    </v-col>
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.Name"
        :readonly="pilot.IsRemote"
        :label="$t('pilotSheet.narrative.nameLabel')" />
    </v-col>
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.PlayerName"
        :readonly="pilot.IsRemote"
        :label="$t('pilotSheet.narrative.playerLabel')" />
    </v-col>
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.Background"
        :readonly="pilot.IsRemote"
        :label="$t('pilotSheet.narrative.backgroundLabel')">
        <template #append>
          <background-selector v-if="!pilot.IsRemote"
            small
            @select="pilot.Background = $event" />
        </template>
      </cc-text-label>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import BackgroundSelector from '../../../../_components/selectors/BackgroundSelector.vue';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'IdentBlock',
  components: { BackgroundSelector },
  mixins: [useMobile],
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  data: () => ({
    noteColor: '',
    notification: '',
  }),
  computed: {
    pilotStatuses() {
      return [
        { title: this.$t('pilotSheet.narrative.statusActive'), value: 'ACTIVE' },
        { title: this.$t('pilotSheet.narrative.statusInactive'), value: 'INACTIVE' },
        { title: this.$t('pilotSheet.narrative.statusRetired'), value: 'RET' },
        { title: this.$t('pilotSheet.narrative.statusMia'), value: 'MIA' },
        { title: this.$t('pilotSheet.narrative.statusKia'), value: 'KIA' },
        { title: this.$t('pilotSheet.narrative.statusUnknown'), value: 'UNKNOWN' },
      ];
    },
    statusColor(): string {
      switch (this.pilot.Status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'mia':
        case 'kia':
          return 'error';
        default:
          return 'text';
      }
    },
  },
};
</script>
