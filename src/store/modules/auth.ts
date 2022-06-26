import { MutationTree, GetterTree, ActionTree } from "vuex";
import { CLIENT_ID } from "~/constants";

const state = () => ({
  token: "",
  me: null,
});

export type AuthState = ReturnType<typeof state>;

export const getters: GetterTree<AuthState, any> = {
  isLogged(state) {
    return Boolean(state.token);
  },
  getToken(state) {
    return state.token;
  },
  getMe(state) {
    return state.me;
  },
};

export const mutations: MutationTree<AuthState> = {
  SET_TOKEN(state, data: { token: string }) {
    state.token = data.token;
  },
  setMe(state, data) {
    state.me = data;
  },
};

export const actions: ActionTree<AuthState, any> = {
  logout({ commit }) {
    commit("SET_TOKEN", { token: "" });
  },

  async login({ commit }, code) {
    const verifier = localStorage.getItem("code-verifier");
    const data = {
      client_id: CLIENT_ID,
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
    };
    const res = await this.$apis.auth(data);
    commit("SET_TOKEN", { token: res.access_token });
  },

  async loadMe({ commit }) {
    let res = null;
    try {
      res = await this.$apis.me();
    } catch (e) {
      return this.$utils.helper.requestLogin(this);
    }
    commit("setMe", res);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
