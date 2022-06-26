<template>
  <v-container class="index-page">
    <f-loading :loading="loading" :fullscreen="true" />
    <template v-if="!loading">
      <v-row dense>
        <v-col
          cols="6"
          md="6"
          lg="4"
          v-for="(vault, ix) in vaults"
          :key="`vault-${ix}`"
        >
          <vault-item :vault="vault" />
        </v-col>
      </v-row>

      <f-bottom-sheet :title="$t('create_or_open_vault')">
        <template #activator="{ on }">
          <div class="py-4">
            <f-button
              class="empty-vault greyscale_6 greyscale_3--text"
              v-on="on"
            >
              {{ $t("create_or_open_vault") }}
            </f-button>
          </div>
        </template>
        <div class="pb-5">
          <create-vault-list />
        </div>
      </f-bottom-sheet>
      <div class="version caption greyscale_3--text mt-10 text-center">
        {{ version }}
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VaultItem from "@/components/VaultItem.vue";
import mixins from "@/mixins";
import { State, Mutation } from "vuex-class";
import CreateVaultList from "@/components/CreateVaultList.vue";
import { CLIENT_ID } from "~/constants";
import p from "../../package.json";

@Component({
  components: {
    VaultItem,
    CreateVaultList,
  },
})
class IndexPage extends Mixins(mixins.page) {
  @State((state) => state.vault.vaults) vaults;

  assets: any = [];

  loading = true;

  get title() {
    return this.$t("cowallet") as string;
  }

  get appbar() {
    return {
      align: "center",
      back: false,
    };
  }

  get version() {
    return p.version;
  }

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  async mounted() {
    this.loading = true;
    // if (this.$route.query.debug === "1") {
    //   const VConsole = require("vconsole");
    //   const vconsole = new VConsole();
    // }
    setTimeout(async () => {
      // in a conversation?
      let ctx: any = null;
      try {
        ctx = this.$utils.helper.jsbridge.getContext();
      } catch (e) {
        return;
      }
      if (ctx) {
        const conv = await this.$apis.getConv(ctx.conversation_id);
        if (conv && conv.category === "GROUP") {
          this.openVaultForConv(conv);
          return;
        } else {
          this.loading = false;
        }
      } else {
        this.loading = false;
        if (this.vaults.length === 0) {
          console.log("no vault");
          this.$router.push("/onboarding");
          return;
        }
      }
    }, 100);
  }

  openVaultForConv(conv) {
    const members = conv.participants
      .map((x) => {
        return x.user_id;
      })
      .filter((x) => {
        return x !== CLIENT_ID;
      });
    const m: any = /(.+)\^(\d+)/.exec(conv.name);
    if (m === null || m.length !== 3) {
      this.$router.push("/onboarding/open?method=friends");
      return;
    }
    const name = m[1];
    const threshold = parseInt(m[2]);
    if (members.length < threshold) {
      this.$router.push(`/onboarding/open?method=friends`);
      return;
    }
    const vault: any = {
      name,
      members,
      threshold,
    };
    vault.members.sort();
    vault.membersHash = this.$utils.helper.sha3_256(vault.members.join(""));
    console.log(vault);
    this.$store.dispatch("cache/loadUsers", vault.members);
    this.$store.commit("vault/addVault", vault);

    this.$router.push(`/vaults/${vault.membersHash}-${vault.threshold}?back=0`);
    // this.loading = false;
    return;
  }
}
export default IndexPage;
</script>

<style lang="scss" scoped>
.empty-vault {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  width: 100%;
  border-radius: 24px;
  cursor: pointer;
}
</style>
