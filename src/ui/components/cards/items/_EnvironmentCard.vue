<template>
  <info-card-base :item="item" />
</template>

<script lang="ts">
import InfoCardBase from './_InfoCardBase.vue';

export default {
  name: 'CcEnvironmentCard',
  components: { InfoCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: { type: Boolean },
    smallTags: { type: Boolean },
    dense: { type: Boolean },
    charts: { type: Boolean },
    collapseActions: { type: Boolean },
    tier: { type: Number },
  },
};
</script>
