<template>
  <v-row align="center" dense>
    <v-col v-if="!mobile" cols="6">
      <Radar :data="chartData" :options="chartOptions" style="max-height: 45vh" />
      <div class="px-4 mt-2">
        <v-row align="center" justify="space-around">
          <v-col>
            <cc-select
              v-model="compareFrames"
              autocomplete
              :items="getComparableFrames"
              item-title="Name"
              return-object
              :label="$t('common.selectors.compare_to')"
              density="compact"
              hide-details
              clearable
              multiple
              style="min-width: 150px" />
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col>
      <frame-statblock :frame="frame" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { Radar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js';
import { Frame } from '@/class';
import FrameStatblock from './_FrameStatblock.vue';
import { useMobile } from '@/mixins/useMobile';


ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default {
  name: 'FrameCombatChart',
  components: { Radar, FrameStatblock },
  mixins: [useMobile],
  props: {
    frame: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    compareFrames: [] as Frame[],
    statProps: [
      'HP',
      'Armor',
      'RepCap',
      'Evasion',
      'Speed',
      'EDefense',
      'TechAttack',
      'SP',
      'HeatCap',
      'SensorRange',
      'SaveTarget',
    ],
  }),
  computed: {
    getComparableFrames() {
      if (this.compareFrames.length >= 6) return this.compareFrames;
      return this.frames.filter((x) => x.ID !== this.frame.ID);
    },
    colors() {
      return [
        '#328E6E',
        '#ff00fa',
        '#4F1C51',
        '#F7374F',
        '#3A59D1',
        '#FF9B17',
        '#BBD8A3',
        '#C7D9DD',
      ];
    },
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    frames() {
      return CompendiumStore().Frames.filter(
        (x) => x.Name !== this.frame.Name && !x.ID.startsWith('missing_')
      );
    },
    isDark() {
      return this.$vuetify.theme.current.dark;
    },
    chartOptions() {
      return {
        plugins: {
          datalabels: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.dataset.label || '';
                const frame = CompendiumStore().Frames.find((x) => x.ID === tooltipItem.dataset.id);
                if (!frame) return label;
                const statName = this.labels[tooltipItem.dataIndex];
                const value = frame[this.statProps[tooltipItem.dataIndex]];
                return `${label}: ${statName} ${value}`;
              },
            },
          },
        },
        layout: {
          padding: 4,
        },
        scales: {
          r: {
            beginAtZero: true,

            angleLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
            grid: {
              color: this.isDark ? '#FFFFFF33' : '#00000033',
            },
            pointLabels: {
              color: this.isDark ? '#FFFFFF66' : '#00000066',
            },
          },
        },
      };
    },
    labels() {
      return [
        this.$t('nav.stats.hp'),
        this.$t('nav.stats.armor'),
        this.$t('nav.stats.repairCapacity'),
        this.$t('nav.stats.evasion'),
        this.$t('nav.stats.speed'),
        this.$t('nav.stats.edef'),
        this.$t('nav.stats.techAttack'),
        this.$t('nav.stats.sp'),
        this.$t('nav.stats.heatCapacity'),
        this.$t('nav.stats.sensors'),
        this.$t('nav.stats.saveTarget'),
      ];
    },
    chartData() {
      return {
        labels: this.labels,
        datasets: this.compareFrames.length
          ? [
              this.getDataset(this.frame),
              ...this.compareFrames.map((x, i) => this.getDataset(x, i, true)),
            ]
          : [this.getDataset(this.frame)],
      };
    },
  },
  methods: {
    getDataset(frame, idx?: number, compare?: boolean) {
      const dataset = {
        label: frame.Name,
        id: frame.ID,
        backgroundColor: compare
          ? this.colors[idx as number] + '1A'
          : this.$vuetify.theme.current.colors.accent + '80',
        borderColor: compare
          ? this.colors[idx as number] + 'CC'
          : this.$vuetify.theme.current.colors.accent + 'B7',
        data: [] as any[],
      };

      const FrameCompStats = frame.NormalizedStats();

      dataset.data = Object.values(FrameCompStats);

      return dataset;
    },
  },
};
</script>
