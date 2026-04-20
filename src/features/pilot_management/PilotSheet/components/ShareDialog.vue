<template>
  <v-card-text :class="mobile && 'px-0'">
    <cc-alert prominent density="compact" icon="mdi-alert">
      {{ $t('pilotSheet.share.intro') }}
    </cc-alert>
    <div v-if="pilot.CloudController.ShareCode" :class="mobile && 'text-center'">
      <v-row justify="center">
        <v-col cols="auto">
          <div class="text-cc-overline mt-4">
            {{ $t('pilotSheet.share.codeLabel') }}
            <v-tooltip>
              <template #activator="{ props }">
                <v-icon v-bind="props" icon="mdi-information-slab-box-outline" size="x-large" />
              </template>
              <div>
                {{ $t('pilotSheet.share.codeTooltip') }}
              </div>
            </v-tooltip>
          </div>
          <b
            class="text-accent"
            style="font-size: calc(30px + 2vw)"
            v-text="
              `${pilot.CloudController.ShareCode.slice(0, 4)}-${pilot.CloudController.ShareCode.slice(4, 8)}-${pilot.CloudController.ShareCode.slice(8, 12)}`
            " />
          <v-tooltip :text="$t('pilotSheet.share.copyCodeTooltip')">
            <template #activator="{ props }">
              <v-icon v-bind="props" @click.stop="copy()">mdi-clipboard-text-outline</v-icon>
            </template>
          </v-tooltip>
          <fieldset class="px-2 pb-2">
            <legend class="text-cc-overline mt-4 mx-3 px-2">
              {{ $t('pilotSheet.share.linkTitle') }}
              <v-tooltip>
                <template #activator="{ props }">
                  <v-icon v-bind="props" icon="mdi-information-slab-box-outline" size="x-large" />
                </template>
                <i18n-t keypath="pilotSheet.share.linkTooltip" tag="div">
                  <template #boldText>
                    <b class="text-accent">{{ $t('pilotSheet.share.linkTooltipBold') }}</b>
                  </template>
                </i18n-t>
              </v-tooltip>
            </legend>
            <v-row no-gutters align="end">
              <v-col>
                <v-text-field
                  v-model="shareLink"
                  readonly
                  flat
                  tile
                  density="compact"
                  hide-details
                  class="my-1"
                  style="font-size: calc(16px + 0.5vw)"
                  @click="copyShareLink()" />
              </v-col>
              <v-col cols="auto">
                <v-tooltip :text="$t('pilotSheet.share.copyLinkTooltip')">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" @click.stop="copyShareLink()">
                      mdi-clipboard-text-outline
                    </v-icon>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row dense align="center">
              <v-col>
                <div class="text-cc-overline">{{ $t('pilotSheet.share.styleLabel') }}</div>
                <cc-select
                  v-model="linkStyle"
                  density="compact"
                  hide-details
                  chip-variant="text"
                  :items="[
                    { title: $t('pilotSheet.share.optFull'), value: 'full' },
                    { title: $t('pilotSheet.share.optBuildOnly'), value: 'build' },
                  ]" />
              </v-col>
              <v-col>
                <div class="text-cc-overline">{{ $t('pilotSheet.share.includeMechLabel') }}</div>

                <cc-select
                  v-model="shareMech"
                  density="compact"
                  chip-variant="text"
                  :items="mechOptions" />
              </v-col>
            </v-row>
          </fieldset>
        </v-col>
      </v-row>
    </div>
    <v-alert v-else prominent color="warning" tile class="mt-4 text-center">
      {{ $t('pilotSheet.share.noCode') }}
    </v-alert>
  </v-card-text>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile';
export default {
  name: 'ShareDialog',
  mixins: [useMobile],
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    linkStyle: 'full',
    shareMech: '',
  }),
  computed: {
    shareLink() {
      return `https://dev.compcon.app/link/pilot/${this.pilot.CloudController.ShareCode}/${this.linkStyle}/${this.shareMech}`;
    },
    mechOptions() {
      const arr = [{ title: this.$t('pilotSheet.share.optNone'), value: '' }];
      arr.push(
        ...this.pilot.Mechs.map((m) => ({
          title: `${m.Name} (${m.Frame.Source} ${m.Frame.Name})`,
          value: m.ID,
        }))
      );
      return arr;
    },
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.pilot.CloudController.ShareCode);
    },
    copyShareLink() {
      navigator.clipboard.writeText(this.shareLink);
    },
  },
};
</script>
