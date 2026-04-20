<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.new.registration.wizard.mechSkills.title') }}&emsp;</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.new.registration.identService') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.new.registration.wizard.mechSkills.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.new.registration.wizard.mechSkills.description') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotManagement.new.registration.wizard.mechSkills.addCount', { word, count }) }}</div>
        {{ $t('pilotManagement.new.registration.truthAttestation') }}
    </v-alert>
    <mech-skills-selector level-up :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import MechSkillsSelector from '../../_components/selectors/MechSkillsSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'MechSkillsPage',
  components: {
    StepperContent,
    MechSkillsSelector,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.MechSkillsController.IsMissingHASE;
    },
    count(): number {
      return this.pilot.MechSkillsController.MaxHASEPoints;
    },
    word(): string {
      const words = this.$t('pilotManagement.new.registration.wizard.skills.words');
      return words[this.count];
    },
  },
};
</script>
