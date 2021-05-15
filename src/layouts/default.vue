<template>
  <v-app>
    <f-app-bar v-bind="appbar" @back="handleBack"></f-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <toast />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const whitelist = ["onboarding", "auth"];

@Component({
  middleware: "i18n",
})
class DefaultLayout extends Vue {
  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;

    return {
      ...appbar,
    };
  }

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  handleBack() {
    if (window.history.length <= 1) {
      this.$router.push({ name: "index" });
    } else {
      this.$router.back();
    }
  }

  mounted() {
    console.log(this.$route.name);
    if (whitelist.includes(this.$route.name as string)) {
      return;
    }
    setTimeout(async () => {
      if (!this.isLogged) {
        console.log("no token");
        this.$router.push("/onboarding");
        return;
      }
      await Promise.all([
        await this.$store.dispatch("global/loadMultisigAssets"),
        await this.loadMe(),
        await this.loadMyAssets(),
      ]);
    }, 100);
  }

  async loadMyAssets() {
    if (this.isLogged) {
      return await this.$store.dispatch("global/loadMyAssets");
    }
    return null;
  }
  async loadMe() {
    return await this.$store.dispatch("auth/loadMe");
  }
}
export default DefaultLayout;
</script>

<style lang="scss" scoped></style>
