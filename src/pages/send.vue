<template>
  <v-container class="pa-0">
    <f-loading :loading="loading" :fullscreen="true" />
    <template v-if="vault">
      <f-panel padding="0" class="pa-4">
        <v-row>
          <v-col>
            <f-bottom-sheet v-model="dialog">
              <template #activator="{ on }">
                <div
                  v-on="on"
                  class="receiver-selector f-bg-greyscale-6 px-4 py-3"
                >
                  <div
                    v-if="receiver"
                    class="d-flex align-center justify-center"
                  >
                    <v-avatar size="32" class="mr-2">
                      <v-img :src="receiver.avatar_url" />
                    </v-avatar>
                    <div class="f-body-1 font-weight-bold">
                      {{ receiver.full_name }}
                    </div>
                  </div>
                  <span v-else class="f-greyscale-3">
                    {{ $t("select_a_receiver") }}
                  </span>
                </div>
              </template>
              <template #title> {{ $t("select_a_receiver") }} </template>
              <template #subheader>
                <f-input
                  v-model="personFilter"
                  :label="$t('common.filter')"
                ></f-input>
              </template>
              <div class="wrapper" style="height: 400px">
                <f-list class="mb-4">
                  <f-list-item
                    v-for="(friend, index) in filterMembers"
                    :key="index"
                    :title="friend.full_name"
                    :subtitle="friend.identity_number"
                    class="narrow"
                    @click="handleSelect(friend)"
                  >
                    <template #head>
                      <v-avatar size="32">
                        <v-img :src="friend.avatar_url" />
                      </v-avatar>
                    </template>
                  </f-list-item>
                </f-list>
              </div>
            </f-bottom-sheet>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <f-asset-amount-input
              v-model="amount"
              :asset.sync="asset"
              :assets="position"
              :precision="8"
              :selectable="true"
              border
              :label="$t('common.amount')"
            >
            </f-asset-amount-input>
            <balance-field
              v-if="asset"
              :is-logged="true"
              :balance="currentBalance"
              :symbol="asset.symbol"
              :prefix="$t('balance_prefix')"
              @click:balance="fillBalance"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <f-input v-model="memo" :label="$t('common.memo')"></f-input>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-center">
            <payment-action
              :label="$t('common.send')"
              :disabled="!validated"
              check-state="signed"
              @done="done"
              @error="error"
              @paid="send"
            />
          </v-col>
        </v-row>
      </f-panel>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { State } from "vuex-class";
import BigNumber from "bignumber.js";
import PaymentAction from "@/components/PaymentAction.vue";
import BalanceField from "@/components/BalanceField.vue";

@Component({
  components: {
    PaymentAction,
    BalanceField,
  },
})
class SendPage extends Mixins(mixins.page) {
  @State((state) => state.global.friends) friends;
  @State((state) => state.global.position) position;

  dialog = false;

  asset: any = {};

  amount = "";

  memo = "";

  personFilter = "";

  receiver: any = null;

  vault: any = null;

  loading = false;

  get title() {
    return this.$t("common.send") as string;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  get filteredFriends() {
    if (this.personFilter) {
      return this.friends.filter((x) => {
        return x.full_name
          .toUpperCase()
          .includes(this.personFilter.toUpperCase());
      });
    }
    return this.friends;
  }

  get filterMembers() {
    const members = this.vault.members.map((x) => {
      return this.$store.getters["cache/getUser"](x);
    });
    if (this.personFilter) {
      return members.filter((x) => {
        return x.full_name
          .toUpperCase()
          .includes(this.personFilter.toUpperCase());
      });
    }
    return members;
  }

  get validated() {
    return Boolean(this.amount && this.asset?.asset_id && this.receiver);
  }

  get currentBalance() {
    const asset = this.$store.getters["global/getPosition"](
      this.asset?.asset_id,
    );
    return asset ? asset.amount : "0.00";
  }

  mounted() {
    const membersHash = this.$route.query.m;
    const threshold = parseInt(this.$route.query.t as string);
    setTimeout(() => {
      this.vault = this.$store.getters["vault/getVault"]({
        membersHash,
        threshold,
      });
    }, 200);
    this.asset = this.position[0];
  }

  handleSelect(friend) {
    this.receiver = friend;
    this.dialog = false;
    console.log(this.personFilter);
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

  async send(invoke) {
    this.loading = true;
    const tx: any = {
      version: 2,
      asset: this.$utils.helper.sha3_256(this.asset.asset_id),
      inputs: [],
      outputs: [],
      extra: this.$utils.helper.toHex(this.memo),
    };

    // pick utxos to send money
    const pickedUTXOs = this.$utils.helper.pickUTXOs(
      this.$store.state.global.unspentUTXOs,
      this.asset.asset_id,
    );
    console.log("pickedUTXOs", pickedUTXOs);

    // calculate the amount
    let inputAmount = new BigNumber(0);
    for (let ix = 0; ix < pickedUTXOs.length; ix++) {
      const utxo = pickedUTXOs[ix];
      inputAmount = inputAmount.plus(new BigNumber(utxo.amount));
      tx.inputs.push({
        hash: utxo.transaction_hash,
        index: utxo.output_index,
      });
      // enough, than break
      if (inputAmount.isGreaterThanOrEqualTo(this.amount)) {
        break;
      }
    }

    console.log("utxos' amount", inputAmount, "; transfer amount", this.amount);

    if (inputAmount.isLessThan(this.amount)) {
      alert("TOO MUCH");
      console.log("ERROR: not enough to pay");
      this.loading = false;
      return;
    }

    // console.log(this.amount.toString());

    // create an otxo which specify the receiver
    const output1 = await this.$apis.loadGhostKeys([this.receiver.user_id], 0);
    output1.amount = this.amount.toString();
    output1.script = this.$utils.helper.buildThresholdScript(parseInt("1"));
    output1.type = 0;
    tx.outputs.push(output1);

    if (inputAmount.isGreaterThan(this.amount)) {
      // need to return change?
      // create another otxo which specify the money for return change
      const output2 = await this.$apis.loadGhostKeys(this.vault.members, 1);
      output2.amount = inputAmount.minus(this.amount).toString();
      output2.script = this.$utils.helper.buildThresholdScript(
        this.vault.threshold,
      );
      output2.type = 0;
      tx.outputs.push(output2);
    }

    console.log("tx", JSON.stringify(tx));
    // build a kernel transaction
    const raw = (window as any).mixinGo.buildTransaction(JSON.stringify(tx));
    console.log("raw transaction", raw);

    this.loading = false;

    // create a multisig
    const result = await this.$apis.createMultisig(raw, "sign");
    if (result.code_id) {
      invoke(result.code_id);
    }
  }

  fillBalance(val) {
    this.amount = val;
  }
}
export default SendPage;
</script>

<style lang="scss" scoped>
.receiver-selector {
  min-height: 52px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  // justify-content: center;
  cursor: pointer;
}
.narrow {
  ::v-deep {
    .f-list-item-content {
      padding-top: 8px;
      padding-bottom: 8px;
      height: 52px;
    }
    .f-list-item-arrow {
      display: none !important;
    }
  }
}
</style>
