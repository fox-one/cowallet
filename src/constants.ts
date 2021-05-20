export const isProduct = process.env.APP_ENV === "prod";

export const GA = "";

export const API_BASE =
  process.env.API_BASE || "https://xuexi-api.firesbox.com";
// export const API_BASE = "https://api.mixin.one";

export const CLIENT_ID =
  process.env.CLIENT_ID ||
  (isProduct
    ? "8e9e520c-b002-4bfe-b989-3f18d8d6e273"
    : "c85a19d8-9c3b-4c79-be4c-492addba7d46");
