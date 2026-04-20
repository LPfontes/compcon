<template>
  <div>
    <template v-for="(item, index) in <any[]>items" :key="`item-${index}`">
      <div v-if="item" class="my-1" :style="{ marginLeft: `${level * 6}px` }">
        <v-btn
          variant="tonal"
          :color="selected === item ? 'secondary' : ''"
          :size="level === 0 ? 'small' : 'x-small'"
          stacked
          :height="calcHeight(item)"
          width="100%"
          @click="$emit('clicked', item)">
          <span>
            <span v-if="item.Parent && item.SectionType.toLowerCase() !== 'section'">
              {{ item.ItemNumber }}.
            </span>
            {{ item.Title }}
          </span>
        </v-btn>
        <template v-if="item.Children.length">
          <IndentedList
            :items="item.Children"
            :level="level + 1"
            :selected="selected"
            @clicked="$emit('clicked', $event)" />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'IndentedList',
  props: {
    items: {
      type: Array,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      default: 0,
    },
    selected: {
      type: Object,
      required: false,
    },
  },
  emits: ['clicked'],
  methods: {
    calcHeight(item: any) {
      const len = item.Title.length;
      const linelength = len + this.level * 3;
      return Math.floor(linelength / 30) * 14 + 24;
    },
  },
};
</script>
