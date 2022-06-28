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
        },
        dark: {
          primary: "#FFF",
        },
      },
    },
  };
  return mergeDeep(UIKit.preset, options);
}
