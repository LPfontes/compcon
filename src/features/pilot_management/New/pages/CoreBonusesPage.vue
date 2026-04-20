<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.new.registration.wizard.coreBonuses.title') }}&emsp;</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.new.registration.identService') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.new.registration.wizard.coreBonuses.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.new.registration.wizard.coreBonuses.description') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">
        {{ $t('pilotManagement.new.registration.wizard.coreBonuses.selectCount', { word, count, n: count }) }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pilotManagement.new.registration.wizard.coreBonuses.disclaimer') }}
      </p>
    </v-alert>
    <core-bonus-selector flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import CoreBonusSelector from '../../_components/selectors/CoreBonusSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'TalentsPage',
  components: {
    StepperContent,
    CoreBonusSelector,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return this.pilot.CoreBonusController.HasCBs;
    },
    count(): number {
      return this.pilot.CoreBonusController.MaxCBPoints;
    },
    word(): string {
      const words = this.$t('pilotManagement.new.registration.wizard.skills.words');
      return words[this.count];
    },
  },
};
</script>
