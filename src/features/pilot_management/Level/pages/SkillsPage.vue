<template>
  <stepper-content
    :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.level.skills.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.level.overview.subtitle') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.level.skills.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.level.skills.description') }}
      <br />
      <b>{{ $t('pilotManagement.level.skills.nbLabel') }}</b>
      {{ $t('pilotManagement.level.skills.nbDescription') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotManagement.level.skills.instruction') }}</div>
      <p class="text-cc-overline">
        {{ $t('pilotManagement.level.skills.legalFooter') }}
      </p>
    </v-alert>

    <skill-selector level-up flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import SkillSelector from '../../_components/selectors/SkillSelector.vue';
import { Pilot } from '@/class';
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'SkillsPage',
  components: { SkillSelector, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.SkillsController.IsMissingSkills;
    },
  },
};
</script>
