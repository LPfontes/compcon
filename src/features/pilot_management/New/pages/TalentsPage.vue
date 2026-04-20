<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.new.registration.wizard.talents.title') }}&emsp;</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.new.registration.identService') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.new.registration.wizard.talents.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.new.registration.wizard.talents.description') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotManagement.new.registration.wizard.talents.selectCount', { word, count }) }}</div>
        {{ $t('pilotManagement.new.registration.truthAttestation') }}
    </v-alert>
    <talent-selector level-up flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import TalentSelector from '../../_components/selectors/TalentSelector.vue';
import { Pilot } from '@/class';
export default {
  name: 'TalentsPage',
  components: {
    StepperContent,
    TalentSelector,
  },
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
    count(): number {
      return this.pilot.TalentsController.MaxTalentPoints;
    },
    word(): string {
      const words = this.$t('pilotManagement.new.registration.wizard.skills.words');
      return words[this.count];
    },
  },
};
</script>
