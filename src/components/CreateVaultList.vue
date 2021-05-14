<template>
  <f-list>
    <f-list-item
      :title="$t('create_or_open_vault.friends')"
      :subtitle="$t('create_or_open_vault.friends.desc')"
      @click="goto('friends')"
    >
      <template #head>
        <div class="icon">👪</div>
      </template>
    </f-list-item>
    <f-list-item
      :title="$t('create_or_open_vault.import')"
      :subtitle="$t('create_or_open_vault.import.desc')"
      @click="goto('import')"
    >
      <template #head>
        <div class="icon">🗝</div>
      </template>
    </f-list-item>
    <f-list-item
      :title="$t('create_or_open_vault.manually')"
      :subtitle="$t('create_or_open_vault.manually.desc')"
      @click="goto('manually')"
    >
      <template #head>
        <div class="icon">✍️</div>
      </template>
    </f-list-item>
  </f-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class CreateVaultList extends Vue {
  @Prop({}) vault;

  goto(method) {
    this.$router.push("/onboarding/open?method=" + method);
  }
}
export default CreateVaultList;
</script>
<style lang="scss" scoped>
.icon {
  font-size: 24px;
}
</style>
