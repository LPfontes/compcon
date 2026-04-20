<template>
  <srd-view :title="$t('compendium.reference_pages.mechs')" :content="mechs" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import mechs from '@/assets/srd/lib/mechs.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'Mechs',
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
    mechs() {
      return mechs;
    },
  },
};
</script>
