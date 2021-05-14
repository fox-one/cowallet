<template>
  <v-dialog v-model="dialog" max-width="280">
    <v-card class="text-center">
      <v-card-title class="justify-center">
        {{ $t("pay.scan_to_pay") }}
      </v-card-title>
      <v-card-text v-if="text">
        <f-qr-code :text="text" :size="200" class="my-5" />
        <p class="f-caption ma-0">
          {{ $t("pay.scan_to_pay.hint") }}
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <f-button type="primary" @click="handlePaid">
          {{ $t("common.paid") }}
        </f-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class QRCodePayModal extends Vue {
  dialog = false;

  text = "";

  show(text) {
    this.text = text;
    this.dialog = true;
  }

  hide() {
    this.text = "";
    this.dialog = false;
  }

  handlePaid() {
    this.hide();
    this.$emit("paid");
  }
}
export default QRCodePayModal;
</script>
