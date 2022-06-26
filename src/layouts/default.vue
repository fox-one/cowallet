<template>
  <v-app>
    <div>
      <f-app-bar
        v-bind="appbar"
        @back="handleBack"
        center
        :color="bgColor"
      ></f-app-bar>
      <v-main>
        <nuxt />
      </v-main>

      <toast />
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { isProduct, TOKEN } from "@/constants";

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

  get bgColor() {
    const isDark = this.$store.state.app?.dark || false;
    return isDark ? "black" : "white";
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

    if (!isProduct && TOKEN) {
      this.$store.commit("auth/SET_TOKEN", {
        token: TOKEN,
      });
    }

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
