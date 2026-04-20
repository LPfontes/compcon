<template>
  <v-card flat
    border
    tile>
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          :text="$t('cloud.dataViewer.title')"
          :tooltip="$t('cloud.dataViewer.titleTooltip')" />
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <div v-bind="props"
            class="mx-2">
            <cc-button v-bind="props"
              variant="tonal"
              :size="mobile ? 'small' : ''"
              :loading="loading"
              icon="mdi-refresh"
              @click="refresh()" />
          </div>
        </template>
        <div class="text-center">
          {{ $t('cloud.dataViewer.reloadData') }}
          <br />
          {{ $t('cloud.dataViewer.noSync') }}
        </div>
      </v-tooltip>
      <template #extension>
        <cc-text-field v-if="!mobile"
          v-model="search"
          variant="outlined"
          color="primary"
          icon="mdi-magnify"
          :placeholder="$t('cloud.dataViewer.search')"
          width="350px"
          clearable />
        <v-spacer />
        <v-tabs v-model="tab">
          <v-tab>
            <v-tooltip max-width="300px"
              location="top">
              <template #activator="{ props }">
                <span v-bind="props">{{ $t('cloud.dataViewer.tabs.data') }}</span>
              </template>
              <div class="text-center">{{ $t('cloud.dataViewer.tabs.dataTooltip') }}</div>
            </v-tooltip>
          </v-tab>
          <v-divider vertical />
          <v-tab>
            <v-tooltip max-width="300px"
              location="top">
              <template #activator="{ props }">
                <span v-bind="props">{{ $t('cloud.dataViewer.tabs.images') }}</span>
              </template>
              <div class="text-center">
                {{ $t('cloud.dataViewer.tabs.imagesTooltip') }}
              </div>
            </v-tooltip>
          </v-tab>
          <v-divider vertical />
          <v-tab>
            <v-tooltip max-width="300px"
              location="top">
              <template #activator="{ props }">
                <span v-bind="props">{{ $t('cloud.dataViewer.tabs.remote') }}</span>
              </template>
              <div class="text-center">
                {{ $t('cloud.dataViewer.tabs.remoteTooltip') }}
              </div>
            </v-tooltip>
          </v-tab>
          <v-divider vertical />
          <v-tab>
            <v-tooltip max-width="300px"
              location="top">
              <template #activator="{ props }">
                <span v-bind="props">{{ $t('cloud.dataViewer.tabs.campaigns') }}</span>
              </template>
              <div class="text-center">{{ $t('cloud.dataViewer.tabs.campaignsTooltip') }}</div>
            </v-tooltip>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-text-field v-if="mobile"
      v-model="search"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      :label="$t('cloud.dataViewer.search')"
      single-line
      density="compact"
      class="mx-1"
      clearable
      hide-details />
    <v-window v-model="tab">
      <v-window-item :value="0">
        <item-data-tab :search="search"
          :loading="loading"
          @refresh="refresh" />
      </v-window-item>
      <v-window-item :value="1">
        <image-data-tab :search="search"
          :loading="loading"
          @refresh="refresh" />
      </v-window-item>
      <v-window-item :value="2">
        <remote-data-tab :search="search"
          :loading="loading"
          @refresh="refresh" />
      </v-window-item>
      <v-window-item :value="3">
        <cc-alert color="secondary"
          class="ma-4"
          dense>
          {{ $t('cloud.dataViewer.campaignsAlert') }}
          <cc-button size="x-small"
            class="mx-1"
            to="/srd?tab=2">
            {{ $t('cloud.dataViewer.campaignLibrary') }}
          </cc-button>
        </cc-alert>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores'
import ItemDataTab from './data_viewer/ItemDataTab.vue'
import RemoteDataTab from './data_viewer/RemoteDataTab.vue'
import ImageDataTab from './data_viewer/ImageDataTab.vue'

export default {
  name: 'CloudDataViewer',
  components: {
    ItemDataTab,
    RemoteDataTab,
    ImageDataTab,
  },
  data: () => ({
    tab: 'Data',
    search: '',
    loading: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown
    },
  },
  async mounted() {
    if (UserStore().IsLoggedIn) {
      await this.refresh()
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      await UserStore().refreshDbData()
      this.loading = false
    },
  },
}
</script>

<style>
.v-data-table-header__content {
  font-weight: bold !important;
}
</style>
