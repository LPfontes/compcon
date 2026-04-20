<template>
  <div class="bordered-primary px-2 pt-2 pb-6">
    <v-row dense>
      <v-col>
        <div class="heading h1 mt-n3">
          {{ pilot.Callsign || $t('pilotSheet.registration.errCallsign') }}
        </div>
        <div class="heading h4 mt-n3">&nbsp;({{ pilot.Name || $t('pilotSheet.registration.errName') }})</div>
        <div class="flavor-text">
          {{ $t('pilotSheet.registration.recordTitle') }}
          {{ pilot.ID }}
        </div>
      </v-col>
      <v-col v-if="!portrait" md="auto">
        <v-icon size="70" icon="cc:orbital" />
      </v-col>
    </v-row>

    <div class="px-4">
      <div>
        <span v-if="!pilot.Name" class="flavor-text">
          {{ $t('pilotSheet.registration.errUuid') }}
        </span>
        <span v-else class="flavor-text">
          {{ flipName(pilot.Name) }}:{{ pilot.ID }}//NDL-C-{{ missionName() }}
        </span>
      </div>
      <v-row dense>
        <v-col cols="12" md="8">
          <v-row density="compact">
            <v-col cols="12" md="8">
              <span class="flavor-text">
                {{ $t('pilotSheet.registration.callsignLabel') }}
                <br v-if="portrait" />
                <b class="text-accent">{{ pilot.Callsign || $t('pilotSheet.registration.errCallsign') }}</b>
                <br />
                {{ $t('pilotSheet.registration.nameAliasLabel') }}
                <br v-if="portrait" />
                <b class="text-accent">{{ pilot.Name || $t('pilotSheet.registration.errName') }}</b>
                <br />
                {{ $t('pilotSheet.registration.backgroundLabel') }}
                <br v-if="portrait" />
                <b class="text-accent">
                  {{ pilot.Background || $t('pilotSheet.registration.errBackground') }}
                </b>
              </span>
            </v-col>
            <v-col v-if="!$vuetify.display.mdAndDown">
              <span class="flavor-text text-disabled">
                {{ pilot.Callsign ? $t('pilotSheet.registration.callsignAvailable') : '--' }}
                <br />
                {{ pilot.Name ? $t('pilotSheet.registration.identityVerified') : '--' }}
                <br />
                {{ pilot.Background ? $t('pilotSheet.registration.phHrRegistered') : '--' }}
              </span>
            </v-col>
          </v-row>
          <div class="flavor-text mt-2">
            {{ $t('pilotSheet.registration.frameConfig') }}
            <span class="text-disabled">{{ $t('pilotSheet.registration.haseVault') }}</span>
          </div>
          <div class="my-1">
            <span class="flavor-text ml-3" style="font-size: 22px; line-height: 15px">
              [ {{ $t('pilotSheet.registration.hull') }}
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Hull }}&emsp;
              </span>
              {{ $t('pilotSheet.registration.agi') }}
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Agi }}&emsp;
              </span>
              {{ $t('pilotSheet.registration.sys') }}
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Sys }}&emsp;
              </span>
              {{ $t('pilotSheet.registration.eng') }}
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Eng }}
              </span>
              ]
            </span>
          </div>
          <v-row class="mt-2">
            <v-col cols="12" md="6">
              <span class="flavor-text">{{ $t('pilotSheet.registration.skillAudit') }}</span>
              <br />
              <span v-if="!pilot.SkillsController.Skills.length" class="stat-text text-accent">
                &nbsp;{{ $t('pilotSheet.registration.errSkillAudit') }}
              </span>
              <v-chip
                v-for="s in pilot.SkillsController.Skills"
                v-else
                :key="s.Skill.ID"
                color="accent"
                class="ma-1"
                variant="outlined"
                label
                small>
                <v-icon start>cc:skill</v-icon>
                {{ s.Skill.Trigger }}
              </v-chip>
            </v-col>
            <v-col cols="12" md="6">
              <span class="flavor-text">{{ $t('pilotSheet.registration.talentAudit') }}</span>
              <br />
              <span v-if="!pilot.TalentsController.Talents.length" class="stat-text text-accent">
                &nbsp;{{ $t('pilotSheet.registration.errTalentAudit') }}
              </span>
              <v-chip
                v-for="t in pilot.TalentsController.Talents"
                v-else
                :key="t.Talent.ID"
                color="accent"
                class="ma-1"
                variant="outlined"
                label
                small>
                <v-icon start>cc:talent</v-icon>
                {{ t.Talent.Name }} {{ 'I'.repeat(t.Rank) }}
              </v-chip>
            </v-col>
          </v-row>
          <v-row density="compact">
            <span v-if="pilotReady" class="flavor-text text-disabled">
              <v-icon large color="grey darken-2">mdi-fingerprint</v-icon>
              {{ $t('pilotSheet.registration.biometricValid') }} [[{{ randomNumber(13, 22) }}PB]] :: OHM C//{{ futureDate() }}
            </span>
          </v-row>
        </v-col>
        <v-col>
          <div class="border ml-auto mr-auto text-center" style="width: 300px; height: 300px">
            <cc-avatar
              v-if="pilot.PortraitController.Avatar"
              :avatar="pilot.PortraitController.Avatar"
              :size="300" />
            <cc-img
              v-else-if="pilot.Portrait"
              :src="pilot.Portrait"
              aspect-ratio="1"
              position="top center" />
          </div>
        </v-col>
      </v-row>
      <v-divider class="ma-2" />
      <v-row dense>
        <span class="text-overline" style="line-height: 13px !important; opacity: 0.4">
          {{ $t('pilotSheet.registration.legalFooter') }}&emsp;&emsp;V-CDL//M-265-114-831 (A)
        </span>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { mission } from '@/io/Generators';

export default {
  name: 'PilotRegistrationCard',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    pilotReady: {
      type: Boolean,
    },
  },
  computed: {
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
  },
  methods: {
    flipName(name: string): string {
      const suffixes = ['II', 'III', 'IV', 'V', 'VI', 'VII'];
      const nArr = name.split(' ');
      let last = nArr.pop() || '';

      if (suffixes.includes(last)) last = nArr.pop() || '';
      nArr.unshift(last);
      return nArr.join('.').replace('-', '.');
    },
    missionName(): string {
      return mission().replace(' ', '-');
    },
    futureDate(): string {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 3000);
      return d.toISOString();
    },
    randomNumber(max, min): number {
      const rand = Math.random() * (max - min) + min;
      const power = Math.pow(10, 2);
      return Math.floor(rand * power) / power;
    },
  },
};
</script>
