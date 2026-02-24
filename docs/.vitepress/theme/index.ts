import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import InstallBlock from "./components/InstallBlock.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("InstallBlock", InstallBlock);
  },
} satisfies Theme;
