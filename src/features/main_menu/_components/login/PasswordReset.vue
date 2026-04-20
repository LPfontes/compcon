<template>
  <div>
    <cc-heading type="h3" center class="my-3">{{ $t('auth.resetHeading') }}</cc-heading>
    <v-row justify="center">
      <v-col lg="6" cols="12">
        <cc-text-field v-model="email" :label="$t('auth.emailLabel')" color="primary" />
      </v-col>
    </v-row>
    <div class="mt-4 text-center">
      <cc-button color="secondary" :disabled="!email" :loading="loading" @click="reset()">
        {{ $t('auth.sendResetEmail') }}
      </cc-button>
    </div>
    <v-slide-x-transition>
      <v-card-text v-if="sent">
        <v-divider class="mb-4" />
        <cc-heading center type="h3" dense class="my-4">
          {{ $t('auth.codeSentTo', { email: email }) }}
        </cc-heading>
        <v-row align="center" justify="center">
          <v-col lg="4" cols="12">
            <cc-text-field v-model="code" color="primary" :label="$t('auth.resetCodeLabel')" />
          </v-col>
          <v-col lg="6" cols="12">
            <cc-text-field
              v-model="newPass"
              color="primary"
              :label="$t('auth.newPassLabel')"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              :rules="[rules.passLength]"
              @click-append-icon="show = !show" />
          </v-col>
        </v-row>
        <div class="mt-4 text-center">
          <cc-button
            color="secondary"
            :disabled="!email || !newPass"
            :loading="loading"
            @click="setNewPassword()">
            {{ $t('auth.setNewPass') }}
          </cc-button>
        </div>
      </v-card-text>
    </v-slide-x-transition>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn variant="text" color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
          {{ $t('auth.cancel') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import logger from '@/user/logger';
import {
  resetPassword,
  type ResetPasswordOutput,
  confirmResetPassword,
  type ConfirmResetPasswordInput,
} from 'aws-amplify/auth';

async function handleResetPassword(username: string) {
  try {
    const output = await resetPassword({ username });
    handleResetPasswordNextSteps(output);
  } catch (error) {
    logger.info(`Error resetting password: ${error}`);
  }
}

function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
  const { nextStep } = output;
  switch (nextStep.resetPasswordStep) {
    case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      logger.info(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
      // Collect the confirmation code from the user and pass to confirmResetPassword.
      break;
    case 'DONE':
      logger.info('Successfully reset password.');
      break;
  }
}

async function handleConfirmResetPassword({
  username,
  confirmationCode,
  newPassword,
}: ConfirmResetPasswordInput) {
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
  } catch (error) {
    logger.info(`Error confirming reset password: ${error}`);
  }
}

export default {
  name: 'AuthPasswordReset',
  data() {
    return {
      loading: false,
      sent: false,
      email: '',
      show: false,
      newPass: '',
      code: '',
    };
  },
  computed: {
    rules() {
      return {
        passLength: (v: string) => (v && v.length >= 6) || (this.$t('auth.minChars') as string),
      };
    },
  },
  methods: {
    reset() {
      this.loading = true;
      handleResetPassword(this.email)
        .then((data) => {
          this.loading = false;
          this.sent = true;
        })
        .catch((err) => {
          logger.error(`Error sending reset password email: ${err}`, this, err);
          this.loading = false;
          this.sent = false;
          this.$notify(this.$t('auth.sendError', { message: err.message }) as string, 'error');
        });
    },
    setNewPassword() {
      this.loading = true;
      handleConfirmResetPassword({
        username: this.email,
        confirmationCode: this.code,
        newPassword: this.newPass,
      })
        .then((data) => {
          this.loading = false;
          this.$notify({
            icon: 'mdi-check',
            color: 'success',
            title: this.$t('auth.success') as string,
            text: this.$t('auth.passChanged') as string,
          });
          this.$emit('set-state', 'sign-in');
        })
        .catch((err) => {
          this.$notify(this.$t('auth.changeError', { message: err.message }) as string, 'error');
          this.loading = false;
        });
    },
  },
};
</script>
