<template>
  <div
    v-if="vault"
    class="card px-3 pt-2 pb-2 d-flex"
    @click="gotoVault"
    :style="cardStyle"
  >
    <div class="right">
      <div class="caption opacity-60 mb-1">
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
      <div class="top title-1 mb-2">
        {{ vault.name || "Unnamed" }}
      </div>

      <div v-if="fullsize" class="d-flex justify-space-between mb-2">
        <div class="left">
          <div class="caption opacity-60">
            {{ $t("vault_item.total_balance") }}
          </div>
          <div class="title-1 font-weight-bold">{{ balanceDisplay }}</div>
        </div>
      </div>

      <div class="members d-flex align-center justify-end">
        <div
          class="member d-flex"
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class VaultItem extends Vue {
  @Prop({ default: null }) vault!: any;

  @Prop({ default: 0 }) balance;

  @Prop({ default: false }) fullsize;

  defaultAvatar = require("@/assets/images/logo.svg");

  vaultIconColor = "primary";

  get vaultMembers() {
    let members = this.vault.members.map((x) => {
      return this.$store!.getters["cache/getUser"](x) || null;
    });
    if (members.length > 4) {
      members = members.slice(0, 5);
      members.unshift(null);
    }
    return members;
  }

  get cardStyle() {
    const hash = this.$utils.helper.sha3_256(
      this.vault.members.join("") + this.vault.threshold,
      "binary",
    );
    const colors = this.$utils.helper.digestColor(hash);
    const lighterColor0 = this.$utils.helper.shadeColor(colors[0], 5);
    return {
      background: `linear-gradient(260deg, ${colors[0]} 0%, ${lighterColor0} 100%)`,
    };
  }

  get balanceDisplay() {
    return this.$utils.helper.fiat(this, this.balance);
  }

  gotoDeposit() {
    this.$router.push("/deposit");
  }

  gotoSend() {
    this.$router.push("/send");
  }

  gotoVault() {
    if (this.fullsize) {
      return;
    }
    const hash = `${this.vault.membersHash}-${this.vault.threshold}`;
    console.log(hash);
    this.$router.push(`/vaults/${hash}`);
  }
}
export default VaultItem;
</script>
<style lang="scss" scoped>
.card {
  border-radius: 8px;
  color: white;
}
.members {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
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
.icon-wrapper {
  border-radius: 32px;
  width: 50px;
  height: 50px;
  margin: 4px;
}
</style>
