<template>
  <v-container class="pa-0">
    <template v-if="vault">
      <f-panel padding="0" class="pa-4">
        <v-row>
          <v-col>
            <f-asset-amount-input
              v-model="value"
              :asset.sync="asset"
              :assets="myAssets"
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
              :label="$t('common.deposit')"
              :disabled="!validated"
              check-state="paid"
              @done="done"
              @error="error"
              @paid="deposit"
            />
          </v-col>
        </v-row>
      </f-panel>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { State } from "vuex-class";
import PaymentAction from "@/components/PaymentAction.vue";
import BalanceField from "@/components/BalanceField.vue";

@Component({
  components: {
    PaymentAction,
    BalanceField,
  },
})
class DepositPage extends Mixins(mixins.page) {
  @State((state) => state.global.myAssets) myAssets;

  asset: any = {};

  value = null;

  memo = "";

  get title() {
    return this.$t("common.deposit") as string;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get vault() {
    const membersHash = this.$route.query.m;
    const threshold = parseInt(this.$route.query.t as string);
    return this.$store.getters["vault/getVault"]({
      membersHash,
      threshold,
    });
  }

  get validated() {
    return Boolean(this.value && this.asset?.asset_id);
  }

  get currentBalance() {
    const asset = this.$store.getters["global/getMyAsset"](
      this.asset?.asset_id,
    );
    return asset ? asset.balance : "0.00";
  }

  mounted() {
    this.asset = this.myAssets[0];
  }

  done() {
    // goto success page
    console.log("ok!");
    this.$router.back();
  }

  error(err) {
    // goto success page
    console.log("error!", err);
  }

  async deposit(invoke) {
    if (this.vault) {
      const resp = await this.$apis.getPayments(
        this.asset.asset_id,
        this.value,
        this.memo,
        this.vault.members,
        this.vault.threshold,
      );

      invoke(resp.code_id);
    }
  }

  fillBalance(val) {
    this.value = val;
  }
}
export default DepositPage;
</script>

<style lang="scss" scoped></style>
