<template>
  <f-panel padding="0" class="py-4 mb-4 no-border-radius text-center">
    <v-row>
      <v-col>
        <f-input
          textarea
          v-model="importJson"
          height="200"
          :label="$t('manage_vault.vault_config')"
        />
      </v-col>
    </v-row>
  </f-panel>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import mixins from "@/mixins";

@Component({
  components: {},
})
class ImportAndOpenVault extends Vue {
  @PropSync("validated") bindValidated;
  @PropSync("name") bindName;
  @PropSync("members") bindMembers;
  @PropSync("threshold") bindThreshold;
  @PropSync("beancount") bindBeancount;

  importJson = "";

  @Watch("importJson")
  updateUserIds() {
    let vault: any = null;
    this.bindValidated = false;
    if (this.importJson) {
      try {
        vault = JSON.parse(this.importJson);
      } catch (e) {
        return;
      }
    } else {
      return;
    }
    console.log(vault);
    this.bindName = vault?.name || this.$t("common.unnamed");
    this.bindMembers = vault?.members;
    this.bindThreshold = vault?.threshold;
    this.bindBeancount = vault?.beancount || null;
    this.bindValidated = true;
  }
}
export default ImportAndOpenVault;
</script>

<style lang="scss" scoped>
.icon {
  font-size: 24px;
}
</style>
