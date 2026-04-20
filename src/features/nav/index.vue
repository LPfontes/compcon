<template>
  <v-app-bar
    v-if="!hide"
    app
    color="primary"
    :class="!mobile && 'clipped-large'"
    class="no-print"
    density="compact"
    :height="mobile ? '40' : '58'"
    style="z-index: 998"
  >
    <div v-if="standalone">
      <v-tooltip
        location="bottom"
        open-delay="500ms"
      >
        <template #activator="{ props }">
          <v-btn
            icon
            :size="mobile ? 'large' : 'x-large'"
            v-bind="props"
            @click="$router.go(-1)"
          >
            <v-icon icon="mdi-arrow-left" />
          </v-btn>
        </template>
        <span>{{ $t('nav.navigateBack') }}</span>
      </v-tooltip>

      <v-tooltip
        location="bottom"
        open-delay="500ms"
      >
        <template #activator="{ props }">
          <v-btn
            icon
            :size="mobile ? 'large' : 'x-large'"
            v-bind="props"
            @click="$router.go(1)"
          >
            <v-icon icon="mdi-arrow-right" />
          </v-btn>
        </template>
        <span>{{ $t('nav.navigateForward') }}</span>
      </v-tooltip>
      <v-divider
        v-if="!mobile"
        vertical
        class="mx-1"
      />
    </div>

    <cc-button
      :size="mobile ? 'large' : 'x-large'"
      icon="mdi-home"
      :tooltip="$t('nav.mainMenu')"
      tooltip-location="bottom"
      @click="$router.push({ name: 'main-menu' })"
    />

    &nbsp;

    <cc-button
      :size="mobile ? 'large' : 'x-large'"
      icon="mdi-book"
      :tooltip="$t('nav.compendium')"
      tooltip-location="bottom"
      @click="$router.push({ path: '/srd' })"
    />

    &nbsp;

    <cc-button
      :size="mobile ? 'large' : 'x-large'"
      icon="cc:pilot"
      :tooltip="$t('nav.pilotManagement')"
      tooltip-location="bottom"
      @click="$router.push({ path: '/pilot_management' })"
    />

    &nbsp;

    <v-menu
      location="bottom"
      open-on-hover
    >
      <template #activator="{ props }">
        <span v-bind="props">
          <cc-button
            :size="mobile ? 'large' : 'x-large'"
            icon="cc:encounter"
            @click="$router.push({ path: '/gm' })"
          />
        </span>
      </template>
      <v-list
        density="compact"
        class="text-caption pa-0"
      >
        <v-list-item
          slim
          @click="$router.push({ path: '/gm/npcs' })"
        >
          {{ $t('nav.gm.npcRoster') }}
        </v-list-item>
        <v-list-item
          slim
          @click="$router.push({ path: '/gm/encounters' })"
        >
          {{ $t('nav.gm.encounters') }}
        </v-list-item>
        <v-list-item
          slim
          @click="$router.push({ path: '/gm/narrative' })"
        >
          {{ $t('nav.gm.narrative') }}
        </v-list-item>
        <v-list-item
          slim
          @click="$router.push({ path: '/gm/campaigns' })"
        >
          {{ $t('nav.gm.campaigns') }}
        </v-list-item>
      </v-list>
    </v-menu>

    &nbsp;

    <cc-button
      :size="mobile ? 'large' : 'x-large'"
      icon="cc:campaign"
      :tooltip="$t('nav.activeMode')"
      tooltip-location="bottom"
      @click="$router.push({ path: '/active-mode' })"
    />

    &nbsp;

    <v-tooltip
      location="bottom"
      open-delay="500ms"
    >
      <template #activator="{ props }">
        <span v-bind="props">
          <cc-button
            :size="mobile ? 'large' : 'x-large'"
            icon="mdi-contain"
            @click="refModal = true"
          ></cc-button>
        </span>
      </template>
      <span>{{ $t('nav.quickReference') }}</span>
    </v-tooltip>

    &nbsp;

    <cc-solo-modal
      v-model="refModal"
      :title="$t('nav.quickReference')"
    >
      <reference is-modal />
    </cc-solo-modal>

    <v-divider
      v-if="!mobile"
      vertical
      class="ml-4 mr-1"
    />

    <v-toolbar-title v-if="!mobile">
      <span v-if="StorageWarning">
        <v-tooltip
          location="bottom"
          max-width="300px"
        >
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              color="warning"
              icon="mdi-database-alert"
              start
            />
          </template>
          <span>
            <v-chip
              color="warning"
              variant="elevated"
              size="x-small"
            >
              {{ $t('nav.storage.warning') }}
            </v-chip>
            {{ $t('nav.storage.warningText') }}
            <span v-html="$t('nav.storage.moreDetails')"></span>
          </span>
        </v-tooltip>
      </span>
      <span v-else-if="StorageMax">
        <v-tooltip
          location="bottom"
          max-width="300px"
        >
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              color="error"
              icon="mdi-database-off"
              start
            />
          </template>
          <span>
            <v-chip
              color="error"
              variant="elevated"
              size="x-small"
            >
              {{ $t('nav.storage.alert') }}
            </v-chip>
            {{ $t('nav.storage.maxText') }}

            <v-alert color="error">
              <b>{{ $t('nav.storage.noSaveText') }}</b>
            </v-alert>
            <span v-html="$t('nav.storage.moreDetails')"></span>
          </span>
        </v-tooltip>
        <v-dialog
          v-model="storageFullDialog"
          width="780px"
        >
          <v-card>
            <v-toolbar
              color="error"
              class="heading h2"
            >
              <v-toolbar-title>
                <v-icon
                  icon="mdi-database-off"
                  start
                />
                {{ $t('nav.storage.limitExceeded') }}
              </v-toolbar-title>
              <v-spacer />
              <v-btn
                icon
                @click="storageFullDialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <p>
                {{ $t('nav.storage.maxText') }}
                <br />
                <br />
                <b class="text-accent">
                  {{ $t('nav.storage.noSaveText') }}
                </b>
                <br />
                <br />
                <span v-html="$t('nav.storage.moreDetails')"></span>
              </p>
            </v-card-text>
          </v-card>
        </v-dialog>
      </span>
      <span v-if="!mobile">
        <span class="heading">COMP/CON</span>
        <span
          class="flavor-text text-white"
          style="opacity: 0.4"
        >
          &nbsp;{{ appVersion }}
        </span>
      </span>
    </v-toolbar-title>

    <v-spacer />

    <v-chip
      v-if="!isOnline"
      color="warning"
      size="small"
      prepend-icon="mdi-wifi-off"
      class="mr-2"
    >
      {{ $t('nav.offline') }}
    </v-chip>

    <v2-auto />

    <search-component />

    <v-divider
      v-if="!portrait"
      vertical
      class="mx-1"
    />

    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <cc-modal
          :title="$t('nav.cloudAccount')"
          icon="mdi-cloud-sync-outline"
        >
          <template #activator="{ open }">
            <cc-button
              v-bind="props"
              class="mx-1"
              :size="mobile ? 'small' : ''"
              icon="mdi-cloud-sync-outline"
              @click="open"
            />
            <v-badge
              :model-value="notifications.length > 0"
              dot
              color="secondary"
              :content="notifications.length"
            />
          </template>
          <cloud-page />
        </cc-modal>
      </template>
      {{ $t('nav.cloudAccount') }}
    </v-tooltip>

    <v-divider
      v-if="!mobile"
      vertical
      class="mx-1"
    />

    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <cc-modal
          :title="$t('nav.achievements')"
          icon="cc:achievement_1"
        >
          <template #activator="{ open }">
            <cc-button
              v-bind="props"
              class="mx-1"
              :size="mobile ? 'small' : ''"
              icon="cc:achievement_1"
              :disabled="UserStoreLoading"
              @click="open"
            />
          </template>
          <template #default="{ close }">
            <achievements-page @close="close()" />
          </template>
        </cc-modal>
      </template>
      {{ $t('nav.achievements') }}
    </v-tooltip>

    <v-divider
      v-if="!mobile"
      vertical
      class="mx-1"
    />

    <v-menu>
      <template #activator="{ props }">
        <cc-button
          class="mx-1"
          :size="mobile ? 'small' : ''"
          icon="mdi-dots-vertical"
          @click="props.onClick($event)"
        />
      </template>

      <v-list density="compact">
        <v-list-item @click.stop="contentModal = true">
          {{ $t('nav.menu.manageContent') }}
        </v-list-item>
        <content-page v-model="contentModal" />
        <cc-modal
          :title="$t('nav.menu.options')"
          icon="mdi-cog"
        >
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ $t('nav.menu.options') }}</v-list-item>
          </template>
          <options-page />
        </cc-modal>
        <cc-modal
          :title="$t('nav.menu.about')"
          icon="mdi-information-outline"
        >
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ $t('nav.menu.about') }}</v-list-item>
          </template>
          <about-page />
        </cc-modal>
        <cc-modal
          :title="$t('nav.menu.credits')"
          icon="cc:gms"
        >
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ $t('nav.menu.credits') }}</v-list-item>
          </template>
          <credits-page />
        </cc-modal>
        <cc-modal
          :title="$t('nav.menu.help')"
          icon="mdi-help-circle-outline"
        >
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ $t('nav.menu.help') }}</v-list-item>
          </template>
          <help-page />
        </cc-modal>
        <v-divider />
        <v-list-item
          target="_blank"
          href="https://www.patreon.com/compcon"
        >
          {{ $t('nav.menu.support') }}
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer
      v-if="!mobile"
      style="max-width: 20px"
    />
  </v-app-bar>
