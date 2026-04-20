<template>
  <cc-tabs ref="tabs"
    fixed>
    <template #tabs>
      <v-tab>
        <v-icon v-if="step > 1"
          start
          icon="mdi-check" />
        {{ $t('pilotManagement.level.tabs.overview') }}
      </v-tab>
      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.SkillsController.HasFullSkills"
          start
          icon="mdi-check" />
        {{ $t('pilotManagement.level.tabs.skills') }}
      </v-tab>
      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.TalentsController.HasFullTalents"
          start
          icon="mdi-check" />
        {{ $t('pilotManagement.level.tabs.talents') }}
      </v-tab>
      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.MechSkillsController.HasFullHASE"
          start
          icon="mdi-check" />
        {{ $t('pilotManagement.level.tabs.mechSkills') }}
      </v-tab>
      <v-divider />

      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.LicenseController.HasLicenses"
          start
          icon="mdi-check" />
        {{ $t('pilotManagement.level.tabs.licenses') }}
      </v-tab>
      <v-divider />

      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.CoreBonusController.HasCBs"
          start
          icon="mdi-check" />
        {{ $t('pilotManagement.level.tabs.coreBonuses') }}
      </v-tab>
      <v-divider />
      <v-tab>{{ $t('pilotManagement.level.tabs.confirm') }}</v-tab>
    </template>
    <v-container>
      <template #default>
        <v-window-item>
          <overview-page :pilot="pilot"
            :cb-eligible="cbEligible"
            @next="setStep(1)" />
        </v-window-item>
        <v-window-item>
          <skills-page :pilot="pilot"
            @next="setStep(2)"
            @back="setStep(0)" />
        </v-window-item>
        <v-window-item>
          <talents-page :pilot="pilot"
            @next="setStep(3)"
            @back="setStep(1)" />
        </v-window-item>
        <v-window-item>
          <mech-skills-page :pilot="pilot"
            @next="setStep(4)"
            @back="setStep(2)" />
        </v-window-item>
        <v-window-item>
          <license-page :pilot="pilot"
            @next="setStep(5)"
            @back="setStep(3)" />
        </v-window-item>
        <v-window-item>
          <core-bonus-page :pilot="pilot"
            :cb-eligible="cbEligible"
            @next="setStep(6)"
            @back="setStep(4)" />
        </v-window-item>
        <v-window-item>
          <confirm-page :pilot="pilot"
            :original="currentPilot"
            @back="setStep(5)" />
        </v-window-item>
      </template>
    </v-container>
  </cc-tabs>
</template>

<script lang="ts">
import OverviewPage from './pages/OverviewPage.vue';
import SkillsPage from './pages/SkillsPage.vue';
import TalentsPage from './pages/TalentsPage.vue';
import MechSkillsPage from './pages/MechSkillsPage.vue';
import LicensePage from './pages/LicensePage.vue';
import CoreBonusPage from './pages/CoreBonusPage.vue';
import ConfirmPage from './pages/ConfirmPage.vue';

import { PilotStore } from '@/stores';
import { Pilot } from '@/class';

export default {
  name: 'LevelWizard',
  components: {
    OverviewPage,
    SkillsPage,
    TalentsPage,
    MechSkillsPage,
    LicensePage,
    CoreBonusPage,
    ConfirmPage,
  },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    step: 1,
    pilot: {} as Pilot,
    cbEligible: false,
  }),
  computed: {
    currentPilot(): Pilot {
      return PilotStore().Pilots.find((p) => p.ID === this.$route.params.pilotID) as Pilot;
    },
  },
  watch: {
    step() {
      window.scrollTo(0, 0);
    },
  },
  created() {
    this.pilot = Pilot.Deserialize(Pilot.Serialize(this.currentPilot));
    this.pilot.Level++;
    this.cbEligible = this.pilot.CoreBonusController.IsMissingCBs;
  },
  methods: {
    setTab(tab: number) {
      this.step = tab;
    },
    setStep(step: number) {
      this.step = step;
      (this.$refs as any).tabs.setTab(step);
    },
  },
};
</script>
