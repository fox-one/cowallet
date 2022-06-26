<template>
  <v-container>
    <f-panel elevation="6" class="text-center">
      <div class="status-wrapper text-center mb-4">
        <div class="title">
          {{ error.title || $t("error") }}
        </div>
      </div>
      <f-divider class="my-4" />
      <div class="detail pa-4 mb-10 text-left error--text">
        <div class="">Code: {{ error.errno }}</div>
        <div class="">Message: {{ error.msg || $t("errors.unknown") }}</div>
      </div>
      <f-button color="primary" @click="retry">{{ $t("retry") }}</f-button>
    </f-panel>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component({
  components: {},
})
class ErrorPage extends Mixins(mixins.page) {
  query: any = {};

  get title() {
    return "Error";
  }

  get appbar() {
    const isDark = (this as any).$vuetify.theme.dark;
    return {
      back: false,
      color: isDark ? "#000" : "#FFF",
    };
  }

  get error() {
    const { errno, msg } = this.$store.getters["app/GET_LAST_ERROR"];
    return { errno, msg };
  }

  retry() {
    window.location.reload();
  }
}
export default ErrorPage;
</script>

<style lang="scss" scoped>
.detail {
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
}
</style>
