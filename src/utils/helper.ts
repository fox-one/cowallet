import {
  CLIENT_ID,
  OAUTH_URL,
  INCOME_TPL,
  EXPENSE_TPL,
  ASSET_UPDATE_TIMEOUT,
} from "~/constants";
import crypto from "crypto";
import { SHA3 } from "sha3";
import Bridge from "@foxone/mixin-sdk-jsbridge";
import { Base64 } from "js-base64";

export const jsbridge = new Bridge({
  client_id: CLIENT_ID,
});

export function errorHandler(
  vue: Vue,
  error: { message: string; code: string | number },
) {
  const $toast = vue.$utils.helper.toast;
  const fallback = "未知错误";
  const message = `${error.code || ""} ${error.message || fallback}`;
  $toast(vue, { message, color: "error" });
}

export function toast(vue: Vue, data: { message: string; color?: string }) {
  vue.$store.commit("app/toast", data);
}

export function getLocale() {
  let locale = "en";
  if (navigator.language.includes("zh")) {
    locale = "zh";
  } else if (navigator.language.includes("ja")) {
    locale = "ja";
  }
  return locale;
}

export function decodeSignedTx(signedTx) {
  let tx = null;
  try {
    const result = (window as any).mixinGo.decodeTransaction(signedTx);
    tx = JSON.parse(result);
  } catch (e) {
    console.log("failed to decode signed_tx, ignore", signedTx);
    return [];
  }
  return tx;
}

export async function getAssetInfo(store, assetId) {
  let asset = store!.getters["cache/getAsset"](assetId);
  const dur = Date.now() - (asset?.last_updated_at || 0);
  // no such an asset, or it's timeout.
  if (asset === null || dur < ASSET_UPDATE_TIMEOUT) {
    asset = await store.dispatch("cache/loadAsset", assetId);
  }
  return asset;
}

export function toHex(_s: string) {
  const s = unescape(encodeURIComponent(_s));
  let h = "";
  for (let i = 0; i < s.length; i++) {
    h += s.charCodeAt(i).toString(16);
  }
  return h;
}

export function buildThresholdScript(t) {
  let s = t.toString(16);
  if (s.length === 1) {
    s = "0" + s;
  }
  if (s.length > 2) {
    alert("INVALID THRESHOLD " + t);
  }
  return "fffe" + s;
}

export function pickUTXOs(utxos, assetId) {
  let sorted = utxos.slice();
  sorted = sorted.filter((x) => {
    return x.asset_id === assetId;
  });
  sorted.sort().reverse();
  console.log(sorted);
  return sorted.slice(0, 32);
}

export function sha3_256(buffer, output = "hex") {
  const hash = new SHA3(256);
  hash.update(buffer);
  return hash.digest(output as any);
}

export function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

