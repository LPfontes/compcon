<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.new.registration.wizard.licenses.title') }}&emsp;</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.new.registration.identService') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.new.registration.wizard.licenses.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.new.registration.wizard.licenses.description') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotManagement.new.registration.wizard.licenses.selectCount', { word, count }) }}</div>
        {{ $t('pilotManagement.new.registration.wizard.licenses.disclaimer') }}
    </v-alert>
    <license-selector flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import LicenseSelector from '../../_components/selectors/LicenseSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'TalentsPage',
  components: {
    StepperContent,
    LicenseSelector,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return this.pilot.LicenseController.HasLicenses;
    },
    count(): number {
      return this.pilot.LicenseController.MaxLicensePoints;
    },
    word(): string {
      const words = this.$t('pilotManagement.new.registration.wizard.skills.words');
      return words[this.count];
    },
  },
};
</script>
