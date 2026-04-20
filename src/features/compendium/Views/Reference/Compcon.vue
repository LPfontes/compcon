<template>
  <srd-view title="using comp/con" :content="using_compcon" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import using_compcon from '@/assets/srd/lib/using_compcon.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'UsingCompcon',
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
    using_compcon() {
      return using_compcon;
    },
  },
};
</script>
