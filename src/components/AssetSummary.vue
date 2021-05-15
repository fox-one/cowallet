<template>
  <div class="asset d-flex flex-column align-center pa-4">
    <v-avatar size="48" class="mb-1">
      <v-img :src="icon" />
    </v-avatar>
    <div class="d-flex align-center mb-1">
      <span class="f-body-1 font-weight-bold mr-1">{{ amount }}</span>
      <span class="f-body-1">{{ symbol }}</span>
    </div>
    <div class="d-flex align-center">
      <span class="f-caption">${{ fiatAmount }}</span>
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
}
export default AssetSummary;
</script>
