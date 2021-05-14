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

    <f-bottom-sheet v-model="dialog">
      <template #title>
        {{ $t("manage_vault") }}
      </template>
      <v-list>
        <v-list-item @click="openNameDialog" :ripple="false">
          <v-list-item-content>
            <v-list-item-title>{{
              $t("manage_vault.change_name")
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="exportVault" :ripple="false">
          <v-list-item-content>
            <v-list-item-title>{{
              $t("manage_vault.export")
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteVault" :ripple="false">
          <v-list-item-content>
            <v-list-item-title class="f-error">{{
              $t("manage_vault.delete")
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </f-bottom-sheet>

    <f-bottom-sheet v-model="nameDialog">
      <template #title>
        {{ $t("manage_vault.change_name") }}
      </template>
      <div class="pa-4">
        <v-row>
          <v-col>
            <f-input
              v-model="changeNameValue"
              :label="$t('manage_vault.vault_name')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <f-button
              type="primary"
              @click="saveName"
              :disabled="!Boolean(changeNameValue)"
              >{{ $t("common.save") }}</f-button
            >
          </v-col>
        </v-row>
      </div>
    </f-bottom-sheet>

    <f-bottom-sheet v-model="exportDialog">
      <template #title>
        {{ $t("manage_vault.export") }}
      </template>
      <div class="pa-4 mb-4">
        <v-row>
          <v-col>
            <f-input
              v-model="vaultJsonContent"
              textarea
              :label="$t('manage_vault.vault_config')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <f-button type="primary" v-clipboard:copy="vaultJsonContent">{{
              $t("common.copy")
            }}</f-button>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <f-button type="subtitle" @click="exportDialog = false">{{
              $t("common.close")
            }}</f-button>
          </v-col>
        </v-row>
      </div>
    </f-bottom-sheet>
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

  dialog = false;

  nameDialog = false;

  exportDialog = false;

  changeNameValue = "";

  vaultJsonContent = "";

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
    return total.toString();
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

  openNameDialog() {
    this.dialog = false;
    this.changeNameValue = this.vault.name;
    this.nameDialog = true;
  }

  exportVault() {
    this.vaultJsonContent = JSON.stringify(this.vault);
    this.dialog = false;
    this.exportDialog = true;
  }

  deleteVault() {
    this.$emit("delete");
    this.nameDialog = false;
  }

  saveName() {
    const newVault = Object.assign({}, this.vault);
    newVault.name = this.changeNameValue.trim();
    this.$emit("update", newVault);
    this.nameDialog = false;
  }

  handleButtonClick(btn) {
    switch (btn.id) {
      case "manage":
        this.dialog = true;
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
