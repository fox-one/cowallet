import { NuxtConfig } from "@nuxt/types";
import i18n from "./src/i18n";
import { isProduct, GA } from "./src/constants";

const config: NuxtConfig = {
  ssr: false,
  router: {
    mode: "hash",
  },
  srcDir: "./src",
  head: {
    title: "CoWallet",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no",
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    script: [{ src: "/scripts/transaction.js" }],
  },
  loading: { color: "#fff" },
  css: ["~/styles/index.scss"],
  plugins: [
    "~/plugins/components.ts",
    "~/plugins/property.ts",
    "~/plugins/libs.ts",
    "~/plugins/persistedstate.ts",
    "~/plugins/ga.ts",
  ],
  buildModules: [
    "@nuxtjs/eslint-module",
    [
      "@nuxt/typescript-build",
      {
        typeCheck: true,
        ignoreNotFoundWarnings: true,
      },
    ],
    "@nuxtjs/vuetify",
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
    [
      "nuxt-i18n",
      {
        vueI18n: i18n,
        locales: ["en", "zh"],
        defaultLocale: "en",
        strategy: "no_prefix",
        detectBrowserLanguage: false,
        parsePages: false,
        seo: false,
      },
    ],
  ],
  vuetify: {
    customVariables: ["~/styles/variables.scss"],
    defaultAssets: false,
    treeShake: true,
    optionsPath: "./vuetify.options.ts",
  },
  build: {
    transpile: ["vuetify"],
  },
  env: {
    TOKEN: process.env.TOKEN || "",
    APP_ENV: process.env.APP_ENV || "",
    API_BASE: process.env.API_BASE || "",
    OAUTH_URL: process.env.OAUTH_URL || "",
    CLIENT_ID: process.env.CLIENT_ID || "",
    // split with ','
    INCLUDE_ASSET_IDS:
      process.env.INCLUDE_ASSET_IDS || "",
  },
  pwa: {
    workbox: {
      enabled: false,
      runtimeCaching: [
        {
          urlPattern: /^(https:\/\/images\.mixin\.one\/|https:\/\/mixin-images\.zeromesh\.net\/).*$/,
          handler: "CacheFirst",
        },
      ],
    },
  },
};

export default config;
