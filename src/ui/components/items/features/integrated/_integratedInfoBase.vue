<template>
  <cc-item-card :item="item" />
</template>

<script lang="ts">
export default {
  name: 'IntegratedInfoBase',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
