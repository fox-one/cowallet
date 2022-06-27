<template>
  <f-app-bar v-bind="appbar" center @back="handleBack" class="navbar">
    <v-layout
      v-if="customizedContent"
      class="d-flex align-center appbar--home"
      justify-center
      align-center
    >
      <div class="account">
        <account-entry />
      </div>
      <div class="title-1 font-weight-bold">CoWallet</div>
    </v-layout>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AccountEntry from "./AccountEntry.vue";

@Component({
  components: {
    AccountEntry,
  },
})
class DefaultLayoutAppBar extends Vue {
  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;
    if (this.customizedContent) {
      appbar.title = "";
    }
    return {
      ...appbar,
    };
  }

  get customizedContent() {
    return Boolean(this.$route.name === "index");
  }

  handleBack() {
    if (window.history.length <= 1) {
      this.$router.push({ name: "index" });
    } else {
      this.$router.back();
    }
  }
}
export default DefaultLayoutAppBar;
</script>

<style lang="scss" scoped>
.appbar--home {
  // position: relative;

  .account {
    position: absolute;
    left: 12px;
  }
}
</style>
