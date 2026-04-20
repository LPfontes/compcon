<template>
  <stepper-content
    :complete="!pilot.LicenseController.IsMissingLicenses"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.level.licenses.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.level.overview.subtitle') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.level.licenses.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.level.licenses.description') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotManagement.level.licenses.instruction') }}</div>
      <p class="text-cc-overline">
        {{ $t('pilotManagement.level.licenses.legalFooter') }}
      </p>
    </v-alert>
    <license-selector level-up flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import LicenseSelector from '../../_components/selectors/LicenseSelector.vue';
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'LicensePage',
  components: { LicenseSelector, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
