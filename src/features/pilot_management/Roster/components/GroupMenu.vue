<template>
  <v-card-text class="pt-2">
    <div class="heading"
      :class="mobile ? 'h4' : 'h3'">
      {{ $t('roster.groupMenu.title') }}
      <cc-slashes />
      <br v-if="mobile" />
      &nbsp;{{ $t('roster.groupMenu.subtitle') }}
    </div>
    <v-container class="flavor-text"
      style="font-size: 13px">
      <div class="mt-n2">
        {{ $t('roster.groupMenu.intro') }}
        <br />
        {{ $t('roster.groupMenu.intro2') }}
      </div>
    </v-container>
    <v-row align="center">
      <v-col>
        <div class="my-2">
          <div class="text-caption">
            {{ $t('roster.groupMenu.encodedData') }}
            <i class="text-disabled">{{ $t('roster.groupMenu.optional') }}</i>
          </div>
          <div class="px-10 pt-1">
            <group-file-import @toggle-import="importHide = $event"
              @done="$emit('close')" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider v-if="!importHide"
      class="mt-4 mb-5" />
    <v-expand-transition>
      <div v-if="!importHide">
        <v-row align="start">
          <v-col cols="12"
            md="5"
            class="mr-auto">
            <div class="my-2">
              <div class="text-caption">{{ $t('roster.groupMenu.unitDesignation') }}</div>
              <cc-text-field v-model="group.Name"
                variant="outlined"
                :placeholder="$t('roster.groupMenu.namePlaceholder')"
                :icon="group.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
                :color="group.Name ? 'success' : 'error'"
                class="my-1 d-inline">
                <template #extra>
                  <cc-button icon="mdi-dice-multiple"
                    variant="outlined"
                    size="small"
                    :tooltip="$t('roster.groupMenu.randomName')"
                    @click="randomName()" />
                </template>
              </cc-text-field>
            </div>

            <div class="my-4">
              <div class="text-caption">{{ $t('roster.groupMenu.descResults') }}</div>
              <v-row align="center"
                dense>
                <v-col>
                  <cc-modal :title="$t('roster.groupMenu.descTitle')"
                    icon="mdi-account-group"
                    shrink
                    max-width="75vw">
                    <template #activator="{ open }">
                      <cc-button block
                        size="small"
                        prepend-icon="mdi-pencil"
                        :color="group.Description ? 'success' : 'panel'"
                        @click="open">
                        <div v-if="!group.Description">{{ $t('roster.groupMenu.addDesc') }}</div>
                        <div v-else>{{ $t('roster.groupMenu.editDesc') }}</div>
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <v-card-text>
                        <cc-text-editor-inline :original="group.Description"
                          @save="group.Description = $event" />
                        <div class="text-right mt-3">
                          <cc-button color="primary"
                            size="small"
                            @click="close">
                            {{ $t('roster.groupMenu.saveAndClose') }}
                          </cc-button>
                        </div>
                      </v-card-text>
                    </template>
                  </cc-modal>
                </v-col>
                <v-col cols="auto">
                  <v-icon v-if="!group.Description"
                    size="large"
                    color="grey">
                    mdi-circle-outline
                  </v-icon>
                  <v-icon v-else
                    size="large"
                    color="success">mdi-check-circle-outline</v-icon>
                </v-col>
              </v-row>
            </div>

            <div class="my-4">
              <div class="text-caption">
                {{ $t('roster.groupMenu.histResults') }}
              </div>
              <v-row align="center"
                dense>
                <v-col>
                  <cc-modal :title="$t('roster.groupMenu.descTitle')"
                    icon="mdi-account-group"
                    shrink
                    max-width="75vw">
                    <template #activator="{ open }">
                      <cc-button block
                        size="small"
                        prepend-icon="mdi-pencil"
                        :color="group.History ? 'success' : 'panel'"
                        @click="open">
                        <div v-if="!group.Description">{{ $t('roster.groupMenu.addHist') }}</div>
                        <div v-else>{{ $t('roster.groupMenu.editHist') }}</div>
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <v-card-text>
                        <cc-text-editor-inline :original="group.History"
                          @save="group.History = $event" />
                        <div class="text-right mt-3">
                          <cc-button color="primary"
                            size="small"
                            @click="close">
                            {{ $t('roster.groupMenu.saveAndClose') }}
                          </cc-button>
                        </div>
                      </v-card-text>
                    </template>
                  </cc-modal>
                </v-col>
                <v-col cols="auto">
                  <v-icon v-if="!group.History"
                    size="large"
                    color="grey">
                    mdi-circle-outline
                  </v-icon>
                  <v-icon v-else
                    size="large"
                    color="success">mdi-check-circle-outline</v-icon>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12"
            md="5"
            class="ml-auto">
            <div class="text-caption">{{ $t('roster.groupMenu.livery') }}</div>
            <div class="border mr-8 ml-auto mr-auto"
              style="width: 300px; height: 300px">
              <cc-img v-if="group.Portrait"
                :src="group.Portrait"
                aspect-ratio="1" />
              <div class="mt-3 text-center">
                <cc-modal :title="$t('roster.groupMenu.setEmblem')"
                  icon="mdi-image">
                  <template #activator="{ open }">
                    <div class="d-flex justify-center">
                      <cc-button size="small"
                        color="secondary"
                        @click="open">
                        <div v-if="!group.Portrait">
                          <v-icon start>mdi-plus</v-icon>
                          {{ $t('roster.groupMenu.addEmblem') }}
                        </div>
                        <div v-else>
                          <v-icon start>mdi-circle-edit-outline</v-icon>
                          {{ $t('roster.groupMenu.editEmblem') }}
                        </div>
                      </cc-button>
                    </div>
                  </template>
                  <cc-image-selector ref="imageSelector"
                    :item="group"
                    type="emblem" />
                </cc-modal>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
  </v-card-text>
  <div style="position: fixed; bottom: 0; right: 0; left: 0">
    <cc-button block
      color="primary"
      :disabled="!group.Name"
      @click="submit()">{{ $t('roster.groupMenu.submit') }}</cc-button>
  </div>
</template>

<script lang="ts">
import { PilotStore } from '../../store';
import { PilotGroup } from '../../store/PilotGroup';
import { teamName } from '@/io/Generators';
import GroupFileImport from './add_panels/GroupFileImport.vue';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'GroupMenu',
  components: { GroupFileImport },
  mixins: [useMobile],
  emits: ['close'],
  data: () => ({
    group: {} as PilotGroup,
    fileValue: null,
    importHide: false,
  }),
  created: function () {
    this.group = new PilotGroup();
  },
  methods: {
    async randomName() {
      this.group.Name = await teamName();
    },
    submit() {
      PilotStore().AddGroup(this.group as PilotGroup);
      this.$emit('close');
    },
  },
};
</script>
