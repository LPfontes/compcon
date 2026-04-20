<template>
  <v-card-text :style="mobile ? 'margin-top: 14px' : 'margin-top: 16px'">
    <div class="packsList"
      style="min-height: 300px">
      <div class="heading h2 text-stark mt-3 px-2">
        <i18n-t keypath="contentManager.directory.official" tag="span">
          <template #link>
            <a href="https://massifpress.com/shop"
              target="_blank">MASSIF PRESS</a>
          </template>
        </i18n-t>
      </div>
      <massif-lcp-table :packs="massifPacks"
        :loading="loading" />
      <v-divider class="my-6" />
      <div class="heading h2 text-stark mt-3 px-2">
        {{ $t('contentManager.directory.community') }}
        <cc-dialog :title="$t('contentManager.directory.communityTitle')">
          <template #activator="{ open }">
            <v-icon size="x-small"
              class="mt-n1 fade-select"
              @click="open()">
              mdi-information-slab-box-outline
            </v-icon>
          </template>
          <v-card-text>
            {{ $t('contentManager.directory.communityInfo') }}
            <br />
            <i18n-t keypath="contentManager.directory.communityCreate" tag="span">
              <template #click>
                <a href="https://github.com/massif-press/lancer-data#lancer-community-content-packs"
                  target="_blank">
                  {{ $t('contentManager.directory.clickHere') }}
                </a>
              </template>
            </i18n-t>
          </v-card-text>
        </cc-dialog>
      </div>
      <cc-alert>
        <i18n-t keypath="contentManager.directory.downloadWarning" tag="span">
          <template #blog>
            <a href="https://www.patreon.com/compcon"
              target="blank">{{ $t('contentManager.directory.devBlog') }}</a>
          </template>
        </i18n-t>
      </cc-alert>
    </div>
    <community-table :packs="communityPacks"
      :loading="loading" />
  </v-card-text>
</template>

<script lang="ts">
import CommunityTable from './components/CommunityTable.vue';
import MassifLcpTable from '@/features/main_menu/_components/MassifLcpTable.vue';
import { useMobile } from '@/mixins/useMobile';
import { collectionDataQuery } from '@/user/api';


export default {
  name: 'PacksDirectory',
  components: {
    CommunityTable,
    MassifLcpTable,
  },
  mixins: [useMobile],
  data: () => ({
    catalog: [] as any[],
    loading: true,
  }),
  computed: {
    massifPacks() {
      return this.catalog
        .filter(x => x.sortkey.includes('massif'))
        .sort((a, b) => a.collection.localeCompare(b.collection));
    },
    communityPacks() {
      return this.catalog
        .filter(x => !x.sortkey.includes('massif'))
        .sort((a, b) => a.author.localeCompare(b.author));
    },
  },
  async mounted() {
    try {
      this.catalog = await collectionDataQuery();
    } catch {
      // API unreachable
    } finally {
      this.loading = false;
    }
  },
};
</script>
