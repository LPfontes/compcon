<template>
  <v-card flat
    border
    tile
    class="my-4">
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          :text="$t('cloud.archive.title')"
          :tooltip="$t('cloud.archive.titleTooltip')" />
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip v-if="hasArchiveAccess"
        max-width="300px"
        location="top">
        <template #activator="{ props }">
          <v-btn size="small"
            icon
            v-bind="props"
            @click="refresh">
            <v-icon size="x-large">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          {{ $t('cloud.archive.reloadData') }}
          <br />
          {{ $t('cloud.archive.noSync') }}
        </div>
      </v-tooltip>
    </v-toolbar>
    <v-card-text v-if="!hasArchiveAccess">
      <cc-alert color="text"
        icon="mdi-information-outline"
        variant="outlined"
        :title="$t('cloud.archive.noAccessTitle')">
        <i18n-t keypath="cloud.archive.noAccessText" tag="span">
          <template #sub>
            <a href="https://www.patreon.com/compcon"
              target="_blank">{{ $t('cloud.archive.subscribing') }}</a>
          </template>
        </i18n-t>
      </cc-alert>
    </v-card-text>
    <div v-else>
      <v-data-table :items="archives"
        :headers="headers"
        :loading="loading"
        density="compact">
        <template #item.created="{ item }">
          {{ new Date(item.created).toLocaleString() }}
        </template>
        <template #item.size="{ item }">
          <span v-if="item.size > 1024 * 1024 + 1">
            {{ (item.size / 1024 / 1024).toFixed(2) }} MB
          </span>
          <span v-else>{{ (item.size / 1024).toFixed(2) }} KB</span>
        </template>

        <template #item.preserve="{ item }">
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-checkbox v-model="item.preserve"
                density="compact"
                hide-details
                v-bind="props"
                @click="setPreserve(item)" />
            </template>
            <div class="text-center"
              v-text="!item.preserve
                ? $t('cloud.archive.preventPrune')
                : $t('cloud.archive.removePruneProtection')
                " />
          </v-tooltip>
        </template>

        <template #item.actions="{ item }">
          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                v-bind="props">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large"
                      v-bind="props">mdi-undo-variant</v-icon>
                  </template>
                  <div class="text-center">{{ $t('cloud.archive.revertTooltip') }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="primary">
                  <v-toolbar-title>
                    <span class="heading h3">{{ $t('cloud.archive.revertTitle') }}</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  {{ $t('cloud.archive.revertText') }}
                  <br />
                  <br />
                  {{ $t('cloud.archive.revertLocalOnly') }}
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">{{ $t('cloud.archive.cancel') }}</v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="accent"
                    :loading="loading"
                    @click="revertCC(item)">
                    {{ $t('cloud.archive.loadArchive') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                :loading="item.downloading"
                :disabled="item.downloading"
                v-bind="props"
                @click="downloadArchive(item)">
                <v-icon size="x-large">mdi-download</v-icon>
              </v-btn>
            </template>
            <div class="text-center">{{ $t('cloud.archive.downloadCopy') }}</div>
          </v-tooltip>

          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                v-bind="props">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large"
                      v-bind="props">mdi-delete-outline</v-icon>
                  </template>
                  <div class="text-center">{{ $t('cloud.archive.deleteArchive') }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">{{ $t('cloud.archive.deleteArchive') }}</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  {{ $t('cloud.archive.deleteConfirm') }}
                  <v-checkbox v-model="skipDeleteWarning"
                    :label="$t('cloud.archive.skipDeleteWarning')"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">{{ $t('cloud.archive.cancel') }}</v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="deleteArchive(item)">
                    {{ $t('cloud.archive.delete') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-data-table>
      <cc-button block
        color="primary"
        prepend-icon="mdi-cloud-upload"
        class="mx-3 mb-3"
        :disabled="working || cloudStorageFull"
        :loading="working"
        @click="createNew()">
        {{ $t('cloud.archive.createNew') }}
        <template v-if="cloudStorageFull"
          #subtitle>
          {{ $t('cloud.archive.storageFull') }}
        </template>
        <template #options>
          <v-card tile
            border
            max-width="600px">
            <v-toolbar density="compact"
              color="primary"
              tile>
              <div class="heading h3 px-2">{{ $t('cloud.archive.archiveSettings') }}</div>
            </v-toolbar>
            <v-card-text>
              <div class="text-caption mb-4">
                {{ $t('cloud.archive.archiveSettingsText') }}
              </div>

              <cc-select v-model="settings.autoBackupFrequency"
                :label="$t('cloud.archive.autoBackupFreq')"
                :items="backupFrequency"
                :loading="updateLoading" />

              <v-divider class="my-4" />

              <div class="text-caption mb-4">
                {{ $t('cloud.archive.pruneText') }}
              </div>

              <div></div>
              <cc-select v-model="settings.autoBackupLimit"
                :label="$t('cloud.archive.itemLimit')"
                :loading="updateLoading"
                :items="pruneOptions"
                :details="pruneOptions.find((o) => o.value === pruneSetting)?.subtitle" />

              <div class="mt-4">{{ $t('cloud.archive.storageLimit') }}</div>
              <v-slider v-model="settings.autoBackupPrunePct"
                :max="99"
                :min="1"
                step="1"
                thumb-label
                color="accent"
                hide-details />
              <div class="text-caption text-right mt-n2"
                v-text="$t('cloud.archive.storagePruneLabel', { pct: settings.autoBackupPrunePct })" />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn :loading="loading"
                :disabled="!prunableItemCount"
                @click="prune">
                <span v-if="prunableItemCount">{{ $t('cloud.archive.pruneCount', { count: prunableItemCount }) }}</span>
                <span v-else>{{ $t('cloud.archive.nothingToPrune') }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </cc-button>
    </div>
  </v-card>
</template>

<script lang="ts">
import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive';
import { cloudDelete, downloadFromS3, updateItem } from '@/io/apis/account';
import { importAll } from '@/io/BulkData';
import { UserStore } from '@/stores';

export default {
  name: 'CloudArchive',
  data: () => ({
    loading: false,
    updateLoading: false,
    working: false,
    headers: [
      { title: this.$t('cloud.archive.headers.created'), key: 'created' },
      { title: this.$t('cloud.archive.headers.source'), key: 'source' },
      { title: this.$t('cloud.archive.headers.size'), key: 'size' },
      { title: this.$t('cloud.archive.headers.preserve'), key: 'preserve' },
      { title: '', key: 'actions', sortable: false, width: '155px' },
    ],
    pruneSetting: 30,
    pruneOptions: [
      { title: this.$t('cloud.archive.options.keepAll'), subtitle: this.$t('cloud.archive.options.keepAllSub'), value: -1 },
      { title: this.$t('cloud.archive.options.last30'), subtitle: this.$t('cloud.archive.options.last30Sub'), value: 30 },
      { title: this.$t('cloud.archive.options.last10'), subtitle: this.$t('cloud.archive.options.last10Sub'), value: 10 },
      { title: this.$t('cloud.archive.options.last5'), subtitle: this.$t('cloud.archive.options.last5Sub'), value: 5 },
      {
        title: this.$t('cloud.archive.options.mostRecent'),
        subtitle: this.$t('cloud.archive.options.mostRecentSub'),
        value: 1,
      },
    ],
    backupFrequency: [
      { title: this.$t('cloud.archive.options.off'), value: 'none' },
      { title: this.$t('cloud.archive.options.appStart'), value: 'appstart' },
      { title: this.$t('cloud.archive.options.daily'), value: 'daily' },
      { title: this.$t('cloud.archive.options.weekly'), value: 'weekly' },
      { title: this.$t('cloud.archive.options.monthly'), value: 'monthly' },
    ],
    prunePct: 50,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    hasArchiveAccess() {
      return UserStore().User.PatreonTierValue > 0;
    },
    archives() {
      return UserStore().CloudArchives;
    },
    settings() {
      return UserStore().UserMetadata.SyncSettings;
    },
    prunableItemCount() {
      return UserStore().PrunableBackups.length;
    },
    cloudStorageFull() {
      return UserStore().CloudStorageFull;
    },
    skipDeleteWarning: {
      get() {
        return UserStore().User.View('skipDeleteWarning_archive', false);
      },
      set(val) {
        UserStore().User.SetView('skipDeleteWarning_archive', val);
      },
    },
  },
  watch: {
    'settings.autoBackupLimit': {
      async handler(val) {
        await this.updateUserMetadata();
      },
    },
    'settings.autoBackupFrequency': {
      async handler(val) {
        await this.updateUserMetadata();
      },
    },
  },

  methods: {
    async createNew() {
      this.working = true;
      const cooldownTime = 10 * 60 * 1000; // 10 minutes

      const cooldown = Number(sessionStorage.getItem('cloud-archive-cooldown')) || 0;

      if (cooldown + cooldownTime > Date.now()) {
        this.$notify({
          title: 'Cloud Archive',
          text: this.$t('cloud.archive.waitCooldown', {
            n: Math.ceil((cooldown + cooldownTime - Date.now()) / 1000)
          }) as string,
          data: { icon: 'mdi-clock', type: 'error' },
        });
        this.working = false;
        return;
      }

      sessionStorage.setItem('cloud-archive-cooldown', Date.now().toString());

      await PostCloudArchive('Manual');
      this.working = false;

      await this.refresh();
    },
    async refresh() {
      this.loading = true;

      await UserStore().refreshDbData();
      this.loading = false;
    },
    async deleteArchive(item) {
      this.loading = true;
      await cloudDelete(item.user_id, item.sortkey, item.uri);
      await this.refresh();
      this.loading = false;
    },
    async downloadArchive(item) {
      item.downloading = true;
      const data = await downloadFromS3(item.uri);

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `archive_${item.created}.compcon`;
      a.click();
      window.URL.revokeObjectURL(url);

      item.downloading = false;
    },
    async revertCC(item) {
      this.loading = true;
      const data = await downloadFromS3(item.uri);

      await importAll(data);

      this.loading = false;
    },
    async prune() {
      this.loading = true;
      await UserStore().PruneBackups();
      await this.refresh();
      this.loading = false;
    },
    async setPreserve(item) {
      this.loading = true;
      item.preserve = !item.preserve;
      await updateItem(item);
      this.loading = false;
    },
    async updateUserMetadata() {
      this.updateLoading = true;
      await UserStore().setUserMetadata();
      this.updateLoading = false;
    },
  },
};
</script>
