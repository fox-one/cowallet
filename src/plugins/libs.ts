import Vue from "vue";
import UIKit from "@foxone/uikit";
import PandoUI from "@foxone/pando-ui";
import VueClipboard from "vue-clipboard2";

import "@foxone/uikit/build/index.min.css";
import "@foxone/pando-ui/build/index.css";

const plugin = ({ app }) => {
  VueClipboard.config.autoSetContainer = true; // add this line
  Vue.use(VueClipboard);
  Vue.use(PandoUI, app.vuetify);

  Vue.use(UIKit);
  Vue.use(UIKit.Toast, app.vuetify, {
    top: false,
    centered: true,
  });
  Vue.use(UIKit.Dialog, app.vuetify, { flat: true });
};

export default plugin;
