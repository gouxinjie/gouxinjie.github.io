import type { NavData } from "./types";

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
        link: "https://chat.deepseek.com/",
        icon: "https://chat.deepseek.com/favicon.svg"
      },
      {
        title: "Kimi Chat（月之暗面）",
        link: "https://www.kimi.com/",
        icon: "https://www.kimi.com/favicon.ico"
      },
      {
        title: "通义千问（阿里）",
        link: "https://www.tongyi.com/qianwen/",
        icon: "https://img.alicdn.com/imgextra/i4/O1CN01EfJVFQ1uZPd7W4W6i_!!6000000006051-2-tps-112-112.png"
      },

      {
        title: "文心一言（百度）",
        link: "https://yiyan.baidu.com/",
        icon: "https://eb-static.cdn.bcebos.com/logo/favicon.ico"
      },

      {
        icon: "https://cdn.oaistatic.com/assets/favicon-l4nq08hd.svg",
        title: "ChatGPT（OpenAI）",
        link: "https://chatgpt.com/"
      },

      {
        title: "Grok Chat（xAI）",
        link: "https://grok.com/chat",
        icon: "https://grok.com/favicon.ico"
      },

      {
        title: "Google Gemini（Google）",
        link: "https://gemini.google.com/",
        icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"
      },

      {
        title: "v0 Chat（Vercel）",
        link: "https://v0.app/chat",
        icon: "https://v0.app/assets/icon.svg"
      },

      {
        icon: "https://www.notion.so/images/logo-ios.png",
        title: "Notion AI（笔记）",
        link: "https://www.notion.so"
      },

      {
        title: "腾讯元宝（腾讯）",
        link: "https://yuanbao.tencent.com/",
        icon: "https://static.yuanbao.tencent.com/modern/_next/static/media/logo_light.d078142a.svg"
      },

      {
        title: "豆包（字节跳动）",
        link: "https://www.doubao.com/chat/",
        icon: "/navIcon/doubao.png"
      },

      {
        icon: "https://chatglm.cn/favicon.ico",
        title: "智谱清言（ChatGLM）",
        link: "https://chatglm.cn"
      }
    ]
  }
];
