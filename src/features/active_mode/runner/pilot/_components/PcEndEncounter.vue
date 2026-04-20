<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-progress-check"
        @click="props.onClick($event)">
        {{ $t('activeMode.runner.endEncounter.btn') }}
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40"
          color="primary"
          class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-clock-end"
              class="mt-n1 ml-2"
              start />
            {{ $t('activeMode.runner.endEncounter.confirmTitle') }}
          </div>
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-cc-overline">// {{ $t('activeMode.runner.endEncounter.reportTitle') }}</div>
          <v-card color="background"
            class="mt-1 mb-4">
            <v-card-text class="pa-2">
              <v-row v-for="c in actionReport"
                :key="c.id"
                dense
                align="center">
                <v-col><cc-chip :bg-color="c.pilotStatus ? 'info' : 'primary'"
                    size="large"
                    flat
                    tile><span class="heading h3 text-text pr-3">{{ c.name
                      }}</span></cc-chip></v-col>
                <v-col v-if="c.status"
                  cols="auto"><v-combobox v-model="c.status"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="npcStatusTypes.map(s => ({ title: localStatus(s), value: s }))"
                    item-title="title"
                    item-value="value" /></v-col>
                <v-col v-if="c.pilotStatus"
                  cols="auto"><v-combobox v-model="c.pilotStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="pilotStatusTypes.map(s => ({ title: localStatus(s), value: s }))"
                    item-title="title"
                    item-value="value" /></v-col>
                <v-col v-if="c.mechStatus"
                  cols="auto"><v-combobox v-model="c.mechStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="mechStatusTypes.map(s => ({ title: localStatus(s), value: s }))"
                    item-title="title"
                    item-value="value" /></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div class="text-cc-overline">// {{ $t('activeMode.runner.endEncounter.resultTitle') }}</div>
          <v-row>
            <v-col>
              <v-combobox v-model="result"
                :items="['PC VICTORY', 'ENEMY VICTORY', 'STALEMATE'].map(r => ({ title: localResult(r), value: r }))"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact" />
            </v-col>
          </v-row>

          <v-divider class="my-4" />
          <v-slide-y-reverse-transition>
            <cc-alert v-if="confirm"
              color="warning"
              variant="outlined"
              :title="$t('activeMode.runner.endEncounter.confirmTitle')"
              icon="mdi-alert-outline"
              class="mb-4">
              <p class=text-text>{{ $t('activeMode.runner.endEncounter.archiveWarning') }}</p>
            </cc-alert>
          </v-slide-y-reverse-transition>
          <v-row>
            <v-col>
              <cc-button v-if="!confirm"
                block
                size=small
                color="primary"
                @click="confirm = true">{{ $t('activeMode.runner.endEncounter.btn') }}</cc-button>
              <cc-button v-else
                block
                size=small
                color="warning"
                @click="end">{{ $t('activeMode.runner.endEncounter.confirmTitle') }}</cc-button>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import * as _ from 'lodash-es';

export default {
  name: 'DamageMenu',
  props: {
    sheet: {
      type: PilotSheet,
      required: true,
    },
  },
  data: () => ({
    confirm: false,
    actionReport: [] as any[],
    result: 'PC VICTORY',
    pilotStatusTypes: [
      'COMBAT EFFECTIVE',
      'INJURED',
      'KIA',
      'MIA',
      'ESCAPED',
      'DISENGAGED',
    ],
    npcStatusTypes: [
      'OPERATIONAL',
      'DESTROYED',
      'ESCAPED',
      'DISENGAGED',
    ],
    mechStatusTypes: [
      'OPERATIONAL',
      'DESTROYED',
      'DESTROYED - REACTOR MELTDOWN',
    ],
  }),
  mounted() {
    const report = [] as any[];
    const actor = this.sheet.Pilot.CombatController.RootActor
    const out = {
      id: actor.ID,
      name: actor.CombatController.CombatName
    } as any;
    if (actor.ItemType !== 'Pilot') {
      out.status = actor.CombatController.IsDestroyed ? 'DESTROYED' : 'OPERATIONAL';
    } else {
      out.pilotStatus = 'COMBAT EFFECTIVE'
      if (actor.IsDead) out.pilotStatus = 'KIA';
      if (actor.CombatController.StatController.CurrentStats['hp'] !== actor.CombatController.StatController.MaxStats['hp']) out.pilotStatus = 'INJURED';

      const mech = actor.ActiveMech;
      out.mechStatus = 'MECH OPERATIONAL';
      if (mech.CombatController.AIControl && mech.CombatController.InCascade) out.mechStatus = 'AI CONTROL - IN CASCADE';
      if (mech.CombatController.IsDestroyed) out.mechStatus = 'MECH DESTROYED';
      if (mech.CombatController.ReactorDestroyed) out.mechStatus = 'MECH DESTROYED - REACTOR MELTDOWN';
    }

    report.push(out);

    this.actionReport = report;
  },
  methods: {
    end() {
      this.sheet.Archive();
      this.$router.replace('/active-mode/sheet-manager');
    },
    localStatus(s: string) {
      const map: any = {
        'COMBAT EFFECTIVE': 'combatEffective',
        'INJURED': 'injured',
        'KIA': 'kia',
        'MIA': 'mia',
        'ESCAPED': 'escaped',
        'DISENGAGED': 'disengaged',
        'OPERATIONAL': 'operational',
        'DESTROYED': 'destroyed',
        'DESTROYED - REACTOR MELTDOWN': 'destroyedMeltdown',
        'MECH OPERATIONAL': 'mechOperational',
        'MECH DESTROYED': 'mechDestroyed',
        'AI CONTROL - IN CASCADE': 'aiCascade'
      };
      return this.$t(`activeMode.runner.endEncounter.statuses.${map[s] || _.camelCase(s)}`);
    },
    localResult(r: string) {
      const map: any = {
        'PC VICTORY': 'pcVictory',
        'ENEMY VICTORY': 'enemyVictory',
        'STALEMATE': 'stalemate'
      };
      return this.$t(`activeMode.runner.endEncounter.results.${map[r]}`);
    }
  },

};
</script>
