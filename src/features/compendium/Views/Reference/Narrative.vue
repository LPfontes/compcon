<template>
  <srd-view :title="$t('compendium.reference_pages.narrativePlay')" :content="narrative" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import narrative from '@/assets/srd/lib/narrative_play.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'Narrative',
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
    narrative() {
      return narrative;
    },
  },
};
</script>
