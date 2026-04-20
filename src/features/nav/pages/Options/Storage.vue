<template>
  <v-container :class="!mobile && 'px-12'">
    <v-card-text v-if="size.usage && size.quota"
      class="flavor-text">
      <v-progress-linear :model-value="((size.usage / size.quota) * 100).toFixed(3)"
        height="20"
        class="mb-5"
        tile
        color="primary">
        <v-chip small
          tile
          variant="elevated"
          color="primary-lighten-5"
          style="opacity: 0.5">
          {{ ((size.usage / size.quota) * 100).toFixed(3) }}%
        </v-chip>
      </v-progress-linear>

      <p class="px-2" v-html="$t('options.storage.usageText', { usage: bytesToSize(size.usage), quota: bytesToSize(size.quota), percent: ((size.usage / size.quota) * 100).toFixed(3) })" />

      <div class="mb-4">
        <cc-heading is-title
          :text="$t('options.storage.settings')" />
        <cc-heading is-title
          small
          :text="$t('options.storage.thresholds')" />
        <v-range-slider v-model="storageRange"
          thumb-label
          hide-details
          strict
          tile
          type="number"
          track-fill-color="secondary"
          color="primary"
          @end="updateUserStorage" />
        <v-row dense
          class="mt-2">
          <v-col>
            <v-text-field v-model.number="storageRange[0]"
              :label="$t('options.storage.warningThreshold')"
              type="number"
              min="0"
              :max="storageRange[1]"
              variant="outlined"
              tile
              hide-details
              density="compact"
              @change="updateUserStorage" />
          </v-col>
          <v-col>
            <v-text-field v-model.number="storageRange[1]"
              :label="$t('options.storage.maxThreshold')"
              type="number"
              :min="storageRange[0]"
              max="100"
              variant="outlined"
              tile
              hide-details
              density="compact"
              @change="updateUserStorage" />
          </v-col>
        </v-row>
        <div class="text-caption text-right text-stark" v-html="$t('options.storage.warningHint', { percent: storageRange[0].toFixed(2), size: bytesToSize((storageRange[0] / 100) * size.quota) })" />
        <div class="text-caption text-right text-stark" v-html="$t('options.storage.maxHint', { percent: storageRange[1].toFixed(2), size: bytesToSize((storageRange[1] / 100) * size.quota) })" />
      </div>

      <div class="mb-8">
        <cc-heading is-title
          small
          :text="$t('options.storage.autoDelete')" />

        <cc-select v-model="deleteDays"
          :items="deleteDaySelections"
          hide-details
          density="compact"
          @update:model-value="updateDeleteDays()" />
        <div class="text-caption text-right text-stark">
          <span v-if="!deleteDays" v-html="$t('options.storage.neverDelete')" />
          <span v-else v-html="$t('options.storage.autoDeleteText', { days: deleteDays })" />
        </div>
      </div>
    </v-card-text>
    <v-card-text v-else
      class="flavor-text">
      {{ $t('options.storage.noAccess') }}
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      :text="$t('options.storage.deletedItems')" />
    <v-card-text>
      <deleted-items />
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      :text="$t('options.storage.userData')" />
    <user-data-viewer />

    <v-dialog v-model="deleteDialog"
      width="80%">
      <template #activator="{ props }">
        <div class="text-center">
          <cc-button size="large"
            variant="outlined"
            color="error"
            class="my-6"
            append-icon="mdi-alert-outline"
            prepend-icon="mdi-alert-outline"
            v-bind="props">
            {{ $t('options.storage.clearAll') }}
          </cc-button>
        </div>
      </template>
      <v-card flat
        tile>
        <v-card-text>
          <v-alert prominent
            dark
            color="error"
            icon="mdi-alert-circle"
            border="bottom"
            class="my-3">
            <span class="heading h2">{{ $t('options.storage.warningTitle') }}</span>
          </v-alert>
          <p class="text-center heading h2 text-text">
            <span v-html="$t('options.storage.deleteConfirm1')" /><br />
            <span v-html="$t('options.storage.deleteConfirm2')" /><br /><br />
            <span v-html="$t('options.storage.deleteConfirm3')" />
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="secondary"
            variant="text"
            large
            @click="deleteDialog = false">
            {{ $t('options.storage.dismiss') }}
          </v-btn>
          <v-spacer />
          <v-btn color="error"
            variant="text"
            @click="deleteAll">
            <v-icon start
              size="x-large"
              icon="mdi-alert-outline" />
            {{ $t('options.storage.deleteAllButton') }}
            <v-icon end
              size="x-large"
              icon="mdi-alert-outline" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import DeletedItems from './components/DeletedItems.vue';
import UserDataViewer from './components/UserDataViewer.vue';
import { ClearAllData, GetLength, GetTotalStorageSize } from '@/io/Storage';
import logger from '@/user/logger';
import { UserStore } from '@/stores';

export default {
  name: 'OptionsStorage',
  components: { DeletedItems, UserDataViewer },
  data() {
    return {
      importDialog: false,
      fileValue: null,
      deleteDialog: false,
      storageRange: [0, 0] as [number, number],
      deleteDays: 0,
      size: {} as StorageEstimate,
    };
  },
  computed: {
    user() {
      return UserStore().User;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    deleteDaySelections() {
      return [
        { title: this.$t('options.storage.never'), value: 0 },
        { title: this.$t('options.storage.week'), value: 7 },
        { title: this.$t('options.storage.weeks'), value: 14 },
        { title: this.$t('options.storage.month'), value: 30 },
        { title: this.$t('options.storage.months3'), value: 90 },
        { title: this.$t('options.storage.months6'), value: 180 },
        { title: this.$t('options.storage.year'), value: 365 },
      ];
    },
  },
  async created() {
    this.storageRange[0] = this.user.StorageWarning;
    this.storageRange[1] = this.user.StorageMax;
    this.deleteDays = this.user.AutoDeleteDays;

    const est = await navigator.storage.estimate();
    const actualUsage = await GetTotalStorageSize();

    this.size = { usage: actualUsage, quota: est.quota };


    if (!est.usage || !est.quota) {
      logger.info(`navigator storage estimate: ${est.usage} / ${est.quota}`, this);
    } else
      logger.info(
        `navigator storage estimate: ${this.bytesToSize(est.usage)} / ${this.bytesToSize(est.quota)}`,
        this
      );
  },
  methods: {
    bytesToSize(bytes: number) {
      const sizes = [
        this.$t('common.units.bytes'),
        this.$t('common.units.kb'),
        this.$t('common.units.mb'),
        this.$t('common.units.gb'),
        this.$t('common.units.tb'),
      ];
      if (bytes === 0) return `0 ${sizes[0]}`;
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (i === 0) return `${bytes} ${sizes[i]})`;
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    },
    async deleteAll() {
      await ClearAllData();
      this.deleteDialog = false;
      window.location.reload();
    },
    async GetLength(db: string): Promise<any> {
      const len = await GetLength(db);
      if (len) return len;
    },
    updateUserStorage() {
      const warn = Number(this.storageRange[0]);
      if (isNaN(warn)) return;
      const max = Number(this.storageRange[1]);
      if (isNaN(max)) return;
      if (warn < 0) this.storageRange[0] = 0;
      if (max > 100) this.storageRange[1] = 100;
      if (warn > max) this.storageRange[0] = max;

      this.user.StorageWarning = this.storageRange[0];
      this.user.StorageMax = this.storageRange[1];
    },
    updateDeleteDays() {
      this.user.AutoDeleteDays = this.deleteDays;
    },
  },
};
</script>
