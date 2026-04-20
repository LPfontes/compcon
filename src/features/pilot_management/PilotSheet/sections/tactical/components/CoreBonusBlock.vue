<template>
  <div>
    <section-header :title="$t('pilotSheet.tactical.coreBonusesTitle')">
      <cc-modal :title="$t('pilotSheet.tactical.setCoreBonuses')" icon="cc:corebonus">
        <template #activator="{ open }">
          <section-edit-chip
            v-if="!pilot.IsRemote"
            :highlight="!pilot.CoreBonusController.HasCBs"
            :current="pilot.CoreBonusController.CurrentCBPoints"
            :max="pilot.CoreBonusController.MaxCBPoints"
            :label="$t('pilotSheet.tactical.editCoreBonuses', { current: pilot.CoreBonusController.CurrentCBPoints, max: pilot.CoreBonusController.MaxCBPoints })"
            @open-selector="open" />
        </template>
        <core-bonus-selector :pilot="pilot" />
      </cc-modal>
    </section-header>

    <v-container class="px-0">
      <no-data-block v-if="!pilot.CoreBonusController.CoreBonuses.length" />

      <cc-core-bonus-item
        v-for="item in pilot.CoreBonusController.CoreBonuses"
        :key="item.ID"
        :bonus="item"
        terse />
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import CoreBonusSelector from '@/features/pilot_management/_components/selectors/CoreBonusSelector.vue';

export default {
  name: 'SkillBlock',
  components: { SectionHeader, NoDataBlock, SectionEditChip, CoreBonusSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
  },
};
</script>
