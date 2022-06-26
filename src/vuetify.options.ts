import UIKit from "@foxone/uikit";
import { mergeDeep } from "vuetify/lib/util/helpers";
import icons from "@/utils/icons";

export default function ({ store }) {
  const isDark = store.state.app?.dark || false;

  const options = {
    icons: {
      values: icons,
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
  };
  return mergeDeep(UIKit.preset, options);
}
