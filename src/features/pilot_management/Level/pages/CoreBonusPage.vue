<template>
  <stepper-content
    :complete="!pilot.CoreBonusController.IsMissingCBs"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title large offset>{{ $t('pilotManagement.level.coreBonuses.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.level.overview.subtitle') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.level.coreBonuses.subtitle') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.level.coreBonuses.description') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotManagement.level.coreBonuses.instruction') }}</div>
      <p class="text-cc-overline">
        {{ $t('pilotManagement.level.coreBonuses.legalFooter') }}
      </p>
    </v-alert>
    <core-bonus-selector v-if="cbEligible" level-up flat :pilot="pilot" />
    <v-card v-else flat tile color="panel">
      <v-card-text class="flavor-text text-center py-5 px-3">
        <span class="heading h2 text-disabled text--darken-1">{{ $t('pilotManagement.level.coreBonuses.ineligibleTitle') }}</span>
        <br />
        <span class="text-disabled text--darken-2">
          {{ $t('pilotManagement.level.coreBonuses.nextIn', { n: 3 - (pilot.Level % 3) }) }}
        </span>
      </v-card-text>
    </v-card>
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import CoreBonusSelector from '../../_components/selectors/CoreBonusSelector.vue';

export default {
  name: 'CoreBonusPage',
  components: { StepperContent, CoreBonusSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    cbEligible: {
      type: Boolean,
    },
  },
};
</script>
