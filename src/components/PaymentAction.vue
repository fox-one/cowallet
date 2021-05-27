<template>
  <div>
    <f-button
      :type="buttonType || 'primary'"
      @click="pay"
      :disabled="disabled"
      >{{ label }}</f-button
    >
    <qrcode-pay-modal ref="QRCodePayModal" @paid="handleConfirmPaid" />
    <f-paying-modal :show="showPaying" :text="''" @cancel="handleCancel" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import QRCodePayModal from "@/components/QRCodePayModal.vue";

@Component({
  components: {
    "qrcode-pay-modal": QRCodePayModal,
  },
})
class PaymentAction extends Vue {
  @Prop({ default: "" }) label;
  @Prop({ default: "paid" }) checkState;
  @Prop({ default: false }) disabled;
  @Prop({ default: "primary" }) buttonType;

  showPaying = false;

  timer: any = null;

  handleCancel() {
    this.showPaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  async invokePayment(codeId) {
    const isDesktop = this.$utils.helper.isDesktop();

    const url = `https://mixin.one/codes/${codeId}`;

    console.log("pay url", url);

    const proc = this.$utils.helper.genCheckResultProc(
      codeId,
      this.checkState,
      (resp) => {
        this.showPaying = false;
        this.hideModal();
        this.$emit("done", resp);
      },
      (e) => {
        this.showPaying = false;
        this.hideModal();
        this.$emit("error", e);
      },
    );

    this.timer = proc(this);

    if (url && isDesktop) {
      this.showModal(url);
    } else {
      window.location.href = url;
    }
  }

  pay() {
    this.$emit("paid", this.invokePayment);
  }

  async handleConfirmPaid() {
    this.hideModal();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  showModal(url) {
    const modal = this.$refs.QRCodePayModal as any;
    if (modal) {
      modal.show(url);
      return;
    }
  }

  hideModal() {
    const modal = this.$refs.QRCodePayModal as any;
    if (modal) {
      modal.hide();
      return;
    }
  }
}
export default PaymentAction;
</script>
