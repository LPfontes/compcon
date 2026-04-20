<template>
  <v-container>
    <div class="heading h2"> {{ $t('activeMode.manager.title') }}</div>

    <div class="my-1">
      <v-tooltip location="top"
        open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="panel"
            flat
            tile
            size="small"
            @click="setSort('Updated')">
            <v-icon icon="mdi-clock-outline"
              size="20"
              color="accent" />
            <v-icon v-if="sort === 'Updated'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1" />
          </v-btn>
        </template>
        <span>{{ $t('activeMode.manager.sortRecent') }}</span>
      </v-tooltip>

      <v-tooltip location="top"
        open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="panel"
            flat
            tile
            size="small"
            @click="setSort('Name')">
            <v-icon icon="mdi-format-text-variant"
              size="24"
              color="accent" />
            <v-icon v-if="sort === 'Name'"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1"
              color="accent" />
          </v-btn>
        </template>
        <span>{{ $t('activeMode.manager.sortName') }}</span>
      </v-tooltip>

      <v-tooltip location="top"
        open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="panel"
            flat
            tile
            size="small"
            @click="setSort('Created')">
            <v-icon icon="mdi-calendar"
              size="21"
              color="accent" />
            <v-icon v-if="sort === 'Created'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1" />
          </v-btn>
        </template>
        <span>{{ $t('activeMode.manager.sortCreated') }}</span>
      </v-tooltip>
    </div>

    <sheet-item v-for="sheet in activeSheets"
      :key="sheet.ID"
      :sheet="sheet"
      @launch="launch(sheet)"
      @archive="sheet.Archive()"
      @export="exportSheet(sheet)"
      @delete="sheet.SaveController.Delete()" />

    <v-divider class="my-5" />
    <v-row dense>
      <v-col>
        <cc-button prepend-icon="mdi-plus"
          block
          color="primary"
          to="/active-mode/new-sheet"
          class="mb-2">
          {{ $t('activeMode.manager.newSheet') }}
        </cc-button>
      </v-col>
      <v-col cols="12"
        md="auto">
        <cc-button prepend-icon="mdi-file-import"
          block
          :size="mobile ? 'x-small' : ''"
          color="primary"
          class="mb-2"
          @click="importSelect()">
          {{ $t('activeMode.manager.import') }}
        </cc-button>
      </v-col>
    </v-row>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          {{ $t('activeMode.manager.archivedTitle', { count: archived.length }) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="mb-4"
            style="max-width: 400px;">
            <cc-text-field v-model="search"
              icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              clearable
              class="mb-4" />
          </div>
          <div v-if="archived.length === 0"
            class="text-center text-cc-overline text-disabled">
            <i>{{ search ? $t('activeMode.manager.noArchivedSearch', { search: search }) : $t('activeMode.manager.noArchived') }}</i>
          </div>
          <v-row v-for="e in archived"
            :key="e.ID"
            class="text-cc-overline bg-background my-1"
            align="center">
            <v-col cols="auto"
              style="height: 100%">
              {{ e.Name }}
              <br>
              <v-card v-if="e.Combatant.actor.CombatController.IsDead"
                class="px-1 bg-error text-center">
                {{ $t('activeMode.manager.status.kia') }}
              </v-card>
              <v-card v-else
                class="px-1 bg-success text-center">
                {{ $t('activeMode.manager.status.active') }}
              </v-card>
            </v-col>
            <v-col cols="auto">
              <div>
                <span class="text-disabled mr-1">{{ $t('activeMode.manager.labels.created') }}</span>
                <b>{{ new Date(e.Created).toLocaleDateString() }}</b>
              </div>
              <div>
                <span class="text-disabled mr-1">{{ $t('activeMode.manager.labels.archived') }}</span>
                <b>{{ new Date(e.Updated).toLocaleDateString() }}</b>
              </div>
            </v-col>
            <v-col class="text-center">
              <cc-dialog :close-on-click="false"
                :title="$t('activeMode.manager.telemetry.title', { name: e.Name })">
                <template #activator="{ open }">
                  <cc-button size="small"
                    color="primary"
                    disabled
                    block
                    :tooltip="$t('activeMode.manager.telemetry.saveTooltip')"
                    @click="open()">{{ $t('activeMode.manager.telemetry.saveBtn') }}</cc-button>
                  <div class="text-cc-overline text-disabled">{{ $t('activeMode.manager.telemetry.wip') }}</div>
                </template>
                <v-card flat
                  tile>
                  <v-card-text>
                    <v-alert density="compact"
                      class="text-caption mt-2 mb-4"
                      flat
                      tile
                      color="panel"
                      border=start
                      border-color="red">{{ $t('activeMode.manager.telemetry.wipAlert') }}
                    </v-alert>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-title class="heading">
                          {{ $t('activeMode.manager.telemetry.encounterNum') }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="bg-background">
                          <code class="text-left "
                            style="white-space: pre-wrap; word-break: break-word;">
                        <v-row dense>
                          <v-col>
                            <div class="text-disabled mb-1">{{ $t('activeMode.manager.telemetry.battlefieldTelemetry') }}</div>
                            <div class="text-disabled mb-1">---------------------</div>
                            <!-- {{ formatTelemetry(a.telemetry) }} -->
                          </v-col>
                          <v-col style="max-height: 800px; overflow-y: scroll;">
                            <div class="text-disabled mb-1">{{ $t('activeMode.manager.telemetry.combatLogs') }}</div>
                            <div class="text-disabled mb-1">---------------------</div>
                            <div class="mb-2">
                              <!-- {{ formatLogEntry(log) }} -->
                            </div>
                          </v-col>
                        </v-row>
                      </code>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                  <v-card-actions>
                    <cc-button color="primary">
                      {{ $t('activeMode.manager.telemetry.exportBtn') }}
                    </cc-button>
                  </v-card-actions>
                </v-card>
              </cc-dialog>
            </v-col>

            <v-col cols="auto"
              class="ml-auto">
              <v-menu max-width="350">
                <template #activator="{ props }">

                  <v-btn icon
                    flat
                    tile
                    v-bind="props"
                    variant="text">
                    <v-icon icon="mdi-delete" />
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <b>{{ $t('activeMode.manager.delete.title') }}</b>
                    <br>
                    <p class="text-caption text--text mb-2">
                      {{ $t('activeMode.manager.delete.confirm') }}
                    </p>
                    <cc-button size="small"
                      block
                      color="primary"
                      @click="e.SaveController.Delete()">
                      {{ $t('activeMode.manager.delete.btn') }}
                    </cc-button>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>


  </v-container>
</template>

<script lang="ts">
import { PilotStore } from '@/stores';
import SheetItem from './_components/SheetItem.vue';
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'SheetManager',
  components: {
    SheetItem,
  },
  mixins: [useMobile],
  data: () => ({
    sort: 'Updated',
    asc: true,
    search: '',
  }),
  computed: {
    activeSheets() {
      let sheets = PilotStore().PilotSheets.filter(x => !x.Archived && !x.SaveController.IsDeleted);

      switch (this.sort) {
        case 'Name':
          if (this.asc) sheets = sheets.sort((a, b) => a.Name.localeCompare(b.Name));
          else
            sheets = sheets.sort((a, b) => b.Name.localeCompare(a.Name));
          break;
        case 'Created':
          if (this.asc) sheets = sheets.sort((a, b) => a.Created - b.Created);
          else
            sheets = sheets.sort((a, b) => b.Created - a.Created);
          break;
        case 'Updated':
          if (this.asc) sheets = sheets.sort((a, b) => a.Updated - b.Updated);
          else
            sheets = sheets.sort((a, b) => b.Updated - a.Updated);
          break;
      }
      return sheets;
    },
    archived() {
      let archives = PilotStore().PilotSheets.filter(x => x.Archived && !x.SaveController.IsDeleted);

      if (this.search) {
        const searchLower = this.search.toLowerCase();
        archives = archives.filter(x => x.Name.toLowerCase().includes(searchLower));
      }

      return archives.sort((a, b) => b.Updated - a.Updated);
    },

  },
  methods: {
    setSort(sort) {
      if (this.sort === sort) {
        this.asc = !this.asc;
      } else {
        this.sort = sort;
        this.asc = true;
      }
    },
    launch(sheet) {
      PilotStore().SetActiveSheet(sheet.ID);
      this.$router.push(`pilot-runner/${sheet.ID}`);
    },
    exportSheet(sheet) {
      const out = JSON.stringify(PilotSheet.Serialize(sheet), null, 2);

      const blob = new Blob([out], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sheet.Name}_sheet.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    importSelect() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target?.result as string);
            const sheet = PilotSheet.Deserialize(json);
            PilotStore().PilotSheets.push(sheet);
            PilotStore().SetActiveSheet(sheet.ID);
            this.$router.push(`pilot-runner/${sheet.ID}`);
          } catch (error) {
            alert(this.$t('activeMode.manager.importError'));
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }
  },
};
</script>
