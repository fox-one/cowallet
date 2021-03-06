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

export function errorHandler(vm: Vue, error: any) {
  const code = error.code;

  let locale = "";
  if (code && vm.$t(`errorcode.${code}`) !== code) {
    locale = vm.$t(`errorcode.${code}`) as string;
  }

  const message = error.message || error.msg || locale || "Unknown Error";

  vm.$uikit.toast.error({ message: `${code} ${message}` });
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
  const now = Date.now();
  const dur = now - (asset?.last_updated_at || 0);
  // no such an asset, or it's timeout.
  if (asset === null || dur > ASSET_UPDATE_TIMEOUT) {
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
    ["#3683FB", "#5596FB"],
    ["#812DD3", "#A955FC"],
    ["#FA7D35", "#FB965F"],
    ["#222222", "#444444"],
    ["#33E1A3", "#55FBBF"],
    ["#D63D3D", "#FF7C7C"],
    ["#6936FB", "#9877F6"],
    ["#FB36AC", "#F677D2"],
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
    if (amountNum < 0.01 && 0 < amountNum) {
      // if the amount is too small but still greater than zero, try to calculate a better fraction.
      const zeroCount = -Math.floor(Math.log(amountNum) / Math.log(10) + 1);
      opts["minimumFractionDigits"] = zeroCount + 2;
    }
    ret = new Intl.NumberFormat(vm.$i18n.locale, opts).format(amountNum);
  } else {
    ret = fiatSymbol + amountNum.toFixed(2);
  }
  const parts = ret.split(".");
  if (parts.length > 1) {
    parts[1] = parts[1].replace(/0+$/, "");
    return parts[1] ? `${parts[0]}.${parts[1]}` : parts[0];
  }
  return ret;
}

export function fiat(vm, amountUsd) {
  const fiats = vm.$store.getters["cache/GET_FIATS"];
  const s = vm.$store.getters["app/GET_SETTINGS"];
  let code = "USD";
  if (s.currency) {
    code = s.currency;
  }
  let amount = amountUsd;
  if (code in fiats) {
    amount = fiats[code] * amountUsd;
  }
  return formatCurrency(vm, code, amount);
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
