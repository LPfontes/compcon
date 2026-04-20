<template>
  <div class="mb-4">
    <section-header :title="$t('pilotSheet.tactical.talentsTitle')">
      <cc-modal v-if="!pilot.IsRemote" :title="$t('pilotSheet.tactical.setTalents')" icon="cc:trait">
        <template #activator="{ open }">
          <section-edit-chip
            v-if="!pilot.IsRemote"
            :highlight="!pilot.TalentsController.HasFullTalents"
            :current="pilot.TalentsController.CurrentTalentPoints"
            :max="pilot.TalentsController.MaxTalentPoints"
            :label="$t('pilotSheet.tactical.editTalents', { current: pilot.TalentsController.CurrentTalentPoints, max: pilot.TalentsController.MaxTalentPoints })"
            @open-selector="open" />
        </template>
        <talent-selector :pilot="pilot" />
      </cc-modal>
    </section-header>

    <v-container class="px-0">
      <no-data-block v-if="!pilot.TalentsController.Talents.length" />
      <cc-talent
        v-for="t in pilot.TalentsController.Talents"
        :key="t.Talent.ID"
        hide-locked
        :talent="t.Talent"
        :rank="t.Rank"
        :terse="view === 'terse'"
        :small="view === 'small'"
        in-column
        hide-change />
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import TalentSelector from '@/features/pilot_management/_components/selectors/TalentSelector.vue';
import { Pilot } from '@/class';

import { UserStore } from '@/stores';

export default {
  name: 'SkillBlock',
  components: { SectionHeader, SectionEditChip, NoDataBlock, TalentSelector },
  props: {
    pilot: {
      type: Object as () => Pilot,
      required: true,
    },
  },
  data: () => ({
    view: 'full',
  }),
};
</script>
