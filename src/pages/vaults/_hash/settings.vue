<template>
  <v-container class="">
    <template v-if="vault">
      <f-panel elevation="1" class="px-0 pb-0 pt-2 mb-4">
        <div class="caption greyscale_3--text px-4">
          {{ $t("manage_vault.general") }}
        </div>
        <f-list>
          <f-list-item
            :title="$t('vault.name')"
            :value="vault.name"
            @click="showNameDialog"
          />
          <f-list-item
            :title="$t('vault.threshold')"
            :value="vault.threshold + ''"
          />
        </f-list>
      </f-panel>

      <f-panel elevation="1" class="px-0 pb-0 pt-2 mb-4">
        <div class="caption greyscale_3--text px-4">
          {{ $t("manage_vault.beancount") }}
        </div>
        <f-list>
          <f-list-item
            :title="$t('beancount.variables')"
            value=""
            @click="showBeancountVariableDialog"
          />
          <f-list-item
            :title="$t('beancount.templates')"
            value=""
            @click="showBeancountTplDialog"
          />
        </f-list>
      </f-panel>

      <f-panel elevation="1" class="px-0 pb-0 pt-2 mb-4">
        <div class="caption greyscale_3--text px-4">
          {{ $t("manage_vault.operation") }}
        </div>
        <f-list>
          <f-list-item
            :title="$t('manage_vault.export')"
            @click="exportVault"
          />
          <f-list-item
            :title="$t('manage_vault.delete')"
            @click="deleteVault"
          />
        </f-list>
      </f-panel>
    </template>

    <f-bottom-sheet
      v-model="nameDialog"
      :title="$t('manage_vault.change_name')"
    >
      <div class="pa-4">
        <v-row>
          <v-col cols="12">
            <f-input
              v-model="changeNameValue"
              :label="$t('manage_vault.vault_name')"
              hide-details
            />
          </v-col>
          <v-col cols="12" class="text-center">
            <f-button
              color="primary"
              @click="saveName"
              :disabled="!Boolean(changeNameValue)"
              >{{ $t("common.save") }}</f-button
            >
          </v-col>
        </v-row>
      </div>
    </f-bottom-sheet>

    <f-bottom-sheet
      v-model="beancountVariableDialog"
      :title="$t('beancount.variables')"
    >
      <div class="pa-4">
        <v-row>
          <v-col cols="12">
            <f-input
              v-model="beancount.asset_name"
              :label="$t('beancount.asset_name')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <f-input
              v-model="beancount.income_name"
              :label="$t('beancount.income_name')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <f-input
              v-model="beancount.expense_name"
              :label="$t('beancount.expense_name')"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <f-button color="primary" @click="saveBeancount">{{
              $t("common.save")
            }}</f-button>
          </v-col>
        </v-row>
      </div>
    </f-bottom-sheet>

    <f-bottom-sheet
      v-model="beancountTplDialog"
      :title="$t('beancount.templates')"
    >
      <div class="pa-4">
        <v-row>
          <v-col cols="12">
            <f-text-area
              v-model="beancount.income_tpl"
              :label="$t('beancount.income_tpl')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <f-text-area
              v-model="beancount.expense_tpl"
              :label="$t('beancount.expense_tpl')"
              hide-details
            />
          </v-col>
          <v-col cols="12" class="text-center">
            <f-button color="primary" @click="saveBeancount">{{
              $t("common.save")
            }}</f-button>
          </v-col>
        </v-row>
      </div>
    </f-bottom-sheet>

    <f-bottom-sheet v-model="exportDialog" :title="$t('manage_vault.export')">
      <div class="pa-4 mb-4">
        <v-row>
          <v-col cols="12">
            <f-text-area
              v-model="vaultJsonContent"
              :label="$t('manage_vault.vault_config')"
              hide-details
            />
          </v-col>
          <v-col cols="12" class="text-center">
            <f-button
              color="primary"
              v-clipboard:copy="vaultJsonContent"
              @click="exportDialog = false"
              >{{ $t("common.copy") }}</f-button
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
import { INCOME_TPL, EXPENSE_TPL } from "@/constants";

@Component({
  components: {},
})
class VaultSettingsPage extends Mixins(mixins.page) {
  @Mutation("vault/updateVault") updateVault;
  @Mutation("vault/removeVault") removeVault;
  @Mutation("vault/setCurrentVault") setCurrentVault;

  loading = true;

  nameDialog = false;

  beancountVariableDialog = false;

  beancountTplDialog = false;

  exportDialog = false;

  changeNameValue = "";

  beancount = {
    asset_name: "Assets:YourName",
    income_name: "Income:YourName",
    expense_name: "Expenses:YourName",
    income_tpl: INCOME_TPL,
    expense_tpl: EXPENSE_TPL,
  };

  vaultJsonContent = "";

  @Watch("vault")
  updateBeancount() {
    if (this.vault?.beancount) {
      this.beancount = Object.assign({}, this.vault.beancount);
      if (this.beancount.income_tpl === undefined) {
        this.beancount.income_tpl = INCOME_TPL;
      }
      if (this.beancount.expense_tpl === undefined) {
        this.beancount.expense_tpl = EXPENSE_TPL;
      }
    }
  }

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

  showBeancountVariableDialog() {
    this.updateBeancount();
    this.beancountVariableDialog = true;
  }

  showBeancountTplDialog() {
    this.updateBeancount();
    this.beancountTplDialog = true;
  }

  exportVault() {
    this.vaultJsonContent = JSON.stringify(this.vault);
    this.exportDialog = true;
  }

  deleteVault() {
    this.removeVault(this.vault);
    this.$router.replace("/");
  }

  saveName() {
    const newVault = Object.assign({}, this.vault);
    newVault.name = this.changeNameValue.trim();
    this.updateVaultInfo(newVault);
    this.nameDialog = false;
  }

  saveBeancount() {
    const newVault = Object.assign({}, this.vault);
    newVault.beancount = this.beancount;
    this.updateVaultInfo(newVault);
    this.beancountVariableDialog = false;
    this.beancountTplDialog = false;
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
