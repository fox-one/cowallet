export async function loadAppData(vm: Vue) {
  await Promise.all([
    vm.$store.dispatch("global/loadMultisigAssets"),
    vm.$store.dispatch("auth/loadMe"),
    vm.$store.dispatch("global/loadMyAssets"),
  ]);
}
