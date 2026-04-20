<template>
  <stepper-content :complete="pilot.HasIdent"
    mandatory
    exit="../pilot_management"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotRegistration.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotRegistration.identService') }}
      <cc-slashes />
      {{ $t('pilotRegistration.personnelPilot') }}
    </div>
    <p class="flavor-text"
      style="font-size: 14px">
      {{ $t('pilotRegistration.identWelcome') }}
    </p>
    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2">
      <div class="heading">
        {{ $t('pilotRegistration.fieldsWarning', { icon: '' }) }}
        <v-icon color="error"
          size="small"
          class="mt-n1">mdi-alert</v-icon>
        {{ $t('pilotRegistration.fieldsWarning').split('{icon}')[1] }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pilotRegistration.truthAttestation') }}
      </p>
    </v-alert>

    <v-row dense>
      <v-col cols="12"
        md="5"
        class="mr-auto">
        <div class="my-2">
          <div v-if="!mobile"
            class="text-caption">{{ $t('pilotRegistration.fullNameLabel') }}</div>
          <div v-else
            class="text-caption">{{ $t('pilotRegistration.pilotNameLabel') }}</div>
          <cc-text-field v-model="pilot.Name"
            variant="outlined"
            :placeholder="$t('pilotRegistration.namePlaceholder')"
            :icon="pilot.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Name ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                :tooltip="$t('pilotRegistration.randomName')"
                @click="randomName()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotRegistration.callsignLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotRegistration.callsignLabelShort') }}</div>
          <cc-text-field v-model="pilot.Callsign"
            variant="outlined"
            :placeholder="$t('pilotRegistration.callsignPlaceholder')"
            :icon="pilot.Callsign ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Callsign ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                :tooltip="$t('pilotRegistration.randomCallsign')"
                @click="randomCallsign()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotRegistration.backgroundLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotRegistration.backgroundLabelShort') }}</div>
          <cc-text-field v-model="pilot.Background"
            variant="outlined"
            :placeholder="$t('pilotRegistration.backgroundPlaceholder')"
            :icon="pilot.Background ? 'mdi-check-circle-outline' : 'mdi-circle-outline'"
            :color="pilot.Background ? 'success' : 'light-panel'"
            class="my-1 d-inline">
            <template #extra>
              <v-tooltip :text="$t('pilotRegistration.selectPredefined')">
                <template #activator="{ props }">
                  <span v-bind="props">
                    <background-selector
                      @select="$emit('set', { attr: 'Background', val: $event })" />
                  </span>
                </template>
              </v-tooltip>
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotRegistration.bioLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotRegistration.bioLabelShort') }}</div>
          <v-row align="center"
            dense>
            <v-col>
              <cc-button block
                size="small"
                :color="!pilot.History ? 'light-panel' : 'success'"
                @click="bioDialog = true">
                <div v-if="!pilot.History">{{ $t('pilotRegistration.addBio') }}</div>
                <div v-else>{{ $t('pilotRegistration.editBio') }}</div>
                <cc-text-editor-dialog v-model="bioDialog"
                  :title="$t('pilotRegistration.editBio')"
                  :original="pilot.History"
                  @save="$emit('set', { attr: 'History', val: $event })" />
              </cc-button>
            </v-col>
            <v-col cols="auto"
              class="ml-2">
              <v-icon v-if="!pilot.History"
                color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else
                color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotRegistration.appearanceLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotRegistration.appearanceLabelShort') }}</div>
          <v-row align="center"
            dense>
            <v-col>
              <cc-button block
                size="small"
                :color="!pilot.TextAppearance ? 'light-panel' : 'success'"
                @click="appearanceDialog = true">
                <div v-if="!pilot.TextAppearance">{{ $t('pilotRegistration.addAppearance') }}</div>
                <div v-else>{{ $t('pilotRegistration.editAppearance') }}</div>
                <cc-text-editor-dialog v-model="appearanceDialog"
                  :title="$t('pilotRegistration.editAppearance')"
                  :original="pilot.TextAppearance"
                  @save="$emit('set', { attr: 'TextAppearance', val: $event })" />
              </cc-button>
            </v-col>
            <v-col cols="auto"
              class="ml-2">
              <v-icon v-if="!pilot.TextAppearance"
                color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else
                color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotRegistration.llLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotRegistration.llLabelShort') }}</div>
          <cc-number-field v-model.number="pilot.Level"
            type="number"
            :label="$t('pilotRegistration.startingLl')"
            :max="12"
            :min="0"
            :color="pilot.Level ? 'warning' : 'success'"
            :tooltip="$t('pilotRegistration.llTooltip')"
            tooltip-icon="mdi-alert"
            class="my-1 d-inline" />
        </div>
      </v-col>
      <v-col cols="12"
        md="auto"
        class="mx-auto mt-2"
        style="max-width: 325px">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotRegistration.imagingLabel') }}
            <div class="mt-n1 text-disabled">{{ $t('pilotRegistration.imagingSub') }}</div>
          </div>
        <div class="border mr-8 ml-auto mr-auto"
          style="width: 300px; height: 300px">
          <cc-img v-if="pilot.Portrait"
            :src="pilot.Portrait"
            aspect-ratio="1" />
        </div>
        <div class="mt-3">
          <cc-modal :title="$t('pilotRegistration.addImage')"
            icon="cc:pilot">
            <template #activator="{ open }">
              <cc-button block
                size="small"
                :color="pilot.Portrait ? 'success' : 'panel'"
                :append-icon="pilot.Portrait ? '' : 'mdi-check-circle-outline'"
                :prepend-icon="pilot.Portrait ? 'mdi-circle-edit-outline' : 'mdi-plus'"
                @click="open">
                {{ pilot.Portrait ? $t('pilotRegistration.editImage') : $t('pilotRegistration.addImage') }}
              </cc-button>
            </template>
            <cc-image-selector ref="imageSelector"
              :item="pilot"
              type="pilot"
              avatar />
          </cc-modal>
        </div>
      </v-col>
    </v-row>
    <v-row dense
      class="text-center my-6 pt-2 pb-1 px-3 bg-surface">
      <v-col cols="12"
        sm="6">
        <cc-button size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="savePilot">
          {{ $t('pilotRegistration.skipRegistration') }}
        </cc-button>
        <div class="text-caption text-disabled"><i>{{ $t('pilotRegistration.recommendedAdvanced') }}</i></div>
      </v-col>
      <v-spacer />
      <v-col cols="12"
        sm="6">
        <cc-button size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="$emit('templates')">
          {{ $t('pilotRegistration.selectTemplate') }}
        </cc-button>
        <div class="text-caption text-disabled"><i>{{ $t('pilotRegistration.recommendedNew') }}</i></div>
      </v-col>
    </v-row>
  </stepper-content>
</template>

<script lang="ts">
import { PilotStore } from '@/stores';
import StepperContent from '../../_components/StepperContent.vue';
import BackgroundSelector from '../../_components/selectors/BackgroundSelector.vue';
import { name, callsign } from '@/io/Generators';
import { Pilot } from '@/class';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'IdentificationPage',
  components: { StepperContent, BackgroundSelector },
  mixins: [useMobile],
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    groupID: { type: String },
  },
  emits: ['set', 'templates', 'next', 'done'],
  data: () => ({
    bioDialog: false,
    appearanceDialog: false,
  }),
  methods: {
    async randomCallsign() {
      const generatedCallsign = await callsign();
      this.$emit('set', { attr: 'Callsign', val: generatedCallsign });
      this.$forceUpdate();
    },
    async randomName() {
      const generatedName = await name();
      this.$emit('set', { attr: 'Name', val: generatedName });
      this.$forceUpdate();
    },
    async savePilot() {
      this.pilot.Callsign = this.pilot.Callsign;
      this.pilot.Name = this.pilot.Name;
      PilotStore().AddPilot(this.pilot as Pilot, this.groupID);
      await this.$emit('done');
    },
  },
};
</script>
