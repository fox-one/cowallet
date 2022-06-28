<template>
  <f-list>
    <f-list-item
      title="Export All Settings"
      :subtitle="'Vaults, settings, tokens'"
    >
      <template #head>
        <v-icon>$FIconShare</v-icon>
      </template>
    </f-list-item>
  </f-list>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component({
  components: {},
})
class AccountEntryActions extends Vue {
  @Get("auth/me") me!: any;
}
export default AccountEntryActions;
</script>
