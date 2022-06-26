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
  payment: {
    url: "",
    modal: false,
    checking: false,
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
  SET_PAYMENT(state, value) {
    state.payment.url = value.url;
    state.payment.modal = value.modal;
    state.payment.checking = value.checking;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
