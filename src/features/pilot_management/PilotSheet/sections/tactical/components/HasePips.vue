<template>
  <span class="text-uppercase stat-text">{{ title }}</span>
  <span class="flavor-text text--disabled pl-2">({{ skillPoints || 0 }})</span>
  <v-tooltip :text="tooltip()">
    <template #activator="{ props }">
      <span v-bind="props">
        <v-icon v-for="n in filled"
          v-if="filled"
          :key="`filled-${n}`"
          color="secondary"
          size="large"
          icon="mdi-hexagon" />
        <v-icon v-for="n in empty"
          v-if="empty"
          :key="`empty-${n}`"
          color="secondary"
          size="large"
          icon="mdi-hexagon-outline" />
      </span>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'HasePips',
  props: {
    title: {
      type: String,
      required: true,
    },
    skillPoints: {
      type: Number,
      required: true,
    },
  },
  computed: {
    filled(): number {
      return this.skillPoints;
    },
    empty(): number {
      return 6 - this.filled;
    },
  },
  methods: {
    tooltip(): string {
      switch (this.title) {
        case 'hull':
          return this.$t('pilotSheet.tactical.haseTooltips.hull', {
            hp: this.skillPoints * 2,
            rep: Math.floor(this.skillPoints / 2),
          });
        case 'agility':
          return this.$t('pilotSheet.tactical.haseTooltips.agility', {
            eva: this.skillPoints,
            spd: Math.floor(this.skillPoints / 2),
          });
        case 'systems':
          return this.$t('pilotSheet.tactical.haseTooltips.systems', {
            edef: this.skillPoints,
            tatk: this.skillPoints,
            sp: Math.floor(this.skillPoints / 2),
          });
        case 'engineering':
          return this.$t('pilotSheet.tactical.haseTooltips.engineering', {
            heat: this.skillPoints,
            lsb: Math.floor(this.skillPoints / 2),
          });
        default:
          return '';
      }
    },
  },
};
</script>
