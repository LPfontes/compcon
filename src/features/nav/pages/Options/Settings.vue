<template>
  <v-container :class="!mobile && 'px-12'">
    <v-row
      align="center"
      justify="space-between"
      dense
    >
      <v-col cols="auto">
        <cc-button
          block
          color="primary"
          size="small"
          prepend-icon="mdi-bell-ring-outline"
          @click="showUpdates"
        >
          {{ $t('options.settings.showUpdateMessages') }}
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-switch
          v-model="userViewExotics"
          color="exotic"
          density="compact"
          off-icon="mdi-star-off-outline"
          on-icon="mdi-star"
          :tooltip="$t('options.settings.showExoticTooltip')"
          :label="$t('options.settings.showExoticItems')"
        ></cc-switch>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        cols="12"
        sm="6"
      >
        <div>
          <cc-heading
            is-title
            :text="$t('options.settings.theme')"
          />
          <cc-select
            v-model="theme"
            :items="themes.sort((a, b) => a.community - b.community)"
            :item-title="item => `${item.name}${item.community ? ' (Community)' : ''}`"
          />

          <i
            class="text-caption"
            style="opacity: 0.75"
          >
            {{ $t('options.settings.communityThemes') }}
            <a
              target="_blank"
              href="https://github.com/vialra"
            >
              vialra,
            </a>
            Asger Toft,
            <a
              target="_blank"
              href="https://github.com/Lunardog15"
            >
              thecrystalwoods,
            </a>
            and
            <a
              target="_blank"
              href="https://github.com/nimoooos"
            >
              Suji
            </a>
          </i>
        </div>
        <div>
          <cc-heading
            is-title
            :text="$t('options.settings.font')"
          />
          <cc-select
            v-model="font"
            :items="fonts"
            item-title="label"
            item-value="value"
          />
        </div>
        <div class="mt-4">
          <cc-heading
            is-title
            :text="$t('options.settings.language')"
          />
          <cc-language-switcher />
        </div>
      </v-col>
      <v-col
        cols="
            12"
        sm="6"
      >
        <cc-heading
          is-title
          :text="$t('options.settings.logLevel')"
        />
        <v-menu>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              three-line
              border
            >
              <v-list-item-title>{{ $t('options.settings.logLevel') }}:</v-list-item-title>
              <v-list-item-subtitle>
                <b class="text-uppercase">{{ logLevel.name }}</b>
              </v-list-item-subtitle>
              <template #append>
                <v-icon>mdi-chevron-down</v-icon>
              </template>
            </v-list-item>
          </template>
          <v-list>
            <v-list-item
              v-for="item in logLevels"
              :key="item.level"
              :title="item.name"
              :subtitle="item.detail"
              @click="setLogLevel(item)"
            />
          </v-list>
        </v-menu>

        <cc-heading
          is-title
          :text="$t('options.settings.errorReporting')"
          class="mt-3 mb-1"
        />
        <v-row>
          <v-col cols="auto">
            <cc-checkbox
              v-model="user.ErrorReporting"
              :disabled="user.EnhancedReporting"
              color="primary"
            />
          </v-col>
          <v-col
            cols="auto"
            :class="`text-${user.ErrorReporting ? 'success' : 'disabled'}`"
          >
            {{ $t('options.settings.errorReporting') }} {{ user.ErrorReporting ? $t('options.settings.enabled') : $t('options.settings.disabled') }}
          </v-col>
          <v-col cols="auto">
            <v-tooltip
              location="top"
              max-width="400px"
            >
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  class="fade-select mx-1"
                  icon="mdi-information-slab-box-outline"
                />
              </template>
              {{ $t('options.settings.errorReportingDesc') }}
              <strong class="text-accent">
                {{ $t('options.settings.errorReportingPii') }}
              </strong>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-slide-y-reverse-transition>
          <v-row v-if="user.ErrorReporting">
            <v-col cols="auto">
              <cc-checkbox
                v-model="user.EnhancedReporting"
                color="primary"
              />
            </v-col>
            <v-col
              cols="auto"
              :class="`text-${user.EnhancedReporting ? 'success' : 'disabled'}`"
            >
              {{ $t('options.settings.enhancedReporting') }} {{ user.EnhancedReporting ? $t('options.settings.enabled') : $t('options.settings.disabled') }}
            </v-col>
            <v-col cols="auto">
              <v-tooltip
                location="top"
                max-width="400px"
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="fade-select mx-1"
                    icon="mdi-information-slab-box-outline"
                  />
                </template>

                {{ $t('options.settings.enhancedReportingDesc') }}
                <strong class="text-accent">
                  {{ $t('options.settings.enhancedReportingPii') }}
                </strong>
                . <span v-html="$t('options.settings.enhancedReportingNotNecessary')"></span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-slide-y-reverse-transition>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="6"
      >
        <cc-button
          block
          size="large"
          color="primary"
          prepend-icon="mdi-database"
          :tooltip="$t('options.settings.createBackupTooltip')"
          @click="bulkExport"
        >
          {{ $t('options.settings.createBackup') }}
        </cc-button>
        <cc-button
          v-if="v2BackupData"
          block
          size="x-small"
          color="primary"
          prepend-icon="mdi-database"
          :tooltip="$t('options.settings.downloadV2Tooltip')"
          @click="downloadV2Backup"
        >
          {{ $t('options.settings.downloadV2Backup') }}
        </cc-button>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <cc-dialog
          :title="$t('options.settings.loadBackup')"
          :close-on-click="false"
        >
          <template #activator="{ open }">
            <cc-button
              block
              size="large"
              color="primary"
              :tooltip="$t('options.settings.loadBackupTooltip')"
              prepend-icon="mdi-database"
              @click="open()"
            >
              {{ $t('options.settings.loadBackup') }}
            </cc-button>
          </template>
          <template #default="{ close }">
            <v-card-text class="pa-6">
              <div v-if="!isV2File">
                <div class="text-cc-overline text-disabled">{{ $t('options.settings.importStrategy') }}</div>
                <v-btn-toggle
                  v-model="strategy"
                  mandatory
                  size="small"
                  color="primary"
                  flat
                  tile
                  density="compact"
                  class="mb-4"
                >
                  <v-btn value="append">{{ $t('options.settings.mergeStrategy') }}</v-btn>
                  <v-btn value="overwrite">{{ $t('options.settings.overwriteStrategy') }}</v-btn>
                </v-btn-toggle>
                <cc-alert
                  v-if="strategy === 'append'"
                  color="warning"
                  variant="outlined"
                  class="mb-4"
                >
                  <p class="text-text">
                    {{ $t('options.settings.mergeWarning') }}
                  </p>
                </cc-alert>
                <cc-alert
                  v-else-if="strategy === 'overwrite'"
                  color="error"
                  variant="outlined"
                  :title="$t('options.settings.warning')"
                  icon="mdi-alert"
                  class="mb-4"
                >
                  {{ $t('options.settings.overwriteWarning') }}
                </cc-alert>
              </div>

              <v-file-input
                v-model="fileValue"
                accept=".compcon"
                variant="outlined"
                density="compact"
                hide-details
                autofocus
                :label="$t('options.settings.selectFile')"
                prepend-icon="mdi-paperclip"
                @change="onFileSelect"
              />

              <cc-alert
                v-if="isV2File"
                color="warning"
                icon="mdi-alert"
                variant="outlined"
                :title="$t('options.settings.v2BackupDetected')"
                class="mt-4"
              >
                <p class="text-text">
                  {{ $t('options.settings.v2BackupText1') }}
                </p>
                <p class="mt-2">
                  {{ $t('options.settings.v2BackupText2') }}
                </p>
              </cc-alert>

              <v-row
                v-if="stagedImportData"
                justify="end"
                class="mt-4"
              >
                <v-col cols="auto">
                  <cc-button
                    color="primary"
                    :loading="importLoading"
                    prepend-icon="mdi-database-arrow-left-outline"
                    @click="doImport(close)"
                  >
                    {{ isV2File ? $t('options.settings.importV2') : $t('options.settings.confirmImport') }}
                  </cc-button>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </cc-dialog>
      </v-col>
    </v-row>

    <div class="text-right">
      <v-btn
        size="x-small"
        variant="text"
        to="/ui-test"
      >
        UI Test I
      </v-btn>
      <v-btn
        size="x-small"
        variant="text"
        to="/ui-test-new"
      >
        UI Test II
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
  import * as allThemes from '@/ui/style/themes'

  import { UserStore } from '@/stores'
  import { exportAll, importAll } from '@/io/BulkData'
  import { saveFile } from '@/io/Data'
  import { ClearAllData } from '@/io/Storage'
  import { isFullBackup, processFullBackup, downloadFullBackup } from '@/io/FullImporter'
  import { GetValue } from '@/io/Storage'

  export default {
    name: 'OptionsSettings',
    emits: ['show-message'],
    data() {
      return {
        importDialog: false,
        fileValue: null as any,
        deleteDialog: false,
        strategy: 'append',
        stagedImportData: null as any,
        isV2File: false,
        importLoading: false,
        v2BackupData: null as any,
        logLevel: {
          name: 'Warning',
          level: 3,
          detail: 'Record warning and error messages (recommended)',
        },
      };
    },
    computed: {
      mobile() {
        return this.$vuetify.display.mdAndDown
      },
      user() {
        return UserStore().User
      },
      logLevels() {
        return [
          {
            name: this.$t('options.settings.logLevels.debug'),
            key: 'debug',
            level: 1,
            detail: this.$t('options.settings.logLevels.debugDetail'),
          },
          {
            name: this.$t('options.settings.logLevels.info'),
            key: 'info',
            level: 2,
            detail: this.$t('options.settings.logLevels.infoDetail'),
          },
          {
            name: this.$t('options.settings.logLevels.warn'),
            key: 'warn',
            level: 3,
            detail: this.$t('options.settings.logLevels.warnDetail'),
          },
          {
            name: this.$t('options.settings.logLevels.error'),
            key: 'error',
            level: 4,
            detail: this.$t('options.settings.logLevels.errorDetail'),
          },
        ];
      },
      fonts() {
        return [
          { label: this.$t('options.settings.fonts.inter'), value: 'inter' },
          { label: this.$t('options.settings.fonts.noto'), value: 'noto' },
          { label: this.$t('options.settings.fonts.helvetica'), value: 'helvetica' },
          { label: this.$t('options.settings.fonts.opendyslexic'), value: 'opendyslexic' },
        ];
      },
      userViewExotics: {
        get: function () {
          return this.user.Option('showExotics')
        },
        set: function (newVal) {
          this.user.SetOption('showExotics', newVal)
        },
      },
      font: {
        get: function () {
          return this.user.Font
        },
        set: function (newVal) {
          this.user.Font = newVal
          document.documentElement.setAttribute('data-font', newVal)
        },
      },
      theme: {
        get: function () {
          return this.user.Theme
        },
        set: function (newVal) {
          this.user.Theme = newVal
          this.$vuetify.theme.global.name = newVal
          window.location.reload()
        },
      },
      userID() {
        return this.user.ID
      },
      themes() {
        return Object.keys(allThemes).map(x => ({
          name: allThemes[x].name,
          value: x,
          community: allThemes[x].community,
        }))
      },
    },
    created() {
      this.logLevel = this.logLevels.find(x => x.key === this.user.LogLevel) || this.logLevels[2]
    },
    async mounted() {
      this.v2BackupData = await GetValue('v2_backup_download')
    },
    methods: {
      reload() {
        location.reload()
      },
      showUpdates() {
        this.user.ReadMessages = []
        this.reload()
      },
      setLogLevel(item) {
        this.logLevel = item
        this.user.LogLevel = item.key
      },
      downloadV2Backup() {
        downloadFullBackup(this.v2BackupData)
      },
      async bulkExport() {
        const result = await exportAll()
        const seen = new WeakSet()
        const serialized = JSON.stringify(
          result,
          (_key, value) => {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) return '[Circular]'
              seen.add(value)
            }
            return value
          },
          2
        )
        await saveFile(
          `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
          serialized,
          'Save COMP/CON Archive'
        )
      },
      async onFileSelect(event) {
        const file = event?.target?.files?.[0]
        if (!(file instanceof File)) return
        try {
          const outer = JSON.parse(await file.text())
          if (isFullBackup(outer)) {
            // v2 format: top-level array of {filename, data} entries
            this.isV2File = true
            this.stagedImportData = outer
          } else {
            // v3 format: {EXPORT_TYPE, data: "<JSON string>"}
            // .data is itself a serialized string and requires a second parse
            this.isV2File = false
            this.stagedImportData = JSON.parse(outer.data)
          }
        } catch (err) {
          this.stagedImportData = null
          this.isV2File = false
          this.$notify({
            title: this.$t('options.settings.import.readError') as string,
            text: `ERROR: ${err}`,
            data: { color: 'error', icon: 'mdi-database-off-outline' },
          })
        }
      },
      async doImport(close) {
        this.importLoading = true
        try {
          if (this.isV2File) {
            const result = await processFullBackup(this.stagedImportData)
            const parts = [] as string[]
            if (result.pilotsImported)
              parts.push(this.$t('options.settings.import.pilots', { count: result.pilotsImported }))
            if (result.pilotsBackedUp)
              parts.push(
                this.$t('options.settings.import.pilotsPending', { count: result.pilotsBackedUp })
              )
            if (result.npcsImported)
              parts.push(this.$t('options.settings.import.npcs', { count: result.npcsImported }))
            if (result.npcsBackedUp)
              parts.push(
                this.$t('options.settings.import.npcsPending', { count: result.npcsBackedUp })
              )
            if (result.encountersImported)
              parts.push(
                this.$t('options.settings.import.encounters', { count: result.encountersImported })
              )
            if (result.encountersBackedUp)
              parts.push(
                this.$t('options.settings.import.encountersPending', {
                  count: result.encountersBackedUp,
                })
              )
            if (result.lcpsImported)
              parts.push(this.$t('options.settings.import.lcps', { count: result.lcpsImported }))
            this.$notify({
              title: this.$t('options.settings.import.v2Success') as string,
              text: parts.length
                ? parts.join(', ') + '.'
                : (this.$t('options.settings.import.noData') as string),
              data: { icon: 'mdi-database-arrow-left-outline' },
            })
          } else {
            await importAll(this.stagedImportData, this.strategy === 'overwrite')
            this.$notify({
              title: this.$t('options.settings.import.v3Success') as string,
              text:
                this.strategy === 'overwrite'
                  ? (this.$t('options.settings.import.overwriteText') as string)
                  : (this.$t('options.settings.import.mergeText') as string),
              data: { icon: 'mdi-database-arrow-left-outline' },
            })
          }
          this.stagedImportData = null
          this.isV2File = false
          this.fileValue = null
          close()
        } catch (err) {
          this.$notify({
            title: this.$t('options.settings.import.importError') as string,
            text: `ERROR: ${err}`,
            data: { color: 'error', icon: 'mdi-database-off-outline' },
          })
        }
        this.importLoading = false
      },
      async deleteAll() {
        this.user.Reset()
        await ClearAllData()
        window.location.reload()
      },
    },
  }
</script>
