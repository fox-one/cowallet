import zh from "vuetify/es5/locale/zh-Hans";
import en from "vuetify/es5/locale/en";
import ja from "vuetify/es5/locale/ja";
import enUikit from "@foxone/uikit/src/locales/en";
import jaUikit from "@foxone/uikit/src/locales/ja";
import zhUikit from "@foxone/uikit/src/locales/zh-Hans";

export default function ({ store }) {
  const isDark = store.state.app?.dark || false;

  return {
    icons: {
      iconfont: "mdiSvg",
    },
    theme: {
      dark: isDark,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: "#000000",

          // general color
          theme_1: "#DF8976",
          theme_2: "#A5C4C4",
          theme_3: "#CCACE3",
          theme_4: "#8ECDE5",
          theme_5: "#E5C38E",
          theme_6: "#9EE0B8",
          theme_lighter_1: "#DF8976",
          theme_lighter_2: "#A5C4C4",
          theme_lighter_3: "#CCACE3",
          theme_lighter_4: "#8ECDE5",
          theme_lighter_5: "#E5C38E",
          theme_lighter_6: "#9EE0B8",
        },
        dark: {
          primary: "#4BB3FF",

          // general color
          theme_1: "#DF8976",
          theme_2: "#A5C4C4",
          theme_3: "#CCACE3",
          theme_4: "#8ECDE5",
          theme_5: "#E5C38E",
          theme_6: "#9EE0B8",
          theme_lighter_1: "#DF8976",
          theme_lighter_2: "#A5C4C4",
          theme_lighter_3: "#CCACE3",
          theme_lighter_4: "#8ECDE5",
          theme_lighter_5: "#E5C38E",
          theme_lighter_6: "#9EE0B8",
        },
      },
    },
    lang: {
      locales: {
        zh: {
          ...zh,
          ...zhUikit,
        },
        en: {
          ...en,
          ...enUikit,
        },
        ja: {
          ...ja,
          ...jaUikit,
        },
      },
    },
  };
}
