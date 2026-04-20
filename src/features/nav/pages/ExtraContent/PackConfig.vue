<template>
  <v-card-text :style="mobile ? 'margin-top: 14px' : 'margin-top: 16px'">
    <div class="heading h2">{{ $t('contentManager.config.title') }}</div>
    <cc-alert class="mt-4 bg-panel pr-12 mb-4"
      color="info"
      prominent
      variant="text">
      <p class="text-text">
        {{ $t('contentManager.config.info') }}
      </p>

      <p class="text-text mt-2">
        {{ $t('contentManager.config.applyInfo') }}
      </p>
    </cc-alert>

    <div v-if="!user.LcpConfigs.length"
      class="text-disabled text-center">
      <i>{{ $t('contentManager.config.noConfigs') }}</i>
    </div>
    <v-card v-for="(config, index) in user.LcpConfigs"
      v-else
      :key="config.id"
      flat
      tile
      border
      max-width="800px"
      class="mb-2 mx-auto">
      <v-card-text v-if="editingIndex === index">
        <v-row dense>
          <v-col cols="auto">
            <v-icon icon="mdi-list-status"
              size="40" />
          </v-col>
          <v-col>
            <v-text-field v-model="config.name"
              color="primary"
              density="compact"
              hide-details
              class="mb-4"
              @change="debouncedSave(config)" />
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top"
              :text="$t('contentManager.config.deleteConfig')">
              <template #activator="{ props }">
                <v-btn color="error"
                  size="40"
                  icon
                  flat
                  tile
                  v-bind="props"
                  @click="removeConfig(config.id)">
                  <v-icon icon="mdi-delete" />
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>

        <div class="text-text text-cc-overline">{{ $t('contentManager.config.lcpsInConfig') }}</div>

        <v-card v-if="!config.packList.length"
          flat
          tile
          color="background"
          class="text-center pa-4">
          <i18n-t keypath="contentManager.config.noLcps" tag="i">
            <template #lancer>
              <b class="text-accent">{{ $t('contentManager.config.lancerCore') }}</b>
            </template>
          </i18n-t>
        </v-card>

        <div v-else
          class="mx-4 mt-4 mb-8">
          <v-row v-for="lcp in config.packList"
            :key="lcp.packID"
            class="bg-panel">
            <v-col cols="auto">
              <v-avatar color="primary"
                size="30">
                <v-icon icon="cc:campaign" />
              </v-avatar>
            </v-col>
            <v-col>
              <span class="heading">{{ lcp.packName }}</span>
              <span class="text-disabled"> {{ $t('contentManager.config.byAuthor', { author: lcp.packAuthor }) }}</span>
            </v-col>
            <v-col cols="auto">
              <v-tooltip location="top"
                :text="$t('contentManager.config.removePack')">
                <template #activator="{ props }">
                  <v-btn color="error"
                    size="30"
                    icon
                    flat
                    tile
                    v-bind="props"
                    @click="removePack(config, lcp)">
                    <v-icon icon="mdi-close" />
                  </v-btn>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4" />

        <v-row align="center">
          <v-col cols="auto">
            <v-select v-model="selection"
              color="primary"
              density="compact"
              hide-details
              return-object
              :items="getEligiblePacks(config)"
              item-title="Name"
              min-width="300px"
              max-width="400px"
              :label="$t('contentManager.config.addLcp')"
              @update:model-value="AddPack(config)" />
          </v-col>
          <v-col cols="auto"
            class="ml-auto">
            <v-btn color="success"
              flat
              tile
              icon
              @click="editingIndex = null">
              <v-icon icon="mdi-content-save" />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row v-else
        dense
        class="pa-1">
        <v-col cols="auto">
          <v-icon icon="mdi-list-status"
            size="40" />
        </v-col>
        <v-col>
          <div class="heading h3">{{ config.name }}</div>
          <div class="text-disabled text-caption">
            <span v-if="config.packList.length">
              {{config.packList.map(x => x.packName).join(' // ')}} LCPs
            </span>
            <span v-else>{{ $t('contentManager.config.coreOnly') }}</span>
          </div>
        </v-col>
        <v-col cols="auto"
          class="ml-auto">
          <v-tooltip location="top"
            :text="$t('contentManager.config.editConfig')">
            <template #activator="{ props }">
              <v-btn color="primary"
                size="40"
                icon
                flat
                tile
                v-bind="props"
                @click="editingIndex = index">
                <v-icon icon="mdi-pencil" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>

    <cc-button color="primary"
      size="small"
      class="ma-0"
      block
      @click="user.AddConfig()">
      <v-icon left>mdi-plus</v-icon>
      {{ $t('contentManager.config.createConfig') }}
    </cc-button>
  </v-card-text>
</template>

<script lang="ts">
import { CompendiumStore, UserStore } from '@/stores'
import { LcpConfig, LcpConfigData } from '@/user'
import _ from 'lodash'
import { useMobile } from '@/mixins/useMobile';

export default {
  name: 'PackConfig',
  mixins: [useMobile],
  data: () => ({
    selection: null as any,
    editingIndex: null as number | null,
  }),
  computed: {
    user() {
      return UserStore().User
    },
  },
  methods: {
    getEligiblePacks(config: LcpConfig) {
      return CompendiumStore().ContentPacks.filter(
        p => !config.packList.some(x => x.packID === p.ID)
      )
    },
    AddPack(config: LcpConfig) {
      if (!this.selection) return
      if (!config) return
      config.packList.push({
        packID: this.selection.ID,
        packName: this.selection.Manifest.name,
        packAuthor: this.selection.Manifest.author,
        packVersion: this.selection.Manifest.version,
        allowed: true,
      } as LcpConfigData)
      this.user.updateConfig(config.id, config)
      this.selection = null
    },
    removePack(config: LcpConfig, pack: LcpConfigData) {
      const index = config.packList.findIndex(p => p.packID === pack.packID)
      if (index === -1) return
      config.packList.splice(index, 1)
      this.user.updateConfig(config.id, config)
    },
    removeConfig(id: string) {
      this.user.RemoveConfig(id)
    },
    debouncedSave: _.debounce(function (config: LcpConfig) {
      UserStore().User.updateConfig(config.id, config)
    }, 500),
  },
}
</script>
