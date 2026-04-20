<template>
  <v-card>
    <v-row dense
      align="center">
      <v-col v-for="image in displayedRemoteImages"
        :key="image"
        cols="4"
        md="3">
        <v-card class="ma-2"
          outlined
          tile
          :color="selectedImage === image ? 'primary' : ''"
          :class="{ selected: image === selectedImage }"
          style="border-width: 3px"
          @click="selectedImage === image ? (selectedImage = null) : stage(image)">
          <div class="background">
            <v-img :src="image"
              contain
              max-height="200px" />
          </div>
        </v-card>
        <v-scale-transition>
          <v-card v-if="selectedImage === image"
            flat
            class="pa-1"
            tile>
            <div class="text-caption pb-1 text-center">
              {{ image }}
            </div>
            <v-menu offset-y
              offset-x
              top
              left>
              <template #activator="{ props }">
                <v-btn block
                  variant="tonal"
                  color="error"
                  size="x-small"
                  v-bind="props">
                  {{ $t('common.selectors.imageArchive.remote.delete') }}
                </v-btn>
              </template>
              <cc-confirmation
                :content="$t('common.selectors.imageArchive.remote.deleteConfirm')"
                @confirm="deleteRemoteImage(image)" />
            </v-menu>
          </v-card>
        </v-scale-transition>
      </v-col>
    </v-row>
    <v-pagination v-model="currentRemotePage"
      :length="totalRemotePages"
      total-visible="5"
      @input="currentRemotePage = $event" />
    <v-divider class="my-3" />
    <cc-alert density="compact"
      class="my-2 text-caption"
      icon="mdi-alert"
      :title="$t('common.selectors.imageArchive.remote.externalWarningTitle')">
      <i>
        {{ $t('common.selectors.imageArchive.remote.externalWarningText') }}
      </i>
    </cc-alert>

    <v-card-text>
      <div class="heading h3">
        {{ $t('common.selectors.imageArchive.remote.addTitle') }}
        <cc-tooltip inline
          :content="$t('common.selectors.imageArchive.remote.addTooltip')">
          <v-icon left>mdi-information-outline</v-icon>
        </cc-tooltip>
      </div>
      <v-row align="center">
        <v-col>
          <v-text-field v-model="remoteInput"
            class="px-6 mt-2"
            dense
            outlined
            hide-details
            :placeholder="$t('common.selectors.imageArchive.remote.linkPlaceholder')"
            prepend-icon="mdi-image-sync"
            :disabled="loading" />
        </v-col>
        <v-col cols="auto">
          <v-btn color="secondary"
            :disabled="!remoteInput || remoteError.length > 0"
            @click="setRemoteImage()">
            {{ $t('common.selectors.imageArchive.remote.loadBtn') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-alert v-if="remoteError"
        type="error"
        class="mt-3">
        <v-row>
          <v-col>{{ remoteError }}</v-col>
          <v-col cols="auto">
            <v-btn icon
              @click="remoteError = ''"><v-icon>mdi-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import * as _ from 'lodash-es';
import { SetItem, RemoveItem, GetKeys } from '@/io/Storage';

export default {
  name: 'RemoteImageArchive',
  emits: ['set-staged'],
  data: () => ({
    currentRemotePage: 1,
    itemsPerPage: 12,
    selectedImage: null as unknown as any,
    loading: false,
    imageSelectTab: 0,
    remoteInput: '',
    remoteError: '',
    iid: '',
    stagedImage: null as unknown as any,
    showAll: false,
    imageUrl: '',
    remoteImages: [] as string[],
    urls: [] as string[],
  }),
  computed: {
    displayedRemoteImages() {
      const startIndex = (this.currentRemotePage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.remoteImages.slice(startIndex, endIndex);
    },
    totalRemotePages() {
      return Math.ceil(this.remoteImages.length / this.itemsPerPage);
    },
  },
  async created() {
    await this.getRemoteImages();
  },
  methods: {
    async getRemoteImages() {
      this.remoteImages = await GetKeys('remote_images');
    },
    async deleteRemoteImage(key) {
      RemoveItem('remote_images', key);
      await this.getRemoteImages();
    },
    stage(image) {
      this.selectedImage = image;
      this.$emit('set-staged', image);
    },
    async setRemoteImage() {
      if (!this.remoteInput || !this.validURL(this.remoteInput)) {
        this.remoteError = this.$t('common.selectors.imageArchive.remote.invalidUrl');
        return;
      }
      this.remoteError = '';
      this.selectedImage = this.remoteInput;
      await SetItem('remote_images', this.remoteInput);
      await this.getRemoteImages();
      this.currentRemotePage = this.totalRemotePages;
    },
    // Pulled from Stackoverflow: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    validURL(str: string): boolean {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator
      return !!pattern.test(str);
    },
  },
};
</script>
