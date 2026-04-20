<template>
  <v-container class="pb-12">
    <h1 class="heading">{{ $t('compendium.reference_pages.iconGuide_page.title') }}</h1>

    <div
      v-for="(items, category) in content"
      :key="category"
      class="mt-2 mb-6"
    >
      <h2
        :id="String(category)"
        class="heading h3 text-accent"
      >
        {{ category }}
      </h2>
      <v-divider class="mt-1 mb-4" />
      <v-row dense>
        <v-col
          v-for="item in items"
          :key="item.name"
          cols="12"
          sm="6"
          xl="4"
        >
          <div class="d-flex align-center">
            <v-avatar
              size="55"
              color="background"
            >
              <v-icon
                size="40"
                :icon="item.icon"
                :color="item.color || ''"
              />
            </v-avatar>
            <div class="ml-4">
              <div class="heading">{{ item.name }}</div>
              <div
                v-if="item.text"
                class="text-disabled text-caption"
              >
                {{ item.text }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
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
        v-for="item in Object.keys(content)"
        :key="'footer_' + item"
        @click="scrollTo(item)"
        v-text="item"
      />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])"
  >
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import { Status } from '@/classes/Status'
  import { CompendiumStore } from '@/stores'
  import scrollTo from '@/util/scrollTo'

  export default {
    name: 'IconGuide',
    props: {
      isModal: {
        type: Boolean,
      },
    },
    computed: {
      content(): any {
        const t = (key: string) => this.$t(`compendium.reference_pages.iconGuide_page.${key}`)
        const cat = (key: string) => t(`categories.${key}`)
        const item = (key: string) => t(`items.${key}`)

        return {
          [cat('damageTypes')]: [
            { name: item('kineticDamage'), icon: 'cc:kinetic', color: 'damage--kinetic' },
            { name: item('energyDamage'), icon: 'cc:energy', color: 'damage--energy' },
            { name: item('explosiveDamage'), icon: 'cc:explosive', color: 'damage--explosive' },
            { name: item('heat'), icon: 'cc:heat', color: 'damage--heat' },
            { name: item('burn'), icon: 'cc:burn', color: 'damage--burn' },
            {
              name: item('variableOther'),
              icon: 'cc:variable',
              color: 'damage--variable',
              text: item('variableOtherText'),
            },
          ],
          [cat('rangeAttackTypes')]: [
            { name: item('meleeAttack'), icon: 'cc:melee' },
            { name: item('rangedAttack'), icon: 'cc:range' },
            { name: item('thrown'), icon: 'cc:thrown' },
            { name: item('threat'), icon: 'cc:threat', text: item('threatText') },
            { name: item('burst'), icon: 'cc:burst', text: item('burstText') },
            { name: item('blast'), icon: 'cc:blast', text: item('blastText') },
            { name: item('line'), icon: 'cc:line', text: item('lineText') },
            { name: item('cone'), icon: 'cc:cone', text: item('coneText') },
          ],
          [cat('trackedStats')]: [
            { name: item('hp'), icon: 'mdi-heart', text: item('hpText'), color: 'hp' },
            { name: item('armor'), icon: 'mdi-shield', color: 'armor' },
            { name: item('structure'), icon: 'cc:structure', color: 'structure' },
            { name: item('overshield'), icon: 'mdi-hexagon-multiple-outline', color: 'overshield' },
            { name: item('heat'), icon: 'cc:heat', color: 'damage--heat' },
            { name: item('reactorStress'), icon: 'cc:reactor', color: 'stress' },
            { name: item('repairCapacity'), icon: 'cc:repair', color: 'system' },
            {
              name: item('speed'),
              icon: 'mdi-arrow-right-bold-hexagon-outline',
              color: 'action--move',
            },
          ],
          [cat('stats')]: [
            { name: item('evasion'), icon: 'cc:evasion' },
            { name: item('techAttack'), icon: 'cc:quick_tech' },
            { name: item('eDefense'), icon: 'cc:edef' },
            { name: item('sensorRange'), icon: 'cc:sensor' },
            { name: item('saveRoll'), icon: 'cc:save' },
            { name: item('systemPoint'), icon: 'cc:system_point' },
          ],
          [cat('actions')]: [
            { name: item('protocol'), icon: 'cc:protocol', color: 'action--protocol' },
            { name: item('fullAction'), icon: 'mdi-hexagon-slice-6', color: 'action--full' },
            { name: item('fullTech'), icon: 'cc:full_tech', color: 'action--full' },
            { name: item('quickAction'), icon: 'mdi-hexagon-slice-3', color: 'action--quick' },
            { name: item('quickTech'), icon: 'cc:quick_tech', color: 'action--quick' },
            { name: item('overcharge'), icon: 'cc:overcharge', color: 'action--overcharge' },
            {
              name: item('move'),
              icon: 'mdi-arrow-right-bold-hexagon-outline',
              color: 'action--move',
            },
            { name: item('reaction'), icon: 'cc:reaction', color: 'action--reaction' },
            { name: item('freeAction'), icon: 'cc:free_action', color: 'action--free' },
          ],
          [cat('itemTypes')]: [
            { name: item('weapon'), icon: 'cc:weapon' },
            { name: item('system'), icon: 'cc:system' },
            { name: item('weaponMod'), icon: 'cc:weaponmod' },
            { name: item('trait'), icon: 'cc:trait' },
            { name: item('coreBonus'), icon: 'cc:corebonus' },
            { name: item('talent'), icon: 'cc:talent' },
            { name: item('skillTrigger'), icon: 'cc:skill' },
            { name: item('reserveTactical'), icon: 'cc:reserve_tactical' },
            { name: item('reserveMech'), icon: 'cc:reserve_mech' },
            { name: item('reserveResource'), icon: 'cc:reserve_resource' },
            { name: item('pilot'), icon: 'cc:pilot' },
            { name: item('mech'), icon: 'cc:frame' },
            { name: item('vehicle'), icon: 'cc:vehicle' },
            { name: item('ship'), icon: 'cc:ship' },
            { name: item('biological'), icon: 'mdi-heart-multiple-outline' },
            { name: item('squad'), icon: 'cc:squad' },
            { name: item('deployable'), icon: 'cc:drone' },
            { name: item('mine'), icon: 'cc:mine' },
          ],
          [cat('npcClasses')]: [
            { name: item('artillery'), icon: 'cc:role_artillery' },
            { name: item('biological'), icon: 'mdi-heart-outline' },
            { name: item('controller'), icon: 'cc:role_controller' },
            { name: item('defender'), icon: 'cc:role_defender' },
            { name: item('striker'), icon: 'cc:role_striker' },
            { name: item('support'), icon: 'cc:role_support' },
          ],
          [cat('statusesAndConditions')]: CompendiumStore().Statuses.map((s: Status) => ({
            name: s.Name,
            icon: s.Icon,
            text: s.Terse,
          })),
          [cat('other')]: [
            { name: item('accuracy'), icon: 'cc:accuracy' },
            { name: item('difficulty'), icon: 'cc:difficulty' },
            { name: item('contentPack'), icon: 'cc:compendium', text: item('contentPackText') },
          ],
        }
      },
    },
    methods: {
      scrollTo(item: any): void {
        const el = document.getElementById(`${item}`)
        if (el) scrollTo(el, this.isModal)
      },
    },
  }
</script>
