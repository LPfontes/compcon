<template>
  <v-progress-linear v-if="!metadata"
    indeterminate
    color="accent" />
  <v-card v-else
    flat
    border
    tile
    class="mb-4">
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          :text="$t('cloud.sync.title')"
          :tooltip="$t('cloud.sync.titleTooltip')" />
      </v-toolbar-title>
    </v-toolbar>

    <div class="px-6">
      <v-row align="center"
        justify="space-around"
        class="mt-1">
        <v-col cols="12"
          md="6">
          <cc-select v-model="settings.frequency"
            :label="$t('cloud.sync.frequency')"
            :items="syncOptions"
            :tooltip="$t('cloud.sync.frequencyTooltip')" />
        </v-col>
        <v-col cols="12"
          md="6">
          <cc-select v-model="settings.includeSettings"
            :label="$t('cloud.sync.syncUserSettings')"
            :tooltip="$t('cloud.sync.syncUserSettingsTooltip')"
            :items="[
              { title: 'On', value: true },
              { title: 'Off', value: false },
            ]" />
        </v-col>
        <v-col cols="12"
          md="6">
          <cc-select v-model="settings.includeShared"
            :label="$t('cloud.sync.syncSharedItems')"
            :tooltip="$t('cloud.sync.syncSharedItemsTooltip')"
            :items="[
              { title: 'On', value: true },
              { title: 'Off', value: false },
            ]" />
        </v-col>
        <v-col cols="12"
          md="6">
          <cc-select v-model="settings.resolutionStrategy"
            :label="$t('cloud.sync.resolutionStrategy')"
            :tooltip="$t('cloud.sync.resolutionStrategyTooltip')"
            :items="resolutionOptions" />
        </v-col>
        <v-col cols="12">
          <cc-select v-model="settings.itemTypes"
            multiple
            clearable
            chip-variant="tonal"
            :label="$t('cloud.sync.syncItems')"
            :tooltip="$t('cloud.sync.syncItemsTooltip')"
            :items="syncItems" />
        </v-col>
      </v-row>
      <v-fade-transition>
        <div v-if="settingsDirty"
          class="text-right mt-2">
          <cc-button prepend-icon="mdi-cog-sync"
            color="primary"
            size="small"
            :loading="loadingSync"
            @click="updateSyncSettings">
            {{ $t('cloud.sync.updateSettings') }}
          </cc-button>
        </div>
      </v-fade-transition>
    </div>

    <cc-button block
      color="primary"
      class="my-4 mx-6"
      :loading="syncing"
      :disabled="!itemsPendingSync || cloudStorageFull"
      prepend-icon="mdi-sync"
      @click="runSync()">
      {{ $t('cloud.sync.syncWithCurrent') }}
      <template #info>
        <span class="text-cc-overline">{{ itemsPendingSync }} {{ $t('cloud.sync.items') }}</span>
      </template>
      <template v-if="cloudStorageFull"
        #subtitle>
        <span class="text-cc-overline">{{ $t('cloud.sync.storageFull') }}</span>
      </template>
      <template #options>
        <v-list max-width="500"
          lines="two"
          border>
          <div class="px-2 pb-2">
            <div class="heading">{{ $t('cloud.sync.overrides') }}</div>
            <div class="text-caption text-accent">
              {{ $t('cloud.sync.overridesTooltip') }}
            </div>
          </div>
          <v-divider />
          <v-list-item :title="$t('cloud.sync.forceNewest')"
            :subtitle="$t('cloud.sync.forceNewestSubtitle')"
            @click="runSync('newest')" />
          <v-list-item :title="$t('cloud.sync.forceLocal')"
            :subtitle="$t('cloud.sync.forceLocalSubtitle')"
            @click="runSync('local')" />
          <v-list-item :title="$t('cloud.sync.forceCloud')"
            :subtitle="$t('cloud.sync.forceCloudSubtitle')"
            @click="runSync('cloud')" />
          <v-divider />
          <v-list-item :title="$t('cloud.sync.removeDeleted')"
            :subtitle="$t('cloud.sync.removeDeletedSubtitle')"
            @click="permDeleteSync()" />
        </v-list>
      </template>
    </cc-button>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores'

