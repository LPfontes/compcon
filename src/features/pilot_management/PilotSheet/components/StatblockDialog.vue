<template>
  <v-card-text>
    <v-row :class="mobile && 'pt-2'"
      class="mb-4"
      align="center">
      <v-col cols="12"
        md="">
        <cc-select v-model="genRadios"
          :items="genItems"
          :label="$t('pilotSheet.statblock.generateLabel')" />
      </v-col>
      <v-col cols="auto">
        <cc-switch v-model="discordEmoji"
          on-icon="mdi-check"
          off-icon="mdi-cancel" />
      </v-col>
      <v-col cols="auto">
        <div>
          {{ $t('pilotSheet.statblock.emojiLabel') }}
          <div class="text-caption"
            style="line-height: 8px">
            {{ $t('pilotSheet.statblock.emojiCaption') }}
          </div>
        </div>
      </v-col>
    </v-row>

    <v-expand-transition>
      <cc-select v-if="genRadios != 'pilotBuild'"
        v-model="selected_mech"
        :items="pilot.Mechs"
        placeholder="N/A"
        density="compact"
        item-title="Name"
        item-value="ID"
        :label="$t('pilotSheet.statblock.selectMechLabel')"
        variant="outlined"
        class="mb-4"
        hide-details />
    </v-expand-transition>

    <v-textarea :value="statblock"
      auto-grow
      readonly
      hide-details
      :rows="mobile ? 14 : 24"
      variant="solo-filled"
      class="flavor-text" />
    <v-tooltip :text="$t('pilotSheet.statblock.copyTooltip')">
      <template #activator="{ props }">
        <cc-button v-bind="props"
          prepend-icon="mdi-clipboard-text-outline"
          color="primary"
          block
          @click="copy()">
          {{ $t('pilotSheet.statblock.copyBtn') }}
        </cc-button>
      </template>
    </v-tooltip>
  </v-card-text>
</template>

<script lang="ts">
import { Mech, Pilot, Statblock } from '@/class';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'StatblockDialog',
  mixins: [useMobile],
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    mechID: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    selected_mech: null as any,
    discordEmoji: false,
    genRadios: 'full',
  }),
  computed: {
    genItems() {
      return [
        { title: this.$t('pilotSheet.statblock.optFull'), value: 'full' },
        { title: this.$t('pilotSheet.statblock.optPilotOnly'), value: 'pilotBuild' },
        { title: this.$t('pilotSheet.statblock.optMechOnly'), value: 'mechBuild' },
      ];
    },
    defaultMechID() {
      if (this.$route.name === 'mech-sheet') {
        return this.mechID;
      } else return this.pilot.Mechs[this.pilot.Mechs.length - 1]?.ID;
    },
    mechSelect() {
      return this.selected_mech ?? this.defaultMechID;
    },
    mech() {
      return this.mechSelect ? this.pilot.Mechs.find((x) => x.ID === this.mechSelect) : null;
    },
    statblock() {
      if (this.genRadios != 'mechBuild') {
        return Statblock.Generate(this.pilot, this.mech as Mech, this.discordEmoji, this.genRadios);
      } else
        return Statblock.GenerateBuildSummary(this.pilot, this.mech as Mech, this.discordEmoji);
    },
  },

  watch: {
    mechSelect() {
      this.selected_mech = this.mechSelect;
    },
  },
  created() {
    if (this.defaultMechID === null) {
      this.genRadios = 'pilotBuild';
    }
    this.selected_mech = this.defaultMechID;
  },
  methods: {
    clearSelected() {
      this.selected_mech = null;
    },
    show() {
      (this.$refs.dialog as any).show();
    },
    hide() {
      (this.$refs.dialog as any).hide();
    },
    copy() {
      navigator.clipboard
        .writeText(this.statblock)
        .then(() =>
          this.$notify({
            title: this.$t('pilotSheet.statblock.copySuccessTitle'),
            text: this.$t('pilotSheet.statblock.copySuccessText'),
            data: { icon: 'mdi-clipboard-text-outline' },
          })
        )
        .catch(() =>
          this.$notify({
            title: this.$t('pilotSheet.statblock.copyErrorTitle'),
            text: this.$t('pilotSheet.statblock.copyErrorText'),
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    },
  },
};
</script>
