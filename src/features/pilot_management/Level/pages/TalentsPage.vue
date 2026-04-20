<template>
  <stepper-content
    :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.level.talents.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.level.overview.subtitle') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.level.talents.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.level.talents.description') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotManagement.level.talents.instruction') }}</div>
      <p class="text-cc-overline">
        {{ $t('pilotManagement.level.talents.legalFooter') }}
      </p>
    </v-alert>
    <talent-selector level-up flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import TalentSelector from '../../_components/selectors/TalentSelector.vue';
import { Pilot } from '@/class';
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'TalentsPage',
  components: { TalentSelector, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return this.pilot.TalentsController.HasFullTalents;
    },
  },
};
</script>
