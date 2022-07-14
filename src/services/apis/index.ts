import Http from "@/services/http";
import { v4 as uuid } from "uuid";

export default function (http: Http) {
  return {
    auth(data): Promise<any> {
      return http.post("/oauth/token", {
        data,
      });
    },

    me(): Promise<any> {
      return http.get("/me");
    },

    getConv(id): Promise<any> {
      return http.get("/conversations/" + id);
    },

    getMultisigAssets(): Promise<any> {
      return http.get("/network/assets/multisig");
    },

    getTopAssets(): Promise<any[]> {
      return http.get("/network/assets/top");
    },

    getMyAssets(): Promise<any[]> {
      return http.get("/assets");
    },

    getAsset(assetId): Promise<any[]> {
      return http.get("/assets/" + assetId);
    },

    getFiats(): Promise<Array<any>> {
      return http.get(`/fiats`);
    },

    getFriends(): Promise<any> {
      return http.get("/friends");
    },

    getUsers(userIds): Promise<any> {
      return http.post("/users/fetch", {
        data: userIds,
      });
    },

    getUTXOs(membersHash, threshold, offset, limit): Promise<any> {
      return http.get(
        `/multisigs/outputs?members=${membersHash}&threshold=${threshold}&offset=${offset}&limit=${limit}&order=updated`,
        {},
      );
    },

    getPayments(asset_id, amount, memo, receivers, threshold): Promise<any> {
      const params = {
        asset_id,
        amount,
        memo,
        trace_id: uuid(),
        opponent_multisig: { receivers, threshold },
      };
      return http.post("/payments", { data: params });
    },

    createMultisig(raw, action): Promise<any> {
      return http.post("/multisigs", { data: { raw: raw, action: action } });
    },

    cancelMultisig(requestId): Promise<any> {
      return http.post(`/multisigs/${requestId}/cancel`, {});
    },

    unlockMultisig(requestId): Promise<any> {
      return http.post(`/multisigs/${requestId}/unlock`, {});
    },

    postSignature(data): Promise<any> {
      return http.post("/external/proxy", { data });
    },

    checkCode(code): Promise<any> {
      return http.get("/codes/" + code, {});
    },

    loadGhostKeys(receivers, index): Promise<any> {
      // return { mask, keys }
      return http.post("/outputs", { data: { receivers, index } });
    },
  };
}
