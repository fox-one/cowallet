<template>
  <v-container class="pa-0">
    <template v-if="vault">
      <summary-panel
        :assets="assets"
        :vault="vault"
        @settings="gotoSettings"
        class="mb-4"
      />
      <div
        v-if="loadingUTXO && position.length === 0"
        class="text-center mt-10 body-2 greyscale_3--text"
      >
        {{ $t("common.loading") }} {{ UTXOCount || "" }}
      </div>
      <template v-else>
        <request-list @click="gotoRequestPage" />
        <asset-list :assets="assets" @click="gotoTransactionsPage" />
      </template>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import AssetList from "@/components/AssetList.vue";
import RequestList from "@/components/RequestList.vue";
import SummaryPanel from "@/components/SummaryPanel.vue";
import mixins from "@/mixins";
import { Mutation, State } from "vuex-class";

@Component({
  components: {
    RequestList,
    AssetList,
    SummaryPanel,
  },
})
class VaultPage extends Mixins(mixins.page) {
  @State((state) => state.global.position) position;
  @State((state) => state.global.UTXOCount) UTXOCount;
  @State((state) => state.global.loadingUTXO) loadingUTXO;
  @Mutation("global/setPosition") setPosition;
  @Mutation("global/setPendingRequests") setPendingRequests;
  @Mutation("vault/setCurrentVault") setCurrentVault;

  assets: any = [];

  vault: any = null;

  loading = true;

  get title() {
    return this.$t("cowallet") as string;
  }

  get appbar() {
    return {
      back: this.$route.query.back !== "0",
      align: "center",
    };
  }

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  mounted() {
    this.loading = true;
    const hash = this.$route.params.hash;
    const parts = hash.split("-");
    const membersHash = parts[0];
    const threshold = parseInt(parts[1]);
    setTimeout(async () => {
      const current = await this.$store.getters["vault/getCurrentVault"];
      if (
        current &&
        current.membersHash === membersHash &&
        current.threshold === threshold
      ) {
        this.vault = current;
      } else {
        this.setPosition([]);
        this.setPendingRequests([]);
        this.vault = await this.$store.getters["vault/getVault"]({
          membersHash,
          threshold,
        });
        this.setCurrentVault(this.vault);
      }
      await this.loadPosition();
      this.loading = false;
    }, 200);
  }

  async loadPosition() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this.$store.dispatch("global/loadUTXOs2", {
            members: this.vault.members,
            threshold: this.vault.threshold,
          }),
        );
      }, 200);
      resolve(null);
    });
  }

  gotoRequestPage(request) {
    this.$router.push(
      `/vaults/${this.vault.membersHash}-${this.vault.threshold}/requests/${request.signed_by}`,
    );
  }

  gotoTransactionsPage(asset) {
    this.$router.push(
      `/vaults/${this.vault.membersHash}-${this.vault.threshold}/assets/${asset.asset_id}`,
    );
  }

  gotoSettings() {
    this.$router.push(
      `/vaults/${this.vault.membersHash}-${this.vault.threshold}/settings`,
    );
  }
}
export default VaultPage;
</script>

<style lang="scss" scoped>
.loading-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
