import { defineConfig } from "vitepress";
import { nav, sidebar } from "./relaConf";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  title: "苟新节",
  description: "Xinjie's Blog Web Site",
  head: [["link", { rel: "icon", href: "/xinjie.png" }]], // 导航栏
  themeConfig: {
    logo: "/avatar.png",
    nav: nav,
    sidebar: sidebar, // 侧边栏
    // 描点导航
    outline: {
      level: [2, 6],
      label: "本页目录"
    },
    // socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }], 顶部社交链接配置github 暂不显示
    lastUpdatedText: "最近更新",
    docFooter: {
      prev: "前一篇",
      next: "后一篇"
    },
    search: {
      provider: "algolia",
      options: {
        appId: "VDXJP5CTIA",
        apiKey: "f0fc71dd05d2daf1a73e3765c484bee6",
        indexName: "gouxinjieio"
      }
    }
  },
  // 配置 Markdown 解析 - 和代码高亮
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    lineNumbers: true,
    // 容器以中文形式
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息"
    }
  },

  // vite相关配置内网穿透：允许ngrok访问的主机
  vite: {
    server: {
      host: "0.0.0.0",
      port: 5174,
      allowedHosts: [
        "eagerly-flowing-woodcock.ngrok-free.app", // 你的ngrok域名
        ".ngrok-free.app" // 允许所有ngrok免费域名
      ]
    }
  }
});
