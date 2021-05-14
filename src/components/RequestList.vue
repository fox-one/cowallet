<template>
  <div v-if="hasRequests">
    <div class="f-title-1 mx-4 mb-2">{{ $t("common.requests") }}</div>
    <f-panel padding="0" class="mx-4 mb-4">
      <f-list>
        <f-list-item
          v-for="(item, ix) in requests"
          :key="`request-${ix}`"
          :title="`Send ${item.asset.symbol}`"
          @click="gotoRequestPage(item)"
        >
          <template #head>
            <f-mixin-asset-logo
              :logo="item.asset.icon_url"
              :size="24"
              class="mt-1"
            />
          </template>
        </f-list-item>
      </f-list>
    </f-panel>
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
