<template>
  <v-container>
    <v-row justify="space-around" dense>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-frequently-asked-questions"
          href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
          color="info"
        >
          {{ $t('help.faq') }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-help-rhombus-outline"
          href="https://github.com/massif-press/compcon/wiki/FAQ%3A-Troubleshooting"
          color="info"
        >
          {{ $t('help.troubleshooting') }}
        </cc-button>
      </v-col>
    </v-row>
    <v-row justify="space-around" dense class="mb-4">
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-bug"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          color="primary"
        >
          {{ $t('help.reportBug') }}
        </cc-button>
      </v-col>

      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-lightbulb-on"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          color="primary"
        >
          {{ $t('help.suggestFeature') }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-forum"
          href="https://github.com/massif-press/compcon/discussions"
          color="primary"
          class="text-white"
        >
          {{ $t('help.discussions') }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-format-float-left"
          href="https://github.com/massif-press/compcon/wiki"
          color="primary"
          class="text-white"
        >
          {{ $t('help.wiki') }}
        </cc-button>
      </v-col>
    </v-row>
    <!-- <h3 class="heading text-accent">Tutorial Mode</h3>
    <p class="panel py-3 text-center text-disabled">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
    <cc-heading is-title :text="$t('help.quickFaq')" />
    <v-row class="body-text text-text">
      <v-col cols="12" md="6">
        <cc-panel :title="$t('help.whereNpcs')">
          <span v-html="$t('help.whereNpcsText')"></span>
        </cc-panel>
      </v-col>
      <v-col cols="12" md="6">
        <cc-panel
          :title="$t('help.howAddContent')"
        >
          <i18n-t keypath="help.howAddContentText" tag="span">
            <template #itch>
              <a target="_blank" href="https://massif-press.itch.io/"
                >{{ $t('help.massifItch') }}</a>
            </template>
          </i18n-t>
        </cc-panel>
      </v-col>
    </v-row>
    <v-row class="body-text text-text">
      <v-col cols="12" md="6">
        <cc-panel :title="$t('help.howExotic')">
          <span v-html="$t('help.howExoticText')"></span>
        </cc-panel>
      </v-col>
      <v-col cols="12" md="6">
        <cc-panel :title="$t('help.needPay')">
          {{ $t('help.needPayText') }}
        </cc-panel>
      </v-col>
    </v-row>
    <br />
    <cc-heading is-title :text="$t('help.additionalHelp')" />
    <p class="body-text">
      <i18n-t keypath="help.additionalHelpText" tag="span">
        <template #faq>
          <a
            target="_blank"
            href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
            >{{ $t('help.faq') }}</a>
        </template>
        <template #discord>
          <a
            target="_blank"
            href="https://discord.gg/rwcpzsU"
            >{{ $t('help.lancerDiscord') }}</a>
        </template>
      </i18n-t>
    </p>

    <!-- <h3 class="heading text-accent">Video Guide</h3>
    <p class="panel py-3 text-center text-disabled">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'HelpPage',
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
