<template>
  <div padding="0" class="mb-4 no-border-radius text-left">
    <div class="f-title-1 mb-4">
      {{ $t("onboarding.friend.title") }}
    </div>
    <div class="sec mb-4">
      <div class="f-title-2 mb-2">{{ $t("onboarding.friend.step_1") }}</div>
      <div class="f-body-2 f-greyscale-3">
        <p>
          <a
            color="text--primary"
            :href="appUrl"
            style="text-decoration: underline"
            >{{ $t("onboarding.friend.step_1.tap") }}</a
          >{{ $t("onboarding.friend.step_1.text") }}
        </p>
      </div>
    </div>
    <div class="sec mb-4">
      <div class="f-title-2 mb-2">{{ $t("onboarding.friend.step_2") }}</div>
      <ul class="f-body-2 f-greyscale-3">
        <li>
          {{ $t("onboarding.friend.step_2.text_1") }}
          <img class="" src="/screenshots/friends-step-1.png" />
        </li>

        <li>{{ $t("onboarding.friend.step_2.text_2") }}</li>
        <li>
          {{ $t("onboarding.friend.step_2.text_3") }}
          <img class="" src="/screenshots/friends-step-2.png" />
        </li>
        <li>
          {{ $t("onboarding.friend.step_2.text_4") }}
        </li>
      </ul>
    </div>
    <div class="sec mb-4">
      <div class="f-title-2 mb-2">{{ $t("onboarding.friend.step_3") }}</div>
      <div class="f-body-2 f-greyscale-3">
        <p>
          {{ $t("onboarding.friend.step_3.text_1") }}
        </p>
        <p>
          <img src="/screenshots/friends-step-3.png" />
        </p>
        <p>{{ $t("onboarding.friend.step_3.text_2") }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { CLIENT_ID } from "@/constants";
@Component({
  components: {},
})
class FriendsVault extends Vue {
  @PropSync("validated") bindValidated;
  @PropSync("name") bindName;
  @PropSync("members") bindMembers;
  @PropSync("threshold") bindThreshold;

  get appUrl() {
    return `mixin://apps/${CLIENT_ID}`;
  }

  mounted() {
    this.bindValidated = false;
  }
}
export default FriendsVault;
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  border-radius: 8px;
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
</style>
