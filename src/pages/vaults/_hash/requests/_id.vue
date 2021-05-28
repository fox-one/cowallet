<template>
  <v-container class="">
    <f-loading :loading="loading" :fullscreen="true" />
    <f-panel v-if="!loading" padding="0" class="pa-4">
      <template v-if="multisig && asset && requests">
        <div class="transfer">
          <div class="asset mb-2">
            <v-avatar size="48" class="mb-1">
              <v-img :src="asset.icon_url" />
            </v-avatar>
            <div class="d-flex align-center">
              <span class="f-body-1 font-weight-bold mr-1">{{
                multisig.amount
              }}</span>
              <span class="f-body-1">{{ asset.symbol }}</span>
            </div>
          </div>
        </div>
        <div class="field-sec mb-2">
          <div class="f-caption f-greyscale-3 mb-1">
            {{ $t("roles.receiver") }}
          </div>
          <div class="field-value receivers d-flex">
            <div
              v-for="user in receivers"
              :key="`receiver-${user.user_id}`"
              class="user mr-1"
            >
              <v-avatar size="28" class="">
                <v-img :src="user.avatar_url" />
              </v-avatar>
              <span class="f-caption">{{ user.full_name }}</span>
            </div>
          </div>
        </div>
        <div class="field-sec mb-2">
          <div class="f-caption f-greyscale-3 mb-1">
            {{ $t("roles.signers") }}
          </div>
          <div class="field-value signers d-flex">
            <div
              v-for="user in signers"
              :key="`signer-${user.user_id}`"
              class="user mr-1 mb-2"
            >
              <v-avatar size="28" class="">
                <v-img :src="user.avatar_url" />
              </v-avatar>
              <span class="f-caption">{{ user.full_name }}</span>
            </div>
          </div>
        </div>
        <div class="field-sec mb-2">
          <div class="f-caption f-greyscale-3 mb-1">
            {{ $t("common.memo") }}
          </div>
          <div class="field-value pre f-body-2">
            {{ multisig.memo || $t("common.empty") }}
          </div>
        </div>
        <div class="field-sec mb-4">
          <div class="f-caption f-greyscale-3 mb-1">
            {{ $t("common.raw_transaction") }}
          </div>
          <div
            class="field-value pre f-body-2 trim d-flex align-center justify-space-between"
          >
            <div class="">
              {{ multisig.raw_transaction.slice(0, 24) + "..." }}
            </div>
            <div class="">
              <v-btn small icon>
                <v-icon size="16" @click="rawDialog = true">{{
                  $icons.mdiMagnify
                }}</v-icon>
              </v-btn>
              <v-btn small icon v-clipboard:copy="multisig.raw_transaction">
                <v-icon size="16">{{ $icons.mdiContentCopy }}</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <div class="hint text-center f-caption">
          <template v-if="!needToSign">
            {{ $t("hint.collected_enough_signatures") }}
          </template>
          <template v-if="meSigned">
            {{ $t("hint.already_signed") }}
          </template>
          <template v-else>
            {{
              $t("hint.please_sign", {
                m: multisig.signers.length,
                n: multisig.threshold,
              })
            }}
          </template>
        </div>
        <div class="buttons text-center mt-4">
          <template v-if="needToSign">
            <payment-action
              v-if="!meSigned"
              :label="$t('common.sign')"
              check-state="signed"
              @done="done"
              @error="error"
              @paid="sign"
            />
            <br />
            <payment-action
              check-state="unlocked"
              button-type="subtitle"
              :label="$t('common.revoke')"
              @done="done"
              @error="error"
              @paid="cancel"
            />
            <br />
            <f-button
              v-if="isDesktop"
              type="subtitle"
              v-clipboard:copy="shareUrl"
              >{{ $t("common.copy_url") }}</f-button
            >
            <f-button v-else type="subtitle" class="" @click="share">{{
              $t("common.share")
            }}</f-button>
          </template>
          <template v-else>
            <f-button type="primary" class="mb-4" @click="submit">{{
              $t("common.submit")
            }}</f-button>
          </template>
        </div>
        <!-- <div v-else>All signed!</div> -->
      </template>
      <template v-else>
        <div class="text-center">{{ $t("common.empty") }}</div>
      </template>
    </f-panel>
    <f-bottom-sheet v-model="rawDialog">
      <template #title>
        <div class="f-title-1">{{ $t("common.raw_transaction") }}</div>
      </template>
      <div class="raw-transaction-wrapper">
        <div v-if="multisig" class="raw-transaction mb-4 pa-4">
          {{ multisig.raw_transaction }}
        </div>
        <div class="text-center">
          <f-button type="subtitle" @click="rawDialog = false">{{
            $t("common.close")
          }}</f-button>
        </div>
      </div>
    </f-bottom-sheet>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { State } from "vuex-class";
