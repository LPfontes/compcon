<template>
  <v-container :class="!mobile && 'px-12'">
    <v2-cloud-migration-panel />

    <v-expansion-panels class="mb-4"
      flat
      color="panel"
      tile>
      <v-expansion-panel>
        <template #title>
          <v-row dense>
            <v-col>
              <div class="text-caption font-weight-bold my-1">{{ $t('cloud.management.notifications') }}</div>
            </v-col>
            <v-col cols="auto">
              <v-chip size="small"
                color="accent">{{ notifications.length }}</v-chip>
            </v-col>
          </v-row>
        </template>
        <template #text>
          <cloud-notification-list />
        </template>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-row>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          :text="$t('cloud.management.ccId')"
          :tooltip="$t('cloud.management.ccIdTooltip')" />
        {{ cognito.userId }}
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          :text="$t('cloud.management.accountEmail')"
          :tooltip="$t('cloud.management.accountEmailTooltip')" />

        {{ cognito.signInDetails.loginId }}
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          :text="$t('cloud.management.ccUsername')"
          :tooltip="$t('cloud.management.ccUsernameTooltip')" />

        <v-row dense
          align="center">
          <v-col>
            <form autocomplete="off">
              <cc-text-field v-model="meta.Username"
                :loading="nameLoading"
                color="primary"
                autocomplete="one-time-code"
                @update:model-value="nameDirty = true" />
            </form>
          </v-col>
          <v-col cols="auto">
            <cc-button size="small"
              class="ml-2"
              color="primary"
              icon="mdi-content-save"
              variant="outlined"
              :loading="nameLoading"
              :disabled="!nameDirty"
              @click="userUpdate('Username')" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          :text="$t('cloud.management.accountDetails')" />
        <div class="text-caption">
          <b>{{ $t('cloud.management.createdV3') }}</b>
          <i class="text-accent ml-1">{{ new Date(Number(meta.CreatedAt)).toLocaleString() }}</i>
        </div>
        <div class="text-caption">
          <b>{{ $t('cloud.management.lastUpdated') }}</b>
          <i class="text-accent ml-1">{{ new Date(Number(meta.UpdatedAt)).toLocaleString() }}</i>
        </div>
      </v-col>
    </v-row>

    <div class="flavor-text">
      <v-row class="text-center py-4">
        <v-col cols="12"
          md="6">
          <itch-card />
        </v-col>
        <v-col cols="12"
          md="6">
          <patreon-card />
        </v-col>
      </v-row>
    </div>

    <cc-heading small
      line>{{ $t('cloud.management.changePassword') }}</cc-heading>
    <v-row dense
      align="center">
      <v-col cols="12"
        md="">
        <cc-text-field v-model="oldPass"
          :label="$t('cloud.management.oldPassword')"
          color="primary"
          variant="outlined"
          :type="showOld ? 'text' : 'password'"
          :append-inner-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
          @click-append-inner="showOld = !showOld" />
      </v-col>
      <v-col cols="12"
        md="">
        <cc-text-field v-model="newPass"
          :label="$t('cloud.management.newPassword')"
          color="primary"
          variant="outlined"
          :type="showNew ? 'text' : 'password'"
          :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          @click-append-inner="showNew = !showNew" />
      </v-col>
      <v-col cols="12"
        md="auto">
        <div class="text-right">
          <cc-button color="accent"
            :disabled="!oldPass || !newPass || oldPass === newPass"
            :loading="loading"
            @click="changePass">
            {{ $t('cloud.management.submit') }}
          </cc-button>
        </div>
      </v-col>
    </v-row>

    <cc-heading small
      line>{{ $t('cloud.management.changeEmail') }}</cc-heading>
    <v-row dense
      align="center">
      <v-col cols="12"
        md="">
        <cc-text-field v-model="newEmail"
          :label="$t('cloud.management.newEmail')"
          color="primary"
          variant="outlined" />
      </v-col>
      <v-col cols="12"
        md="">
        <cc-text-field v-model="newEmailConfirm"
          :label="$t('cloud.management.confirmNewEmail')"
          color="primary"
          variant="outlined" />
      </v-col>
      <v-col cols="auto">
        <div class="text-right">
          <cc-modal :title="$t('cloud.management.changeEmail')"
            shrink
            max-width="50vw">
            <template #activator="{ open }">
              <cc-button color="accent"
                :disabled="!newEmail || newEmail !== newEmailConfirm"
                :loading="loading"
                @click="sendVerify(open)">
                {{ $t('cloud.management.submit') }}
              </cc-button>
            </template>
            <template #default="{ close }">
              <div v-if="sendingVerify"
                class="text-center py-4">
                <v-progress-circular indeterminate
                  size="80"
                  class="my-2" />
                <div class="text-cc-overline">{{ $t('cloud.management.working') }}</div>
              </div>
              <div v-else>
                <p class="mb-3">
                  {{ $t('cloud.management.emailSentText', { email: newEmail }) }}
                </p>
                <cc-text-field v-model="verifyCode"
                  :label="$t('cloud.management.verificationCode')"
                  color="primary"
                  variant="outlined"
                  autocomplete="one-time-code" />
              </div>
              <v-row class="my-3">
                <v-col>
                  <cc-button color="primary"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="close">
                    {{ $t('cloud.management.cancel') }}
                  </cc-button>
                </v-col>
                <v-col>
                  <cc-button color="primary"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="resetEmail(close)">
                    {{ $t('cloud.management.reset') }}
                  </cc-button>
                </v-col>
                <v-col>
                  <cc-button color="success"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="completeVerify">
                    {{ $t('cloud.management.confirm') }}
                  </cc-button>
                </v-col>
              </v-row>
            </template>
          </cc-modal>
        </div>
      </v-col>
    </v-row>

    <cc-button block
      color="secondary"
      :loading="loading"
      class="my-12"
      @click="ccSignOut">
      {{ $t('cloud.management.signOut') }}
      <template #info>
        <v-icon icon="mdi-logout" />
      </template>
    </cc-button>

    <div class="text-right">
      <cc-modal :title="$t('cloud.management.accountDeletion')"
        max-width="50vw"
        shrink>
        <template #activator="{ open }">
          <cc-button variant="tonal"
            color="error"
            prepend-icon="mdi-skull"
            @click="open">
            {{ $t('cloud.management.deleteAccount') }}
          </cc-button>
        </template>
        <template #default="{ isActive }">
          <delete-account @close="isActive.value = false" />
        </template>
      </cc-modal>
    </div>
  </v-container>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import * as _ from 'lodash-es';