</template>

<script lang="ts">
  import HelpPage from './pages/Help.vue'
  import AboutPage from './pages/About.vue'
  import CreditsPage from './pages/Credits.vue'
  import OptionsPage from './pages/Options/index.vue'
  import ContentPage from './pages/ExtraContent/index.vue'
  import CloudPage from './pages/Cloud.vue'
  import AchievementsPage from './pages/Achievements.vue'

  import Reference from '../compendium/Views/Reference/Reference.vue'

  import { UserStore } from '@/stores'
  import { useOnlineStatus } from '@/composables/useOnlineStatus'

  import SearchComponent from './search/index.vue'
  import V2Auto from './pages/ExtraContent/components/v2Auto.vue'

  export default {
    name: 'CcNav',
    components: {
      HelpPage,
      AboutPage,
      CreditsPage,
      OptionsPage,
      ContentPage,
      CloudPage,
      AchievementsPage,
      Reference,
      SearchComponent,
      V2Auto,
    },
    props: {
      pilotManagement: { type: Boolean },
      encounter: { type: Boolean },
    },
    setup() {
      const { isOnline } = useOnlineStatus()
      return { isOnline }
    },
    data: () => ({
      aboutDialog: false,
      helpDialog: false,
      optionsDialog: false,
      contentModal: false,
      storageWarningDialog: false,
      storageFullDialog: false,
      qrDialog: false,
      hasCmdKey: false,
      refModal: false,
    }),
    computed: {
      hide(): boolean {
        if (this.$route.path === '/') return true
        return false
      },
      landscape(): boolean {
        return this.$vuetify.display.mdAndDown
      },
      portrait(): boolean {
        return this.$vuetify.display.xs
      },
      mobile() {
        return this.portrait
      },
      StorageWarning(): boolean {
        return UserStore().StorageWarning
      },
      StorageMax(): boolean {
        return UserStore().StorageFull
      },
      appVersion(): string {
        return APP_VERSION || 'dev'
      },
      notifications() {
        return UserStore().CloudNotifications
      },
      standalone(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches
      },
      UserStoreLoading(): boolean {
        return UserStore().IsLoading
      },
    },
    created() {
      this.hasCmdKey = navigator.userAgent.includes('Mac')
      this.storageFullDialog = this.StorageMax
    },
  }
</script>
