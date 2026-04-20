<template>
  <cc-compendium-browser :items="filteredFrames"
    item-type="Frame"
    :options="options"
    equippable
    @equip="select($event)">
    <template #header>
      <div class="heading h4 text-center text-accent">{{ $t('pilotSheet.hangar.selectFrameTitle') }}</div>
    </template>

    <template #top>
      <v-row justify="end">
        <v-col cols="auto">
          <cc-switch v-model="showAll"
            :label="$t('pilotSheet.hangar.showAllFrames')"
            color="error" />
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>

  <cc-solo-modal v-model="nameDialog"
    shrink
    :title="$t('pilotSheet.hangar.registerTitle')"
    icon="cc:frame">
    <v-row justify="center">
      <v-col cols="11"
        md="8">
        <span class="text-overline">{{ $t('pilotSheet.hangar.registerLabel') }}</span>
        <v-text-field v-model="mechName"
          variant="outlined"
          :label="$t('pilotSheet.hangar.nameLabel')"
          hide-details
          tile>
          <template #prepend>
            <v-tooltip :text="$t('pilotSheet.hangar.randomNameTooltip')"
              location="top">
              <template #activator="{ props }">
                <cc-button v-bind="props"
                  color="accent"
                  icon="mdi-dice-multiple"
                  variant="outlined"
                  @click="randomName()"></cc-button>
              </template>
            </v-tooltip>
          </template>
          <template #append>
            <v-icon v-if="!mechName"
              color="error">
              mdi-alert
            </v-icon>
            <v-icon v-else
              color="success">
              mdi-check-circle-outline
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <div class="py-4">
      <cc-button block
        color="accent"
        size="small"
        prepend-icon="cc:frame"
        append-icon="mdi-check"
        class="px-10"
        :disabled="!mechName"
        @click="addMech()">
        {{ $t('pilotSheet.hangar.registerBtn') }}
      </cc-button>
    </div>
  </cc-solo-modal>
</template>

<script lang="ts">
import * as _ from 'lodash-es'

import { CompendiumStore } from '@/stores'
import { Pilot, Frame, Mech, ItemType } from '@/class'
import { mechname } from '@/io/Generators'
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent'

export default {
  name: 'NewMechMenu',
  props: {
    pilot: { type: Pilot, required: true },
  },
  emits: ['close'],
  data: () => ({
    nameDialog: false,
    mechName: '',
    showAll: false,
    selectedFrame: null as any,
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'cards',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
    },
  }),
  computed: {
    headers() {
      return [
        { title: this.$t('pilotSheet.hangar.frameHeaders.manufacturer'), key: 'Source' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.name'), key: 'Name' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.size'), key: 'Size' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.armor'), key: 'Armor' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.hp'), key: 'HP' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.evasion'), key: 'Evasion' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.edef'), key: 'EDefense' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.heatcap'), key: 'HeatCap' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.repcap'), key: 'RepCap' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.sensors'), key: 'SensorRange' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.techatk'), key: 'TechAttack' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.save'), key: 'SaveTarget' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.speed'), key: 'Speed' },
        { title: this.$t('pilotSheet.hangar.frameHeaders.sp'), key: 'SP' },
      ];
    },
    allFrames() {
      if (!this.pilot.LcpConfig) return CompendiumStore().Frames
      return CompendiumStore().Frames.filter(
        x =>
          !x.InLcp ||
          this.pilot.LcpConfig?.packList.some(y => y.packID === x.Brew?.LcpId) ||
          this.pilot.LcpConfig?.packList.some(y => y.packName === x.Brew?.LcpName)
      )
    },
    filteredFrames() {
      if (this.showAll) return this.allFrames.filter(x => !x.IsHidden)

      return this.pilot.LicenseController.AllowedItems(ItemType.Frame)
    },
  },
  methods: {
    select(frame: Frame) {
      this.nameDialog = true
      this.selectedFrame = frame
    },
    async randomName() {
      this.mechName = await mechname()
    },
    addMech() {
      const newMech = new Mech(this.selectedFrame, this.pilot)
      newMech.Name = this.mechName
      this.pilot.AddMech(newMech)
      AchievementEventSystem.emit('add_mech')
      this.mechName = ''
      this.selectedFrame = null
      this.showAll = false
      this.nameDialog = false
      this.$emit('close')
    },
  },
}
</script>
