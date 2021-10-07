export const isProduct = process.env.APP_ENV === "prod";

export const GA = "";

export const API_BASE = process.env.API_BASE || "https://api.mixin.one";

export const OAUTH_URL = process.env.OAUTH_URL || "https://mixin-oauth.fox.one";

// export const API_BASE = "https://api.mixin.one";

// 3 minutes timeout for the cache/asset
export const ASSET_UPDATE_TIMEOUT = 180000;

export const INCLUDE_ASSET_IDS = process.env.INCLUDE_ASSET_IDS || "";

export const CLIENT_ID =
  process.env.CLIENT_ID ||
  (isProduct
    ? "8e9e520c-b002-4bfe-b989-3f18d8d6e273"
    : "c85a19d8-9c3b-4c79-be4c-492addba7d46");

export const INCOME_TPL = `{DATE} * "{VAULT_NAME}" "{MEMO}"
  {INCOME_NAME}        -{AMOUNT} {SYMBOL}
  {ASSET_NAME}         +{AMOUNT} {SYMBOL}
`;

export const EXPENSE_TPL = `{DATE} * "{VAULT_NAME}" "{MEMO}"
  {ASSET_NAME}         -{AMOUNT} {SYMBOL}
  {EXPENSE_NAME}       +{AMOUNT} {SYMBOL}
`;