import { updateUser } from '@/io/apis/account';
import {
  signOut,
  updatePassword,
  confirmUserAttribute,
  updateUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';
import DeleteAccount from './_components/deleteAccount.vue';
import PatreonCard from './_components/patreonCard.vue';
import ItchCard from './_components/itchCard.vue';
import CloudNotificationList from '@/features/nav/_components/CloudNotificationList.vue';
import logger from '@/user/logger';
import V2CloudMigrationPanel from './_components/v2CloudMigrationPanel.vue';

export default {
  name: 'AccountManagement',
  components: { DeleteAccount, PatreonCard, ItchCard, CloudNotificationList, V2CloudMigrationPanel },
  emits: ['set-state'],
  data() {
    return {
      loading: false,
      showAccountMigration: true,
      nameLoading: false,
      nameDirty: false,
      showError: false,
      error: '',
      iid: '',
      username: '',
      oldPass: '',
      showOld: false,
      newPass: '',
      showNew: false,
      newEmail: '',
      newEmailConfirm: '',
      sendingVerify: false,
      verifyCode: '',
      authedUser: null,
    };
  },

  computed: {
    cognito() {
      return UserStore().Cognito;
    },
    meta() {
      return UserStore().UserMetadata;
    },
    rules() {
      return {
        passLength: (v: string) => (v && v.length >= 6) || (this.$t('cloud.management.minChars') as string),
      };
    },
    passMatch() {
      return () =>
        (this.oldPass && this.newPass && this.oldPass !== this.newPass) ||
        (this.$t('cloud.management.passMatch') as string);
    },
    user() {
      return UserStore().User;
    },
    notifications() {
      return UserStore().CloudNotifications;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  mounted() {
    window.addEventListener('keydown', this._onJwtShortcut)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this._onJwtShortcut)
  },
  methods: {
    async _onJwtShortcut(e: KeyboardEvent) {
      // this is a temporary debug tool for VTT/API development
      if (e.ctrlKey && e.altKey && e.key === 'j') {
        try {
          const session = await fetchAuthSession()
          const token = session.tokens?.idToken?.toString()
          if (!token) throw new Error('No token available')
          await navigator.clipboard.writeText(token)
          this.$notify({
            title: this.$t('cloud.management.jwtCopied') as string,
            text: this.$t('cloud.management.jwtCopiedText') as string,
            data: { icon: 'mdi-key', color: 'success-darken-2' },
          })
        } catch (err) {
          this.$notify({
            title: 'JWT Copy Failed',
            text: String(err),
            data: { icon: 'mdi-alert', color: 'error' },
          })
        }
      }
    },
    copy(str: string) {
      navigator.clipboard.writeText(str);
      this.$notify({
        title: this.$t('cloud.management.dataCopied') as string,
        text: this.$t('cloud.management.copiedToClipboard', { str }) as string,
        data: { icon: 'mdi-clipboard-text-outline', color: 'success-darken-2' },
      });
    },
    async changePass() {
      this.loading = true;

      try {
        await updatePassword({ oldPassword: this.oldPass, newPassword: this.newPass });
        this.$notify({
          title: this.$t('cloud.management.updateComplete') as string,
          text: this.$t('cloud.management.passChanged') as string,
          data: { color: 'success' },
        });
      } catch (err) {
        logger.error(`Failed to change password: ${err}`, this, err);
        this.$notify({
          title: this.$t('cloud.management.updateFailed') as string,
          text: this.$t('cloud.management.serverError') as string,
          data: { color: 'error' },
        });
      }

      this.loading = false;
    },
    async sendVerify(open) {
      this.sendingVerify = true;
      try {
        await updateUserAttributes({ userAttributes: { email: this.newEmail } });
        this.$notify({
          title: this.$t('cloud.management.emailSentTitle') as string,
          text: this.$t('cloud.management.emailSentCheck') as string,
          data: { color: 'success' },
        });
        open();

      } catch (err) {
        logger.error(`Failed to initiate email change: ${err}`, this, err);
        this.$notify({
          title: this.$t('cloud.management.updateFailed') as string,
          text: this.$t('cloud.management.serverError') as string,
          data: { color: 'error' },
        });
      }
      this.sendingVerify = false;
    },
    ccSignOut() {
      signOut()
        .then(() => {
          this.$notify({
            title: this.$t('cloud.management.signOutSuccess') as string,
            text: this.$t('cloud.management.signOutMsg') as string,
            data: { color: 'success' },
          });
          UserStore().signOut();
          window.location.reload();
          this.$emit('set-state', 'sign-in');
        })
        .catch((err) => {
          logger.error(`Error signing out: ${err}`, this, err);
        });
    },
    async userUpdate(key: string) {
      if (key === 'Username') this.nameLoading = true;

      const backendKeys = { Username: 'username' };
      const res = await updateUser(this.cognito.userId, { [backendKeys[key] || key]: this.meta[key] });
      if (res && res.status === 200) {
        this.$notify({
          title: this.$t('cloud.management.updateComplete') as string,
          text: this.$t('cloud.management.userDataUpdated') as string,
          data: { color: 'success' },
        });
      } else {
        this.$notify({
          title: this.$t('cloud.management.updateFailed') as string,
          text: this.$t('cloud.management.serverError') as string,
          data: { color: 'error' },
        });
      }

      this.nameLoading = false;
      this.nameDirty = false;
    },
    async completeVerify() {
      this.loading = true;
      try {
        await confirmUserAttribute({
          userAttributeKey: 'email',
          confirmationCode: this.verifyCode,
        });
        this.$notify({
          title: this.$t('cloud.management.emailChangeComplete') as string,
          text: this.$t('cloud.management.emailChangeChanged') as string,
          data: { color: 'success' },
        });
      } catch (err) {
        logger.error(`Failed to initiate email change: ${err}`, this, err);
        this.$notify({
          title: this.$t('cloud.management.updateFailed') as string,
          text: this.$t('cloud.management.serverError') as string,
          data: { color: 'error' },
        });
      } finally {
        this.loading = false;
      }
    },
    resetEmail(close) {
      close();
      this.sendingVerify = false;
      this.verifyCode = '';
      this.newEmail = '';
      this.newEmailConfirm = '';
      this.$notify({
        title: this.$t('cloud.management.emailChangeCancelled') as string,
        text: this.$t('cloud.management.emailChangeCancelledMsg') as string,
        data: { color: 'info' },
      });
    },

  },
};
</script>

<style scoped>
.v-input--selection-controls {
  margin: 0;
}

label {
  font-size: 10px;
}
</style>
