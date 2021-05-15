<template>
  <v-container class="">
    <template v-if="vault">
      <f-panel padding="0" class="py-2">
        <div class="f-caption px-4">General</div>
        <f-list>
          <f-list-item
            :title="$t('vault.name')"
            :value="vault.name"
            @click="showNameDialog"
          />
          <f-list-item
            :title="$t('vault.threshold')"
            :value="vault.threshold"
          />
        </f-list>
        <div class="f-caption px-4">Beancount</div>
        <f-list>
          <f-list-item
            :title="$t('beancount.asset_name')"
            :value="vault.beancount_asset_name"
            @click="showNameDialog"
          />
          <f-list-item
            :title="$t('beancount.income_name')"
            :value="vault.beancount_income_name"
            @click="showNameDialog"
          />
          <f-list-item
            :title="$t('beancount.expense_name')"
            :value="vault.beancount_expense_name"
            @click="showNameDialog"
          />
        </f-list>
      </f-panel>
    </template>

    <f-bottom-sheet v-model="nameDialog">
      <template #title>
        {{ $t("manage_vault.change_name") }}
      </template>
      <div class="pa-4">
        <v-row>
          <v-col>
            <f-input
              v-model="changeNameValue"
              :label="$t('manage_vault.vault_name')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <f-button
              type="primary"
              @click="saveName"
              :disabled="!Boolean(changeNameValue)"
              >{{ $t("common.save") }}</f-button
            >
          </v-col>
        </v-row>
      </div>
    </f-bottom-sheet>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { Mutation, State } from "vuex-class";

@Component({
  components: {},
})
class VaultSettingsPage extends Mixins(mixins.page) {
  @Mutation("vault/updateVault") updateVault;
  @Mutation("vault/setCurrentVault") setCurrentVault;

  loading = true;

  nameDialog = false;

  changeNameValue = "";

  get title() {
    return this.$t("settings") as string;
  }

  get appbar() {
    return {
      back: this.$route.query.back !== "0",
      align: "center",
    };
  }

  get meta() {
    const hash = this.$route.params.hash;
    const parts = hash.split("-");
    const membersHash = parts[0];
    const threshold = parseInt(parts[1]);
    return {
      membersHash,
      threshold,
    };
  }

  get vault() {
    const current = this.$store.getters["vault/getCurrentVault"];
    if (
      current &&
      current.membersHash === this.meta.membersHash &&
      current.threshold === this.meta.threshold
    ) {
      return current;
    } else {
      return this.$store.getters["vault/getVault"]({
        membersHash: this.meta.membersHash,
        threshold: this.meta.threshold,
      });
    }
  }

  showNameDialog() {
    this.changeNameValue = this.vault.name;
    this.nameDialog = true;
  }

  saveName() {
    const newVault = Object.assign({}, this.vault);
    newVault.name = this.changeNameValue.trim();
    this.updateVaultInfo(newVault);
    this.nameDialog = false;
  }

  updateVaultInfo(vault) {
    console.log("update vault", vault);
    this.updateVault(vault);
    this.setCurrentVault(vault);
  }
}
export default VaultSettingsPage;
</script>

<style lang="scss" scoped></style>
