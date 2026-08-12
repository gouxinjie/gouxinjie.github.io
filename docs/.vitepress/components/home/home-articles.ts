/**
 * 首页精选文章数据
 * 6 张卡片，按设计稿 3 列 2 行排布
 * 数据来源与原 frontmatter features 同步，但扩展了阅读时间和标签
 */

export interface HomeArticle {
  title: string;
  desc: string;
  link: string;
  tag: string;
  reading: string;
  /** lucide 风格图标 svg 字符串（24x24 viewBox） */
  icon: string;
  /** 图标品牌色调色（与 .xinjie-article__icon 叠加） */
  iconBg?: string;
  /** 分类标签颜色（背景色 / 文字色） */
  tagColor?: string;
}

export const FEATURED_ARTICLES: HomeArticle[] = [
  {
    title: "为什么前端项目部署需要 nginx 或 Apache?",
    desc: "部署时需使用Web服务器(如Nginx), 因为浏览器无法直接访问服务器文件系统, 但是可以通过 HTTP 请求访问服务器上暴露的端口和路径。",
    link: "/column/Aliyun/核心概念/为什么前端项目部署需要nginx",
    tag: "Web 部署",
    reading: "7 分钟阅读",
    icon:
      '<path d="M2 3h20"/><path d="M21 3v11a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V3"/><path d="m8 21 4-4 4 4"/>',
    iconBg: "linear-gradient(135deg, #fb923c, #f97316)",
    tagColor: "#f97316"
  },
  {
    title: "使用FNM进行多个Node版本的管理",
    desc: "fnm 是一个轻量级的 Node.js 版本管理工具, 它不仅非常快速, 而且安装、使用都简洁, 尤其是在不同项目之间切换时非常方便。",
    link: "/column/Node/基础/fnm管理node版本",
    tag: "Node.js",
    reading: "6 分钟阅读",
    icon:
      '<rect x="3" y="3" width="7" height="7" rx="1"/><path d="M14 3h7v7"/><path d="M14 14h7v7"/><path d="M3 14h7v7"/>',
    iconBg: "linear-gradient(135deg, #34d399, #10b981)",
    tagColor: "#10b981"
  },
  {
    title: "使用Docker本地部署 CSR 前端项目完整指南",
    desc: "本文详解了使用Docker部署Vue3+Vite项目的完整方案, 涵盖多阶段构建、Nginx优化及 docker-compose 编排, 简化部署流程。",
    link: "/column/Docker/进阶/Docker本地部署CSR前端项目",
    tag: "Docker",
    reading: "12 分钟阅读",
    icon:
      '<rect x="3" y="3" width="18" height="12" rx="2"/><path d="M3 9h18"/><path d="M7 17v3"/><path d="M13 17v3"/><path d="M17 19h4"/><path d="M19 17v4"/>',
    iconBg: "linear-gradient(135deg, #60a5fa, #3b82f6)",
    tagColor: "#3b82f6"
  },
  {
    title: "工作中常用的 git 操作",
    desc: "通过分支管理、变更追踪和历史记录等功能, 确保代码的完整性和项目的协同效率, 同时还支持错误回滚和代码审查。",
    link: "/column/Git/git相关/工作中常用的git操作-2.html",
    tag: "Git",
    reading: "8 分钟阅读",
    icon:
      '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v8"/><path d="M6 16h6"/><path d="M14 16l2-2 2 2"/>',
    iconBg: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    tagColor: "#7c3aed"
  },
  {
    title: "Nginx 开启 Gzip 压缩",
    desc: "在前端项目中, JS/CSS 文件较大时, 启用 Gzip 压缩可以显著减少传输体积, 提高页面加载速度。",
    link: "/column/Nginx/Nginx服务器与部署/开启gzip压缩.html",
    tag: "Nginx",
    reading: "5 分钟阅读",
    icon:
      '<path d="M13 2 3 14h8l-1 8 10-12h-8z"/>',
    iconBg: "linear-gradient(135deg, #fde047, #f59e0b)",
    tagColor: "#f59e0b"
  },
  {
    title: "前端常用加密方式有哪些?",
    desc: "前端常用加密方式有很多, 比如 MD5、SHA1、AES、DES 等。选择合适的加密方式可以提高数据的安全性和完整性。",
    link: "/column/前端进阶/网络安全/前端常用加密方式",
    tag: "安全",
    reading: "10 分钟阅读",
    icon:
      '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    iconBg: "linear-gradient(135deg, #f87171, #ef4444)",
    tagColor: "#ef4444"
  }
];
