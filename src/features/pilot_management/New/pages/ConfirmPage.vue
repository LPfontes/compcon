<template>
  <stepper-content
    :complete="pilotReady"
    mandatory
    exit="../pilot_management"
    back
    no-confirm
    @back="$emit('back')">
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <br />
    <v-alert v-if="!pilotReady" type="error" variant="outlined" tile>
      <span class="stat-text text-accent">
        {{ $t('pilotManagement.new.registration.wizard.confirm.warning', { id: pilot.ID }) }}
      </span>
      <ul class="flavor-text text-error">
        <li v-if="!pilot.Callsign">
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          {{ $t('pilotManagement.new.registration.wizard.confirm.critical') }}
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          &nbsp;{{ $t('pilotManagement.new.registration.wizard.confirm.errors.callsign') }}
        </li>
        <li v-if="!pilot.Name">
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          {{ $t('pilotManagement.new.registration.wizard.confirm.critical') }}
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          &nbsp;{{ $t('pilotManagement.new.registration.wizard.confirm.errors.name') }}
        </li>
        <li v-if="!pilot.SkillsController.HasFullSkills">
          {{ $t('pilotManagement.new.registration.wizard.confirm.errors.skills') }}
        </li>
        <li v-if="!pilot.TalentsController.HasFullTalents">{{ $t('pilotManagement.new.registration.wizard.confirm.errors.talents') }}</li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">
          {{ $t('pilotManagement.new.registration.wizard.confirm.errors.mechSkills') }}
        </li>
        <li v-if="!pilot.LicenseController.HasLicenses">
          {{ $t('pilotManagement.new.registration.wizard.confirm.errors.licenses') }}
        </li>
        <li v-if="!pilot.CoreBonusController.HasCBs">
          {{ $t('pilotManagement.new.registration.wizard.confirm.errors.coreBonuses') }}
        </li>
      </ul>
    </v-alert>
    <cc-button
      block
      color="success"
      class="my-6"
      prepend-icon="cc:orbital"
      :disabled="!pilotReady"
      @click="savePilot()">
      <span>
        {{ $t('pilotManagement.new.registration.wizard.confirm.registerBtn', {
          callsign: pilot.Callsign || $t('pilotManagement.new.registration.wizard.confirm.defaultCallsign'),
          name: pilot.Name || $t('pilotManagement.new.registration.wizard.confirm.defaultName')
        }) }}
      </span>
    </cc-button>
    <div v-if="!pilotReady" class="text-right">
      <div class="d-inline-block">
        <cc-button
          size="small"
          color="primary"
          :tooltip="$t('pilotManagement.new.registration.wizard.confirm.overrideTooltip')"
          :disabled="missingBasicInfo"
          @click="savePilot()">
          {{ $t('pilotManagement.new.registration.wizard.confirm.overrideBtn') }}
        </cc-button>
      </div>
    </div>
  </stepper-content>
</template>

<script lang="ts">
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent';
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue';
import StepperContent from '../../_components/StepperContent.vue';
import { Pilot } from '@/classes/pilot/Pilot';

import { PilotStore } from '@/stores';

export default {
  name: 'ConfirmPage',
  components: { PilotRegistrationCard, StepperContent },
  emits: ['done', 'back'],
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    groupID: { type: String },
  },
  data: () => ({
    default_callsign: '',
    default_name: '',
  }),
  computed: {
    pilotReady(): boolean {
      return (
        this.pilot.HasIdent &&
        this.pilot.SkillsController.HasFullSkills &&
        this.pilot.TalentsController.HasFullTalents &&
        this.pilot.MechSkillsController.HasFullHASE &&
        this.pilot.LicenseController.HasLicenses &&
        this.pilot.CoreBonusController.HasCBs
      );
    },
    missingBasicInfo(): boolean {
      return !this.pilot.Callsign || !this.pilot.Name;
    },
  },
  methods: {
    savePilot() {
      const store = PilotStore();
      this.pilot.Callsign = this.pilot.Callsign ? this.pilot.Callsign : this.$t('pilotManagement.new.registration.wizard.confirm.defaultCallsign');
      this.pilot.Name = this.pilot.Name ? this.pilot.Name : this.$t('pilotManagement.new.registration.wizard.confirm.defaultName');
      store.AddPilot(this.pilot as Pilot, this.groupID);

      if (this.pilot.isTemplate) AchievementEventSystem.emit('add_template_pilot');
      AchievementEventSystem.emit('add_pilot');

      this.$emit('done');
    },
  },
};
</script>
