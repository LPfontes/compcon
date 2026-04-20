<template>
  <v-window-item>
    <v-card-title v-html-safe="title" primary-title class="heading h2" />
    <v-card-text class="text-center flavor-text">
      <p v-if="content" v-html-safe="content" class="flavor-text" />
      <slot />
    </v-card-text>
    <v-card-actions>
      <v-btn text color="warning" @click="$emit('dismiss')">dismiss</v-btn>
      <v-spacer />
      <v-btn
        v-if="!hidePrevious"
        text
        color="secondary"
        @click="$emit('previous')"
        >previous</v-btn
      >
      <slot v-if="otherBtn" name="confirm-button" />
      <v-btn
        v-else
        color="primary"
        large
        :disabled="disabled"
        @click="$emit('confirm')"
      >
        confirm
      </v-btn>
    </v-card-actions>
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'TableWindowItem',
  props: {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    otherBtn: {
      type: Boolean,
      required: false,
    },
    hidePrevious: {
      type: Boolean,
      required: false,
    },
  },
};
</script>
