<template>
  <f-auth-method-modal
    ref="authModal"
    :fennec="fennec"
    :client-id="clientId"
    :scope="scope"
    :is-firesbox="false"
    :pkce="true"
    :wallets="['mixin', 'fennec']"
    @auth="handleAuth"
    @error="handleError"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CONFIG, EVENTS } from "@/constants";

@Component
class AuthModal extends Vue {
  scope = "PROFILE:READ ASSETS:READ";

  clientId = CONFIG.MIXIN_CLIENT_ID;

  fennec = false;

  mounted() {
    setTimeout(() => {
      this.fennec = this.$fennec?.isAvailable() ?? false;
    }, 200);

    this.$root.$on(EVENTS.OPEN_AUTH, () => {
      const authModal = this.$refs.authModal as any;

      authModal?.onClick();
    });
  }

  async handleAuth(value) {
    try {
      let loginInfo: any = null;
      if (value?.type === "mixin") {
        loginInfo = {
          token: value.token,
          scope: this.scope,
          channel: value.type,
        };
      } else {
        await this.$fennec.connect(CONFIG.FENNEC_PROVIDER_NAME);
        const token = await this.$fennec.ctx!.wallet.signToken({
          payload: { from: CONFIG.FENNEC_PROVIDER_ID },
        });
        loginInfo = { token, scope: this.scope, channel: value.type };
      }

      this.$store.commit("auth/SET_TOKEN", loginInfo);
      await this.$utils.app.loadAppData(this);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
  }

  handleError(err) {
    console.log(err);
  }
}
export default AuthModal;
</script>
