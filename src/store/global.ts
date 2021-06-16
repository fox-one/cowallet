/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from "vue";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import BigNumber from "bignumber.js";
import { INCLUDE_ASSET_IDS } from "@/constants";

const UTXOS_PER_PAGE = 200;

const state = () => ({
  me: null,

  multisigAssets: {},

  position: [],
  spentUTXOs: [],
  unspentUTXOs: [],
  signedUTXOs: [],
  pendingRequests: [],
  UTXOCount: 0,
  loadingUTXO: false,
  friends: [],

  myAssets: [],
  currentMultisig: null,
});

export type GlobalState = {
  conv: any | null;

  multisigAssets: Record<string, any>;

  position: Array<any>;

  spentUTXOs: Array<any>;
  unspentUTXOs: Array<any>;
  signedUTXOs: Array<any>;
  pendingRequests: Array<any>;
  UTXOCount: number;
  loadingUTXO: boolean;
  friends: Array<any>;

  myAssets: Array<any>;
  currentMultisig: any | null;
};

const getters: GetterTree<GlobalState, any> = {
  getConvInfo(state) {
    return state.conv;
  },

  getUTXOsByAssetId(state) {
    return (assetId) => {
      const unspent = state.unspentUTXOs.filter((x) => {
        return x.asset_id === assetId;
      });
      const spent = state.spentUTXOs.filter((x) => {
        return x.asset_id === assetId;
      });
      const signed = state.signedUTXOs.filter((x) => {
        return x.asset_id === assetId;
      });
      return {
        signed,
        spent,
        unspent,
      };
    };
  },

  getMyAsset(state) {
    return (assetId) => {
      for (let ix = 0; ix < state.myAssets.length; ix++) {
        const x = state.myAssets[ix];
        if (x.asset_id === assetId) {
          return x;
        }
      }
      return null;
    };
  },

  getPosition(state) {
    return (assetId) => {
      for (let ix = 0; ix < state.position.length; ix++) {
        const x = state.position[ix];
        if (x.asset_id === assetId) {
          return x;
        }
      }
      return null;
    };
  },
};

const mutations: MutationTree<GlobalState> = {
  SET_CONV(state, data) {
    state.conv = data;
  },
  setMultisigAssets(state, value) {
    const mam = Object.assign({}, state.multisigAssets);
    for (let ix = 0; ix < value.length; ix++) {
      const ele = value[ix];
      mam[ele.asset_id] = ele;
    }
    state.multisigAssets = mam;
  },
  setPosition(state, value) {
    state.position = value;
  },
  setMyAssets(state, value) {
    state.myAssets = value;
  },
  setFriends(state, value) {
    state.friends = value;
  },
  setSpentUTXOs(state, value) {
    state.spentUTXOs = value;
  },
  setUnspentUTXOs(state, value) {
    state.unspentUTXOs = value;
  },
  setSignedUTXOs(state, value) {
    state.signedUTXOs = value;
  },
  setPendingRequests(state, value) {
    state.pendingRequests = value;
  },
  setUTXOCount(state, value) {
    state.UTXOCount = value;
  },
  setLoadingUTXO(state, value) {
    state.loadingUTXO = value;
  },
  setCurrentMultisig(state, value) {
    state.currentMultisig = value;
  },
};

