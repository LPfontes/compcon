<template>
  <cc-alert v-if="pilot.CombatController.IsDead"
    :title="$t('activeMode.runner.pilot.kiaTitle')"
    icon="mdi-skull"
    color="error"
    variant="outlined"
    prominent
    class="my-8">
    <p class="text-text mb-3">

      {{ $t('activeMode.runner.pilot.kiaDesc') }}
    </p>
    <div class="text-right">
      <v-btn size="x-small"
        variant="text"
        class="fade-select"
        @click="pilot.CombatController.IsDead = false">
        {{ $t('activeMode.runner.common.override') }}
      </v-btn>
    </div>
  </cc-alert>

  <panel-base v-else
    :encounter-instance="encounterInstance"
    :item="pilot">
    <template #name-block>
      <div class="heading h2">{{ pilot.Callsign }}</div>
      <div class="heading h4">{{ pilot.Name }}</div>

      <cc-alert v-if="pilot.CombatController.HasStatus('downandout')"
        :title="$t('activeMode.runner.pilot.downTitle')"
        icon="mdi-medical-bag"
        color="primary"
        class="mr-6">
        {{ $t('activeMode.runner.pilot.downDesc') }}
      </cc-alert>
    </template>

    <template #action-palette>
      <v-row no-gutters>
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="pilot.ActiveMech.CombatController.Mounted ? 'primary' : 'panel'"
            :text="$t('activeMode.runner.common.palette.mounted')"
            @click="setMounted" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="pilot.CombatController.Overwatch ? 'primary' : 'panel'"
            :text="$t('activeMode.runner.common.palette.overwatch')"
            @click="pilot.CombatController.Overwatch = !pilot.CombatController.Overwatch" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="pilot.CombatController.Prepared ? 'primary' : 'panel'"
            :text="$t('activeMode.runner.common.palette.prepared')"
            @click="pilot.CombatController.Prepared = !pilot.CombatController.Prepared" />
        </v-col>
      </v-row>
    </template>

    <template #actions>
      <pilot-actions-panel :owner="combatant"
        :encounter="encounterInstance" />
    </template>

    <v-expansion-panels class="mt-2"
      multiple
      flat
      tile
      bg-color="background"
      variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:talent"
              class="mt-n1"
              start />
            {{ $t('activeMode.runner.common.sections.talents', { count: pilot.TalentsController.Talents.length }) }}
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <cc-masonry-grid :items="pilot.TalentsController.Talents"
            :xl-columns="xlColumns">
            <template #default="{ item }">
              <cc-talent :key="item.Talent.ID"
                rank-view
                :talent="item.Talent"
                :rank="item.Rank"
                hide-locked
                hide-change>
                <template #combat>
                  <div v-if="item.Talent.AllActions?.length"
                    class="mb-2 mt-1">
                    <cc-combat-action-chip v-for="a in item.Talent.AllActions"
                      :key="a.ID"
                      :action="a"
                      :owner="combatant"
                      :encounter="encounterInstance" />
                  </div>
                  <div v-if="item.Talent.AllDeployables?.length"
                    class="mb-2">
                    <deploy-button v-for="d in item.Talent.AllDeployables"
                      :key="d.ID"
                      :deployable="d"
                      :actor="pilot"
                      @deploy="deploy($event)" />
                  </div>
                </template>
              </cc-talent>
            </template>
          </cc-masonry-grid>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="text-cc-overline mt-4 text-disabled">{{ $t('activeMode.runner.common.sections.loadout') }}</div>
    <pilot-combat-loadout :encounter-instance="encounterInstance"
      :owner="combatant"
      @deploy="deploy($event)" />
  </panel-base>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile';
import PanelBase from './_PanelBase.vue';
import PilotActionsPanel from './_components/PilotActionsPanel.vue';
import PilotCombatLoadout from './_components/loadouts/PilotCombatLoadout.vue';
import DeployButton from './_components/loadouts/_deployButton.vue';

export default {
  name: 'PcPanel',
  components: {
    PanelBase,
    PilotActionsPanel,
    PilotCombatLoadout,
    DeployButton,
  },
  mixins: [useMobile],
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  emits: ['deselect'],
  computed: {
    xlColumns() {
      if (this.mobile) return 1
      else return this.encounterInstance.MaxMasonryColumns
    },
    pilot() {
      return this.combatant.actor;
    },
  },
  methods: {
    deploy(deployable) {
      this.encounterInstance.Deploy(deployable, this.combatant);
    },
    setMounted() {
      this.pilot.ActiveMech.CombatController.ToggleMounted();
    },
  },
};
</script>
