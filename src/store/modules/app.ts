import { isDarkTheme } from "@/utils/helper";

const state = () => ({
  dark: isDarkTheme(),
  snackbar: {
    show: false,
    message: "",
    color: "info",
  },
  appbar: {
    title: "",
    style: "",
    show: true,
    back: false,
    flat: true,
    align: "center",
  },
});

const mutations = {
  toast(state, { message, color }) {
    state.snackbar.show = true;
    state.snackbar.message = message;
    state.snackbar.color = color;
  },
  setSnackbar(state, val) {
    state.snackbar.show = val;
  },
  SET_APPBAR(state, value) {
    const defaultValue = {
      title: "",
      style: "",
      show: true,
      back: true,
      flat: true,
      align: "center",
    };
    state.appbar = { ...defaultValue, ...value };
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
