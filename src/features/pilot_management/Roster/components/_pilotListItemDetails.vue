<template>
  <div
    style="font-size: 14px"
    class="flavor-text"
  >
    <div>
      <v-icon
        icon="cc:skill"
        start
      />
      <span
        v-if="!pilot.SkillsController.Skills.length"
        style="opacity: 0.6"
        v-text="$t('roster.pilotListItem.noData')"
      />
      <span
        v-for="(s, i) in pilot.SkillsController.Skills"
        :key="s.Skill.ID"
      >
        {{ s.Skill.Name }} {{ 'I'.repeat(s.Rank) }}
        <cc-slashes
          v-if="Number(i) < pilot.SkillsController.Skills.length - 1"
          class="pr-3"
          style="opacity: 0.4"
        />
      </span>
    </div>

    <div>
      <v-icon
        icon="cc:talent"
        start
      />
      <span
        v-if="!pilot.TalentsController.Talents.length"
        style="opacity: 0.6"
        v-text="$t('roster.pilotListItem.noData')"
      />
      <span
        v-for="(s, i) in pilot.TalentsController.Talents"
        :key="s.Talent.ID"
      >
        {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
        <cc-slashes
          v-if="Number(i) < pilot.TalentsController.Talents.length - 1"
          class="pr-3"
          style="opacity: 0.4"
        />
      </span>
    </div>

    <div
      v-if="pilot.CoreBonusController.CoreBonuses.length"
      cols="auto"
    >
      <v-icon
        icon="cc:corebonus"
        start
        class="mt-n1"
      />
      <span
        v-for="(b, i) in pilot.CoreBonusController.CoreBonuses"
        :key="b.ID"
      >
        {{ b.Name }}
        <cc-slashes
          v-if="Number(i) < pilot.CoreBonusController.CoreBonuses.length - 1"
          class="pr-3"
          style="opacity: 0.4"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import { PropType } from 'vue'
  import { Pilot } from '@/class'

  export default {
    name: 'PilotListItemDetails',
    props: {
      pilot: { type: Object as PropType<Pilot>, required: true },
    },
  }
</script>
