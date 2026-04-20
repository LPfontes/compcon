<template>
  <div class="my-3">
    <cc-modal title="Add Reserves and Bonuses" icon="cc:barrage" clip>
      <template #activator="{ open }">
        <section-header
          title="Reserves and Bonuses"
          label="Add Reserves and Bonuses"
          :editable="!pilot.IsRemote"
          @edit="open" />
      </template>
      <template #default="{ close }">
        <reserve-selector :pilot="pilot" @close="close" />
      </template>
    </cc-modal>

    <v-container>
      <no-data-block
        v-if="
          !pilot.ReservesController.Reserves.length &&
          !pilot.ReservesController.Organizations.length
        " />
      <v-row v-else>
        <v-col v-for="(r, i) in pilot.ReservesController.Reserves" :key="`reserve-${i}`" cols="12" md="6" lg="4">
          <cc-reserve-item :reserve="r" @remove="pilot.ReservesController.RemoveReserve(i)" />
        </v-col>
        <v-col v-for="(o, i) in pilot.ReservesController.Organizations" :key="`org-${i}`" cols="12" md="6" lg="4">
          <cc-org-item :org="o" @remove="pilot.ReservesController.RemoveOrganization(i)" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import ReserveSelector from '@/features/pilot_management/_components/selectors/ReserveSelector.vue';

export default {
  name: 'DtResourcesBlock',
  components: { SectionHeader, NoDataBlock, ReserveSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
