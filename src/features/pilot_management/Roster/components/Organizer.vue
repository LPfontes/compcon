<template>
  <v-card-text>
    <v-row>
      <v-col>
        <v-row align="center"
          dense>
          <v-col><v-divider /></v-col>
          <v-col cols="auto">{{ $t('roster.organizer.itemsCount', items.length) }}</v-col>
        </v-row>
        <v-table>
          <thead class="heading">
            <tr>
              <th width="1px">
                <v-btn icon
                  flat
                  size="small"
                  :value="selected.length === items.length"
                  hide-details
                  @click="
                    selected.length ? (selected = []) : (selected = items.map((x: any) => x.ID))
                    ">
                  <v-icon size="x-large"
                    :icon="selected.length === items.length
                      ? 'mdi-checkbox-outline'
                      : selected.length > 0
                        ? 'mdi-minus-box-outline'
                        : 'mdi-checkbox-blank-outline'
                      " />
                </v-btn>
              </th>
              <th>{{ $t('roster.organizer.name') }}</th>
              <th>{{ $t('roster.organizer.callsign') }}</th>
              <th>{{ $t('roster.organizer.licenseLevel') }}</th>
              <th>{{ $t('roster.organizer.group') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.ID">
              <td>
                <v-checkbox v-model="selected"
                  multiple
                  :value="(item as any).ID"
                  hide-details />
              </td>
              <td :class="item.SaveController.IsDeleted ? 'text-error text-decoration-line-through' : ''
                ">
                {{ (item as any).Name }}
              </td>
              <th>
                {{ item.Callsign }}
              </th>
              <th>
                {{ item.Level }}
              </th>
              <th>
                <v-chip size="small"
                  label
                  prepend-icon="mdi-account-group">
                  {{ getPilotGroup(item) }}
                </v-chip>
              </th>
            </tr>
          </tbody>
        </v-table>
        <v-row dense
          justify="end">
          <v-col cols="auto">
            <v-checkbox v-model="showDeleted"
              density="compact"
              :label="$t('roster.organizer.showDeleted')" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto"
        style="width: 350px">
        <div>
          <b class="text-accent">{{ selected.length }}</b>
          {{ $t('roster.organizer.selectedCount', selected.length).replace(selected.length.toString(), '').trim() }}
        </div>
        <v-list>
          <v-list-item :title="$t('roster.organizer.setGroup')"
            :subtitle="$t('roster.organizer.setGroupSubtitle')"
            prepend-icon="mdi-account-group"
            :disabled="!selected.length"
            @click="setGroupDialog = true" />
          <!-- <v-list-item
            :title="selected.length < 2 ? 'Print' : 'Print Multiple'"
            subtitle="Generate item printables"
            prepend-icon="mdi-printer"
            :disabled="!selected.length"
            @click="printDialog = true" /> -->
          <v-list-item :title="selected.length < 2 ? $t('roster.organizer.export') : $t('roster.organizer.exportMulti')"
            :subtitle="selected.length < 2 ? $t('roster.organizer.exportSubtitle') : $t('roster.organizer.exportMultiSubtitle')
              "
            prepend-icon="mdi-upload"
            :disabled="!selected.length"
            @click="exportItems()" />
          <v-list-item :title="selected.length < 2 ? $t('roster.organizer.delete') : $t('roster.organizer.deleteMulti')"
            :subtitle="selected.length < 2 ? $t('roster.organizer.deleteSubtitle') : $t('roster.organizer.deleteMultiSubtitle')
              "
            prepend-icon="mdi-delete"
            :disabled="!selected.length"
            @click="deleteItems()" />
          <v-list-item v-if="showDeleted"
            :title="selected.length < 2 ? $t('roster.organizer.restore') : $t('roster.organizer.restoreMulti')"
            :subtitle="selected.length < 2
              ? $t('roster.organizer.restoreSubtitle')
              : $t('roster.organizer.restoreMultiSubtitle')
              "
            prepend-icon="mdi-file-restore-outline"
            :disabled="!selected.length"
            @click="deleteItems(true)" />
          <v-list-item v-if="showDeleted && !showDeleteConfirm"
            :title="$t('roster.organizer.deletePerm')"
            variant="elevated"
            elevation="0"
            :subtitle="$t('roster.organizer.deletePermSubtitle')"
            prepend-icon="mdi-delete-forever-outline"
            base-color="warning"
            :disabled="!selected.length"
            @click="showDeleteConfirm = true" />
          <v-divider v-if="showDeleteConfirm" />
          <v-list-item v-if="showDeleteConfirm"
            :title="$t('roster.organizer.confirmPerm')"
            :subtitle="$t('roster.organizer.confirmPermSubtitle')"
            prepend-icon="mdi-exclamation-thick"
            :disabled="!selected.length"
            base-color="error"
            @click="deleteItemsPermanent()" />
          <v-list-item v-if="showDeleteConfirm"
            :title="$t('roster.organizer.cancelPerm')"
            prepend-icon="mdi-cancel"
            base-color="accent"
            @click="showDeleteConfirm = false" />
        </v-list>
      </v-col>
    </v-row>
  </v-card-text>
  <v-dialog v-model="setGroupDialog"
    max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>{{ $t('roster.organizer.setGroup') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon
          @click="setGroupDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-select v-model="stagedGroup"
          :items="allGroups"
          :label="$t('roster.organizer.pilotGroupLabel')"
          item-title="Name"
          return-object
          variant="outlined"
          density="compact"
          clearable
          hide-details />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text"
          @click="setGroupDialog = false">{{ $t('roster.organizer.cancel') }}</v-btn>
        <v-spacer />
        <v-btn variant="text"
          color="accent"
          @click="setGroup">{{ $t('roster.organizer.set') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import * as _ from 'lodash-es';
import { PilotStore } from '../../store';
import exportAsJson from '@/util/jsonExport';
import { PilotGroup } from '../../store/PilotGroup';

export default {
  name: 'Organizer',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selected: [] as any[],
    addKvp: {
      key: '',
      value: '',
    },
    printDialog: false,
    deleteDialog: false,
    showDeleted: false,
    setGroupDialog: false,
    stagedGroup: null,
    showDeleteConfirm: false,
  }),
  computed: {
    items() {
      return PilotStore().Pilots.filter(
        (x: any) => this.showDeleted || !x.SaveController.IsDeleted
      );
    },
    allGroups() {
      return PilotStore().getPilotGroups();
    },
  },
  methods: {
    async setGroup() {
      for (const id of this.selected) {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item) {
          await PilotStore().TransferPilot(item, this.stagedGroup ? (this.stagedGroup as PilotGroup).ID : undefined);
        }
      }

      this.stagedGroup = null;
      this.setGroupDialog = false;
      await PilotStore().SaveGroupData();
      await PilotStore().SavePilotData();
    },
    exportItems() {
      let json = {} as any;
      let filename = '';
      if (this.selected.length === 1) {
        const item = this.items.find((x: any) => x.ID === this.selected[0]);
        if (item) {
          json = (item as any).Serialize();
          filename = (item as any).Name + '.json';
        }
      } else {
        const data = this.items.filter((x: any) => this.selected.includes(x.ID));
        json = {
          type: `pilot_collection`,
          item_count: data.length,
          data: data.map((x: any) => x.Serialize()),
        };
        filename = `roster_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`;
      }

      exportAsJson(json, filename);
    },
    deleteItems(undelete: boolean = false) {
      this.selected.forEach((id) => {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item) {
          if (undelete) item.SaveController.Restore();
          else item.SaveController.Delete();
        }
      });
      this.selected = [];
      PilotStore().SavePilotData();
      PilotStore().SaveGroupData();
    },
    async deleteItemsPermanent() {
      const promises = [] as Promise<any>[];
      this.selected.forEach((id) => {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item && item.SaveController.IsDeleted) {
          promises.push(PilotStore().DeletePilotPermanent(item));
        }
      });
      await Promise.all(promises);

      this.selected = [];
      this.showDeleteConfirm = false;
    },
    getPilotGroup(item: any) {
      const group = PilotStore().PilotGroups.find((x) => x.Pilots.some((y) => y.id === item.ID));
      return group ? group.Name : this.$t('roster.organizer.none');
    },
  },
};
</script>
