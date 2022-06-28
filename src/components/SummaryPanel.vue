<template>
  <f-panel elevation="1" class="can pa-0 mx-4" dark :style="cardStyle">
    <div class="bg-1" :style="cardBgStyle"></div>
    <div class="bg-2" :style="cardBgStyle"></div>
    <div class="content">
      <div class="d-flex justify-space-between px-4 pt-4 pb-2">
        <div class="top title-1 mb-1 font-weight-bold">
          {{ vault.name || "Unnamed" }}
        </div>
        <div class="multisig text-right">
          <div class="caption opacity-60 mb-2">
            <span
              >{{
                $t("vault_item.threshold", {
                  m: vault.threshold,
                  n: vault.members.length,
                })
              }}
            </span>
            {{ $t("vault_item.vault") }}
          </div>
          <div class="members d-flex align-center justify-begin">
            <div
              class="member d-flex mb-1"
              v-for="(mem, ix) in vaultMembers"
              :key="`mem-${ix}`"
            >
              <v-avatar v-if="mem" size="24">
                <v-img :src="mem ? mem.avatar_url : defaultAvatar" />
              </v-avatar>
              <div
                v-else
                class="more-icon-wrapper d-flex justify-center align-center"
              >
                <v-icon size="20">$FIconMoreHorizon</v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-space-between align-end px-4 pb-4">
        <div class="left">
          <div class="caption opacity-60">
            {{ $t("vault_item.total_balance") }}
          </div>
          <div class="headline font-weight-bold">{{ balanceDisplay }}</div>
        </div>
        <v-btn small icon @click="gotoSettings">
          <v-icon>$FIconMoreHorizon</v-icon>
        </v-btn>
      </div>

      <v-row no-gutters class="buttons">
        <v-col
          cols="6"
          v-for="(btn, ix) in btns"
          :key="`btn-${ix}`"
          class="btn-wrapper text-center"
        >
          <v-btn
            text
            block
            class="op-button pa-4"
            :ripple="false"
            :disabled="btn.disabled"
            @click="handleButtonClick(btn)"
          >
            <div class="btn-inner d-flex align-center">
              <v-icon
                size="24"
                class="icon mr-2"
                :class="btn.icon_reverse ? 'reverse' : ''"
                >{{ btn.icon }}</v-icon
              >
              <div class="label body-2">{{ btn.label }}</div>
            </div>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </f-panel>
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

  get vaultMembers() {
    const members = this.vault.members.map((x) => {
      return this.$store!.getters["cache/getUser"](x) || null;
    });
    return members;
  }

  get cardColors() {
    const hash = this.$utils.helper.sha3_256(
      this.vault.members.join("") + this.vault.threshold,
      "binary",
    );
    const colors = this.$utils.helper.digestColor(hash);
    const lighterColor0 = this.$utils.helper.shadeColor(colors[0], 5);
    return { colors, ligten0: lighterColor0 };
  }

  get cardStyle() {
    const { colors, ligten0 } = this.cardColors;
    return {
      background: `linear-gradient(260deg, ${colors[0]} 0%, ${ligten0} 100%)`,
    };
  }

  get cardBgStyle() {
    const { colors } = this.cardColors;
    return {
      backgroundColor: colors[1],
      opacity: 0.6,
    };
  }

  get balanceDisplay() {
    return this.$utils.helper.fiat(this, this.totalUsd);
  }

  get btns() {
    return [
      {
        id: "send",
        label: this.$t("common.send"),
        icon: "$FIconArrowDown",
        icon_reverse: true,
        disabled: this.position.length === 0,
      },
      {
        id: "deposit",
        label: this.$t("common.deposit"),
        icon: "$FIconArrowDown",
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
.can {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}
.bg-1,
.bg-2 {
  position: absolute;
  background: transparent;
  display: block;
  content: " ";
  border-radius: 600em;
  width: 150vw;
  height: 150vw;
  &.bg-1 {
    margin-top: 120px;
    margin-left: -90%;
  }
  &.bg-2 {
    bottom: 120px;
    right: -110%;
  }
}
.content {
  z-index: 1;
  position: relative;
}

.members {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  max-width: 40vw;
  .member {
    margin-left: -4px;
    height: 24px;
    width: 24px;
    &:last-child {
      margin-left: 0;
    }
    .more-icon-wrapper {
      border-radius: 20px;
      height: 24px;
      width: 24px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.op-button {
  &:hover::before {
    background: none;
    opacity: 0 !important;
  }
  .icon.reverse {
    transform: rotate(180deg);
  }
  &.v-btn.v-btn--text.v-btn--disabled {
    color: rgba(255, 255, 255, 0.5) !important;
    .v-icon {
      color: rgba(255, 255, 255, 0.5) !important;
    }
  }
}
</style>
