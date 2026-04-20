<template>
  <stepper-content :complete="pilot.HasIdent"
    mandatory
    exit="../pilot_management"
    @complete="$emit('next')">
    <cc-title offset>{{ $t('pilotManagement.new.registration.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotManagement.new.registration.identService') }}
      <cc-slashes />
      {{ $t('pilotManagement.new.registration.personnelPilot') }}
    </div>
    <p class="flavor-text"
      style="font-size: 14px">
      {{ $t('pilotManagement.new.registration.identWelcome') }}
    </p>
    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2">
      <div class="heading">
        {{ $t('pilotManagement.new.registration.fieldsWarning', { icon: '' }) }}
        <v-icon color="error"
          size="small"
          class="mt-n1">mdi-alert</v-icon>
        {{ $t('pilotManagement.new.registration.fieldsWarning').split('{icon}')[1] }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pilotManagement.new.registration.truthAttestation') }}
      </p>
    </v-alert>

    <v-row dense>
      <v-col cols="12"
        md="5"
        class="mr-auto">
        <div class="my-2">
          <div v-if="!mobile"
            class="text-caption">{{ $t('pilotManagement.new.registration.fullNameLabel') }}</div>
          <div v-else
            class="text-caption">{{ $t('pilotManagement.new.registration.pilotNameLabel') }}</div>
          <cc-text-field v-model="pilot.Name"
            variant="outlined"
            :placeholder="$t('pilotManagement.new.registration.namePlaceholder')"
            :icon="pilot.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Name ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                :tooltip="$t('pilotManagement.new.registration.randomName')"
                @click="randomName()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotManagement.new.registration.callsignLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotManagement.new.registration.callsignLabelShort') }}</div>
          <cc-text-field v-model="pilot.Callsign"
            variant="outlined"
            :placeholder="$t('pilotManagement.new.registration.callsignPlaceholder')"
            :icon="pilot.Callsign ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Callsign ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                :tooltip="$t('pilotManagement.new.registration.randomCallsign')"
                @click="randomCallsign()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile"
            class="text-caption">
            {{ $t('pilotManagement.new.registration.backgroundLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotManagement.new.registration.backgroundLabelShort') }}</div>
          <cc-text-field v-model="pilot.Background"
            variant="outlined"
            :placeholder="$t('pilotManagement.new.registration.backgroundPlaceholder')"
            :icon="pilot.Background ? 'mdi-check-circle-outline' : 'mdi-circle-outline'"
            :color="pilot.Background ? 'success' : 'light-panel'"
            class="my-1 d-inline">
            <template #extra>
              <v-tooltip :text="$t('pilotManagement.new.registration.selectPredefined')">
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
            {{ $t('pilotManagement.new.registration.bioLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotManagement.new.registration.bioLabelShort') }}</div>
          <v-row align="center"
            dense>
            <v-col>
              <cc-button block
                size="small"
                :color="!pilot.History ? 'light-panel' : 'success'"
                @click="bioDialog = true">
                <div v-if="!pilot.History">{{ $t('pilotManagement.new.registration.addBio') }}</div>
                <div v-else>{{ $t('pilotManagement.new.registration.editBio') }}</div>
                <cc-text-editor-dialog v-model="bioDialog"
                  :title="$t('pilotManagement.new.registration.editBio')"
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
            {{ $t('pilotManagement.new.registration.appearanceLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotManagement.new.registration.appearanceLabelShort') }}</div>
          <v-row align="center"
            dense>
            <v-col>
              <cc-button block
                size="small"
                :color="!pilot.TextAppearance ? 'light-panel' : 'success'"
                @click="appearanceDialog = true">
                <div v-if="!pilot.TextAppearance">{{ $t('pilotManagement.new.registration.addAppearance') }}</div>
                <div v-else>{{ $t('pilotManagement.new.registration.editAppearance') }}</div>
                <cc-text-editor-dialog v-model="appearanceDialog"
                  :title="$t('pilotManagement.new.registration.editAppearance')"
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
            {{ $t('pilotManagement.new.registration.llLabel') }}
          </div>
          <div v-else
            class="text-caption">{{ $t('pilotManagement.new.registration.llLabelShort') }}</div>
          <cc-number-field v-model.number="pilot.Level"
            type="number"
            :label="$t('pilotManagement.new.registration.startingLl')"
            :max="12"
            :min="0"
            :color="pilot.Level ? 'warning' : 'success'"
            :tooltip="$t('pilotManagement.new.registration.llTooltip')"
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
            {{ $t('pilotManagement.new.registration.imagingLabel') }}
            <div class="mt-n1 text-disabled">{{ $t('pilotManagement.new.registration.imagingSub') }}</div>
          </div>
        <div class="border mr-8 ml-auto mr-auto"
          style="width: 300px; height: 300px">
          <cc-img v-if="pilot.Portrait"
            :src="pilot.Portrait"
            aspect-ratio="1" />
        </div>
        <div class="mt-3">
          <cc-modal :title="$t('pilotManagement.new.registration.addImage')"
            icon="cc:pilot">
            <template #activator="{ open }">
              <cc-button block
                size="small"
                :color="pilot.Portrait ? 'success' : 'panel'"
                :append-icon="pilot.Portrait ? '' : 'mdi-check-circle-outline'"
                :prepend-icon="pilot.Portrait ? 'mdi-circle-edit-outline' : 'mdi-plus'"
                @click="open">
                {{ pilot.Portrait ? $t('pilotManagement.new.registration.editImage') : $t('pilotManagement.new.registration.addImage') }}
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
          {{ $t('pilotManagement.new.registration.skipRegistration') }}
        </cc-button>
        <div class="text-caption text-disabled"><i>{{ $t('pilotManagement.new.registration.recommendedAdvanced') }}</i></div>
      </v-col>
      <v-spacer />
      <v-col cols="12"
        sm="6">
        <cc-button size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="$emit('templates')">
          {{ $t('pilotManagement.new.registration.selectTemplate') }}
        </cc-button>
        <div class="text-caption text-disabled"><i>{{ $t('pilotManagement.new.registration.recommendedNew') }}</i></div>
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
