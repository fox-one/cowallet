import { MutationTree, GetterTree, ActionTree } from "vuex";

const state = () => ({
  users: {},
  assets: {},
});

type CacheState = {
  users: Record<string, any>;
  assets: Record<string, any>;
};

const getters: GetterTree<CacheState, any> = {
  getUsers(state) {
    return Object.assign({}, state.users);
  },

  getUser(state) {
    return (userId) => {
      if (Object.prototype.hasOwnProperty.call(state.users, userId)) {
        return Object.assign({}, state.users[userId]);
      }
      return null;
    };
  },

  getAsset(state) {
    return (assetId) => {
      if (Object.prototype.hasOwnProperty.call(state.assets, assetId)) {
        return Object.assign({}, state.assets[assetId]);
      }
      return null;
    };
  },
};

const mutations: MutationTree<CacheState> = {
  addUsers(state, users) {
    const um = Object.assign({}, state.users);
    for (let ix = 0; ix < users.length; ix++) {
      um[users[ix].user_id] = users[ix];
    }
    state.users = um;
  },

  addAsset(state, asset) {
    const um = Object.assign({}, state.assets);
    um[asset.asset_id] = asset;
    um[asset.asset_id]["last_updated_at"] = Date.now();
    state.assets = um;
  },

  addAssets(state, assets) {
    const um = Object.assign({}, state.assets);
    const now = Date.now();
    for (let ix = 0; ix < assets.length; ix++) {
      const item = assets[ix];
      um[item.asset_id] = item;
      um[item.asset_id]["last_updated_at"] = now;
    }
    state.assets = um;
  },
};

const actions: ActionTree<CacheState, any> = {
  async loadUsers({ commit }, userIds) {
    const users = await this.$apis.getUsers(userIds);
    commit("addUsers", users);
    return users;
  },

  async loadAsset({ commit }, assetId) {
    const asset = await this.$apis.getAsset(assetId);
    commit("addAsset", asset);
    return asset;
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
