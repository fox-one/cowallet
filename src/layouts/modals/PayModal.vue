<template>
  <div>
    <template v-if="url">
      <v-dialog
        v-model="modal"
        transition="dialog-top-transition"
        max-width="500"
        @click:outside="close"
      >
        <v-card class="py-5">
          <v-card-text class="">
            <div class="f-title-1 text-center mb-4">
              {{ $t("scan_to_transfer") }}
            </div>
            <div class="qrcode-wrapper">
              <f-qr-code :text="url" :size="200" />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <f-paying-modal :show="mask" :text="$t('loading')" @cancel="close" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { isDesktop } from "@foxone/utils/helper";

@Component({
  components: {},
})
class PayModal extends Vue {
  @State((state) => state.app.payment)
  payment!: any;

  get modal() {
    if (!isDesktop()) {
      return false;
    }
    return this.payment.modal;
  }

  set modal(val) {
    return;
  }

  get mask() {
    return this.payment.checking;
  }

  get url() {
    return this.payment.url;
  }

  close() {
    this.$store.commit("app/SET_PAYMENT", { modal: false, checking: false });
  }
}
export default PayModal;
</script>
<style lang="scss" scoped>
.qrcode-wrapper {
  display: flex;
  width: 100%;
  height: 200px;
  justify-content: center;
  align-items: center;
}
</style>
