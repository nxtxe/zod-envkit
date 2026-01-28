import { defineConfig } from "vitepress";

export default defineConfig({
  title: "zod-envkit",
  description: "Type-safe environment variable validation and documentation",
  base: "/zod-envkit/",

  head: [["link", { rel: "icon", href: "/zod-envkit/zod-envkit.svg" }]],

  themeConfig: {
    logo: "/zod-envkit.svg",
    siteTitle: false,

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
            { text: "Generated", link: "/api/generated/" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/nxtxe/zod-envkit" },
      { icon: "npm", link: "https://www.npmjs.com/package/zod-envkit" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "© nxtxe",
    },
  },
});
