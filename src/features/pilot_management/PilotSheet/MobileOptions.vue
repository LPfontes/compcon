<template>
  <v-container>
    <div class="heading h3 py-0 px-2">{{ $t('pilotSheet.mobileOptions.title') }}</div>
    <cc-button block
      size="large"
      color="panel"
      prepend-icon="mdi-printer"
      @click="$router.push(`/print/${pilot.ID}`)">
      {{ $t('pilotSheet.mobileOptions.print') }}
      <template #subtitle>
        <span class="text-cc-overline">{{ $t('pilotSheet.mobileOptions.printSubtitle') }}</span>
      </template>
    </cc-button>

    <br />

    <cc-modal :title="$t('pilotSheet.mobileOptions.statblockGenTitle')"
      icon="mdi-code-block-tags">
      <template #activator="{ open }">
        <cc-button block
          size="large"
          color="panel"
          prepend-icon="mdi-file-document-outline"
          @click="open">
          {{ $t('pilotSheet.mobileOptions.genStatblock') }}
          <template #subtitle>
            <span class="text-cc-overline">
              {{ $t('pilotSheet.mobileOptions.genStatblockSubtitle') }}
            </span>
          </template>
        </cc-button>
      </template>
      <statblock-dialog :pilot="pilot" />
    </cc-modal>
    <br />

    <cc-button v-if="!pilot.IsRemote"
      block
      size="large"
      color="panel"
      prepend-icon="mdi-download"
      @click="exportPilot()">
      {{ $t('pilotSheet.mobileOptions.export') }}
      <template #subtitle>
        <span class="text-cc-overline">{{ $t('pilotSheet.mobileOptions.exportSubtitle') }}</span>
      </template>
    </cc-button>
    <cc-button v-if="!pilot.IsRemote"
      block
      size="small"
      color="panel"
      prepend-icon="mdi-download"
      @click="exportPilot(true)">
      {{ $t('pilotSheet.mobileOptions.exportLegacy') }}
      <template #subtitle>
        <span class="text-cc-overline">{{ $t('pilotSheet.mobileOptions.exportLegacySubtitle') }}</span>
      </template>
    </cc-button>
    <br />

    <cc-dialog v-if="!pilot.IsRemote"
      :title="$t('pilotSheet.mobileOptions.sharePilotData')"
      icon="cc:pilot"
      :close-on-click="false">
      <template #activator="{ open }">
        <v-tooltip open-delay="300"
          location="top"
          :text="isAuthed ? $t('pilotSheet.mobileOptions.sharePilotData') : $t('pilotSheet.mobileOptions.requiresCloud')">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              block
              size="large"
              color="panel"
              prepend-icon="mdi-code-block-brackets"
              @click="open()">
              {{ $t('pilotSheet.mobileOptions.sharePilot') }}
              <template #subtitle>
                <span class="text-cc-overline">{{ $t('pilotSheet.mobileOptions.shareSubtitle') }}</span>
              </template>
            </cc-button>
          </template>
        </v-tooltip>
      </template>
      <share-dialog :pilot="pilot" />
    </cc-dialog>

    <br />

    <cc-dialog v-if="pilot.IsRemote"
      :close-on-click="false"
      :title="$t('pilotSheet.mobileOptions.convertRemote')"
      icon="cc:pilot">
      <template #activator="{ open }">
        <cc-button block
          color="panel"
          prepend-icon="mdi-content-copy"
          @click="open">
          {{ $t('pilotSheet.mobileOptions.convertToLocal') }}
          <template #subtitle>
            <span class="text-cc-overline">
              {{ $t('pilotSheet.mobileOptions.convertSubtitle') }}
            </span>
          </template>
        </cc-button>
      </template>
      <template #default="{ close }">
        <cc-confirmation full-width
          :content="$t('pilotSheet.mobileOptions.convertConfirm')"
          cancellable
          @confirm="convert()"
          @cancel="close" />
      </template>
    </cc-dialog>

    <cc-modal v-else
      :title="$t('pilotSheet.mobileOptions.cloneTitle')"
      icon="mdi-dna">
      <template #activator="{ open }">
        <cc-button size="large"
          block
          color="panel"
          prepend-icon="mdi-dna"
          @click="open">
          {{ $t('pilotSheet.mobileOptions.clone') }}
          <template #subtitle>
            <span class="text-cc-overline">{{ $t('pilotSheet.mobileOptions.cloneSubtitle') }}</span>
          </template>
        </cc-button>
      </template>
      <template #default="{ close }">
        <clone-dialog :pilot="pilot"
          @close="close" />
      </template>
    </cc-modal>

    <br />
    <cc-modal :title="$t('pilotSheet.mobileOptions.lcpConfigTitle')"
      icon="mdi-list-status">
      <template #activator="{ open }">
        <cc-button size="large"
          block
          color="panel"
          prepend-icon="mdi-list-status"
          @click="open">
          {{ $t('pilotSheet.mobileOptions.lcpConfigTitle') }}
          <template #subtitle>
            <span class="text-cc-overline">
              {{ $t('pilotSheet.mobileOptions.lcpConfigSubtitle') }}
            </span>
          </template>
        </cc-button>
      </template>
      <lcp-config-selector :actor="pilot" />
    </cc-modal>

    <br />

    <cc-button v-if="pilot.IsRemote"
      block
      size="large"
      color="panel"
      :loading="loading"
      :disabled="pilot.CloudController.SyncStatus === 'Synced'"
      prepend-icon="mdi-cloud-sync"
      @click="remoteUpdate()">
      {{ $t('pilotSheet.mobileOptions.downloadData') }}
      <template #subtitle>
        <span class="text-cc-overline">
          {{
            pilot.CloudController.SyncStatus === 'Synced'
              ? $t('pilotSheet.mobileOptions.upToDate')
              : $t('pilotSheet.mobileOptions.downloadDesc')
          }}
        </span>
      </template>
    </cc-button>
    <br />

    <cc-dialog :close-on-click="false"
      :title="$t('pilotSheet.mobileOptions.confirmDeletionTitle')"
      icon="cc:pilot">
      <template #activator="{ open }">
        <cc-button v-if="!pilot.IsRemote"
          block
          size="large"
          color="error"
          prepend-icon="mdi-delete"
          @click="open">
          {{ $t('pilotSheet.mobileOptions.deletePilot') }}
          <template #subtitle>
            <span class="text-cc-overline">{{ $t('pilotSheet.mobileOptions.deletePilotSubtitle') }}</span>
          </template>
        </cc-button>
      </template>
      <template #default="{ close }">
        <cc-confirmation full-width
          :content="$t('pilotSheet.mobileOptions.confirmDeletionDesc', { callsign: pilot.Callsign, name: pilot.Name, level: pilot.Level })"
          cancellable
          @confirm="delete_pilot(close)"
          @cancel="close" />
      </template>
    </cc-dialog>
  </v-container>
