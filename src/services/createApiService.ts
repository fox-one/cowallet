/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-promise-reject-errors */
import { NuxtAppOptions } from "@nuxt/types";
import createApis from "./apis/index";
import Http from "@/services/http";
import { API_BASE } from "@/constants";

function generateStructureInterceptor(app: NuxtAppOptions) {
  return [
    (res) => {
      if (res && res.data.error && res.data.error.code) {
        if (res.data.error.code === 401) {
          app.store!.dispatch("auth/logout");
        }
        return Promise.reject(res.data);
      }
      return res.data.data;
    },
    (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;
        if (status === 401) {
          app.store!.dispatch("auth/logout");
        }
        const { code, message } = error.response.data;
        return Promise.reject({ code, message });
      } else {
        return Promise.reject({ code: -1 });
      }
    },
  ];
}

function generateAuthInterceptor(app: NuxtAppOptions) {
  return [
    (configs) => {
      const token = app.store!.getters["auth/getToken"];
      if (token) {
        configs.headers.Authorization = `Bearer ${token}`;
      }
      return configs;
    },
    () => {},
  ];
}

export default function createApiSerivce(app: NuxtAppOptions) {
  const apiBase = localStorage.getItem("cowallet_api_base") || API_BASE;
  const http = new Http(
    { baseURL: apiBase },
    [generateAuthInterceptor(app)],
    [generateStructureInterceptor(app)],
  );
  return createApis(http);
}
