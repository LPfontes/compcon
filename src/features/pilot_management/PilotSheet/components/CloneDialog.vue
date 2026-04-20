<template>
  <v-card-text>
    <div class="text-center body-text light-panel mb-4"
      style="border-radius: 3px">
      {{ $t('pilotSheet.clone.intro') }}
    </div>

    <v-row justify="space-around">
      <v-col cols="12"
        md="6">
        <cc-button prepend-icon="mdi-content-copy"
          details="test"
          block
          color="primary"
          :tooltip="$t('pilotSheet.clone.duplicateTooltip')"
          @click="copyPilot">
          {{ $t('pilotSheet.clone.duplicateBtn') }}
        </cc-button>
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-button prepend-icon="mdi-dna"
          large
          block
          color="primary"
          :tooltip="$t('pilotSheet.clone.flashCloneTooltip')"
          :disabled="!!quirk"
          @click="rollQuirk">
          {{ $t('pilotSheet.clone.flashCloneBtn') }}
        </cc-button>
      </v-col>
    </v-row>
    <v-scale-transition>
      <div v-if="quirk">
        <cc-alert color="deep-orange"
          variant="tonal"
          class="my-4">
          <div class="text-center heading h3 mb-2">
            <v-icon size="small"
              class="pb-1"
              start
              icon="mdi-alert" />
            <b style="letter-spacing: 15px">{{ $t('pilotSheet.clone.warning') }}</b>
            <v-icon size="small"
              class="pb-1"
              icon="mdi-alert" />
          </div>
          <div class="text-cc-overline"
            :class="!mobile && 'px-2'">
            {{ $t('pilotSheet.clone.warningText1') }}
            <ul class="pb-1">
              <li>
                {{ $t('pilotSheet.clone.warningItem1') }}
              </li>
              <li>
                {{ $t('pilotSheet.clone.warningItem2') }}
              </li>
              <li>
                {{ $t('pilotSheet.clone.warningItem3') }}
              </li>
              <li>
                {{ $t('pilotSheet.clone.warningItem4') }}
              </li>
              <li>
                {{ $t('pilotSheet.clone.warningItem5') }}
              </li>
            </ul>
            <v-divider class="pb-1" />
            <div class="text-center">
              {{ $t('pilotSheet.clone.warningFooter') }}
            </div>
          </div>
        </cc-alert>

        <v-row align="center"
          justify="center">
          <v-col cols="12"
            md="8">
            <div class="text-overline">{{ $t('pilotSheet.clone.quirkTitle') }}</div>
            <cc-alert density="compact"
              color="primary">
              <v-card-text :class="mobile && 'px-0'">
                {{ quirk }}
              </v-card-text>
            </cc-alert>
          </v-col>
          <v-col cols="auto">
            <cc-button v-if="!mobile"
              icon="mdi-dice-6"
              variant="outlined"
              :tooltip="$t('pilotSheet.clone.rerollTooltip')"
              @click="rollQuirk" />
            <cc-button v-else
              prepend-icon="mdi-dice-6"
              @click="rollQuirk">{{ $t('pilotSheet.clone.rerollBtn') }}</cc-button>
          </v-col>
        </v-row>

        <v-row v-if="quirk"
          align="center"
          justify="center">
          <v-col cols="12"
            md="8">
            <cc-button large
              block
              tile
              color="secondary"
              @click="clonePilot">
              {{ $t('pilotSheet.clone.decantBtn') }}
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </v-scale-transition>
  </v-card-text>
</template>

<script lang="ts">
import { CompendiumStore, PilotStore } from '@/stores';
import * as _ from 'lodash-es';
import { Pilot } from '@/class';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'CloneDialog',
  mixins: [useMobile],
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  data: () => ({
    quirk: null,
  }),
  methods: {
    show() {
      (this.$refs.dialog as any).show();
    },
    hide() {
      this.quirk = null;
      this.$emit('close');
    },
    rollQuirk() {
      const compendium = CompendiumStore();
      this.quirk = _.sample(compendium.Lists.quirks);
    },
    clonePilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(this.pilot as Pilot));
      newPilot.RenewID();
      this.pilot.Name += '※';
      this.pilot.AddQuirk(this.quirk);
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      PilotStore().AddPilot(newPilot);
      this.hide();
      this.$router.push({ name: 'pilot_sheet', params: { id: newPilot.ID } });
    },
    copyPilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(this.pilot as Pilot));
      newPilot.RenewID();
      newPilot.Callsign += '″';
      newPilot.Name += ` (${this.$t('roster.organizer.copy')})`;
      newPilot.Status = 'ACTIVE';
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      PilotStore().AddPilot(newPilot);
      this.hide();
      this.$router.push({ name: 'pilot_sheet', params: { id: newPilot.ID } });
    },
  },
};
</script>
