import { defineConfig } from "vitepress";
import { nav, sidebar } from "./navAndSidebarConfig";
import markdownItTaskCheckbox from "markdown-it-task-checkbox"; // todoList 任务列表
import { MermaidMarkdown, MermaidPlugin } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  title: "苟新节",
  description: "XinJie's Blog Web Site",
  head: [["link", { rel: "icon", href: "/xinjie.png" }]], // 导航栏
  // appearance: "dark", // force-dark: 强制dark模式   light:浅色模式

  // 开启最后更新时间
  lastUpdated: true,
  cleanUrls: true,

  // 设置站点地图
  sitemap: {
    hostname: "https://gouxinjie.github.io"
  },

  themeConfig: {
    logo: "/avatar.png",
    nav: nav,
    sidebar: sidebar, // 顶部导航区和侧边栏
    // 描点导航
    outline: {
      level: [2, 6],
      label: "本页目录"
    },

    // socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }], //顶部社交链接配置github 暂不显示

    lastUpdatedText: "最近更新",
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      }
    },

    // 先不设置footer
    footer: {
      message: "我见青山多妩媚，料青山见我应如是。",
      copyright: "@苟新节 wx:13113183859"
    },

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
    },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式"
  },

  // 配置 Markdown 解析
  markdown: {
    // 代码主题
    theme: { light: "github-light", dark: "github-dark" },
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    // 容器以中文形式
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息"
    },

    // md 配置插件
    config: (md) => {
      // 字数及阅读时间组件插入h1标题下
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === "h1") htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      };
      // 配置任务列表 todoList
      md.use(markdownItTaskCheckbox);
      // 配置mermaid
      md.use(MermaidMarkdown);
    }
  },

  // vite相关配置
  vite: {
    server: {
      host: "0.0.0.0",
      port: 5174,
      // 内网穿透：允许ngrok访问的主机
      allowedHosts: [
        "eagerly-flowing-woodcock.ngrok-free.app", // 你的ngrok域名
        ".ngrok-free.app" // 允许所有ngrok免费域名
      ]
    },
    // 配置mermaid
    plugins: [MermaidPlugin()],
    optimizeDeps: {
      include: ["mermaid"]
    },
    ssr: {
      noExternal: ["mermaid"]
    }
  }
});
