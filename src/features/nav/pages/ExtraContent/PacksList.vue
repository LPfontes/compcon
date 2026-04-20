<template>
  <div v-if="contentPacks.length === 0">
    <cc-alert color="primary">{{ $t('contentManager.packs.noPacks') }}</cc-alert>
  </div>
  <div v-else>
    <v-data-table v-model:expanded="expandedRows"
      :headers="headers"
      :items="contentPacks"
      item-value="Key"
      :items-per-page="-1"
      hide-default-footer
      density="compact"
      :show-expand="mobile"
      :mobile="$vuetify.display.xs">
      <template #item.toggleActive="{ item }">
        <cc-switch v-if="!item.Missing"
          :model-value="item.Active"
          size="large"
          @update:model-value="toggleActive(item.ID, item.Active)" />
        <cc-tooltip v-else
          icon="mdi-alert">
          {{ $t('contentManager.packs.missingDeps') }}
        </cc-tooltip>
      </template>
      <template #item.v3="{ item }">
        <v-tooltip v-if="item.v3"
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="success">
              mdi-check
            </v-icon>
          </template>
          {{ $t('contentManager.packs.v3Compatible') }}
        </v-tooltip>
        <v-tooltip v-else
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="error">
              mdi-cancel
            </v-icon>
          </template>
          {{ $t('contentManager.packs.v2Compatible') }}
        </v-tooltip>
      </template>
      <template #item.deleteAction="{ item }">
        <v-menu width="400px">
          <template #activator="{ props }">
            <v-btn icon
              color="error"
              variant="plain"
              v-bind="props">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              {{ $t('contentManager.packs.deleteConfirm') }}
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn size="small">{{ $t('contentManager.packs.cancel') }}</v-btn>
              <v-btn size="small"
                color="error"
                class="ml-auto"
                @click="deletePack(item.ID)">
                {{ $t('contentManager.packs.confirm') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </template>
      <template #expanded-row="{ columns, item }">
        <tr class="bg-panel">
          <td :colspan="columns.length">
            <pack-info-card :pack="<ContentPack>item" />
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-end mt-2">
      <cc-button :loading="loading"
        size="small"
        color="error"
        @click="deleteAll">
        {{ $t('contentManager.packs.deleteAll') }}
      </cc-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ContentPack } from '@/class'
import PackInfoCard from './components/PackInfoCard.vue'
import { CompendiumStore } from '@/stores'
import { useMobile } from '@/mixins/useMobile';

export default {
  name: 'PacksList',
  components: { PackInfoCard },
  mixins: [useMobile],
  data: () => ({
    expandedRows: [] as any[],
    initHeaders: [
      { title: '', key: 'data-table-expand' },
      { title: this.$t('contentManager.packs.headers.active'), value: 'toggleActive', sortable: false },
      { title: this.$t('contentManager.packs.headers.name'), value: 'Name' },
      { title: this.$t('contentManager.packs.headers.author'), value: 'Author' },
      { title: this.$t('contentManager.packs.headers.version'), value: 'Version' },
      { title: this.$t('contentManager.packs.headers.v3'), value: 'v3' },
      { title: '', value: 'deleteAction', sortable: false },
    ],
    loading: false,
  }),
  computed: {
    headers() {
      return this.mobile ? this.initHeaders.slice(1) : this.initHeaders
    },
    contentPacks() {
      return [...CompendiumStore().ContentPacks].sort((a, b) => {
        if (a.v3 !== b.v3) return a.v3 ? -1 : 1
        return a.Name.localeCompare(b.Name)
      })
    },
  },
  methods: {
    async toggleActive(packID: string, state: boolean): Promise<void> {
      try {
        await CompendiumStore().togglePackActive(packID)
        this.$notify({
          color: 'success',
          text: this.$t('contentManager.packs.notify.statusSuccess', {
            status: !state ? this.$t('contentManager.packs.notify.activated') : this.$t('contentManager.packs.notify.deactivated')
          }) as string,
        })
      } catch (e) {
        this.$notify({
          color: 'error',
          text: this.$t('contentManager.packs.notify.error', { e }) as string,
        })
      }
    },
    async deletePack(id: string): Promise<void> {
      await CompendiumStore().deleteContentPack(id)
    },
    async deleteAll() {
      this.loading = true
      await CompendiumStore().deleteAllContentPacks()
      this.$notify({
        color: 'success',
        text: this.$t('contentManager.packs.notify.deletedAll') as string,
      })
      this.loading = false
    },
    async reload() {
      // this.$emit('start-load');
      // const pilotStore =PilotStore();
      // const npcStore =NpcStore();
      // const missing = { pilots: [], npcs: [] };
      // await pilotStore.loadPilots();
      // missing.pilots = pilotStore.MissingPilots;
      // await npcStore.loadNpcs();
      // missing.npcs = npcStore.MissingNpcs;
      // await CompendiumStore().setMissingContent(missing);
      // this.$emit('end-load');
    },
  },
}
</script>

<style scoped>
.v-table :deep(.v-table__wrapper) {
  overflow: visible !important;
}
</style>
