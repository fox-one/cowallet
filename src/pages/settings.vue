<template>
  <v-container class="pa-0">
    <div class="page-inner pa-4">
      <div class="my-3">
        <currency-setting />
        <export-action />
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import CurrencySetting from "~/components/settings/CurrencySettings.vue";
import ExportAction from "~/components/settings/ExportAction.vue";
@Component({
  components: {
    CurrencySetting,
    ExportAction,
  },
})
class SettingsPage extends Mixins(mixins.page) {
  counter = 0;

  get title() {
    return this.$t("settings") as string;
  }

  get token() {
    return this.$store.getters["auth/GET_TOKEN"];
  }

  mounted() {
    //   this.$store.commit(AuthModuleKey + MutationTypes.SET_TOKEN, "sadf");
  }

  async copyToken() {
    if (this.counter >= 5) {
      await this.$copyText(this.token);
    }
    this.counter += 1;
  }

  async logout() {
    await this.$store.dispatch("auth/logout");
    window.location.reload();
  }
}
export default SettingsPage;
</script>

<style lang="scss" scoped></style>
