<template>
  <div class="my-1 body-2">
    <span v-if="isLogged">
      <span class="greyscale_3--text">{{ prefix }}</span>
      <a class="mr-1 text--primary" @click="$emit('click:balance', balance)">{{
        meta.balance
      }}</a>
      <span class="greyscale_3--text">{{ symbol }}</span>
    </span>
    <a v-else @click="$emit('click:connect')">
      {{ connectLabal }}
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  inheritAttrs: false,
})
class BalanceField extends Vue {
  @Prop() balance!: string;

  @Prop() symbol!: string;

  @Prop() prefix!: string;

  @Prop() connectLabal!: string;

  @Prop({ default: false }) isLogged!: boolean;

  get meta() {
    return {
      balance: this.balance || "0.00",
    };
  }
}
export default BalanceField;
</script>