export default {
  name: 'SyncSettings',
  data: () => ({
    settingsDirty: false,
    loadingSync: false,
    syncing: false,
    selectedItems: [] as string[],
  }),
  computed: {
    metadata() {
      return UserStore().UserMetadata
    },
    settings() {
      return UserStore().UserMetadata.SyncSettings
    },
    itemsPendingSync() {
      const userItems = UserStore().AllItemsToSync.length
      const remoteItems = UserStore().AllRemoteItemsToSync.length
      if (!UserStore().SyncSettings.includeShared) return userItems
      return userItems + remoteItems
    },
    cloudStorageFull() {
      return UserStore().CloudStorageFull
    },
    patreonTier() {
      return UserStore().User.PatreonTierValue
    },
    syncOptions() {
      return [
        {
          title: this.$t('cloud.sync.options.manual'),
          value: 'manual',
          subtitle: this.$t('cloud.sync.options.manualSub'),
        },
        {
          title: this.$t('cloud.sync.options.start'),
          value: 'start',
          subtitle: this.$t('cloud.sync.options.startSub'),
        },
        {
          title: this.$t('cloud.sync.options.close'),
          value: 'close',
          disabled: this.patreonTier < 1,
          subtitle: this.$t('cloud.sync.options.closeSub'),
        },
        {
          title: this.$t('cloud.sync.options.startClose'),
          value: 'startAndClose',
          disabled: this.patreonTier < 1,
          subtitle: this.$t('cloud.sync.options.startCloseSub'),
        },
        {
          title: this.$t('cloud.sync.options.everyHour'),
          value: 'start_minutes_60',
          disabled: this.patreonTier < 2,
          subtitle: this.$t('cloud.sync.options.everyHourSub'),
        },
        {
          title: this.$t('cloud.sync.options.every30'),
          value: 'start_minutes_30',
          disabled: this.patreonTier < 2,
          subtitle: this.$t('cloud.sync.options.every30Sub'),
        },
        {
          title: this.$t('cloud.sync.options.every10'),
          value: 'start_minutes_10',
          disabled: this.patreonTier < 3,
          subtitle: this.$t('cloud.sync.options.every10Sub'),
        },
        {
          title: this.$t('cloud.sync.options.every5'),
          value: 'start_minutes_5',
          disabled: this.patreonTier < 3,
          subtitle: this.$t('cloud.sync.options.every5Sub'),
        },
      ]
    },
    syncItems() {
      return [
        { title: this.$t('cloud.sync.options.pilotData'), value: 'pilot' },
        { title: this.$t('cloud.sync.options.pilotGroups'), value: 'pilotgroup' },
        { title: this.$t('cloud.sync.options.npcData'), value: 'npc' },
        { title: this.$t('cloud.sync.options.campaignData'), value: 'campaign' },
        { title: this.$t('cloud.sync.options.encounterData'), value: 'encounter' },
        { title: this.$t('cloud.sync.options.narrativeData'), value: 'collectionitem' },
      ]
    },
    resolutionOptions() {
      return [
        { title: this.$t('cloud.sync.options.keepNewest'), value: 'newest' },
        { title: this.$t('cloud.sync.options.localWins'), value: 'local' },
        { title: this.$t('cloud.sync.options.cloudWins'), value: 'cloud' },
        { title: this.$t('cloud.sync.options.manualRes'), value: 'manual' },
      ]
    },
    deletionOptions() {
      const arr = [
        { title: this.$t('cloud.sync.options.none'), value: '0' },
        { title: this.$t('cloud.sync.options.days7'), value: '7' },
        { title: this.$t('cloud.sync.options.days30'), value: '30' },
        { title: this.$t('cloud.sync.options.days90'), value: '90' },
        { title: this.$t('cloud.sync.options.year1'), value: '365' },
      ]
      if (this.patreonTier > 1) arr.push({ title: this.$t('cloud.sync.options.forever'), value: '-1' })
      return arr
    },
  },
  watch: {
    settings: {
      handler() {
        this.settingsDirty = true
      },
      deep: true,
    },
  },
  methods: {
    async updateSyncSettings() {
      this.loadingSync = true
      await UserStore().setUserMetadata()
      UserStore().setSyncTimer()
      this.settingsDirty = false
      this.loadingSync = false
    },
    async runSync(override?: 'cloud' | 'local' | 'newest') {
      const total = UserStore().AllItemsToSync.length
      this.syncing = true
      const failures = await UserStore().AutoSync(override)
      this.settingsDirty = false
      this.syncing = false

      if (failures.length) {
        this.$notify({
          title: this.$t('cloud.sync.notify.partialSync', { count: total - failures.length, total }) as string,
          text: this.$t('cloud.sync.notify.failedSync', { count: failures.length }) as string,
          type: 'error',
        })
      } else {
        this.$notify({
          title: this.$t('cloud.sync.notify.fullSync', { total }) as string,
          text: this.$t('cloud.sync.notify.syncSuccess') as string,
          type: 'success',
        })
      }
    },
    async permDeleteSync() {
      this.syncing = true
      try {
        const count = await UserStore().permDeleteFlaggedItems()
        this.$notify({
          title: this.$t('cloud.sync.notify.deletedCount', { count: count, s: count !== 1 ? 's' : '' }) as string,
          text: count > 0 ? (this.$t('cloud.sync.notify.deletedSuccess') as string) : (this.$t('cloud.sync.notify.noItemsToDelete') as string),
          type: count > 0 ? 'success' : 'info',
        })
      } catch (e) {
        this.$notify({
          title: this.$t('cloud.sync.notify.deletionFailed') as string,
          text: this.$t('cloud.sync.notify.deletionError') as string,
          type: 'error',
        })
      } finally {
        this.syncing = false
      }
    }
  },
}
</script>
