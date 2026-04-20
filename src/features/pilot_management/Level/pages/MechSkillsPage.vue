<template>
  <stepper-content :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.level.mechSkills.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.level.overview.subtitle') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.level.mechSkills.subtitle') }}
    </div>
    <p class="flavor-text"
      style="font-size: 14px">
      {{ $t('pilotManagement.level.mechSkills.description', { id: pilot.ID }) }}
    </p>
    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">{{ $t('pilotManagement.level.mechSkills.instruction') }}</div>
      <p class="text-cc-overline">
        {{ $t('pilotManagement.level.mechSkills.legalFooter') }}
      </p>
    </v-alert>
    <mech-skills-selector level-up
      :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import MechSkillsSelector from '../../_components/selectors/MechSkillsSelector.vue';
import { Pilot } from '@/class';
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'MechSkillsPage',
  components: { MechSkillsSelector, StepperContent },
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
  },
};
</script>
