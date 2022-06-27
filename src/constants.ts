import pkg from "../package.json";

export const isProduct = process.env.APP_ENV === "prod";

export const GA = "";

export const VERSION = pkg.version;

export const TOKEN = process.env.TOKEN || "";

export const API_BASE = process.env.API_BASE || "https://api.mixin.one";

export const OAUTH_URL = process.env.OAUTH_URL || "https://mixin-oauth.fox.one";

// 5 minutes timeout for the cache/asset
export const ASSET_UPDATE_TIMEOUT = 300000;

export const INCLUDE_ASSET_IDS = process.env.INCLUDE_ASSET_IDS || "";

export const EVENTS = {
  OPEN_AUTH: "OPEN_AUTH",
  PAY_QR_CODE: "PAY_QR_CODE",
  OPEN_TERMS_MODAL: "OPEN_TERMS_MODAL",
};

export const CLIENT_ID =
  process.env.CLIENT_ID ||
  (isProduct
    ? "8e9e520c-b002-4bfe-b989-3f18d8d6e273"
    : "c85a19d8-9c3b-4c79-be4c-492addba7d46");

export const CONFIG = {
  MIXIN_CLIENT_ID: CLIENT_ID,
  FENNEC_PROVIDER_NAME: "CoWallet",
  FENNEC_PROVIDER_ID: "cowallet",
};

export const INCOME_TPL = `{DATE} * "{VAULT_NAME}" "{MEMO}"
  {INCOME_NAME}        -{AMOUNT} {SYMBOL}
  {ASSET_NAME}         +{AMOUNT} {SYMBOL}
`;

export const EXPENSE_TPL = `{DATE} * "{VAULT_NAME}" "{MEMO}"
  {ASSET_NAME}         -{AMOUNT} {SYMBOL}
  {EXPENSE_NAME}       +{AMOUNT} {SYMBOL}
`;
