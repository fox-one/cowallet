<template>
  <div class="auth-page">
    <v-progress-circular :width="3" color="primary" indeterminate />
    <div class="mt-3 greyscale_3--text">
      {{ $t("common.authing") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class AuthPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("common.authing") as string;
  }

  get appbar() {
    return {
      show: false,
    };
  }

  get code() {
    return this.$route.query.code as string;
  }

  get state() {
    const state = this.$route.query.state as string;
    try {
      return JSON.parse(decodeURIComponent(state));
    } catch (error) {
      return "";
    }
  }

  get redirect() {
    return "/";
    // const authPath = localStorage.getItem("authPath");
    // return authPath || "/";
  }

  async mounted() {
    await this.$store.dispatch("auth/login", this.code);
    this.$store.dispatch("auth/loadMe");
    document.location.replace(this.redirect);
  }
}
export default AuthPage;
</script>

<style lang="scss" scoped>
.auth-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
