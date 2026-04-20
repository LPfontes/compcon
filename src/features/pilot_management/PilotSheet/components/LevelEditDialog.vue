<template>
  <v-card-text class="py-2 px-0">
    <cc-alert v-if="!pilot.IsLevelEdit" icon="mdi-alert" :title="$t('pilotSheet.levelEdit.warning')" color="warning">
      {{ $t('pilotSheet.levelEdit.warningText') }}
    </cc-alert>

    <cc-alert v-else icon="mdi-alert" :title="$t('pilotSheet.levelEdit.alert')" color="error">
      {{ $t('pilotSheet.levelEdit.alertText') }}
    </cc-alert>

    <v-card class="mt-2 pa-2 flavor-text" flat tile>
      {{ $t('pilotSheet.levelEdit.intro') }}
    </v-card>

    <v-row dense justify="space-around" align="center" class="text-center mt-2">
      <v-col cols="auto">
        <div class="text-cc-overline">{{ $t('pilotSheet.levelEdit.currentLevel') }}</div>
        <div class="heading h1" style="line-height: 42px">
          {{ pilot.Level }}
        </div>
      </v-col>

      <v-col cols="auto">
        <v-icon size="x-large">mdi-arrow-right</v-icon>
      </v-col>

      <v-col cols="auto">
        <div class="text-cc-overline mb-2">{{ $t('pilotSheet.levelEdit.newLevel') }}</div>
        <cc-select v-model.number="newLevel" :items="levels" type="number" color="primary" />
      </v-col>
    </v-row>

    <cc-button
      block
      color="primary"
      prepend-icon="cc:pilot"
      class="mt-6"
      :disabled="newLevel === pilot.Level"
      @click="setLevel">
      {{ $t('pilotSheet.levelEdit.setBtn') }}
    </cc-button>
  </v-card-text>
</template>

<script lang="ts">
import { Rules } from '@/class';

export default {
  name: 'LevelEditDialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  data: () => ({
    alert: true,
    newLevel: 0,
    levels: Array.from(Array(Rules.MaxPilotLevel + 1).keys()),
  }),
  mounted() {
    this.newLevel = this.pilot.Level;
  },
  methods: {
    setLevel() {
      this.pilot.Level = (this.newLevel as number) || 0;
      this.pilot.IsLevelEdit = true;
      this.$emit('close');
    },
  },
};
</script>
