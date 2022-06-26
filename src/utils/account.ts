import { Vue } from "vue-property-decorator";
import { CONFIG, EVENTS } from "~/constants";

export function logout(vm: Vue) {
  if (vm.$store.state.auth.channel === "fennec") {
    vm.$fennec?.disconnect();
  }
  vm.$store.dispatch("auth/logout");
}

export function requestLogout(vm: Vue, cbs: { onDisconnect?: any }) {
  vm.$uikit.dialog.show({
    title: vm.$t("confirm") as string,
    text: vm.$t("disconnect.confirm") as string,
    type: "warning",
    confirm: {
      text: vm.$t("disconnect") as string,
      callback: () => {
        vm.$utils.account.logout(vm);

        cbs?.onDisconnect?.();
      },
    },
  });
}

export function openAuth(vm: Vue) {
  vm.$root.$emit(EVENTS.OPEN_AUTH);
}
