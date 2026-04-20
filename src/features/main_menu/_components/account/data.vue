<template>
  <v-container :class="!mobile && 'px-12'">
    <v-progress-linear :model-value="(cloudUseMb / cloudMaxMb) * 100"
      color="secondary"
      bg-color="primary"
      tile
      height="35">
      <v-chip size="small"
        tile
        variant="elevated"
        elevation="0">
        {{ ((cloudUseMb / cloudMaxMb) * 100).toFixed(3) }}%
      </v-chip>
    </v-progress-linear>
    <div class="text-center flavor-text">
      {{ $t('cloud.data.usage') }}
      <cc-slashes />
      {{ $t('cloud.data.usageOf', {
        used: (cloudUseMb >= 1 ? cloudUseMb : cloudUseKb).toFixed(2),
        unit: (cloudUseMb >= 1 ? 'MB' : 'KB'),
        max: cloudMaxMb.toFixed(2)
      }) }}
      <cc-button size="small"
        variant="tonal"
        color="info"
        prepend-icon="mdi-star"
        class="my-1">
        {{ $t('cloud.data.upgrade') }}
      </cc-button>
    </div>
    <br />
    <sync-settings />
    <br />
    <cloud-data-viewer />
    <br />
    <cloud-archive />

    <div class="my-8 text-right">
      <cc-button color="primary"
        :loading="resetting"
        @click="resetMigration()">{{ $t('cloud.data.resetMigration') }}</cc-button>
    </div>
  </v-container>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import CloudArchive from './_components/cloudArchive.vue';
import CloudDataViewer from './_components/cloudDataViewer.vue';
import SyncSettings from './_components/syncSettings.vue';

export default {
  name: 'CloudAccountData',
  components: { SyncSettings, CloudDataViewer, CloudArchive },
  emits: ['reset'],
  data: () => ({
    resetting: false,
  }),
  computed: {
    cloudUseKb() {
      return UserStore().CloudStorageUsed / 1024;
    },
    cloudUseMb() {
      return UserStore().CloudStorageUsed / 1024 / 1024;
    },
    cloudMaxMb() {
      return UserStore().MaxCloudStorage / 1024 / 1024;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    async resetMigration() {
      this.resetting = true;
      await UserStore().resetV2CloudMigration();
      await UserStore().checkV2CloudMigration()
      this.resetting = false;
      this.$emit('reset')
    },
  },
};
</script>
