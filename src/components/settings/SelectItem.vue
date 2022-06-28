<template>
  <f-list-item
    :title="title"
    :subtitle="subtitle"
    :class="classes"
    @click="handleClick"
  >
    <template #tail>
      <span>
        <v-icon v-if="active">{{ $icons.mdiCheck }}</v-icon>
      </span>
    </template>
  </f-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
class SelectItem extends Vue {
  @Prop() title;
  @Prop() subtitle;
  @Prop() value;
  @Prop() active;
  get classes() {
    return { "select-item": true, "select-item--active": this.active };
  }
  handleClick() {
    this.$emit("select", this.value);
  }
}
export default SelectItem;
</script>

<style lang="scss" scoped>
.select-item {
  &:not(.select-item--active) {
    ::v-deep {
      .f-list-item__body {
        color: var(--v-greyscale_3-base);
        padding-right: 40px;
      }
    }
  }
}
</style>
