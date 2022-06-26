<template>
  <div>
    <template v-if="position.length">
      <div class="caption greyscale_3--text mx-4 mb-2 text-center">
        {{ $t("common.assets") }}
      </div>
      <f-panel padding="0" class="mx-4">
        <f-list>
          <f-list-item
            class="px-0 list-item"
            v-for="item in sortedPosition"
            :key="item.asset_id"
            @click="handleClick(item)"
          >
            <template #head>
              <f-mixin-asset-logo
                :logo="item.icon_url"
                :size="32"
                class="mt-1"
              />
            </template>
            <template #body>
              <div class="block">
                <div class="body-2">
                  <strong>{{
                    `${totalAmount(item.amount.toString())}`
                  }}</strong>
                  {{ `${item.symbol}` }}
                </div>
                <div class="caption greyscale_3--text">
                  {{ totalUsd(item.totalUsd) }}
                </div>
              </div>
            </template>
            <template #tail>
              <div class="">
                <div class="body-2">&nbsp;</div>
                <div class="caption greyscale_3--text">
                  {{ totalUsd(item.price_usd) }}
                </div>
              </div>
            </template>
          </f-list-item>
        </f-list>
      </f-panel>
    </template>
    <div v-else class="body-2 greyscale_3--text text-center mt-10">
      {{ $t("hint.no_asset_1") }} <br />{{ $t("hint.no_asset_2") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";

@Component
class AssetList extends Vue {
  @State((state) => state.global.position) position;

  get sortedPosition() {
    const ret = this.position.slice();
    return ret.sort((a, b) => {
      if (a.totalUsd.isGreaterThan(b.totalUsd)) {
        return -1;
      } else if (a.totalUsd.isLessThan(b.totalUsd)) {
        return 1;
      }
      return 0;
    });
  }

  handleClick(item) {
    this.$emit("click", item);
  }

  totalUsd(num) {
    return this.$utils.helper.formatCurrency(this, "USD", num);
  }

  totalAmount(num) {
    return this.$utils.helper.formatCurrency(this, "", num, 8);
  }
}
export default AssetList;
</script>

<style lang="scss" scoped>
.block {
  flex: 1;
}
.list-item {
  min-height: 64px;
}
</style>
