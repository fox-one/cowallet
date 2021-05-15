<template>
  <v-container class="pa-0">
    <f-loading :loading="loading" :fullscreen="true" />
    <template v-if="asset">
      <f-panel padding="0">
        <asset-summary
          :icon="asset.icon_url"
          :symbol="asset.symbol"
          :amount="asset.amount"
          :fiat-amount="asset.price_usd"
        />
      </f-panel>

      <f-list>
        <f-list-item
          v-for="(tran, ix) in transactions"
          :key="`trans-${ix}`"
          :title="tran.amount"
          :subtitle="tran.memo || $t('common.empty')"
        >
          <template #head>
            <v-icon :color="getTransColor(tran)">{{
              getTransIcon(tran)
            }}</v-icon>
          </template>
          <template #tail>
            <div class="tail text-right">
              <div class="f-body-2">～</div>
              <div class="f-caption datetime">
                {{ tran.datetime_display }}
              </div>
            </div>
          </template>
        </f-list-item>
      </f-list>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { State } from "vuex-class";
import AssetSummary from "@/components/AssetSummary.vue";
import dayjs from "dayjs";

@Component({
  components: { AssetSummary },
})
class AssetsPage extends Mixins(mixins.page) {
  @State((state) => state.global.position) position;

  loading = false;

  get title() {
    return this.$t("common.transactions") as string;
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

  get transactions() {
    const { signed, unspent, spent } = this.$store.getters[
      "global/getUTXOsByAssetId"
    ](this.assetId);
    const incomes: any = [];
    const expenses: any = [];
    // all unspent and signed items are incoming
    const incomeUTXOs = signed.concat(unspent);
    for (let ix = 0; ix < incomeUTXOs.length; ix++) {
      const item = incomeUTXOs[ix];
      incomes.push({
        amount: `+${item.amount}`,
        memo: item.memo,
        datetime: item.created_at,
        utxo_id: item.utxo_id,
      });
    }
    for (let ix = 0; ix < spent.length; ix++) {
      // all spent items are incoming
      const item = spent[ix];
      incomes.push({
        amount: `+${item.amount}`,
        memo: item.memo,
        datetime: item.created_at,
        utxo_id: item.utxo_id,
        type: "income",
      });
      // console.log(item.signed_tx);
      // decode signed_tx, and consider all outputs as expenses
      let decodedTx: any = null;
      try {
        const result = (window as any).mixinGo.decodeTransaction(
          item.signed_tx,
        );
        decodedTx = JSON.parse(result);
      } catch (e) {
        console.log("failed to decode signed_tx, ignore");
        return [];
      }
      console.log(decodedTx);
      for (let iy = 0; iy < decodedTx.outputs.length; iy++) {
        const output = decodedTx.outputs[iy];
        expenses.push({
          amount: `-${output.amount}`,
          memo: item.memo,
          datetime: item.updated_at,
          utxo_id: item.utxo_id,
          type: "expense",
        });
      }
    }
    // merge incomes and expenses
    const result = incomes.concat(expenses);
    result.sort((a, b) => {
      if (a.datetime > b.datetime) {
        return -1;
      } else if (a.datetime < b.datetime) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log(result);
    return result.map((x) => {
      x.datetime_display = dayjs(x.datetime).format("YYYY/MM/DD HH:mm:ss");
      return x;
    });
  }

  // get meta() {
  //   let usd = new BigNumber(0);
  //   let amount = new BigNumber(0);
  //   for (let ix = 0; ix < this.position.length; ix++) {
  //     const ele = this.position[ix];
  //     usd = usd.plus(ele.totalUsd);
  //     amount = amount.plus(ele.amount);
  //   }
  //   const meta = {
  //     totalUsd: totalUsd.toString()
  //     amount: totalAmount
  //   }
  //   return meta;
  // }

  get assetId() {
    return this.$route.params.asset;
  }

  get asset() {
    return this.position.find((x) => {
      return x.asset_id === this.assetId;
    });
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  mounted() {
    this.$store.dispatch("cache/loadAsset", this.assetId);
  }

  getTransColor(tran) {
    return tran.type === "expense" ? "green" : "red";
  }
  getTransIcon(tran) {
    return tran.type === "expense"
      ? this.$icons.mdiArrowUpCircle
      : this.$icons.mdiArrowDownCircle;
  }
}
export default AssetsPage;
</script>

<style lang="scss" scoped></style>
