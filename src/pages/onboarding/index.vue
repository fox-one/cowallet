<template>
  <v-container class="narrow">
    <f-panel elevation="1" class="my-4 px-0 py-8">
      <div class="top text-center mb-4">
        <v-avatar size="64">
          <v-img :src="logo" />
        </v-avatar>
        <div class="title mt-2">
          {{ $t("hint.you_have_no_vault") }}
        </div>
        <div class="body-2 greyscale_3--text px-4">
          <template v-if="isLogged">
            {{ $t("hint.please_create_or_open_vault_1") }} <br />
            {{ $t("hint.please_create_or_open_vault_2") }}
          </template>
          <template v-else> {{ $t("hint.please_auth") }} </template>
        </div>
      </div>
      <div v-if="!isLogged" class="auth text-center">
        <f-button color="primary" large @click="auth">{{
          $t("common.auth")
        }}</f-button>
      </div>
      <template v-if="isLogged" class="">
        <v-divider class="my-2" />
        <create-vault-list />
      </template>
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

  logo = require("@/assets/images/logo.svg");

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

  auth() {
    this.$utils.helper.requestLogin(this);
  }

  goto(method) {
    this.$router.push("/onboarding/open?method=" + method);
  }
}
export default OnboardingPage;
</script>

<style lang="scss" scoped>
.icon {
  font-size: 24px;
}
</style>
