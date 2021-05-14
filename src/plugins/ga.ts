import Vue from "vue";
import VueGtag from "vue-gtag";
import { GA } from "@/constants";

export default ({ app }) => {
  Vue.use(
    VueGtag,
    {
      config: { id: GA },
    },
    app.router,
  );
};
