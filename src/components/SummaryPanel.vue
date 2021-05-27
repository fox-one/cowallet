<template>
  <div class="pa-4">
    <div class="top mb-6">
      <vault-item :vault="vault" :balance="totalUsd" :fullsize="true" />
    </div>

    <div class="buttons d-flex px-4 justify-space-between">
      <div
        v-for="(btn, ix) in btns"
        :key="`btn-${ix}`"
        class="btn-wrapper text-center"
      >
        <v-btn
          text
          block
          class="op-button"
          :ripple="false"
          :disabled="btn.disabled"
          @click="handleButtonClick(btn)"
        >
          <div class="btn-inner">
            <div class="icon-wrapper mb-1" :class="[btn.color]">
              <v-icon size="28">{{ btn.icon }}</v-icon>
            </div>
            <div class="f-caption f-greyscale-3">{{ btn.label }}</div>
          </div>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";
import BigNumber from "bignumber.js";
import VaultItem from "@/components/VaultItem.vue";

@Component({
  components: {
    VaultItem,
  },
})
class SummaryPanel extends Vue {
  @State((state) => state.global.position) position;
  @State((state) => state.global.pendingRequests) requests;

  @Prop({ default: [] }) assets;

  @Prop({ default: [] }) vault;

  get btns() {
    return [
      {
        id: "send",
        color: "purple",
        label: this.$t("common.send"),
        icon: this.$icons.mdiArrowUpCircle,
        disabled: this.requests.length !== 0 || this.position.length === 0,
      },
      {
        id: "deposit",
        color: "orange",
        label: this.$t("common.deposit"),
        icon: this.$icons.mdiArrowDownCircle,
      },
      {
        id: "manage",
        color: "blue",
        label: this.$t("common.manage"),
        icon: this.$icons.mdiCog,
      },
    ];
  }

  get totalUsd() {
    let total = new BigNumber(0);
    for (let ix = 0; ix < this.position.length; ix++) {
      const ele = this.position[ix];
      total = total.plus(ele.totalUsd);
    }
    return total.toFixed(2);
  }

  gotoDeposit() {
    this.$router.push({
      name: "deposit",
      query: {
        m: this.vault.membersHash,
        t: this.vault.threshold,
      },
    });
  }

  gotoSend() {
    this.$router.push({
      name: "send",
      query: {
        m: this.vault.membersHash,
        t: this.vault.threshold,
      },
    });
  }

  gotoSettings() {
    this.$emit("settings");
  }

  handleButtonClick(btn) {
    switch (btn.id) {
      case "manage":
        this.gotoSettings();
        break;
      case "send":
        this.gotoSend();
        break;
      case "deposit":
        this.gotoDeposit();
        break;
    }
  }
}
export default SummaryPanel;
</script>
<style lang="scss" scoped>
.btn-wrapper {
  width: 33%;
}
.op-button {
  padding-left: 24px !important;
  padding-right: 24px !important;
  height: 64px !important;
  &:hover::before {
    background: none;
    opacity: 0 !important;
  }
  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    &.purple {
      background-color: #ccace366 !important;
      color: #a777c9;
    }
    &.orange {
      background-color: #e5b38e66 !important;
      color: #d38c63;
    }
    &.blue {
      background-color: #8ecde566 !important;
      color: #5db0d1;
    }
  }
}
</style>
