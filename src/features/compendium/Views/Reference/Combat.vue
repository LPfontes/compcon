<template>
  <srd-view title="combat" :content="combat" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import combat from '@/assets/srd/lib/combat.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'Combat',
  components: {
    SrdView,
  },
  inheritAttrs: false,
  props: {
    preScroll: {
      type: String,
      default: '',
    },
  },
  computed: {
    combat() {
      return combat;
    },
  },
};
</script>
