<template>
  <f-list>
    <nuxt-link to="/settings">
      <f-list-item
        :title="$t('settings')"
        :subtitle="'Export data and change settings.'"
      >
        <template #head>
          <v-icon>$FIconSetting</v-icon>
        </template>
      </f-list-item>
    </nuxt-link>
    <a href="https://github.com/fox-one/cowallet" target="_blank">
      <f-list-item
        title="View at Github"
        :subtitle="'Fork or star our projects.'"
      >
        <template #head>
          <v-icon>$FIconGithub</v-icon>
        </template>
      </f-list-item>
    </a>
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
