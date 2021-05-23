<template>
  <div class="my-1">
    <span v-if="isLogged">
      {{ prefix }}
      <a class="ml-1 text--primary" @click="$emit('click:balance', balance)">{{
        meta.balance
      }}</a>
      {{ symbol }}
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
