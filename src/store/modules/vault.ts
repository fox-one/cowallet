import { MutationTree, GetterTree, ActionTree } from "vuex";

const state = () => ({
  vaults: [],
  current: null,
});

type VaultState = {
  vaults: Array<any>;
  current: any;
};

const getters: GetterTree<VaultState, any> = {
  getVaults(state) {
    return state.vaults;
  },

  getVault(state) {
    return (vaultMeta) => {
      for (let ix = 0; ix < state.vaults.length; ix++) {
        const vault = state.vaults[ix];
        if (
          vault.membersHash === vaultMeta.membersHash &&
          vault.threshold === vaultMeta.threshold
        ) {
          return vault;
        }
      }
      return null;
    };
  },

  getCurrentVault(state) {
    if (state.current) {
      return Object.assign({}, state.current);
    }
    return null;
  },
};

const mutations: MutationTree<VaultState> = {
  addVault(state, vault) {
    const vs = state.vaults.slice();
    for (let ix = 0; ix < vs.length; ix++) {
      if (
        vault.membersHash === vs[ix].membersHash &&
        vault.threshold === vs[ix].threshold
      ) {
        return;
      }
    }
    state.vaults.push(vault);
  },
  removeVault(state, vault) {
    const vs = state.vaults.slice();
    for (let ix = 0; ix < vs.length; ix++) {
      if (
        vault.membersHash === vs[ix].membersHash &&
        vault.threshold === vs[ix].threshold
      ) {
        vs.splice(ix, 1);
        break;
      }
    }
    state.vaults = vs;
  },
  updateVault(state, vault) {
    const vs = state.vaults.slice();
    for (let ix = 0; ix < vs.length; ix++) {
      if (
        vault.membersHash === vs[ix].membersHash &&
        vault.threshold === vs[ix].threshold
      ) {
        vs.splice(ix, 1, vault);
        break;
      }
    }
    state.vaults = vs;
  },
  setCurrentVault(state, value) {
    state.current = value;
  },
};

const actions: ActionTree<VaultState, any> = {};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
