<template>
  <div>
    <v-dialog v-model="showIosWarning"
      min-width="300px"
      width="60vw">
      <cc-alert color="warning"
        prominent
        icon="mdi-apple"
        :title="$t('mainMenu.storage.iosTitle')">
        <div v-html="$t('mainMenu.storage.iosWarning')"></div>
        <ol class="mt-2 ml-4">
          <li>
            <i18n-t keypath="mainMenu.storage.iosShare" tag="span">
              <template #icon>
                <v-icon size="small"
                  icon="mdi-export-variant" />
              </template>
            </i18n-t>
          </li>
          <li v-html="$t('mainMenu.storage.iosAddHome')"></li>
          <li v-html="$t('mainMenu.storage.iosAdd')"></li>
        </ol>
        <div class="mt-2">{{ $t('mainMenu.storage.iosFinal') }}</div>
        <div class="text-center">
          <cc-button class="mt-3"
            color="primary"
            block
            size="x-small"
            @click="showIosWarning = false">
            {{ $t('mainMenu.storage.continueAnyway') }}
          </cc-button>
        </div>
      </cc-alert>
    </v-dialog>

    <v-dialog v-model="show"
      min-width="300px"
      width="60vw">
      <cc-alert color="error"
        prominent
        icon="mdi-database-alert"
        :title="$t('mainMenu.storage.permTitle')">
        <div v-if="!hasStorage">
          <i18n-t keypath="mainMenu.storage.noSupport" tag="span">
            <template #link>
              <a class="text-secondary"
                href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"
                target="_blank">
                {{ $t('mainMenu.storage.asPwa') }}
                <v-icon size="small"
                  icon="mdi-open-in-new" />
              </a>
            </template>
          </i18n-t>
        </div>
        <div v-else v-html="$t('mainMenu.storage.v3Storage')"></div>
        <div v-if="allowedStorageState === 'denied' || allowedStorageState === 'prompt'"
          class="mt-2 pa-2"
          style="border: white 1px solid"
          v-html="$t('mainMenu.storage.denied')">
        </div>
        <div class="text-center">
          <cc-button class="mt-2"
            color="primary"
            block
            size="x-small"
            @click="show = false">
            {{ $t('mainMenu.storage.continue') }}
          </cc-button>
        </div>
      </cc-alert>
      <v-fade-transition>
        <div v-if="!show"
          class="text-white">
          <b>{{ $t('mainMenu.storage.activated') }}</b>
        </div>
      </v-fade-transition>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'StorageWarning',
  data: () => ({
    show: false,
    showIosWarning: false,
    hasStorage: false,
    allowedStorage: false,
    allowedStorageState: '',
    hasQuota: false,
  }),
  async created() {
    if (this.isIosBrowser()) {
      this.showIosWarning = true;
      return;
    }
    this.hasStorage = await this.hasPermanentStorage();
    this.allowedStorageState = await this.hasPermanentStoragePermission();
    this.allowedStorage = this.allowedStorageState === 'granted';
    this.hasQuota = await this.storageQuota();
    this.show = (!this.hasStorage || !this.allowedStorage) && !this.hasQuota;
  },
  methods: {
    isIosBrowser() {
      const isIos =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (!isIos) return false;
      const isStandalone =
        (navigator as any).standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches;
      return !isStandalone;
    },
    async hasPermanentStorage() {
      await navigator.storage.persist();
      return await navigator.storage.persisted();
    },
    async hasPermanentStoragePermission() {
      try {
        const res = await navigator.permissions.query({
          name: 'persistent-storage',
        });
        return res.state;
      } catch {
        return 'granted';
      }
    },
    async storageQuota() {
      const est = await navigator.storage.estimate();
      if (!est.quota) return false;
      return est.quota / 1048576 > 5;
    },
  },
};
</script>
