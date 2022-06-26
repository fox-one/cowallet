import Vue, { VNode } from "vue";
import { Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import dayjs from "dayjs";

export interface Page extends Vue {
  htmlTitle?: string;
  setLang: () => void;
  setPageConfig: () => void;
}

@Component({
  head() {
    const vm = this as Page;
    return {
      title: "CoWallet - " + (vm.htmlTitle || vm.title),
      meta: [
        {
          hid: "theme-color",
          name: "theme-color",
          content: vm.$store.state.app.dark ? "#000000" : "#FFFFFF",
        },
      ],
    };
  },
  beforeRouteEnter(_to, _from, next) {
    next((vm: any) => {
      vm.setLang();
      vm.setPageConfig();
    });
  },
})
export default class PageView extends Vue {
  @Mutation("app/SET_APPBAR") setAppbar;

  get appbar() {
    return {};
  }

  get bottomNav() {
    return "";
  }

  setLang() {
    const locale = this.$utils.helper.getLocale();
    this.$i18n.locale = locale;
    // this?.$vuetify.lang.current = locale;
    dayjs.locale(locale);
  }

  setPageConfig() {
    this.$store.commit("app/SET_APPBAR", { title: this.title, ...this.appbar });
    // setTimeout(() => {
    //   this.$utils.helper.loadMixinTheme();
    // }, 50);
  }
}
