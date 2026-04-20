<template>
  <div id="wrapper">
    <main-title @logupdate="ccLog('update')" />
    <c-c-log v-show="!$vuetify.display.mdAndDown"
      ref="log" />
    <v-container fluid
      style="height: calc(100vh - 85px); margin-top: 20px">
      <v-row justify="space-between"
        align="center"
        style="height: 100%">
        <main-btn icon="cc:compendium"
          :to="'/srd'"
          :help="$t('mainMenu.compendiumHelp')"
          @hover="ccLog('compendium')">
          {{ $t('mainMenu.compendium') }}
        </main-btn>
        <main-btn icon="cc:pilot"
          :to="'/pilot_management'"
          :help="$t('mainMenu.pilotHelp')"
          @hover="ccLog('pilot')">
          {{ $t('mainMenu.pilotRoster') }}
        </main-btn>
        <main-btn icon="cc:encounter"
          condensed
          :to="'/gm'"
          :help="$t('mainMenu.gmHelp')"
          @hover="ccLog('gm')">
          {{ $t('mainMenu.gmToolkit') }}
        </main-btn>
        <main-btn icon="cc:campaign"
          :to="'/active-mode'"
          :help="$t('mainMenu.activeHelp')"
          @hover="ccLog('encounter')">
          {{ $t('mainMenu.activeMode') }}
        </main-btn>
        <main-btn icon="cc:content_manager"
          condensed
          :help="$t('mainMenu.contentHelp')"
          @hover="ccLog('content')"
          @clicked="extraContentModal = true">
          {{ $t('mainMenu.contentManager') }}
          <v-tooltip v-if="hasV2Backups"
            :text="$t('mainMenu.v2Waiting')">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-alert"
                size="24"
                color="warning"
                class="ml-1 mt-n2" />
            </template>
          </v-tooltip>


        </main-btn>
        <extra-content v-model="extraContentModal" />
      </v-row>
    </v-container>

    <v-footer color="primary"
      app
      fixed
      height="32">
      <v-row no-gutters
        justify="space-around"
        align="center">
        <v-col cols="auto"
          class="text-center mr-1">
          <cc-modal :title="$t('mainMenu.cloudAccount')"
            icon="mdi-cloud-sync">
            <template #activator="{ open }">
              <cc-button size="small"
                :color="isLoggedIn ? 'success' : ''"
                :loading="startingUp"
                :prepend-icon="isLoggedIn ? 'mdi-cloud-sync' : 'mdi-cloud-off-outline'"
                class="mr-2"
                @click="open">
                <span>{{ isLoggedIn ? $t('mainMenu.connected') : $t('mainMenu.logIn') }}</span>
              </cc-button>
            </template>
            <sign-in />
          </cc-modal>
        </v-col>
        <v-col cols="auto"
          class="text-center">
          <cloud-notifications />
        </v-col>

        <v-col cols="auto"
          class="ml-auto text-right">
          <v-row dense
            justify="space-between">
            <v-col cols="auto">
              <cc-modal :title="$t('mainMenu.options')"
                icon="mdi-cog">
                <template #activator="{ open }">
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('options')"
                    @click="open">
                    {{ $t('mainMenu.options') }}
                  </cc-button>
                </template>
                <options-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-dialog :title="$t('mainMenu.about')"
                icon="mdi-information">
                <template #activator="{ open }">
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('about')"
                    @click="open">
                    {{ $t('mainMenu.about') }}
                  </cc-button>
                </template>
                <about-page />
              </cc-dialog>
            </v-col>

            <v-col cols="auto">
              <cc-modal :title="$t('mainMenu.credits')"
                icon="cc:gms">
                <template #activator="{ open }">
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('credits')"
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
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('help')"
                    @click="open">
                    {{ $t('mainMenu.help') }}
                  </cc-button>
                </template>
                <help-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-button target="_blank"
                color="warning"
                size="small"
                variant="tonal"
                href="https://www.patreon.com/compcon">
                {{ $t('mainMenu.supportProject') }}
              </cc-button>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang="ts">
import MainTitle from './_components/MainTitle.vue';
import MainBtn from './_components/MainBtn.vue';
import CCLog from './_components/CCLog.vue';
import SignIn from './_components/login/index.vue';
import ExtraContent from '../nav/pages/ExtraContent/index.vue';
import AboutPage from '../nav/pages/About.vue';
import CreditsPage from '../nav/pages/Credits.vue';
import HelpPage from '../nav/pages/Help.vue';
import OptionsPage from '../nav/pages/Options/index.vue';
import { UserStore } from '@/stores';
import CloudNotifications from '../nav/CloudNotifications.vue';
import { getV2Backups } from '@/io/V2Importer';

export default {
  name: 'LandingPageDesktop',
  components: {
    MainTitle,
    MainBtn,
    CCLog,
    ExtraContent,
    CreditsPage,
    AboutPage,
    HelpPage,
    OptionsPage,
    SignIn,
    CloudNotifications,
  },
  data: () => ({
    importDialog: false,
    fileValue: undefined,
    extraContentModal: false,
    v2BackupCount: 0,
  }),
  computed: {
    isLoggedIn() {
      return UserStore().IsLoggedIn;
    },
    startingUp() {
      return UserStore().IsLoading;
    },
    hasV2Backups() {
      return this.v2BackupCount > 0;
    },
  },
  watch: {
    async extraContentModal(val) {
      if (!val) await this.loadV2BackupCount();
    },
  },
  async created() {
    await this.loadV2BackupCount();
  },
  methods: {
    async loadV2BackupCount() {
      this.v2BackupCount = (await getV2Backups()).length;
    },
    ccLog(btn: string) {
      switch (btn) {
        case 'compendium':
          (this.$refs['log'] as any).print(
            'man compendium',
            this.$t('mainMenu.logs.compendium')
          );
          break;
        case 'pilot':
          (this.$refs['log'] as any).print(
            'man pilot-sheet',
            this.$t('mainMenu.logs.pilot')
          );
          break;
        case 'gm':
          (this.$refs['log'] as any).print(
            'man gm-tools',
            this.$t('mainMenu.logs.gm')
          );
          break;
        case 'campaign':
          (this.$refs['log'] as any).print('man campaigns', this.$t('mainMenu.logs.wip'));
          break;
        case 'content':
          (this.$refs['log'] as any).print(
            'man homebrew',
            this.$t('mainMenu.logs.content')
          );
          break;
        case 'encounter':
          (this.$refs['log'] as any).print(
            'man activemode',
            this.$t('mainMenu.logs.encounter')
          );
          break;
        case 'options':
          (this.$refs['log'] as any).print(
            'compcon -settings --verbose',
            this.$t('mainMenu.logs.options')
          );
          break;
        case 'about':
          (this.$refs['log'] as any).print('compcon --v', this.$t('mainMenu.logs.about'));
          break;
        case 'help':
          (this.$refs['log'] as any).print('compcon --h', this.$t('mainMenu.logs.help'));
          break;
        case 'update':
          (this.$refs['log'] as any).print(
            'gms-upm compcon changelog -l',
            this.$t('mainMenu.logs.update')
          );
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 90vh;
  background: url(../../assets/ui/grid.png);
  animation: 600s scroll infinite linear;
  top: 0;
  left: 0;
}

@keyframes scroll {
  100% {
    background-position: -3000px -3000px;
  }
}
</style>
