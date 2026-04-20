<template>
  <v-container>
    <div class="pa-2 text-white" :style="`background-color: rgb(var(--v-theme-primary))`">
      <span class="heading h2">
        {{ table.name }}
      </span>
    </div>
    <v-row>
      <v-col>
        <cc-text-field v-model="table.name" color="primary" :label="$t('activeMode.gm.tableConfig.tableName')" />
      </v-col>
      <v-col>
        <cc-text-field v-model="table.gm" color="primary" :label="$t('activeMode.gm.tableConfig.gameMaster')" />
      </v-col>
    </v-row>
    <br />
    name, description, owner info (prepopulate with user info)
    <br />
    load campaign info (optional)
    <br />
    publish or keep local
    <br />
    if publish, generate link to share
  </v-container>
</template>

<script>
export default {
  name: 'ActiveTableConfiguration',
  data: () => ({
    table: {
      name: this.$t('activeMode.gm.tableConfig.newTable'),
    },
  }),
};
</script>