</template>

<script lang="ts">
import { saveFile } from '@/io/Data'
import { Pilot } from '@/class'
import { UserStore } from '@/stores'
import { CloudController } from '@/classes/components'
import CloneDialog from './components/CloneDialog.vue'
import StatblockDialog from './components/StatblockDialog.vue'
import logger from '@/user/logger'
import LcpConfigSelector from './components/LcpConfigSelector.vue'
import { useMobile } from '@/mixins/useMobile';
import ShareDialog from './components/ShareDialog.vue'

export default {
  name: 'MobileOptionsMenu',
  components: {
    StatblockDialog,
    CloneDialog,
    LcpConfigSelector,
    ShareDialog,
  },
  mixins: [useMobile],
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  emits: ['close'],
  data: () => ({
    loading: false,
    deleteDialog: false,
  }),
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    delete_pilot(close?: Function) {
      this.pilot.SaveController.Delete()
      if (close) close()
      if (this.$route.path !== '/pilot_management') this.$router.push('/pilot_management')
    },
    exportPilot(v2 = false) {
      try {
        saveFile(
          this.pilot.Callsign.toUpperCase().replace(/\W/g, '') + '.json',
          Pilot.Serialize(this.pilot as Pilot),
          'Save Pilot',
          v2
        )
        this.$notify({
          title: this.$t('pilotSheet.mobileOptions.exportSuccess'),
          text: this.$t('pilotSheet.mobileOptions.exportSuccessDesc', { fileName: this.pilot.Callsign.toUpperCase().replace(/\W/g, '') + '.json' }),
          data: { type: 'success', icon: 'mdi-check' },
        })
      } catch (error) {
        logger.error(`Pilot export failed: ${error}`, this, error)
        this.$notify({
          title: this.$t('pilotSheet.mobileOptions.exportError'),
          text: this.$t('pilotSheet.mobileOptions.exportErrorDesc'),
          data: { type: 'error', icon: 'mdi-alert' },
        })
      }
    },
    async remoteUpdate() {
      try {
        await CloudController.UpdateRemote(this.pilot)
        await UserStore().refreshDbData()
        this.$notify({
          title: this.$t('pilotSheet.mobileOptions.syncComplete'),
          text: this.$t('pilotSheet.mobileOptions.syncCompleteDesc', { callsign: this.pilot.Callsign, name: this.pilot.Name }),
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        })
      } catch (err) {
        this.$notify({
          title: this.$t('pilotSheet.mobileOptions.syncFailed'),
          text: this.$t('pilotSheet.mobileOptions.syncFailedDesc', { callsign: this.pilot.Callsign, name: this.pilot.Name, error: err }),
          data: { icon: 'mdi-alert', color: 'error' },
        })
      }
    },
    async convert() {
      this.loading = true
      UserStore().deleteRemoteItem(this.pilot.SaveController.RemoteCode)
      this.pilot.CloudController.GenerateMetadata()
      this.pilot.SaveController.ClearRemote()
      await UserStore().refreshDbData()
      this.loading = false
      this.$emit('close')
    },
  },
}
</script>
