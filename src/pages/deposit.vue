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
              @final="final"
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

@Component({
  components: {
    PaymentAction,
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

  mounted() {
    this.asset = this.myAssets[0];
  }

  final() {
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
}
export default DepositPage;
</script>

<style lang="scss" scoped></style>
