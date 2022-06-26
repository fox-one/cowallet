import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import modules from "./modules";

// options
pathify.options.mapping = "standard";
pathify.options.deep = 2;

export default function () {
  Vue.use(Vuex);

  return new Vuex.Store({
    modules,
    plugins: [pathify.plugin],
  });
}
