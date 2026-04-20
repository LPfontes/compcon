<template>
  <srd-view :title="$t('compendium.reference_pages.pilots')" :content="pilots" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import pilots from '@/assets/srd/lib/pilots.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'Pilots',
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
    pilots() {
      return pilots;
    },
  },
};
</script>
