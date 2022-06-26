/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from "vue";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import BigNumber from "bignumber.js";
import { INCLUDE_ASSET_IDS } from "@/constants";
import { Base64 } from "js-base64";

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
  transactions: Array<any>;
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

  getTransactionsByAsset(state) {
    return (assetId) => {
      const ret: any = [];
      for (let ix = 0; ix < state.transactions.length; ix++) {
        const x = state.transactions[ix];
        if (x.asset_id === assetId) {
          ret.push(x);
        }
      }
      return ret;
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
  setTransactions(state, value) {
    state.transactions = value;
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
      item.id = item.asset_id;

      // add all my assets to the cache
      commit("cache/addAsset", item, { root: true });

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
    // sort by the total usd
    ret.sort((a, b) => {
      const ta = a.balance * a.price_usd;
      const tb = b.balance * b.price_usd;
      if (ta > tb) {
        return -1;
      } else if (ta < tb) {
        return 1;
      }
      return 0;
    });
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

  async loadUTXOs2({ commit, state }, payload) {
    const { members, threshold } = payload;
    const membersCopy = members.slice();
    membersCopy.sort();

    const hash = this.$utils.helper.sha3_256(membersCopy.join(""));

    const spentUTXOs: any = [];
    const unspentUTXOs: any = [];
    const signedUTXOs: any = [];

    const positionMap = {};
    const requestMap = {};

    let utxos: any = [];

    let offset = 0;
    let UTXOCount = 0;

    // fetch utxos
    commit("setLoadingUTXO", true);
    let resp = await this.$apis.getUTXOs(hash, threshold, 0, UTXOS_PER_PAGE);
    utxos = utxos.concat(resp);

    while (resp) {
      if (resp.length < UTXOS_PER_PAGE) {
        break;
      }
      offset = resp[resp.length - 1].updated_at;
      UTXOCount += resp.length;
      commit("setUTXOCount", UTXOCount);
      resp = await this.$apis.getUTXOs(hash, threshold, offset, UTXOS_PER_PAGE);
      utxos = utxos.concat(resp);
    }

    // sort utxos
    utxos.sort((a: any, b: any) => {
      if (a.created_at < b.created_at) {
        return 1;
      } else if (a.created_at > b.created_at) {
        return -1;
      }
      return 0;
    });

    for (let ix = 0; ix < utxos.length; ix++) {
      const utxo = utxos[ix];

      // classify utxos
      if (utxo.state === "unspent") {
        unspentUTXOs.push(utxo);
      } else if (utxo.state === "signed") {
        signedUTXOs.push(utxo);
      } else {
        spentUTXOs.push(utxo);
      }

      // arrange wallet position
      if (!Object.prototype.hasOwnProperty.call(positionMap, utxo.asset_id)) {
        const asset = await this.$utils.helper.getAssetInfo(
          this,
          utxo.asset_id,
        );
        if (asset === undefined) {
          continue;
        }
        positionMap[utxo.asset_id] = asset;
        positionMap[utxo.asset_id].amount = new BigNumber(0);
      }

      if (utxo.state === "unspent" || utxo.state === "signed") {
        positionMap[utxo.asset_id].amount = positionMap[
          utxo.asset_id
        ].amount.plus(utxo.amount);
      }
      positionMap[utxo.asset_id].totalUsd = positionMap[
        utxo.asset_id
      ].amount.times(positionMap[utxo.asset_id].price_usd);

      positionMap[utxo.asset_id].logo = positionMap[utxo.asset_id].icon_url;
      positionMap[utxo.asset_id].id = utxo.asset_id;

      // arrage pending requests: group related otxos by signed_by.
      if (utxo.state === "signed") {
        if (!Object.prototype.hasOwnProperty.call(requestMap, utxo.signed_by)) {
          requestMap[utxo.signed_by] = {
            asset_id: utxo.asset_id,
            asset: positionMap[utxo.asset_id],
            signed_by: utxo.signed_by,
            utxos: [],
          };
        }
        requestMap[utxo.signed_by].utxos.push(utxo);
      }
    }

    // build transaction from utxos
    const snapshots: any = {};
    for (let ix = 0; ix < utxos.length; ix++) {
      const utxo = utxos[ix];
      // handle change utxo
      if (
        Object.prototype.hasOwnProperty.call(snapshots, utxo.transaction_hash)
      ) {
        const arr: any = [];
        for (let iy = 0; iy < snapshots[utxo.transaction_hash].length; iy++) {
          const item = snapshots[utxo.transaction_hash][iy];
          // ignore all utxo with a change
          if (utxo.ouput_index === item.index) {
            continue;
          }
          item.utxo_id = utxo.utxo_id;
          item.memo = utxo.memo;
          item.created_at = utxo.created_at;
          arr.push(item);
        }
        snapshots[utxo.transaction_hash] = arr;
        continue;
      }
      // other utxo, create snapshots
      snapshots[utxo.transaction_hash] = [
        {
          utxo_id: utxo.utxo_id,
          asset_id: utxo.asset_id,
          created_at: utxo.created_at,
          hash: utxo.transaction_hash,
          index: utxo.output_index,
          amount: utxo.amount,
          memo: utxo.memo,
          sender: utxo.sender,
          state: "DONE",
          type: "income",
        },
      ];

      if (utxo.signed_tx) {
        const decodedTx: any = this.$utils.helper.decodeSignedTx(
          utxo.signed_tx,
        );
        if (decodedTx === null) {
          console.log("failed to decode signed_tx, ignore");
          continue;
        }

        let state = "PENDING";
        if (utxo.state == "spent") {
          state = "DONE";
        }

        const items: any = [];
        if (decodedTx.outputs) {
          for (let iy = 0; iy < decodedTx.outputs.length; iy++) {
            items.push({
              asset_id: utxo.asset_id,
              created_at: utxo.updated_at,
              hash: utxo.signed_by,
              index: iy,
              amount: decodedTx.outputs[iy].amount,
              state: state,
              memo: utxo.memo,
              type: "expense",
            });
          }
        }

        snapshots[utxo.signed_by] = items;
      }
    }

    let result = [];
    for (const key in snapshots) {
      if (Object.prototype.hasOwnProperty.call(snapshots, key)) {
        const items = snapshots[key];
        result = result.concat(items);
      }
    }

    result.sort((a: any, b: any) => {
      if (a.created_at < b.created_at) {
        return 1;
      } else if (a.created_at > b.created_at) {
        return -1;
      }
      return 0;
    });

    // for (let ix = 0; ix < result.length; ix++) {
    //   const item = result[ix];
    //   console.log(item);
    // }

    commit("setTransactions", result);
    commit("setLoadingUTXO", false);
    commit("setPosition", Object.values(positionMap));
    commit("setUnspentUTXOs", unspentUTXOs);
    commit("setSpentUTXOs", spentUTXOs);
    commit("setSignedUTXOs", signedUTXOs);
    commit("setPendingRequests", Object.values(requestMap));
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
        positionMap[ele.asset_id].id = ele.asset_id;

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
    commit("setUnspentUTXOs", unspentUTXOs);
    commit("setSpentUTXOs", spentUTXOs);
    commit("setSignedUTXOs", signedUTXOs);
    commit("setPendingRequests", Object.values(requestMap));
    return;
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