export function shadeColor(color, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor((R * (100 + percent)) / 100);
  G = Math.floor((G * (100 + percent)) / 100);
  B = Math.floor((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

export function digestColor(digestArray) {
  let ret = 0;
  const colors = [
    ["#DF8976", "#FFC3B766"],
    ["#A5C4C4", "#BDE5E566"],
    ["#CCACE3", "#E3CCF366"],
    ["#8ECDE5", "#BDE8F966"],
    ["#E5AE8E", "#F9D2BC66"],

    ["#9EE0B8", "#C4F5D866"],
    ["#555555", "#B1B1B166"],
    ["#6AD896", "#C3EFBC66"],
    ["#7C93CD", "#AEBCE066"],
    ["#CD7C7C", "#EBB3B366"],

    // ["#E9CA9B", "#E3CFB8"],
  ];
  for (let ix = 0; ix < digestArray.length; ix++) {
    const item = digestArray[ix];
    ret += item;
  }
  const pos = ret % colors.length;
  return colors[pos];
}

export function isDarkTheme() {
  try {
    const context = jsbridge.getContext();
    if (context?.appearance) {
      return context.appearance === "dark";
    }
  } catch (error) {}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function shareCard(title, description, icon_url, url) {
  const data = {
    action: url,
    app_id: CLIENT_ID,
    description,
    icon_url,
    title,
  };

  window.location.href =
    "mixin://send?category=app_card&data=" +
    encodeURIComponent(Base64.encode(JSON.stringify(data)));
}

export function requestLogin(vue) {
  // if (NODE_ENV === "development" && APP_TOKEN) {
  //   vue.$store?.commit("auth/SET_TOKEN", {
  //     token: APP_TOKEN,
  //     scope: APP_SCOPE,
  //   });
  //   initApp(vue);
  //   return;
  // }
  const randomCode = crypto.randomBytes(32);
  const verifier = base64URLEncode(randomCode);
  const challenge = base64URLEncode(sha256(randomCode));
  localStorage.setItem("code-verifier", verifier);

  const host = window.location.origin;
  const redirectUrl = encodeURIComponent(host + "/#/auth/");
  localStorage.setItem("authPath", window.location.href);
  let path = `${OAUTH_URL}/?client_id=${CLIENT_ID}&scope=PROFILE:READ+ASSETS:READ+CONTACTS:READ&code_challenge=${challenge}&response_type=code&code_challenge_method=S256`;
  path += `&redirect_url=${redirectUrl}`;
  window.location.href = path;
}

export function genCheckResultProc(codeId, state, done, error) {
  const proc = async (vm) => {
    let resp: any = null;
    try {
      resp = await vm.$apis.checkCode(codeId);
    } catch (e) {
      console.log("err", e);
      error(e);
      return null;
    }
    if (resp.status === state || resp.state === state) {
      console.log("get the final state ", resp.type, resp.state || resp.status);
      done(resp);
      return null;
    } else {
      console.log("try in 3 sec");
      return setTimeout(() => {
        proc(vm);
      }, 3000);
    }
  };
  return proc;
}

export function isDesktop() {
  return !navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i,
  );
}

export function formatCurrency(
  vm: Vue,
  fiatSymbol: string,
  amount: number | string,
  fraction = -1,
) {
  let ret = "";
  let amountNum = 0;
  if (amount.constructor === String) {
    amountNum = parseFloat(amount);
  } else {
    amountNum = amount as number;
  }
  if (window.Intl) {
    const opts: any = {};
    if (fiatSymbol) {
      opts.style = "currency";
      opts.currency = fiatSymbol.toUpperCase();
      // comment it because iOS do not support it
      // currencyDisplay: "narrowSymbol",
    }
    if (fraction !== -1) {
      opts["minimumFractionDigits"] = fraction;
    }
    // if the amount is too small but still greater than zero, try to calculate a better fraction.
    if (amountNum < 0.01 && 0 < amountNum) {
      const zeroCount = -Math.floor(Math.log(amountNum) / Math.log(10) + 1);
      opts["minimumFractionDigits"] = zeroCount + 2;
    }
    ret = new Intl.NumberFormat(vm.$i18n.locale, opts).format(amountNum);
  } else {
    ret = fiatSymbol + amountNum.toFixed(2);
  }
  return ret;
}

export async function submitSignatures(vm, multisig) {
  const params = {
    method: "sendrawtransaction",
    params: [multisig.raw_transaction],
  };

  const resp = await vm.$apis.postSignature(params);
  return new Promise((resolve, reject) => {
    if (resp.hash === multisig.transaction_hash) {
      resolve(resp);
    } else {
      reject(resp);
    }
    return;
  });
}

function fillTemplate(_tpl, vault, tran) {
  const vars = {
    VAULT_NAME: vault.name,
    ASSET_NAME: vault.beancount?.asset_name,
    EXPENSE_NAME: vault.beancount?.expense_name,
    INCOME_NAME: vault.beancount?.income_name,
    DATE: tran.datetime_beancount,
    MEMO: tran.memo,
    AMOUNT: tran.amount,
    SYMBOL: tran.symbol,
  };
  let tpl = _tpl;
  for (const key in vars) {
    const re = new RegExp(`{${key}}`, "g");
    tpl = tpl.replace(re, vars[key]);
  }
  return tpl;
}

export function genBeancount(vault, tran) {
  if (tran.type === "expense") {
    return fillTemplate(
      vault.beancount.expense_tpl || EXPENSE_TPL,
      vault,
      tran,
    );
  } else if (tran.type === "income") {
    return fillTemplate(vault.beancount.income_tpl || INCOME_TPL, vault, tran);
  }
  return "";
}
