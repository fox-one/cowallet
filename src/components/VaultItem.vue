<template>
  <div class="card px-6 pt-4 pb-2 d-flex" @click="gotoVault" :style="cardStyle">
    <div class="right">
      <div class="f-caption opacity-80">
        <span class="font-weight-bold"
          >{{
            $t("vault_item.threshold", {
              m: vault.threshold,
              n: vault.members.length,
            })
          }}
        </span>
        {{ $t("vault_item.vault") }}
      </div>
      <div class="top f-title-1 mb-1 font-weight-bold">
        {{ vault.name || "Unnamed" }}
      </div>

      <div v-if="fullsize" class="d-flex justify-space-between mb-2">
        <div class="left">
          <div class="f-caption opacity-80">
            {{ $t("vault_item.total_balance") }}
          </div>
          <div class="f-title-1 font-weight-bold">{{ balanceDisplay }}</div>
        </div>
      </div>

      <div class="members d-flex">
        <div
          class="member mr-2 mb-2"
          v-for="(mem, ix) in vaultMembers"
          :key="`mem-${ix}`"
        >
          <v-avatar size="24">
            <v-img :src="mem ? mem.avatar_url : defaultAvatar" />
          </v-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";

@Component
class VaultItem extends Vue {
  @Prop({}) vault;

  @Prop({ default: 0 }) balance;

  @Prop({ default: false }) fullsize;

  defaultAvatar = require("@/assets/images/logo.svg");

  vaultIconColor = "primary";

  get vaultMembers() {
    const members = this.vault.members.map((x) => {
      return this.$store!.getters["cache/getUser"](x) || null;
    });
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
      boxShadow: `0 2px 6px ${colors[1]}`,
    };
  }

  get balanceDisplay() {
    return this.$utils.helper.formatCurrency(this, "USD", this.balance);
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
  // background: #df8976;
  border-radius: 24px;
  color: white;

  // box-shadow: 0px 2px 6px #ffc3b7;

  .opacity-80 {
    opacity: 0.8;
  }
}
.members {
  display: flex;
  flex-wrap: wrap;
}
.icon-wrapper {
  border-radius: 32px;
  width: 50px;
  height: 50px;
  margin: 4px;
}
</style>
