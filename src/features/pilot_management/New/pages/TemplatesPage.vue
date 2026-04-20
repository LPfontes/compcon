<template>
  <stepper-content :complete="selectionComplete"
    exit="../pilot_management"
    back
    mandatory
    @back="$emit('back')"
    @complete="setTemplate()">
    <cc-title offset>{{ $t('pilotRegistration.title') }}</cc-title>
    <div class="heading h2">
      {{ $t('pilotRegistration.identService') }}
      <cc-slashes />
      &nbsp;{{ $t('pilotRegistration.wizard.templates.subtitle') }}
    </div>
    <v-row density="compact"
      justify="start">
      <v-col>
        <p class="flavor-text"
          style="font-size: 14px">
          {{ $t('pilotRegistration.wizard.templates.description') }}
        </p>
        <v-alert color="accent"
          variant="outlined"
          density="compact"
          class="mt-2"
          tile>
          <div class="text-center text-stark">
            {{ $t('pilotRegistration.wizard.templates.selectionNote', { icon: '' }) }}
            <v-icon color="accent">mdi-circle-edit-outline</v-icon>
            {{ $t('pilotRegistration.wizard.templates.selectionNote').split('{icon}')[1] }}
          </div>
        </v-alert>
      </v-col>
      <v-col cols="12"
        md="4">
        <b class="heading h3 text-accent">{{ $t('pilotRegistration.wizard.templates.artCourtesy') }}</b>
        <v-img target="_blank"
          href="https://www.retrogrademinis.com/"
          src="/public/retrograde_logo.webp"
          class="img-select"
          max-height="131px"
          max-width="478px"
          contain />
      </v-col>
    </v-row>
    <div class="my-4">
      <template-item v-for="t in templates"
        :key="t.name"
        :template="t"
        :is-selected="selected && t.name === selected.name"
        @select="selected = t" />
    </div>
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import TemplateItem from '../components/TemplateItem.vue';
import { getImagePath, ImageTag } from '@/io/ImageManagement';

import { CompendiumStore } from '@/stores';
import Templates from '../pregens.json';
import { CompendiumItem, MechSkills, Mech, Pilot, Frame } from '@/class';
import { mechname } from '@/io/Generators';

export default {
  name: 'TemplatesPage',
  components: { TemplateItem, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  emits: ['back', 'next'],
  data: () => ({
    selected: null as any,
  }),
  computed: {
    templates() {
      return Templates;
    },
    retrogradeLogo() {
      return getImagePath(ImageTag.Misc, 'retrograde_logo.webp');
    },
    selectionComplete(): boolean {
      return this.selected !== null;
    },
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight - 120);
    },
  },
  methods: {
    getItem(type: string, id: string) {
      const compendium = CompendiumStore();
      return CompendiumItem.Clone(compendium.referenceByID(type, id) as CompendiumItem);
    },
    async setTemplate() {
      const t = this.selected.build;
      this.pilot.MechSkillsController.MechSkills = MechSkills.Deserialize(t.mechSkills);
      this.pilot.SkillsController.ClearSkills();
      t.skills.forEach((s) => {
        this.pilot.SkillsController.AddSkill(this.getItem('Skills', s));
      });
      this.pilot.TalentsController.ClearTalents();
      t.talents.forEach((t) => {
        this.pilot.TalentsController.AddTalent(this.getItem('Talents', t));
      });

      this.pilot.Loadout.Armor = [this.getItem('PilotGear', t.gear.armor)];
      this.pilot.Loadout.Weapons = t.gear.weapons.map((x) => this.getItem('PilotGear', x));
      this.pilot.Loadout.Gear = t.gear.gear.map((x) => this.getItem('PilotGear', x));

      const m = t.mech;
      const mech = new Mech(
        this.getItem('Frames', 'mf_standard_pattern_i_everest') as Frame,
        this.pilot as Pilot
      );

      mech.Name = await mechname();
      mech.MechLoadoutController.ActiveLoadout.Systems = m.systems.map((x) =>
        this.getItem('MechSystems', x)
      );

      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Main')
        .Slots[0].EquipWeapon(this.getItem('MechWeapons', m.mounts[0].slots[0]));
      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Flex')
        .Slots[0].EquipWeapon(this.getItem('MechWeapons', m.mounts[1].slots[0]));
      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Flex')
        .Slots[1].EquipWeapon(this.getItem('MechWeapons', m.mounts[1].slots[1]));
      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Heavy')
        .Slots[0].EquipWeapon(this.getItem('MechWeapons', m.mounts[2].slots[0]));

      mech.PortraitController.SetCloudImage(this.selected.image);

      this.pilot.Mechs.forEach((m) => {
        this.pilot.RemoveMech(m);
      });
      this.pilot.AddMech(mech);

      this.pilot.isTemplate = true;

      this.$emit('next');
    },
  },
};
</script>

<style scoped>
.img-select {
  filter: saturate(0.6) brightness(80%);
  -webkit-filter: saturate(0.6) brightness(80%);
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
}

.img-select:hover {
  cursor: pointer;
  filter: saturate(1) brightness(110%);
  -webkit-filter: saturate(1) brightness(110%);
}
</style>
