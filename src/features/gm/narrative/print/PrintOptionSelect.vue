<template>
  <div v-show="items.length > 0">
    <div v-if="title" class="heading h3 text-accent pb-2">{{ title }}</div>
    <div v-else style="height: 8px" />
    <v-item-group
      :model-value="modelValue"
      :mandatory="mandatory"
      :multiple="multiple"
      @update:model-value="$emit('update:model-value', $event)"
    >
      <v-row justify="space-around" align="center">
        <v-col v-for="i in items"
          :key="(i as any).title"
          style="min-width: 16vw">
          <v-item v-slot="{ isSelected, toggle }" :value="i">
            <v-card
              :color="isSelected ? 'accent' : ''"
              class="d-flex align-center text-center"
              min-height="100%"
              variant="tonal"
              :ripple="false"
              @click="toggle"
            >
              <v-card-text>
                <v-scroll-y-transition>
                  <div>
                    <v-icon v-if="(i as any).icon" size="60">{{ (i as any).icon }}</v-icon>
                    <br v-if="(i as any).icon" />
                    <div :class="`font-weight-bold ${isSelected && 'text-white'}`">
                      {{ (i as any).title }}
                    </div>
                  </div>
                </v-scroll-y-transition>
              </v-card-text>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PrintOptionSelect',
  props: {
    modelValue: {
      type: [Object, Array],
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    items: {
      type: Array,
      required: true,
    },
    mandatory: {
      type: Boolean,
      required: false,
    },
    multiple: {
      type: Boolean,
      required: false,
    },
    widen: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['update:model-value'],
};
</script>
