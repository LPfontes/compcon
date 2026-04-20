<template>
  <v-card-text>
    <div class="mb-4">
      <cc-alert
        :color="pilot.MechSkillsController.IsMissingHASE ? 'warning' : 'success'"
        class="stat-text text-center"
      >
        {{
          $t('pilotSheet.tactical.editHase', {
            current: pilot.MechSkillsController.CurrentHASEPoints,
            max: pilot.MechSkillsController.MaxHASEPoints,
          })
        }}
      </cc-alert>
      <div class="text-right">
        <v-btn
          size="x-small"
          color="accent"
          variant="text"
          @click="pilot.MechSkillsController.Reset()"
        >
          {{ $t('common.selectors.reset') }} {{ $t('pilotSheet.tactical.haseTitle') }}
        </v-btn>
      </div>
    </div>

    <v-row align="center">
      <v-col
        v-for="s in skills"
        :key="`skill_col_${s.text}`"
        cols="12"
        md="6"
        class="mb-6"
      >
        <div class="heading h3 text-accent">
          {{ s.text }}
        </div>
        <p
          v-html-safe="s.description"
          class="flavor-text px-2 mb-3"
        />
        <v-row
          no-gutters
          justify="center"
          align="start"
        >
          <v-col style="max-width: 500px">
            <cc-tickbar
              :model-value="pilot.MechSkillsController[s.val]"
              :icon="!mobile ? s.icon : undefined"
              :size="mobile ? 'small' : 'default'"
              color="accent"
              controls
              :stop-add="pilot.MechSkillsController.HasFullHASE"
              :max="6"
              @update:model-value="pilot.MechSkillsController[s.val] = $event"
            />
          </v-col>
        </v-row>
        <div class="text-center py-2">
          <span
            v-for="(b, i) in s.bonuses"
            :key="`bonus_${s.val}_${i}`"
            class="heading h3"
          >
            {{ b.text }}
            <span class="text-accent">+{{ b.value }}</span>
            <cc-slashes
              v-if="s.bonuses.length > i + 1"
              class="mx-2"
            />
          </span>
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
  import { Pilot } from '@/class'
  import { useMobile } from '@/mixins/useMobile'

  export default {
    name: 'MechSkillsSelector',
    mixins: [useMobile],
    props: {
      pilot: { type: Pilot, required: true },
    },
    computed: {
      skills() {
        return [
          {
            val: 'Hull',
            icon: 'mdi-alpha-h-box-outline',
            text: this.$t('pilotSheet.tactical.hull'),
            description: this.$t('pilotSheet.tactical.hullDesc'),
            bonuses: [
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.hp'),
                value: this.pilot.MechSkillsController.MechSkills.Hull * 2,
              },
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.rep'),
                value: Math.floor(this.pilot.MechSkillsController.MechSkills.Hull / 2),
              },
            ],
          },
          {
            val: 'Agi',
            icon: 'mdi-alpha-a-box-outline',
            text: this.$t('pilotSheet.tactical.agi'),
            description: this.$t('pilotSheet.tactical.agiDesc'),
            bonuses: [
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.eva'),
                value: this.pilot.MechSkillsController.MechSkills.Agi,
              },
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.spd'),
                value: Math.floor(this.pilot.MechSkillsController.MechSkills.Agi / 2),
              },
            ],
          },
          {
            val: 'Sys',
            icon: 'mdi-alpha-s-box-outline',
            text: this.$t('pilotSheet.tactical.sys'),
            description: this.$t('pilotSheet.tactical.sysDesc'),
            bonuses: [
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.edef'),
                value: this.pilot.MechSkillsController.MechSkills.Sys,
              },
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.tatk'),
                value: this.pilot.MechSkillsController.MechSkills.Sys,
              },
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.sp'),
                value: Math.floor(this.pilot.MechSkillsController.MechSkills.Sys / 2),
              },
            ],
          },
          {
            val: 'Eng',
            icon: 'mdi-alpha-e-box-outline',
            text: this.$t('pilotSheet.tactical.eng'),
            description: this.$t('pilotSheet.tactical.engDesc'),
            bonuses: [
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.heat'),
                value: this.pilot.MechSkillsController.MechSkills.Eng,
              },
              {
                text: this.$t('pilotSheet.tactical.bonusLabels.lsb'),
                value: Math.floor(this.pilot.MechSkillsController.MechSkills.Eng / 2),
              },
            ],
          },
        ]
      },
    },
    watch: {
      'pilot.MechSkillsController.IsMissingHASE': function (newVal) {
        if (newVal === false) window.scrollTo(0, document.body.scrollHeight)
      },
      'pilot.MechSkillsController.CurrentHASEPoints': function () {
        this.pilot.SaveController.save()
      },
    },
    methods: {
      calcMax(skill: any) {
        return (
          this.pilot.MechSkillsController.MaxHASEPoints -
          this.pilot.MechSkillsController.CurrentHASEPoints +
          this.pilot.MechSkillsController.MechSkills[skill.val]
        )
      },
    },
  }
</script>

<style scoped>
  .bonus-text {
    position: relative;
    bottom: 20px;
  }
</style>
