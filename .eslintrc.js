module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "arrow-parens": ["error", "always"],
    camelcase: "off",
    "no-empty": "off",
    "@typescript-eslint/camelcase": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-non-null-assertion": ["off"],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
  overrides: [
    {
      files: ["*.*"],
      rules: {
        // https://github.com/vuejs/eslint-plugin-vue/issues/1248 一个未完工的vue3.0 feature，被加入到了 plugin:vue/essential 规则里
        "vue/experimental-script-setup-vars": "off",
      },
    },
  ],
};
