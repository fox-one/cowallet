<template>
  <f-bottom-sheet
    v-model="dialog"
    hide-close-icon
    min-width="500"
    z-index="111"
    wapper-in-desktop="dialog"
    content-class="f-bottom-sheet--no-padding"
  >
    <template #activator="{ on }">
      <pando-account-avatar
        :logged="logged"
        :name="meta.name"
        :avatar="meta.avatar"
        @click.native="on.click"
      />
    </template>

    <pando-account-overview
      :balance="meta.balance"
      :logged="logged"
      name="CoWallet"
      :version="VERSION"
      @close="handleClose"
      @connect="handleConnect"
      @disconnect="handleDisconnect"
    >
      <template #actions>
        <!-- <account-entry-actions /> -->
      </template>
    </pando-account-overview>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { VERSION } from "@/constants";
import AccountEntryActions from "./AccountEntryActions.vue";

@Component({
  components: {
    AccountEntryActions,
  },
})
class AccountEntry extends Vue {
  @Get("auth/me") me!: any;

  dialog = false;

  VERSION = VERSION;

  get logged() {
    return this.$store.getters["auth/isLogged"];
  }

  get bal() {
    return this.$store.getters["global/getMyAssetsTotalBal"];
  }

  get meta() {
    return {
      avatar: this.me?.avatar_url ?? "",
      name: this.me?.full_name ?? "",
      balance: this.$utils.helper.formatCurrency(this, "USD", this.bal),
    };
  }

  handleClose() {
    this.dialog = false;
  }

  handleConnect() {
    this.dialog = false;
    this.$utils.account.openAuth(this);
  }

  handleDisconnect() {
    this.$utils.account.requestLogout(this, {
      onDisconnect: () => {
        this.dialog = false;
      },
    });
  }
}
export default AccountEntry;
</script>
