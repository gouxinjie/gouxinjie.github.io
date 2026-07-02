import type { NavData, Project } from "./types";

/**
 * 首页导航数据
 */
export const NAV_DATA: NavData[] = [
  {
    title: "常用工具",
    items: [
      {
        icon: "https://caniuse.com/img/favicon-128.png",
        title: "Can I use",
        desc: "权威的Web API与CSS特性浏览器兼容性查询工具，为兼容性决策提供准确数据。",
        link: "https://caniuse.com"
      },
      {
        icon: "https://tinypng.com/images/apple-touch-icon.png",
        title: "TinyPNG",
        desc: "智能在线图片压缩工具，有效减小PNG/JPEG文件体积，几乎不损失视觉质量。",
        link: "https://tinypng.com"
      },
      {
        icon: "/navIcon/grid.svg",
        title: "Grid布局生成器",
        desc: "可视化CSS Grid布局生成器，通过拖拽交互快速创建复杂网格并生成对应代码。",
        link: "https://cssgrid-generator.netlify.app/"
      },
      {
        icon: "https://devtool.tech/logo.svg",
        title: "开发者武器库",
        desc: "集合了众多编码、调试、设计等在线工具的聚合平台，旨在提升开发者效率。",
        link: "https://devtool.tech"
      },
      {
        icon: "https://tool.lu/favicon.ico",
        title: "在线工具",
        desc: "功能全面的中文在线工具箱，涵盖代码处理、文档转换、加密解密等日常开发需求。",
        link: "https://tool.lu"
      },
      {
        icon: "/navIcon/json-cn.ico",
        title: "Json 中文网",
        desc: "提供JSON数据的在线解析、格式化、验证与压缩，支持多种视图和错误提示。",
        link: "https://www.json.cn"
      },
      {
        title: "docsmall",
        link: "https://docsmall.com/",
        desc: "免费在线工具，支持图片压缩、GIF裁剪、PDF合并与分割等多种文档处理功能。",
        icon: "https://docsmall.com/favicon.png"
      },
      {
        icon: "https://www.emojiall.com/favicon.ico",
        title: "Emoji 图标",
        desc: "收录海量Emoji表情符号，提供名称、含义、编码查询及不同平台的外观对比。",
        link: "https://www.emojiall.com/zh-hans"
      },
      {
        icon: "https://aigcrank.cn/favicon.ico",
        title: "AIGC 排名",
        desc: "AI 生成内容（AIGC）相关项目的排名和评价，帮助用户选择最有价值的项目。",
        link: "https://aigcrank.cn/"
      },
      {
        icon: "https://cloud.dify.ai/logo/logo.svg",
        title: "Dify平台",
        desc: "开源的LLM应用开发平台，提供可视化工作流、RAG引擎与多模型支持，可快速构建和部署AI应用。",
        link: "https://dify.ai"
      }
    ]
  },
  {
    title: "AI 导航",
    items: [
      {
        title: "深度求索 DeepSeek",
        desc: "国产开源大模型，推理能力出色，支持 1M 超长上下文与联网搜索。",
        link: "https://chat.deepseek.com/",
        icon: "https://chat.deepseek.com/favicon.svg"
      },
      {
        title: "Kimi Chat（月之暗面）",
        desc: "长文本处理专家，支持 200 万字上下文，擅长文档分析与总结。",
        link: "https://www.kimi.com/",
        icon: "https://www.kimi.com/favicon.ico"
      },
      {
        title: "通义千问（阿里）",
        desc: "阿里云旗下大模型，深度整合办公场景，支持代码生成与多轮对话。",
        link: "https://www.tongyi.com/qianwen/",
        icon: "https://img.alicdn.com/imgextra/i4/O1CN01EfJVFQ1uZPd7W4W6i_!!6000000006051-2-tps-112-112.png"
      },

      {
        title: "文心一言（百度）",
        desc: "百度出品的大语言模型，支持文学创作、商业文案与知识问答。",
        link: "https://yiyan.baidu.com/",
        icon: "https://eb-static.cdn.bcebos.com/logo/favicon.ico"
      },

      {
        title: "ChatGPT（OpenAI）",
        desc: "全球领先的通用大模型，支持多模态交互、代码生成与复杂推理。",
        link: "https://chatgpt.com/",
        icon: "https://cdn.oaistatic.com/assets/favicon-l4nq08hd.svg"
      },

      {
        title: "Grok Chat（xAI）",
        desc: "马斯克 xAI 推出的实时 AI 助手，连接 X 平台，风格大胆直接。",
        link: "https://grok.com/chat",
        icon: "https://grok.com/favicon.ico"
      },

      {
        title: "Google Gemini（Google）",
        desc: "谷歌多模态大模型，深度融合搜索与 Workspace 生态，支持超长文本。",
        link: "https://gemini.google.com/",
        icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"
      },

      {
        title: "v0 Chat（Vercel）",
        desc: "Vercel 推出的 UI 代码生成工具，一句话生成前端组件与页面原型。",
        link: "https://v0.app/chat",
        icon: "https://v0.app/assets/icon.svg"
      },

      {
        title: "Notion AI（笔记）",
        desc: "集成在 Notion 中的 AI 助手，支持文档撰写、内容总结与知识问答。",
        link: "https://www.notion.so",
        icon: "https://www.notion.so/images/logo-ios.png"
      },

      {
        title: "腾讯元宝（腾讯）",
        desc: "腾讯旗下 AI 助手，支持公众号内容检索、文档解析与多轮对话。",
        link: "https://yuanbao.tencent.com/",
        icon: "https://static.yuanbao.tencent.com/modern/_next/static/media/logo_light.d078142a.svg"
      },

      {
        title: "豆包（字节跳动）",
        desc: "字节跳动出品的 AI 助手，内置丰富应用生态，支持语音与多模态。",
        link: "https://www.doubao.com/chat/",
        icon: "/navIcon/doubao.png"
      },

      {
        title: "智谱清言（ChatGLM）",
        desc: "智谱 AI 推出的对话助手，清华技术背景，支持长文档与编程辅助。",
        link: "https://chatglm.cn",
        icon: "https://chatglm.cn/favicon.ico"
      }
    ]
  }
];

