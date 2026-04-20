<template>
  <div class="nav-body elevation-8">
    <div id="cap" />
    <div class="d-inline">
      <nav-item :selected="selected === 1"
        @click="$emit('to', 1)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('pilotSheet.nav.narrativeTooltip')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pilotSheet.nav.narrativeLabel') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item v-if="hasBonds"
        :selected="selected === 2"
        @click="$emit('to', 2)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('pilotSheet.nav.bondsTooltip')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pilotSheet.nav.bondsLabel') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item :selected="selected === 3"
        @click="$emit('to', 3)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('pilotSheet.nav.tacticalTooltip')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pilotSheet.nav.tacticalLabel') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item :selected="selected === 4"
        @click="$emit('to', 4)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('pilotSheet.nav.hangarTooltip')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pilotSheet.nav.hangarLabel') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
    </div>

    <div id="divider" />

    <v-tooltip v-if="pilot.IsRemote"
      open-delay="300"
      :text="isAuthed
        ? pilot.CloudController.SyncStatus === 'Synced'
          ? $t('pilotSheet.mobileOptions.upToDate')
          : $t('pilotSheet.mobileOptions.downloadDesc')
        : $t('pilotSheet.nav.loginToUpdate')
        ">
      <template #activator="{ props }">
        <v-btn icon
          variant="text"
          size="x-small"
          class="unskew ml-3"
          :disabled="!isAuthed || pilot.CloudController.SyncStatus === 'Synced'"
          :loading="loading"
          v-bind="props"
          @click="remoteUpdate()">
          <v-icon>mdi-cloud-sync</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <cc-dialog v-else
      :title="$t('pilotSheet.mobileOptions.sharePilotData')"
      icon="cc:pilot"
      :close-on-click="false">
      <template #activator="{ open }">
        <v-tooltip open-delay="300"
          location="top"
          :text="isAuthed ? $t('pilotSheet.mobileOptions.sharePilotData') : $t('pilotSheet.mobileOptions.requiresCloud')">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-btn icon
                variant="plain"
                size="x-small"
                class="unskew ml-6"
                :disabled="!isAuthed"
                @click="open">
                <v-icon color="white">mdi-broadcast</v-icon>
              </v-btn>
            </span>
          </template>
        </v-tooltip>
      </template>
      <share-dialog :pilot="pilot" />
    </cc-dialog>

    <v-tooltip open-delay="300"
      location="top"
      :text="$t('pilotSheet.mobileOptions.title')">
      <template #activator="{ props }">
        <edit-menu :pilot="pilot"
          class="unskew"
          size="x-small"
          v-bind="props"
          style="display: inline-block" />
      </template>
    </v-tooltip>

    <div id="end-cap"
      :class="bondClass" />
  </div>
</template>

<script lang="ts">
import EditMenu from './PilotEditMenu.vue'
import ShareDialog from './ShareDialog.vue'
import { Pilot } from '@/class'
import { CompendiumStore, UserStore } from '@/stores'
import NavItem from '../../_components/NavItem.vue'
import { CloudController } from '@/classes/components'

export default {
  name: 'PilotNav',
  components: {
    EditMenu,
    ShareDialog,
    NavItem,
  },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    selected: {
      type: Number,
      required: true,
    },
  },
  emits: ['to'],
  data: () => ({
    loading: false,
  }),

  computed: {
    bondClass() {
      return this.hasBonds ? 'bonds' : 'nobonds'
    },
    isAuthed() {
      return UserStore().IsLoggedIn
    },
    hasBonds() {
      return CompendiumStore().Bonds.length > 0
    },
  },
  methods: {
    delete_pilot() {
      this.pilot.SaveController.Delete()
      this.$router.push('/pilot_management')
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
  },
}
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  left: 12px;
  min-height: 19px;
  padding-left: 20px;
  padding-right: 20px;
  transform: skew(-0.65rad);
  background-color: rgb(var(--v-theme-primary));
  z-index: 10;
}

#cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 70px;
  height: 30px;
  left: -50px;
  top: 0;
  z-index: 9;
}

#end-cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 5px;
  height: 32px;
  top: 0;
  z-index: 9;
  transition: background-color 0.2s ease-in-out;
}

#end-cap.bonds {
  left: 650px;
}

#end-cap.nobonds {
  left: 580px;
}

#divider {
  width: 2px;
  min-width: 2px;
  height: 32px;
  right: 95px;
  top: 0;
  z-index: 11;
  background-color: white;
  position: absolute;
}

.unskew {
  transform: translateZ(0) skew(0.65rad);
}

.nav-body:hover #end-cap {
  background-color: rgb(var(--v-theme-accent));
}
</style>
