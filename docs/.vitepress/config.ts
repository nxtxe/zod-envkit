import { defineConfig } from "vitepress";

const REPO = "zod-envkit";
const BASE = `/${REPO}/`;

const commonTheme = {
  logo: "/zod-envkit.svg",
  siteTitle: false as false,

  socialLinks: [
    { icon: "github", link: "https://github.com/nxtxe/zod-envkit" },
    { icon: "npm", link: "https://www.npmjs.com/package/zod-envkit" },
  ],

  footer: {
    message: "Released under the MIT License.",
    copyright: "© nxtxe",
  },
} 

export default defineConfig({
  title: "zod-envkit",
  description: "Type-safe environment variable validation and documentation",
  base: BASE,

  head: [["link", { rel: "icon", href: `/zod-envkitmini.svg` }]],

  locales: {
    root: {
      label: "English",
      lang: "en",

      themeConfig: {
        ...commonTheme,

        nav: [
          { text: "Guide", link: "/guide/getting-started" },
          { text: "CLI", link: "/guide/cli" },
          { text: "API", link: "/api/" },
        ],

        sidebar: {
          "/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Getting Started", link: "/guide/getting-started" },
                { text: "Library", link: "/guide/library" },
                { text: "CLI", link: "/guide/cli" },
                { text: "env.meta.json", link: "/guide/meta" },
              ],
            },
          ],

          "/api/": [
            {
              text: "API",
              items: [
                { text: "Overview", link: "/api/" },
                { text: "Contract", link: "/api/contract" },
                { text: "Functions", link: "/api/functions" },
                { text: "Type aliases", link: "/api/type-aliases" },
              ],
            },
          ],
        },
      },
    },

    ru: {
      label: "Русский",
      lang: "ru",
      link: "/ru/",

      themeConfig: {
        ...commonTheme,

        nav: [
          { text: "Гайд", link: "/ru/guide/getting-started" },
          { text: "CLI", link: "/ru/guide/cli" },
          { text: "API", link: "/api/" },
        ],

        sidebar: {
          "/ru/guide/": [
            {
              text: "Гайд",
              items: [
                { text: "Начало работы", link: "/ru/guide/getting-started" },
                { text: "Библиотека", link: "/ru/guide/library" },
                { text: "CLI", link: "/ru/guide/cli" },
                { text: "env.meta.json", link: "/ru/guide/meta" },
              ],
            },
          ],

          "/ru/api/": [
            {
              text: "API",
              items: [
                { text: "Overview", link: "/api/" },
                { text: "Contract", link: "/api/contract" },
                { text: "Functions", link: "/api/functions" },
                { text: "Type aliases", link: "/api/type-aliases" },
              ],
            },
          ],
        },
      },
    },
  },
});