/**
 * 在线项目数据
 */
export const PROJECTS_DATA: Project[] = [
  {
    name: "Blog",
    desc: "我的博客系统",
    url: "https://gouxinjie.com",
    tech: ["VitePress", "GitHub Pages"],
    deploy: "Git Actions 自动部署，监听本地 80 端口",
  },
  {
    name: "Prompt Gallery",
    desc: "基于 Next.js + Supabase 的画廊应用",
    url: "https://prompt.gouxinjie.com",
    tech: ["Next.js", "Supabase", "PM2"],
    deploy: "Git Actions 自动部署，PM2 管理，端口 5173",
  },
  {
    name: "Archive",
    desc: "基于 Nuxt4 + SQLite 的个人档案项目",
    url: "https://archive.gouxinjie.com",
    tech: ["Nuxt4", "SQLite", "PM2"],
    deploy: "Git Actions 自动部署，PM2 管理，端口 3000",
  },
  {
    name: "Compress Imgs",
    desc: "基于 TinyPNG API 的 Python Web 单体项目",
    url: "https://compress-imgs.gouxinjie.com",
    tech: ["Python", "TinyPNG"],
    deploy: "Git Actions 自动部署，端口 8000",
  },
  {
    name: "CodeView",
    desc: "基于 Node.js + React 的前后端分离项目",
    url: "https://codeview.gouxinjie.com",
    tech: ["Node.js", "React", "Docker"],
    deploy: "Git Actions + Docker 镜像自动部署",
  },
  {
    name: "Flow Calendar",
    desc: "青柠日历（Lime Calendar），以月历为核心的轻量生活记录 H5 工具",
    url: "https://flow-calendar.gouxinjie.com",
    tech: ["Next.js", "PM2", "Nginx"],
    deploy: "Git Actions 自动部署，PM2 管理，端口 3400",
  },
];
