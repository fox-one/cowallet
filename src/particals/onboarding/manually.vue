<template>
  <div>
    <v-row>
      <v-col cols="12">
        <f-input
          v-model="nameValue"
          :label="$t('manage_vault.vault_name')"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <f-input
          textarea
          v-model="userIdsValue"
          hide-details
          :label="$t('onboarding.manually.user_ids')"
        />
      </v-col>
      <v-col cols="12">
        <f-input
          v-model="thresholdValue"
          hide-details
          :label="$t('onboarding.manually.threshold')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { State } from "vuex-class";

@Component({
  components: {},
})
class ManuallyOpenVault extends Vue {
  @State((state) => state.vault.vaults) vaults;

  @PropSync("validated") bindValidated;
  @PropSync("name") bindName;
  @PropSync("members") bindMembers;
  @PropSync("threshold") bindThreshold;

  nameValue = "";

  userIdsValue = "";

  thresholdValue = "";

  get userIds() {
    const lines = this.userIdsValue.split("\n");
    return lines.map((x) => {
      return x.trim();
    });
  }

  get thresholdNum() {
    let num = 0;
    try {
      num = parseInt(this.thresholdValue);
    } catch (e) {
      return 0;
    }
    return num;
  }

  @Watch("nameValue")
  @Watch("userIds")
  @Watch("thresholdNum")
  updateUserIds() {
    if (this.nameValue) {
      if (this.userIds.length >= this.thresholdNum) {
        this.bindValidated = true;
      } else {
        this.bindValidated = false;
      }
    } else {
      return false;
    }
    this.bindName = this.nameValue;
    this.bindMembers = this.userIds;
    this.bindThreshold = this.thresholdNum;
  }
}
export default ManuallyOpenVault;
</script>

<style lang="scss" scoped>
.icon {
  font-size: 24px;
}
</style>