import PaymentAction from "@/components/PaymentAction.vue";

@Component({
  components: {
    PaymentAction,
  },
})
class RequestDetailPage extends Mixins(mixins.page) {
  @State((state) => state.global.pendingRequests) requests;
  @State((state) => state.global.currentMultisig) multisig;
  @State((state) => state.auth.me) me;

  // multisig: any = null;

  receivers: any = [];

  signers: any = [];

  asset = null;

  rawDialog = false;

  loading = false;

  get title() {
    return this.$t("common.request") as string;
  }

  get isDesktop() {
    return this.$utils.helper.isDesktop();
  }

  get request() {
    const signedBy = this.$route.params.id;
    const result = this.requests.find((x) => x.signed_by === signedBy);
    return result;
  }

  get vault() {
    const hash = this.$route.params.hash;
    const parts = hash.split("-");
    const membersHash = parts[0];
    const threshold = parseInt(parts[1]);
    return this.$store.getters["vault/getVault"]({
      membersHash,
      threshold,
    });
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get meSigned() {
    if (this.me) {
      return Boolean(this.multisig.signers.find((x) => x === this.me.user_id));
    }
    return false;
  }

  get needToSign() {
    return this.multisig.signers.length < this.multisig.threshold;
  }

  get payUrl() {
    return `mixin://codes/${this.multisig.code_id}`;
  }

  get shareUrl() {
    return window.location.href;
  }

  @Watch("multisig")
  async handleUsers() {
    if (this.multisig) {
      if (this.multisig.error) {
        console.log(this.multisig);
        return;
      }
      let allUserIDs = this.multisig.receivers.slice();
      allUserIDs = allUserIDs.concat(this.multisig.signers);
      allUserIDs.sort();
      const allUsers = await this.$apis.getUsers(allUserIDs);
      for (let ix = 0; ix < allUsers.length; ix++) {
        const user = allUsers[ix];
        if (this.multisig.receivers.includes(user.user_id)) {
          this.receivers.push(user);
        }
        if (this.multisig.signers.includes(user.user_id)) {
          this.signers.push(user);
        }
      }
      this.asset = await this.$utils.helper.getAssetInfo(
        this.$store,
        this.multisig.asset_id,
      );
      this.loading = false;
    }
  }

  @Watch("vault")
  triggerLoadUTXOs() {
    if (this.vault) {
      setTimeout(() => {
        this.$store.dispatch("global/loadUTXOs", {
          members: this.vault.members,
          threshold: this.vault.threshold,
        });
      }, 200);
    }
  }

  @Watch("request")
  triggerLoadMultisig() {
    if (this.request?.utxos.length) {
      const first = this.request.utxos[0];
      this.$store.dispatch("global/loadMultisig", first.signed_tx);
    }
  }

  mounted() {
    // load current multisig to show details
    this.loading = true;
    this.triggerLoadMultisig();
    setTimeout(() => {
      this.loading = false;
    }, 10000);
  }

  sign(invoke) {
    invoke(this.multisig.code_id);
  }

  async cancel(invoke) {
    const resp = await this.$apis.createMultisig(
      this.multisig.raw_transaction,
      "unlock",
    );
    if (resp.code_id) {
      invoke(resp.code_id);
    }
  }

  async submit() {
    // keep the submit operation because it may signed by other wallets

    this.loading = true;
    try {
      const resp = await this.$utils.helper.submitSignatures(
        this,
        this.multisig,
      );
      console.log(resp);
      this.loading = false;
      this.$router.back();
    } catch (e) {
      console.log("error", e);
      this.loading = false;
    }
  }

  async done(multisig) {
    // goto success page
    console.log("ok!", multisig);
    if (multisig.threshold === multisig.signers.length) {
      // enough signatures, submit it
      this.loading = true;
      try {
        const resp = await this.$utils.helper.submitSignatures(this, multisig);
        console.log(resp);
        this.loading = false;
        this.$router.back();
      } catch (e) {
        console.log("error", e);
        this.loading = false;
      }
    } else {
      this.$router.back();
    }
  }

  error() {
    // goto success page
    console.log("request closed!");
  }

  share() {
    window.location.href = `mixin://send?text=${encodeURIComponent(
      this.shareUrl,
    )}`;
  }
}
export default RequestDetailPage;
</script>

<style lang="scss" scoped>
.transfer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .asset {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.raw-transaction {
  max-height: 300px;
  overflow: auto;
}
.field-value {
  &.user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &.pre {
    word-wrap: anywhere;
    font-family: "Menlo", "SF Mono", "Roboto Mono", Courier, monospace;
  }
  &.trim {
    height: 32px;
    overflow: hidden;
  }
}
.signers {
  flex-wrap: wrap;
}
.buttons {
  ::v-deep {
    .f-button {
      min-width: 240px !important;
    }
  }
}
</style>
