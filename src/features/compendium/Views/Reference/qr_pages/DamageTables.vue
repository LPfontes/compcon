<template>
  <v-container class="pb-12">
    <h1 class="heading text-center mb-4">{{ t('title') }}</h1>

    <!-- STRUCTURE DAMAGE -->
    <v-row justify="center">
      <v-col>
        <v-toolbar
          id="structuredamage"
          color="red darken-3"
          dark
        >
          <v-toolbar-title>{{ t('structureDamage.title') }}</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col>
                <span class="heading h3">{{ t('colRoll') }}</span>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('colResult') }}</span>
              </v-col>
              <v-col cols="7">
                <span class="heading h3">{{ t('colEffect') }}</span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- Glancing Blow -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-5</v-icon>
                <v-icon large>mdi-minus</v-icon>
                <v-icon large>mdi-dice-6</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('structureDamage.glancingBlow') }}</span>
              </v-col>
              <v-col cols="7">
                <span
                  class="body-text text-text"
                  v-html="bold(t('structureDamage.glancingBlowEffect'))"
                />
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- System Trauma -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-2</v-icon>
                <v-icon large>mdi-minus</v-icon>
                <v-icon large>mdi-dice-4</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('structureDamage.systemTrauma') }}</span>
              </v-col>
              <v-col cols="7">
                <span
                  class="body-text text-text"
                  v-html="bold(t('structureDamage.systemTraumaEffect'))"
                />
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- Direct Hit -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-1</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('structureDamage.directHit') }}</span>
              </v-col>
              <v-col cols="7">
                <span class="body-text text-text">
                  {{ t('structureDamage.directHitEffect') }}
                  <br />
                  <span v-html="bold(t('structureDamage.directHit3Plus'))" />
                  <br />
                  <span v-html="bold(t('structureDamage.directHit2'))" />
                  <br />
                  <span v-html="bold(t('structureDamage.directHit1'))" />
                </span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- Crushing Hit -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-1</v-icon>
                <v-icon large>mdi-dice-1</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('structureDamage.crushingHit') }}</span>
              </v-col>
              <v-col cols="7">
                <span
                  class="body-text text-text"
                  v-html="bold(t('structureDamage.crushingHitEffect'))"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- OVERHEATING -->
    <v-row
      justify="center"
      class="mt-4"
    >
      <v-col>
        <v-toolbar
          id="overheating"
          color="orange darken-4"
          dark
        >
          <v-toolbar-title>{{ t('overheating.title') }}</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col>
                <span class="heading h3">{{ t('colRoll') }}</span>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('colResult') }}</span>
              </v-col>
              <v-col cols="7">
                <span class="heading h3">{{ t('colEffect') }}</span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- Emergency Shunt -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-5</v-icon>
                <v-icon large>mdi-minus</v-icon>
                <v-icon large>mdi-dice-6</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('overheating.emergencyShunt') }}</span>
              </v-col>
              <v-col cols="7">
                <span
                  class="body-text text-text"
                  v-html="bold(t('overheating.emergencyShuntEffect'))"
                />
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- Power Plant Destabilize -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-2</v-icon>
                <v-icon large>mdi-minus</v-icon>
                <v-icon large>mdi-dice-4</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('overheating.powerPlantDestabilize') }}</span>
              </v-col>
              <v-col cols="7">
                <span
                  class="body-text text-text"
                  v-html="bold(t('overheating.powerPlantDestabilizeEffect'))"
                />
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- Meltdown -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-1</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('overheating.meltdown') }}</span>
              </v-col>
              <v-col cols="7">
                <span class="body-text text-text">
                  {{ t('overheating.meltdownEffect') }}
                  <br />
                  {{ t('overheating.meltdown3Plus') }}
                  <br />
                  {{ t('overheating.meltdown2') }}
                  <br />
                  {{ t('overheating.meltdown1') }}
                </span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- Irreversible Meltdown -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-1</v-icon>
                <v-icon large>mdi-dice-1</v-icon>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndUp"
                cols="3"
              >
                <span class="heading h3">{{ t('overheating.irreversibleMeltdown') }}</span>
              </v-col>
              <v-col cols="7">
                <span class="body-text text-text">
                  {{ t('overheating.irreversibleMeltdownEffect') }}
                </span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <p class="ma-3 flavor-text">{{ t('overheating.meltdownNote') }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- DOWN AND OUT -->
    <v-row
      justify="center"
      class="mt-4"
    >
      <v-col>
        <v-toolbar
          id="downandout"
          color="yellow darken-4"
          dark
        >
          <v-toolbar-title>{{ t('downAndOut.title') }}</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col>
                <span class="heading h3">{{ t('colRoll') }}</span>
              </v-col>
              <v-col cols="10">
                <span class="heading h3">{{ t('colEffect') }}</span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- On 6 -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-6</v-icon>
              </v-col>
              <v-col cols="10">
                <span class="body-text text-text">{{ t('downAndOut.on6') }}</span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- On 2-5 -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-2</v-icon>
                <v-icon large>mdi-minus</v-icon>
                <v-icon large>mdi-dice-5</v-icon>
              </v-col>
              <v-col cols="10">
                <span class="body-text text-text">
                  {{ t('downAndOut.on2to5') }}
                  <br />
                  {{ t('downAndOut.on2to5Choice') }}
                </span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <!-- On 1 -->
            <v-row>
              <v-col>
                <v-icon large>mdi-dice-1</v-icon>
              </v-col>
              <v-col cols="10">
                <span class="body-text text-text">{{ t('downAndOut.on1') }}</span>
              </v-col>
            </v-row>
            <v-divider class="ma-2" />
            <p class="ma-3 flavor-text">{{ t('downAndOut.note') }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-footer
    v-if="!isModal"
    border
    app
    class="py-0 bg-primary"
  >
    <v-tabs
      density="compact"
      center-active
      grow
    >
      <v-tab
        v-for="item in footerItems"
        :key="item.id"
        @click="scrollTo(item.id)"
        v-text="item.label"
      />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo('structuredamage')"
  >
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import scrollTo from '@/util/scrollTo'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'DamageTables',
    props: {
      isModal: {
        type: Boolean,
      },
    },
    setup() {
      const { t: $t } = useI18n()
      const t = (key: string) => $t(`compendium.reference_pages.damageTables_page.${key}`)

      /** Converts {b}...{/b} placeholder tags to real <b> HTML tags */
      const bold = (str: string) => str.replace(/\{b\}/g, '<b>').replace(/\{\/b\}/g, '</b>')

      return { t, bold }
    },
    computed: {
      footerItems(): { id: string; label: string }[] {
        return [
          { id: 'structuredamage', label: this.t('structureDamage.title') },
          { id: 'overheating', label: this.t('overheating.title') },
          { id: 'downandout', label: this.t('downAndOut.title') },
        ]
      },
    },
    methods: {
      scrollTo(id: string): void {
        const el = document.getElementById(id)
        if (el) scrollTo(el, this.isModal)
      },
    },
  }
</script>
