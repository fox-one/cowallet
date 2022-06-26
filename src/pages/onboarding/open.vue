<template>
  <v-container class="pa-4 narrow">
    <f-panel padding="0" class="pa-4">
      <component
        v-if="innerComponent"
        :is="innerComponent"
        :name.sync="formName"
        :members.sync="formMembers"
        :threshold.sync="formThreshold"
        :beancount.sync="formBeancount"
        :validated.sync="formValidated"
      />
      <div v-if="method !== 'friends'" class="text-center mt-6">
        <f-button color="primary" :disabled="!validated" @click="open">{{
          $t("common.open")
        }}</f-button>
      </div>
    </f-panel>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { State, Mutation } from "vuex-class";
import Friends from "@/particals/onboarding/friends.vue";
import Import from "@/particals/onboarding/import.vue";
import Manually from "@/particals/onboarding/manually.vue";

@Component({
  components: {
    Friends,
    Import,
    Manually,
  },
})
class OpenVaultPage extends Mixins(mixins.page) {
  @State((state) => state.vault.vaults) vaults;

  logo = require("@/assets/images/logo.svg");

  method = "manually";

  formName = "";

  formMembers = [];

  formThreshold = 0;

  formValidated = false;

  formBeancount = null;

  get title() {
    return this.$t("create_or_open_vault") as string;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  get validated() {
    return this.formValidated;
  }

  get innerComponent() {
    switch (this.method) {
      case "friends":
        return "friends";
      case "import":
        return "import";
      default:
        return "manually";
    }
  }

  mounted() {
    this.method = this.$route.query.method as string;
  }

  open() {
    console.log(this.formMembers, this.formThreshold, this.formValidated);
    const vault: any = {
      name: this.formName,
      members: this.formMembers.slice(),
      threshold: this.formThreshold,
      beancount: this.formBeancount,
    };
    vault.members.sort();
    vault.membersHash = this.$utils.helper.sha3_256(vault.members.join(""));
    this.$store.dispatch("cache/loadUsers", vault.members);
    this.$store.commit("vault/addVault", vault);
    this.$router.push("/");
  }
}
export default OpenVaultPage;
</script>

<style lang="scss" scoped>
.icon {
  font-size: 24px;
}
</style>
