<template>
  <div class="pa-1 px-2"
    style="height: calc(100vh - 40px)">
    <div class="text-center">
      <v2-auto block />
    </div>
    <div style="position: absolute; top: 0; left: 0; right: 0; container-type: inline-size">
      <div class="bg-primary text-center">
        <span class="heading text-white"
          style="letter-spacing: 3cqw; line-height: 38pt; font-size: 33pt">
          COMP/CON
        </span>
        <div class="text-cc-overline"
          style="position: absolute; right: 2px; opacity: 0.8">
          v.{{ appVersion }}
        </div>
      </div>
    </div>

    <div class="d-flex justify-center align-center py-3 mt-4"
      style="height: calc(100% - 28px)">
      <v-row dense
        justify="space-around"
        style="height: 100%">
        <mobile-btn icon="cc:compendium"
          :title="$t('mainMenu.compendium')"
          :to="'/srd'" />
        <mobile-btn icon="cc:pilot"
          :title="$t('mainMenu.roster')"
          :text="$t('mainMenu.pilotHelp')"
          :to="'/pilot_management'" />
        <mobile-btn v-if="landscape"
          icon="cc:encounter"
          :title="$t('mainMenu.gmToolkit')"
          :text="$t('mainMenu.gmHelp')"
          :to="'/gm'" />
        <mobile-btn icon="cc:content_manager"
          :title="$t('mainMenu.content')"
          @clicked="extraContentModal = true" />
        <extra-content v-model="extraContentModal" />
        <mobile-btn icon="cc:campaign"
          :title="$t('mainMenu.activeMode')"
          :to="'/active-mode'" />
      </v-row>
    </div>

    <v-bottom-navigation density="compact"
      class="bg-primary">
      <v-row no-gutters
        align="center"
        justify="space-around">
        <v-col cols="auto">
          <cc-modal :title="$t('mainMenu.cloudAccount')"
            icon="mdi-cloud-sync">
            <template #activator="{ open }">
              <cc-button v-if="landscape"
                :loading="startingUp"
                size="small"
                class="mx-2"
                :variant="isLoggedIn ? '' : 'outlined'"
                :color="isLoggedIn ? 'success' : ''"
                @click="open">
                {{ isLoggedIn ? $t('mainMenu.connected') : $t('mainMenu.signIn') }}
              </cc-button>

              <cc-button v-else
                :loading="startingUp"
                size="small"
                class="mx-2"
                :variant="isLoggedIn ? '' : 'outlined'"
                :color="isLoggedIn ? 'success' : ''"
                :icon="isLoggedIn ? 'mdi-cloud-sync' : 'mdi-cloud-off-outline'"
                @click="open" />
            </template>
            <sign-in />
          </cc-modal>
        </v-col>

        <v-divider vertical
          class="mr-2" />

        <v-col cols="auto">
          <cc-modal :title="$t('mainMenu.options')"
            icon="mdi-cog">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.options') }}
              </cc-button>
            </template>
            <options-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal :title="$t('mainMenu.about')"
            icon="mdi-information">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.about') }}
              </cc-button>
            </template>
            <about-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal :title="$t('mainMenu.credits')"
            icon="cc:gms">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.credits') }}
              </cc-button>
            </template>
            <credits-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal :title="$t('mainMenu.help')"
            icon="mdi-help-circle">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.help') }}
              </cc-button>
            </template>
            <help-page />
          </cc-modal>
        </v-col>
      </v-row>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import MobileBtn from './_components/MobileBtn.vue'
import ExtraContent from '../nav/pages/ExtraContent/index.vue'
import CreditsPage from '../nav/pages/Credits.vue'
import AboutPage from '../nav/pages/About.vue'
import HelpPage from '../nav/pages/Help.vue'
import OptionsPage from '../nav/pages/Options/index.vue'
import { UserStore } from '@/stores'
import SignIn from './_components/login/index.vue'
import V2Auto from '../nav/pages/ExtraContent/components/v2Auto.vue'

export default {
  name: 'LandingPageMobile',
  components: {
    MobileBtn,
    ExtraContent,
    AboutPage,
    CreditsPage,
    HelpPage,
    OptionsPage,
    SignIn,
    V2Auto,
  },
  data: () => ({
    extraContentModal: false,
  }),
  computed: {
    userstore() {
      return UserStore()
    },
    isLoggedIn() {
      return UserStore().IsLoggedIn
    },
    startingUp() {
      return UserStore().IsLoading
    },
    appVersion(): string {
      return APP_VERSION || 'dev'
    },
    landscape() {
      return this.$vuetify.display.smAndUp
    },
  },
}
</script>
