<template>
  <div v-if="hasRequests" class="mx-0 mb-4">
    <f-list>
      <f-list-item
        v-for="(item, ix) in requests"
        :key="`request-${ix}`"
        @click="gotoRequestPage(item)"
      >
        <template #head>
          <div class="icon-wrapper">
            <f-mixin-asset-logo
              :logo="item.asset.icon_url"
              :size="38"
              class="mt-1"
            />
            <v-icon class="badge" size="18">$FIconUpRight3PFill</v-icon>
          </div>
        </template>
        <template #body>
          <div class="block">
            <div class="body-2">
              {{ `${item.asset.symbol} ${$t("common.requests")}` }}
            </div>
            <div class="caption greyscale_3--text">
              {{ `${$t("common.tap_to_review")}` }}
            </div>
          </div>
        </template>
      </f-list-item>
    </f-list>
    <v-divider class="divider" inset />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";

@Component
class RquestList extends Vue {
  @State((state) => state.global.pendingRequests) requests;

  get hasRequests() {
    return this.requests?.length > 0;
  }

  gotoRequestPage(request) {
    this.$emit("click", request);
  }
}
export default RquestList;
</script>

<style lang="scss" scoped>
.block {
  flex: 1;
}
.icon-wrapper {
  position: relative;
  .badge {
    position: absolute;
    bottom: 4px;
    right: -2px;
    border: 2px solid white;
    border-radius: 1em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    padding-bottom: 1px;
  }
}
.theme--dark {
  .icon-wrapper {
    .badge {
      background: #000;
      border-color: #000;
    }
  }
}
.divider {
  opacity: 0.6;
}
</style>
