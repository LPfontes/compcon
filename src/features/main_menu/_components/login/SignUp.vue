<template>
  <v-container>
    <cc-alert color="secondary"
      prominent
      icon="mdi-information-outline"
      variant="outlined"
      :title="$t('auth.signUpTitle')">
      <div class="text-text">
        <p>
          {{ $t('auth.signUpText1') }}
        </p>
        <p class="my-1">
          {{ $t('auth.signUpText2') }}
        </p>
      </div>
    </cc-alert>
    <cc-heading type="h3"
      center
      class="my-2">{{ $t('auth.signUp') }}</cc-heading>

    <div class="my-4">
      <v-row justify="center"
        align="center">
        <v-col lg="6"
          cols="12">
          <div class="text-cc-overline pl-3">{{ $t('auth.email') }}</div>
          <cc-text-field v-model="email"
            icon="mdi-email-outline"
            color="primary"
            variant="outlined" />
        </v-col>
        <v-col lg="6"
          cols="12">
          <div class="text-cc-overline pl-3">{{ $t('auth.password') }}</div>
          <cc-text-field v-model="password"
            icon="mdi-lock-outline"
            color="primary"
            variant="outlined"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click-append-inner="show = !show" />
        </v-col>
      </v-row>
      <br />
      <cc-button block
        size="small"
        color="secondary"
        type="submit"
        class="my-6"
        :loading="loading"
        :disabled="!submitOk"
        @click="createAccount">
        {{ $t('auth.submit') }}
      </cc-button>
      <cc-button variant="text"
        color="error"
        @click="$emit('set-state', 'sign-in')">
        {{ $t('auth.cancel') }}
      </cc-button>
    </div>

    <v-scroll-y-transition leave-absolute
      hide-on-leave>
      <v-alert v-if="error"
        v-model="showError"
        color="error darken-1"
        density="compact"
        class="mt-2"
        icon="mdi-alert"
        closeable
        prominent>
        <div class="font-weight-bold">ERROR</div>
        <div v-html-safe="error" />
      </v-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script lang="ts">
import logger from '@/user/logger';
import { signUp } from 'aws-amplify/auth';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'SignUp',
  mixins: [useMobile],
  data() {
    return {
      showError: false,
      error: '',
      loading: false,
      show: false,
      email: '',
      password: '',
    };
  },
  computed: {
    submitOk() {
      return (
        /^\w+([.-]?\w+)*(\+\w+([.-]?\w+)*)?@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(this.email) &&
        this.password.length >= 6
      );
    },
    rules() {
      return {
        required: (value: any) => !!value || (this.$t('auth.required') as string),
        min: (v: string) => v.length >= 6 || (this.$t('auth.minChars') as string),
        emailMatch: (v: string) =>
          !v ||
          /^\w+([.-]?\w+)*(\+\w+([.-]?\w+)*)?@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(v) ||
          (this.$t('auth.emailValid') as string),
      };
    },
  },
  methods: {
    async createAccount() {
      this.loading = true;
      try {
        const userEmail = this.email;
        this.email = userEmail;

        await signUp({
          username: userEmail,
          password: this.password,
          options: {
            userAttributes: {
              email: userEmail,
            },
          },
        });

        this.loading = false;
        this.showError = false;
        this.$emit('success', userEmail);
      } catch (error: any) {
        logger.error(`Error creating account: ${error}`, this, error);
        this.loading = false;
        this.showError = true;
        this.error = error.message;
      }
    },
  },
};
</script>
