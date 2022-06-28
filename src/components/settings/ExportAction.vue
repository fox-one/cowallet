<template>
  <f-bottom-sheet
    v-model="dialog"
    wapper-in-desktop="dialog"
    :adaptive="true"
    :title="$t('export.title')"
  >
    <template #activator="{ on }">
      <f-list-item
        v-on="on"
        :title="$t('export.title')"
        :subtitle="$t('export.subtitle')"
        class="pa-0"
      />
    </template>

    <div class="pa-4 mb-4">
      <v-row>
        <v-col cols="12">
          <f-text-area
            v-model="jsonConfig"
            :label="$t('export.config')"
            hide-details
            readonly
          />
        </v-col>
        <v-col cols="12" class="text-center">
          <f-button
            color="primary"
            v-clipboard:copy="jsonConfig"
            @click="dialog = false"
            >{{ $t("common.copy") }}</f-button
          >
        </v-col>
      </v-row>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
class ExportAction extends Vue {
  dialog = false;

  get jsonConfig() {
    const settings = this.$store.getters["app/GET_SETTINGS"];
    const vaults = this.$store.getters["vault/getVaults"];
    const token = this.$store.getters["auth/getToken"];
    const str = JSON.stringify({
      version: "1",
      settings,
      vaults,
      token,
    });
    return str;
  }
}
export default ExportAction;
</script>

<style lang="scss" scoped></style>
