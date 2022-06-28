<template>
  <v-container class="narrow">
    <f-panel elevation="1" class="my-4 px-0 py-8">
      <template v-if="isLogged">
        <div class="top text-center mb-4">
          <v-avatar size="64">
            <v-img :src="logo" />
          </v-avatar>
          <div class="title mt-2 mb-2">
            {{ $t("hint.onboarding") }}
          </div>
          <div class="body-2 greyscale_3--text px-4">
            {{ $t("hint.please_create_or_open_vault_1") }} <br />
            {{ $t("hint.please_create_or_open_vault_2") }}
          </div>
        </div>
        <v-divider class="my-2 opacity-60" />
        <create-vault-list />
        <div v-if="hasVaults" class="text-center mt-8">
          <nuxt-link to="/">
            <f-button color="primary">{{
              $t("onboarding.view_vaults")
            }}</f-button>
          </nuxt-link>
        </div>
      </template>
      <div v-else>
        <div class="top text-center mb-4">
          <v-avatar size="64">
            <v-img :src="logo" />
          </v-avatar>
          <div class="title mt-2 mb-2">
            {{ $t("hint.login") }}
          </div>
          <div class="body-2 greyscale_3--text px-4">
            {{ $t("hint.please_auth") }}
          </div>
        </div>
        <div class="auth text-center mb-10">
          <f-button color="primary" large class="mb-4" @click="auth">{{
            $t("common.auth")
          }}</f-button>
          <br />
        </div>
      </div>
    </f-panel>
    <f-panel elevation="1">
      <div class="d-flex">
        <div class="caption">
          {{ $t("import_config.hint") }}
        </div>
        <v-spacer />
        <f-bottom-sheet
          v-model="dialog"
          wapper-in-desktop="dialog"
          :adaptive="true"
          :title="$t('import_config')"
        >
          <template #activator="{ on }">
            <f-button color="primary" rounded small v-on="on">{{
              $t("import_config")
            }}</f-button>
          </template>

          <div class="pa-4 mb-4">
            <v-row>
              <v-col cols="12">
                <f-text-area
                  v-model="jsonConfig"
                  :label="$t('import_config')"
                  hide-details
                />
              </v-col>
              <v-col cols="12" class="text-center">
                <f-button color="primary" @click="importConfig">{{
                  $t("import_config")
                }}</f-button>
              </v-col>
            </v-row>
          </div>
        </f-bottom-sheet>
      </div>
    </f-panel>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { State } from "vuex-class";
import CreateVaultList from "@/components/CreateVaultList.vue";

@Component({
  components: {
    CreateVaultList,
  },
})
class OnboardingPage extends Mixins(mixins.page) {
  @State((state) => state.vault.vaults) vaults;

  dialog = false;

  logo = require("@/assets/images/logo.svg");

  jsonConfig = "";

  get title() {
    return this.$t("onboarding") as string;
  }

  get appbar() {
    return {
      align: "center",
      back: false,
    };
  }

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  get hasVaults() {
    return this.$store.getters["vault/getVaults"]?.length !== 0;
  }

  auth() {
    this.$utils.account.openAuth(this);
  }

  goto(method) {
    this.$router.push("/onboarding/open?method=" + method);
  }

  importConfig() {
    let j: any = null;
    try {
      j = JSON.parse(this.jsonConfig);
    } catch (e) {
      this.$utils.helper.errorHandler(this, e);
      return;
    }
    // validation and commit
    try {
      if (j.settings) {
        this.$store.commit("app/SET_SETTINGS", j.settings);
      }
      if (j.vaults) {
        this.$store.commit("vault/removeAllVaults");
        for (let ix = 0; ix < j.vaults.length; ix++) {
          const vault = j.vaults[ix];
          this.$store.commit("vault/addVault", vault);
          this.$store.dispatch("cache/loadUsers", vault.members);
        }
      }
      if (j.token) {
        this.$store.commit("auth/SET_TOKEN", { token: j.token });
      }
    } catch (e) {
      this.$utils.helper.errorHandler(this, e);
      return;
    }
    this.dialog = false;
    this.$router.replace("/");
  }
}
export default OnboardingPage;
</script>

<style lang="scss" scoped>
.icon {
  font-size: 24px;
}
</style>
