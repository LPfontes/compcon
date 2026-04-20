<template>
  <stepper-content complete :exit="`/pilot/${pilot.ID}`" @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.level.overview.title') }}&emsp;</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.level.overview.subtitle') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotManagement.level.tabs.overview') }}
    </div>
    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotManagement.level.overview.description') }}
      <code>un_omni-18364.andes.cerrobonete.node:9</code>
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2">
      <p class="text-cc-overline">
        {{ $t('pilotManagement.level.overview.legalWarning') }}
      </p>
    </v-alert>
    <div class="flavor-text my-4">
      <v-row justify="center">
        <v-col class="text-center text-stark">
          {{ $t('pilotManagement.level.overview.eligibilityDetermined') }}&nbsp;
          <div
            class="text-accent stat-text d-inline-block"
            style="position: relative; top: 10px; line-height: 10px">
            {{ pilot.Name }}
            <cc-slashes class="text-primary" />
            "{{ pilot.Callsign }}"
            <div
              class="text-cc-overline text-text pt-1"
              style="font-size: 10px !important; letter-spacing: 1px !important; opacity: 0.5">
              {{ pilot.ID }}
            </div>
          </div>
          &nbsp;{{ $t('pilotManagement.level.overview.eligibleForUpdate') }}
        </v-col>
      </v-row>
    </div>

    <cc-panel color="primary" stark class="mx-auto" style="max-width: fit-content">
      <v-row dense>
        <v-col class="text-center" cols="12" md="auto">
          <div class="text-overline text-white">{{ $t('pilotManagement.level.overview.licenseLevel') }}</div>
          <v-avatar color="background" size="100" class="mx-auto">
            <div class="text-white heading h1 font-weight-black">{{ pilot.Level }}</div>
          </v-avatar>
        </v-col>
        <v-col cols="12" md="auto" class="flavor-text text-white px-4">
          <ul>
            <li>{{ $t('pilotManagement.level.overview.benefitSkillTrigger') }}</li>
            <li>{{ $t('pilotManagement.level.overview.benefitTalent') }}</li>
            <li>{{ $t('pilotManagement.level.overview.benefitMechSkill') }}</li>
            <li>{{ $t('pilotManagement.level.overview.benefitGrit') }}</li>
            <li>{{ $t('pilotManagement.level.overview.benefitLicense') }}</li>
            <li v-if="cbEligible" class="font-weight-bolder">{{ $t('pilotManagement.level.overview.benefitCoreBonus') }}</li>
            <li v-else class="text-disabled">{{ $t('pilotManagement.level.overview.benefitCoreBonusIneligible') }}</li>
          </ul>
        </v-col>
      </v-row>
    </cc-panel>
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'OverviewPage',
  components: { StepperContent },
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

<style scoped>
.offset {
  padding-left: 600px !important;
  margin-left: -600px !important;
}
</style>
