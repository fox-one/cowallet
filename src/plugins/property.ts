import { Plugin } from "@nuxt/types";
import createApiService from "@/services/createApiService";
import utils from "@/utils";

import Fennec from "@foxone/fennec-dapp";

declare module "vue/types/vue" {
  interface Vue {
    title?: string;
    $utils: typeof utils;
    $icons: typeof utils.icons;
    $fennec: Fennec;
    $apis: ReturnType<typeof createApiService>;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $utils: typeof utils;
    $icons: typeof utils.icons;
    $fennec: Fennec;
    $apis: ReturnType<typeof createApiService>;
  }
}

declare module "vuex/types/index" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $utils: typeof utils;
    $icons: typeof utils.icons;
    $fennec: Fennec;
    $apis: ReturnType<typeof createApiService>;
  }
}

const plugin: Plugin = ({ app }, inject) => {
  inject("apis", createApiService(app));
  inject("utils", utils);
  inject("icons", utils.icons);
};

export default plugin;