const actions: ActionTree<GlobalState, any> = {
  async getConv({ commit }, id) {
    const res = await this.$apis.getConv(id);
    commit("SET_CONV", res);
  },

  async loadMultisigAssets({ commit }) {
    const result = await this.$apis.getMultisigAssets();
    commit("setMultisigAssets", result);
    console.log("load multisig assets", result.length);
    return;
  },

  async loadMyAssets({ commit, state }) {
    const result = await this.$apis.getMyAssets();
    const ret: any = [];
    let includeIDs: Array<any> = [];
    if (INCLUDE_ASSET_IDS !== "") {
      includeIDs = INCLUDE_ASSET_IDS.split(",");
    }
    for (let ix = 0, len = result.length; ix < len; ix++) {
      const item = result[ix];
      if (includeIDs.length) {
        if (includeIDs.includes(item.asset_id)) {
          item.logo = item.icon_url;
          ret.push(item);
        }
      } else {
        if (
          item.chain_id === "43d61dcd-e413-450d-80b8-101d5e903357" ||
          Object.prototype.hasOwnProperty.call(
            state.multisigAssets,
            item.asset_id,
          )
        ) {
          // all ERC20 token is available at Kernel
          item.logo = item.icon_url;
          ret.push(item);
          continue;
        }
      }
    }
    commit("setMyAssets", ret);
    console.log("load my assets", ret.length);
    return;
  },

  async loadFriends({ commit }) {
    const result = await this.$apis.getFriends();
    commit("setFriends", result);
    return;
  },

  async loadMultisig({ commit }, raw) {
    const multisig = await this.$apis.createMultisig(raw, "sign");
    commit("setCurrentMultisig", multisig);
    return;
  },

  async loadUTXOs({ commit, state }, payload) {
    const { members, threshold } = payload;
    const membersCopy = members.slice();
    membersCopy.sort();

    const hash = this.$utils.helper.sha3_256(membersCopy.join(""));

    const positionMap = {};
    const requestMap = {};

    let offset = 0;
    let UTXOCount = 0;
    commit("setLoadingUTXO", true);

    let resp = await this.$apis.getUTXOs(hash, threshold, 0, UTXOS_PER_PAGE);

    const spentUTXOs: any = [];
    const unspentUTXOs: any = [];
    const signedUTXOs: any = [];

    while (resp.length) {
      for (let ix = 0; ix < resp.length; ix++) {
        const ele = resp[ix];

        if (ele.state === "unspent") {
          unspentUTXOs.push(ele);
        } else if (ele.state === "signed") {
          signedUTXOs.push(ele);
        } else {
          // const result = await this.$apis.createMultisig(ele.signed_tx, "sign");
          // console.log(ele.utxo_id, result);
          spentUTXOs.push(ele);
        }

        // arrange wallet position
        if (!Object.prototype.hasOwnProperty.call(positionMap, ele.asset_id)) {
          const asset = await this.$utils.helper.getAssetInfo(
            this,
            ele.asset_id,
          );
          if (asset === undefined) {
            continue;
          }
          positionMap[ele.asset_id] = asset;
          positionMap[ele.asset_id].amount = new BigNumber(0);
        }

        if (ele.state === "unspent" || ele.state === "signed") {
          positionMap[ele.asset_id].amount = positionMap[
            ele.asset_id
          ].amount.plus(ele.amount);
        }
        positionMap[ele.asset_id].totalUsd = positionMap[
          ele.asset_id
        ].amount.times(positionMap[ele.asset_id].price_usd);

        positionMap[ele.asset_id].logo = positionMap[ele.asset_id].icon_url;

        // arrage pending requests: group related otxos by signed_by.
        if (ele.state === "signed") {
          if (
            !Object.prototype.hasOwnProperty.call(requestMap, ele.signed_by)
          ) {
            requestMap[ele.signed_by] = {
              asset_id: ele.asset_id,
              asset: positionMap[ele.asset_id],
              signed_by: ele.signed_by,
              utxos: [],
            };
          }
          requestMap[ele.signed_by].utxos.push(ele);
        }
      }
      if (resp.length < UTXOS_PER_PAGE) {
        break;
      }
      offset = resp[resp.length - 1].updated_at;
      UTXOCount += resp.length;
      commit("setUTXOCount", UTXOCount);
      resp = await this.$apis.getUTXOs(hash, threshold, offset, UTXOS_PER_PAGE);
    }

    commit("setLoadingUTXO", false);
    commit("setPosition", Object.values(positionMap));
    commit("setSpentUTXOs", spentUTXOs);
    commit("setUnspentUTXOs", unspentUTXOs);
    commit("setSignedUTXOs", signedUTXOs);
    commit("setPendingRequests", Object.values(requestMap));
    return;
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
