<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotRegistration.wizard.skills.title') }}</cc-title>

    <div class="heading h2">
      {{ $t('pilotRegistration.identService') }}
      <cc-slashes />
      {{ $t('pilotRegistration.wizard.skills.subtitle') }}
    </div>

    <p class="flavor-text" style="font-size: 14px">
      {{ $t('pilotRegistration.wizard.skills.description') }}
      <br />
      <b>{{ $t('pilotRegistration.wizard.skills.nb') }}</b>
      {{ $t('pilotRegistration.wizard.skills.nbDescription') }}
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">{{ $t('pilotRegistration.wizard.skills.selectCount', { word, count }) }}</div>
        {{ $t('pilotRegistration.truthAttestation') }}
    </v-alert>
    <v-scroll-y-reverse-transition>
      <cc-alert
        v-if="pilot.Background && !pilot.SkillsController.HasFullSkills"
        class="my-2"
        icon="mdi-orbit"
        :title="$t('pilotRegistration.wizard.skills.suggestionsAvailable')">
        <p class="text-cc-overline text-disabled">
          {{ $t('pilotRegistration.wizard.skills.suggestionsDescription') }}
        </p>
        <div class="mx-3 mt-2">
          <cc-button
            size="small"
            :color="suggestedSet ? 'success' : 'accent'"
            block
            prepend-icon="mdi-auto-mode"
            :append-icon="suggestedSet ? 'mdi-check' : undefined"
            @click="setSuggestedSkills()">
            {{ suggestedSet ? $t('pilotRegistration.wizard.skills.suggestionsAdded') : $t('pilotRegistration.wizard.skills.addSuggestions') }}
          </cc-button>
        </div>
      </cc-alert>
    </v-scroll-y-reverse-transition>
    <skill-selector flat :pilot="<Pilot>pilot" @reset="reset" />
  </stepper-content>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import StepperContent from '../../_components/StepperContent.vue';
import SkillSelector from '../../_components/selectors/SkillSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'SkillsPage',
  components: {
    StepperContent,
    SkillSelector,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    suggestedSet: false,
  }),
  computed: {
    canContinue(): boolean {
      return !this.pilot.SkillsController.IsMissingSkills;
    },
    count(): number {
      return this.pilot.SkillsController.MaxSkillPoints;
    },
    word(): string {
      const words = this.$t('pilotRegistration.wizard.skills.words');
      return words[this.count];
    },
  },
  methods: {
    setSuggestedSkills() {
      const bgItem = CompendiumStore().Backgrounds.find(
        (b) => b.Name.toLowerCase() === this.pilot.Background.toLowerCase()
      );
      if (!bgItem || !bgItem.SuggestedSkills?.length) return;

      if (this.suggestedSet) {
        bgItem.SuggestedSkills.forEach((skill) => {
          this.pilot.SkillsController.RemoveSkill(skill);
        });
        this.suggestedSet = false;
        return;
      }

      this.pilot.SkillsController.ClearSkills();
      bgItem.SuggestedSkills.forEach((skill) => {
        this.pilot.SkillsController.AddSkill(skill);
      });
      this.suggestedSet = true;
    },
    reset() {
      this.suggestedSet = false;
    },
  },
};
</script>
