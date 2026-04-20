<template>
  <div class="text-center mr-6">
    <div class="border">
      <cc-img v-if="pilot.Portrait" :src="pilot.Portrait" max-width="100%" />
    </div>
    <cc-modal v-if="!pilot.IsRemote" :title="$t('pilotSheet.narrative.setPortraitTitle')" icon="cc:pilot" tabs>
      <template #activator="{ open }">
        <v-btn color="secondary" size="small" block variant="tonal" @click="open">
          <v-icon start>mdi-circle-edit-outline</v-icon>
          {{ $t('pilotSheet.narrative.setPortraitBtn') }}
        </v-btn>
      </template>
      <cc-image-selector ref="imageSelector" :item="pilot" type="pilot" avatar />
    </cc-modal>
  </div>
</template>

<script lang="ts">
import { Pilot } from '@/class';
export default {
  name: 'ImageBlock',
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
};
</script>
