<template>
  <div class="asset d-flex flex-column align-center pa-4">
    <v-avatar size="64" class="mb-2">
      <v-img :src="icon" />
    </v-avatar>
    <div class="d-flex align-center mb-2">
      <span class="body-1 font-weight-bold mr-1">{{ amountDisplay }}</span>
      <span class="body-1">{{ symbol }}</span>
    </div>
    <div class="d-flex align-center">
      <span class="body-2 greyscale_3--text">{{ usdDisplay }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";

@Component({
  components: {},
})
class AssetSummary extends Vue {
  @Prop() icon;
  @Prop() fiatAmount;
  @Prop() symbol;
  @Prop() amount;

  get amountDisplay() {
    if (this.amount) {
      return this.$utils.helper.formatCurrency(this, "", this.amount, 8);
    }
    return "";
  }

  get usdDisplay() {
    if (this.fiatAmount) {
      return this.$utils.helper.formatCurrency(this, "USD", this.fiatAmount);
    }
    return "";
  }
}
export default AssetSummary;
</script>
