<template>
  <div>
    <v-btn icon
      :size="size"
      variant="plain"
      @click.native.stop>
      <v-icon icon="mdi-cog"
        color="white"
        size="large" />
      <v-menu v-model="menu"
        activator="parent">
        <v-card tile
          border>
          <v-toolbar density="compact"
            color="primary"
            height="46">
            <div v-if="!dense"
              class="heading h3 py-0 px-2">
              {{ $t('pilotSheet.mobileOptions.title') }}
            </div>
          </v-toolbar>
          <v-list :lines="mobile ? 'one' : 'two'"
            subheader
            color="panel"
            density="compact"
            slim>
            <v-list-item :title="$t('pilotSheet.mobileOptions.print')"
              prepend-icon="mdi-printer"
              :subtitle="$t('pilotSheet.mobileOptions.printSubtitle')"
              @click="$router.push(`/print/${pilot.ID}`)" />
            <cc-modal :title="$t('pilotSheet.mobileOptions.statblockGenTitle')"
              icon="mdi-code-block-tags">
              <template #activator="{ open }">
                <v-list-item prepend-icon="mdi-file-document-outline"
                  :title="$t('pilotSheet.mobileOptions.genStatblock')"
                  :subtitle="$t('pilotSheet.mobileOptions.genStatblockSubtitle')"
                  @click.stop="open" />
              </template>
              <statblock-dialog :pilot="pilot" />
            </cc-modal>
            <v-list-item v-if="!pilot.IsRemote"
              prepend-icon="mdi-export-variant"
              :title="$t('pilotSheet.mobileOptions.export')"
              :subtitle="$t('pilotSheet.mobileOptions.exportSubtitle')"
              @click="exportPilot()" />

            <v-list-item v-if="!pilot.IsRemote"
              prepend-icon="mdi-export-variant"
              :title="$t('pilotSheet.mobileOptions.exportLegacy')"
              :subtitle="$t('pilotSheet.mobileOptions.exportLegacySubtitle')"
              @click="exportPilot(true)" />


            <cc-dialog v-if="pilot.IsRemote"
              :close-on-click="false"
              :title="$t('pilotSheet.mobileOptions.convertRemote')"
              icon="cc:pilot">
              <template #activator="{ open }">
                <v-list-item prepend-icon="mdi-content-copy"
                  :title="$t('pilotSheet.mobileOptions.convertToLocal')"
                  :subtitle="$t('pilotSheet.mobileOptions.convertSubtitle')"
                  @click.stop="open" />
              </template>
              <template #default="{ close }">
                <cc-confirmation :content="$t('pilotSheet.mobileOptions.convertConfirm')"
                  cancellable
                  @confirm="convert()"
                  @cancel="close" />
              </template>
            </cc-dialog>

            <cc-modal v-else
              :title="$t('pilotSheet.mobileOptions.cloneTitle')"
              icon="mdi-dna">
              <template #activator="{ open }">
                <v-list-item prepend-icon="mdi-dna"
                  :title="$t('pilotSheet.mobileOptions.clone')"
                  :subtitle="$t('pilotSheet.mobileOptions.cloneSubtitle')"
                  @click.stop="open" />
              </template>
              <template #default="{ close }">
                <clone-dialog :pilot="pilot"
                  @close="close" />
              </template>
            </cc-modal>

            <cc-dialog :title="$t('pilotSheet.mobileOptions.lcpConfigTitle')"
              :close-on-click="false"
              icon="mdi-list-status">
              <template #activator="{ open }">
                <v-list-item v-if="!pilot.IsRemote"
                  prepend-icon="mdi-list-status"
                  :title="$t('pilotSheet.mobileOptions.lcpConfigTitle')"
                  :subtitle="$t('pilotSheet.mobileOptions.lcpConfigSubtitle')"
                  @click.stop="open" />
              </template>
              <lcp-config-selector :actor="pilot" />
            </cc-dialog>

            <v-list-item v-if="pilot.IsRemote"
              :loading="loading"
              :disabled="pilot.CloudController.SyncStatus === 'Synced'"
              prepend-icon="mdi-cloud-sync"
              :title="$t('pilotSheet.mobileOptions.downloadData')"
              :subtitle="pilot.CloudController.SyncStatus === 'Synced'
                ? $t('pilotSheet.mobileOptions.upToDate')
                : $t('pilotSheet.mobileOptions.downloadDesc')
                "
              @click="remoteUpdate()" />

            <v-divider />
            <cc-dialog :close-on-click="false"
              :title="$t('pilotSheet.mobileOptions.confirmDeletionTitle')"
              icon="cc:pilot">
              <template #activator="{ open }">
                <v-list-item :title="$t('pilotSheet.mobileOptions.deletePilot')"
                  :subtitle="$t('pilotSheet.mobileOptions.deletePilotSubtitle')"
                  @click.stop="open">
                  <template #prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                </v-list-item>
              </template>
              <template #default="{ close }">
                <cc-confirmation full-width
                  :content="$t('pilotSheet.mobileOptions.confirmDeletionDesc', { callsign: pilot.Callsign, name: pilot.Name, level: pilot.Level })"
                  cancellable
                  @confirm="delete_pilot(close)"
                  @cancel="close" />
              </template>
            </cc-dialog>
          </v-list>
        </v-card>
      </v-menu>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { saveFile } from '@/io/Data'
import { Pilot } from '@/class'
import { UserStore } from '@/stores'
import { CloudController } from '@/classes/components'
import CloneDialog from './CloneDialog.vue'
import StatblockDialog from './StatblockDialog.vue'
import logger from '@/user/logger'
import LcpConfigSelector from './LcpConfigSelector.vue'
import { useMobile } from '@/mixins/useMobile';

// import { RemoteSyncItem } from '@/cloud/item_sync';

export default {
  name: 'EditMenu',
  components: {
    StatblockDialog,
    CloneDialog,
    LcpConfigSelector,
  },
  mixins: [useMobile],
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    light: {
      type: Boolean,
    },
    dense: {
      type: Boolean,
    },
    size: {
      type: String,
      default: 'small',
    },
  },
  emits: ['close'],
  data: () => ({
    loading: false,
    deleteDialog: false,
    menu: false,
  }),
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    delete_pilot(close?: Function) {
      this.menu = false
      this.pilot.SaveController.Delete()
      if (close) close()
      if (this.$route.path !== '/pilot_management') this.$router.push('/pilot_management')
    },
    exportPilot(v2 = false) {
      try {
        const fileName = this.pilot.Callsign.toUpperCase().replace(/\W/g, '') + '.json'
        saveFile(
          fileName,
          Pilot.Serialize(this.pilot as Pilot),
          'Save Pilot',
          v2
        )
        this.$notify({
          title: this.$t('pilotSheet.mobileOptions.exportSuccess'),
          text: this.$t('pilotSheet.mobileOptions.exportSuccessDesc', { fileName }),
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
        logger.error(`Error syncing item: ${err}`, this, err)
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
