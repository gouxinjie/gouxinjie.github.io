/**
 * VitePress 站点配置文件
 * 配置站点标题、描述、导航、侧边栏、Markdown 插件等
 * 参考文档: https://vitepress.dev/reference/site-config
 */

// 核心导入
import { defineConfig } from "vitepress";

// 导航和侧边栏配置
import { nav, sidebar } from "./navAndSidebarConfig";

// Markdown 插件
import markdownItTaskCheckbox from "markdown-it-task-checkbox"; // todoList 任务列表
import { MermaidMarkdown, MermaidPlugin } from "vitepress-plugin-mermaid"; // 图表渲染插件

/**
 * 站点配置
 */
export default defineConfig({
  /**
   * 基本配置
   */
  base: "/", // 站点基础路径
  title: "苟新节", // 站点标题
  description: "XinJie's Blog Web Site", // 站点描述
  lang: "zh-CN", // 站点语言
  head: [
    // 网站图标
    ["link", { rel: "icon", href: "/xinjie.png" }],
    ["link", { rel: "apple-touch-icon", href: "/xinjie.png" }],

    // SEO Meta 标签
    ["meta", { name: "author", content: "苟新节" }],
    ["meta", { name: "keywords", content: "前端开发,JavaScript,TypeScript,Vue,React,Angular,Docker,Git,Node.js,个人博客" }],
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover" }],

    // Open Graph / Facebook
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "苟新节的博客" }],
    ["meta", { property: "og:title", content: "苟新节 - 前端技术博客" }],
    ["meta", { property: "og:description", content: "专注于前端技术分享，涵盖 JavaScript、TypeScript、Vue、React、Angular、Docker 等技术栈" }],
    ["meta", { property: "og:url", content: "https://gouxinjie.github.io" }],
    ["meta", { property: "og:image", content: "https://gouxinjie.github.io/avatar.png" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],

    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "苟新节 - 前端技术博客" }],
    ["meta", { name: "twitter:description", content: "专注于前端技术分享，涵盖 JavaScript、TypeScript、Vue、React、Angular、Docker 等技术栈" }],
    ["meta", { name: "twitter:image", content: "https://gouxinjie.github.io/avatar.png" }],

    // 主题颜色
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "msapplication-TileColor", content: "#3eaf7c" }],

    // 百度统计（如需要可取消注释）
    // ["script", {}, `
    //   var _hmt = _hmt || [];
    //   (function() {
    //     var hm = document.createElement("script");
    //     hm.src = "https://hm.baidu.com/hm.js?YOUR_BAIDU_ANALYTICS_ID";
    //     var s = document.getElementsByTagName("script")[0];
    //     s.parentNode.insertBefore(hm, s);
    //   })();
    // `]
  ],
  // appearance: "dark", // 外观模式: force-dark(强制暗色), light(浅色), undefined(跟随系统)

  /**
   * 功能配置
   */
  lastUpdated: true, // 开启最后更新时间
  cleanUrls: true, // 启用干净的 URL (去除 .html 后缀)

  /**
   * 站点地图配置
   */
  sitemap: {
    hostname: "https://gouxinjie.github.io" // 站点地图的主机名
  },

  /**
   * 主题配置
   */
  themeConfig: {
    logo: "/avatar.png", // 站点 Logo
    nav: nav, // 顶部导航配置
    sidebar: sidebar, // 侧边栏配置

    /**
     * 锚点导航配置
     */
    outline: {
      level: [2, 6], // 显示的标题级别范围
      label: "本页目录" // 锚点导航标题
    },

    // socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }], // 顶部社交链接配置 (暂不显示)

    /**
     * 最后更新时间配置
     */
    lastUpdatedText: "最近更新", // 最后更新时间文本
    lastUpdated: {
      text: "最后更新于", // 最后更新时间前缀文本
      formatOptions: {
        dateStyle: "short", // 日期格式
        timeStyle: "medium" // 时间格式
      }
    },

    /**
     * 页脚配置
     */
    footer: {
      message: "我见青山多妩媚，料青山见我应如是", // 页脚消息
      copyright: "@新节 wx:13113183859" // 版权信息
    },

    /**
     * 文档导航配置
     */
    docFooter: {
      prev: "前一篇", // 上一篇按钮文本
      next: "后一篇" // 下一篇按钮文本
    },

    /**
     * 搜索配置
     */
    search: {
      provider: "algolia", // 搜索提供商
      options: {
        appId: "VDXJP5CTIA", // Algolia 应用 ID
        apiKey: "f0fc71dd05d2daf1a73e3765c484bee6", // Algolia 搜索 API Key
        indexName: "gouxinjieio" // Algolia 索引名称
      }
    },

    /**
     * 界面文本配置
     */
    returnToTopLabel: "回到顶部", // 返回顶部按钮文本
    sidebarMenuLabel: "菜单", // 侧边栏菜单按钮文本
    darkModeSwitchLabel: "主题", // 深色模式切换按钮文本
    lightModeSwitchTitle: "切换到浅色模式", // 浅色模式切换标题
    darkModeSwitchTitle: "切换到深色模式" // 深色模式切换标题
  },

  /**
   * Markdown 配置
   */
  markdown: {
    /**
     * 代码主题配置
     */
    theme: {
      light: "github-light", // 浅色模式代码主题
      dark: "github-dark" // 深色模式代码主题
    },
    lineNumbers: true, // 启用代码行号

    /**
     * 图片配置
     */
    image: {
      lazyLoading: true // 启用图片懒加载
    },

    /**
     * 容器配置 (中文形式)
     */
    container: {
      tipLabel: "提示", // 提示容器标题
      warningLabel: "警告", // 警告容器标题
      dangerLabel: "危险", // 危险容器标题
      infoLabel: "信息", // 信息容器标题
      detailsLabel: "详细信息" // 详情容器标题
    },

    /**
     * Markdown 插件配置
     */
    config: (md) => {
      /**
       * 字数及阅读时间组件插入h1标题下
       */
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === "h1") htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      };

      /**
       * 配置任务列表 (todoList)
       */
      md.use(markdownItTaskCheckbox);

      /**
       * 配置 Mermaid 图表渲染
       */
      md.use(MermaidMarkdown);
    }
  },

  /**
   * Vite 相关配置
   */
  vite: {
    /**
     * 服务器配置
     */
    server: {
      host: "0.0.0.0", // 服务器主机
      port: 5174, // 服务器端口

      /**
       * 内网穿透配置
       * 允许 ngrok 访问的主机
       */
      allowedHosts: [
        "eagerly-flowing-woodcock.ngrok-free.app", // 特定的 ngrok 域名
        ".ngrok-free.app" // 允许所有 ngrok 免费域名
      ]
    },

    /**
     * 插件配置
     */
    plugins: [MermaidPlugin()], // Mermaid 图表插件

    /**
     * 依赖优化配置
     */
    optimizeDeps: {
      include: ["mermaid"] // 包含需要优化的依赖
    },

    /**
     * SSR 配置
     */
    ssr: {
      noExternal: ["mermaid"] // 不将 mermaid 作为外部依赖
    }
  }
});
