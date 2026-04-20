<template>
  <v-container class="text-center">
    <cc-heading type="h3" center>{{ $t('auth.verifyHeading') }}</cc-heading>
    <div class="my-2">
      <div v-if="preFill">{{ $t('auth.codeSent') }}</div>
      <div v-else>{{ $t('auth.sendTo') }}</div>
      <v-row dense justify="center" align="center">
        <v-col cols="12" sm="6" lg="4">
          <v-text-field
            v-model="verifyEmail"
            density="compact"
            hide-details
            variant="outlined"
            tile />
        </v-col>
      </v-row>
      <div class="d-flex align-center justify-center">
        <cc-button
          :size="preFill ? 'small' : 'default'"
          color="accent"
          class="mt-2"
          @click="resend()">
          {{ preFill ? $t('auth.resend') : $t('auth.send') }} {{ $t('auth.codeLabel') }}
        </cc-button>
      </div>
      <v-fade-transition>
        <div v-if="!preFill" class="text-center mt-1">
          <v-btn size="x-small" flat tile :disabled="!verifyEmail" @click="preFill = true">
            {{ $t('auth.alreadyHaveCode') }}
          </v-btn>
        </div>
      </v-fade-transition>
    </div>

    <v-fade-transition>
      <div v-if="preFill">
        <v-divider class="my-4" />
        {{ $t('auth.inputCode') }}
        <v-row dense justify="center">
          <v-col cols="12" sm="6" lg="4">
            <v-text-field
              v-model="verify"
              :label="$t('auth.codeLabel')"
              density="compact"
              variant="outlined"
              class="my-1"
              hide-details />
          </v-col>
        </v-row>
        <div class="d-flex align-center justify-center">
          <cc-button
            color="secondary"
            :loading="loading"
            :disabled="!verify || !verifyEmail"
            class="my-4"
            @click="confirm">
            {{ $t('auth.confirmCode') }}
          </cc-button>
        </div>
      </div>
    </v-fade-transition>
    <cc-button variant="text" color="accent" @click="$emit('set-state', 'sign-in')">
      {{ $t('auth.cancel') }}
    </cc-button>
    <v-scroll-y-transition leave-absolute hide-on-leave>
      <cc-alert
        v-if="error"
        v-model="showError"
        color="error"
        prominent
        icon="mdi-alert"
        closeable
        title="error">
        <div v-html-safe="error" />
      </cc-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script lang="ts">
import logger from '@/user/logger';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

export default {
  name: 'AuthAccountVerify',
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    error: '',
    showError: false,
    loading: false,
    show: false,
    verify: '',
    verifyEmail: '',
    preFill: false,
    sentCode: false,
  }),
  created() {
    if (this.email) {
      this.verifyEmail = this.email;
      this.preFill = true;
      this.sentCode = true;
    }
  },
  methods: {
    async confirm() {
      this.loading = true;

      try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
          username: this.verifyEmail,
          confirmationCode: this.verify,
        });

        if (isSignUpComplete) {
          this.loading = false;
          this.$notify(this.$t('auth.successCreated') as string);
          this.$emit('set-state', 'sign-in');
        } else {
          this.loading = false;
          this.showError = true;
          this.error = this.$t('auth.confirmError') as string;
        }
      } catch (error: any) {
        logger.error(`error confirming sign up: ${error}`, this);
        this.showError = true;
        this.error = error.message;
      }
    },
    async resend() {
      try {
        const res = await resendSignUpCode({ username: this.verifyEmail });

        this.$notify(this.$t('auth.resendSuccess', { email: this.verifyEmail }) as string);

        this.sentCode = true;
        this.preFill = true;
      } catch (error: any) {
        logger.error(`error resending code: ${error}`, this, error);
        this.showError = true;
        this.error = error.message;
      }
    },
  },
};
</script>
