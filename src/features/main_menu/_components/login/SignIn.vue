<template>
  <v-container>
    <v-fade-transition>
      <div v-if="signingIn" class="flavor-text">
        <v-row v-for="(l, lIdx) in loginLog" :key="`log-${lIdx}`" no-gutters>
          <v-col v-html-safe="l.str" cols="12" md="" />
          <v-col cols="12" md="auto">
            <i class="text-caption text-disabled ml-3">{{ l.time }}</i>
          </v-col>
        </v-row>
        <v-fade-transition>
          <div v-if="showError">
            <div class="text-right mb-2">
              <v-btn
                size="x-small"
                variant="tonal"
                color="secondary"
                prepend-icon="mdi-clipboard-text-outline"
                @click="copyLog">
                {{ $t('auth.copyLog') }}
              </v-btn>
            </div>
            <v-row dense>
              <v-col>
                <cc-button variant="tonal" block color="primary" @click="abort">{{ $t('auth.abort') }}</cc-button>
              </v-col>
              <v-col>
                <cc-button variant="tonal" block color="primary" @click="retry">{{ $t('auth.retry') }}</cc-button>
              </v-col>
              <v-col>
                <cc-button variant="tonal" block color="primary" @click="fail">{{ $t('auth.fail') }}</cc-button>
              </v-col>
            </v-row>
          </div>
        </v-fade-transition>
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <div v-if="!signingIn">
        <form @submit.prevent="signIn" @keyup.enter="signIn">
        <v-row class="mt-1">
          <v-col lg="6" cols="12">
            <div class="text-cc-overline pl-3">{{ $t('auth.email') }}</div>
            <cc-text-field
              v-model="email"
              icon="mdi-email-outline"
              color="primary"
              variant="outlined"
              type="email"
              autocomplete="username" />
          </v-col>
          <v-col lg="6" cols="12">
            <div class="text-cc-overline pl-3">{{ $t('auth.password') }}</div>
            <cc-text-field
              v-model="password"
              icon="mdi-lock-outline"
              color="primary"
              variant="outlined"
              :type="show ? 'text' : 'password'"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              autocomplete="current-password"
              @click-append-inner="show = !show" />
          </v-col>
        </v-row>
        <div class="text-center mt-4">
          <cc-button
            size="large"
            block
            color="secondary"
            :loading="loading"
            :disabled="loading || !email || !password"
            @click="signIn">
            {{ $t('auth.signIn') }}
          </cc-button>
          <cc-button
            color="accent"
            size="small"
            block
            class="mt-2"
            variant="outlined"
            @click="$emit('set-state', 'sign-up')">
            {{ $t('auth.signUp') }}
          </cc-button>
        </div>
        </form>
        <v-footer style="position: absolute; bottom: 0; left: 0; right: 0">
          <cc-button
            :size="mobile ? 'small' : 'default'"
            :stacked="mobile"
            prepend-icon="mdi-email-check"
            color="primary"
            @click="$emit('reverify')">
            {{ $t('auth.verifyEmail') }}
          </cc-button>
          <v-spacer />
          <cc-button
            :size="mobile ? 'small' : 'default'"
            :stacked="mobile"
            prepend-icon="mdi-lock-reset"
            color="primary"
            @click="$emit('set-state', 'reset')">
            {{ $t('auth.forgotPassword') }}
          </cc-button>
        </v-footer>
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import logger from '@/user/logger';
import { signIn } from 'aws-amplify/auth';

export default {
  name: 'AuthSignIn',
  data: () => ({
    email: '',
    password: '',
    show: false,
    error: '',
    showError: false,
    loading: false,
    loginLog: [] as { str: string; time: number }[],
    signingIn: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    async signIn() {
      this.signingIn = true;
      await this.addLoginLog(this.$t('auth.connecting') as string);

      this.loading = true;
      const userEmail = this.email.trim();
      this.email = userEmail;

      let signInResult;
      si_attempt: try {
        signInResult = await signIn({
          username: userEmail,
          password: this.password,
        });
      } catch (error: any) {
        if (error.name === 'UserAlreadyAuthenticatedException') {
          await this.addLoginLog(this.$t('auth.alreadySignedIn') as string, true);
          await this.addLoginLog(this.$t('auth.attemptingContinue') as string, true);
          signInResult = { isSignedIn: true };
          break si_attempt;
        }
        this.showError = true;
        await this.addLoginLog(this.$t('auth.connectionFailed') as string, true);
        await this.addLoginLog(this.$t('auth.error', { message: error.message }), true);
        return;
      }

      if (!signInResult.isSignedIn) {
        this.showError = true;
        await this.addLoginLog(this.$t('auth.connectionFailed') as string, true);
        await this.addLoginLog(this.$t('auth.error', { message: 'sign-in failed' }), true);
        return;
      }

      await this.addLoginLog(this.$t('auth.connectionEstablished') as string);

      try {
        await UserStore().setCognito();
        await this.addLoginLog(this.$t('auth.credentialsVerified') as string);
      } catch (error: any) {
        logger.error(`Error verifying user credentials: ${error}`, this, error);
        this.showError = true;
        await this.addLoginLog(this.$t('auth.failedRetrieve') as string, true);
        await this.addLoginLog(this.$t('auth.error', { message: error.message }), true);
        return;
      }

      await this.addLoginLog(this.$t('auth.requestingInfo') as string);

      try {
        await UserStore().getUserMetadata();
        await this.addLoginLog(this.$t('auth.infoReceived') as string);
        await this.addLoginLog(this.$t('auth.retrievingSession') as string);
      } catch (error: any) {
        this.showError = true;
        await this.addLoginLog(this.$t('auth.failedRetrieve') as string, true);
        await this.addLoginLog(this.$t('auth.error', { message: error.message }), true);
        return;
      }

      if (!Object.keys(UserStore().UserMetadata).length) {
        this.showError = true;
        this.error = this.$t('auth.dataNotFound') as string;
        return;
      }

      await this.addLoginLog(this.$t('auth.collectingData') as string);
      try {
        await UserStore().setMetadataFromDynamo();
        await this.addLoginLog(this.$t('auth.updatingMetadata') as string);
      } catch (error: any) {
        this.showError = true;
        await this.addLoginLog(this.$t('auth.failedMetadata') as string, true);
        await this.addLoginLog(this.$t('auth.error', { message: error.message }), true);
        return;
      }

      await UserStore().checkV2CloudMigration();

      await this.addLoginLog(this.$t('auth.redirecting') as string);

      await setTimeout(() => {}, 2000);

      this.signingIn = false;
      this.$emit('set-state', 'signed-in');
    },
    async addLoginLog(message: string, error = false) {
      const delay = 200;
      let str = `<b>${message}</b>`;
      if (error) str = `<span class="text-error">${str}</span>`;
      this.loginLog.push({ str, time: Date.now() });
      return new Promise((r) => setTimeout(r, delay));
    },
    emailValid() {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email);
    },
    copyLog() {
      let log = this.loginLog.map((x) => `${x.str} / ${x.time}`).join('\n');
      log = log.replace(/<[^>]*>?/gm, '');
      navigator.clipboard.writeText(log);
    },
    abort() {
      this.reset();
      this.signingIn = false;
    },
    retry() {
      this.reset();
      this.signIn();
    },
    fail() {
      this.reset();
      this.$emit('close');
    },
    reset() {
      this.signingIn = false;
      this.showError = false;
      this.loading = false;
      this.loginLog = [];
    },
  },
};
</script>
