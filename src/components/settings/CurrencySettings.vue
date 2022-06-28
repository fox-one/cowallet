<template>
  <f-bottom-sheet
    v-model="dialog"
    wapper-in-desktop="dialog"
    :adaptive="true"
    :title="$t('currency')"
  >
    <template #activator="{ on }">
      <f-list-item
        v-on="on"
        :title="$t('currency')"
        :subtitle="currentCurrency"
        class="pa-0"
      />
    </template>

    <div class="items">
      <select-item
        v-for="(item, index) in items"
        :key="index"
        :title="item.name"
        :subtitle="item.text"
        :value="item.value"
        :active="item.value === currentCurrency"
        @select="handleSelect"
      />
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Currency } from "@/constants";
import SelectItem from "./SelectItem.vue";
@Component({
  components: {
    SelectItem,
  },
})
class CurrencySetting extends Vue {
  dialog = false;
  get items() {
    return Object.values(Currency).map((x) => ({
      name: x.name,
      text: x.text,
      value: x.name,
    }));
  }

  get currentCurrency() {
    const settings = this.$store.getters["app/GET_SETTINGS"];
    if (settings?.currency) {
      return settings.currency;
    }
    return "USD";
  }

  handleSelect(value) {
    this.dialog = false;
    this.$store.commit("app/SET_SETTINGS", { currency: value });
  }
}
export default CurrencySetting;
</script>

<style lang="scss" scoped>
.items {
  max-height: 60vh;
  overflow: auto;
}
</style>
