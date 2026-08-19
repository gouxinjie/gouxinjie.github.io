import { transformMenuList } from "../../utils/functions";

// 前端进阶/通用专题相关
const frontendAdvanceList = [
  {
    text: "性能优化",
    collapsed: false,
    items: [
      {
        text: "防抖和节流函数细节"
      },
      {
        text: "NProgress页面加载进度条原理"
      },
      {
        text: "VitePress首屏加载优化实战"
      },
      {
        text: "前端图片加载优化全链路方案"
      },
      {
        text: "前端图片瀑布流实现方案详解"
      },
      {
        text: "顶部阅读进度条的方案实现"
      }
    ]
  },
  {
    text: "架构与原理",
    collapsed: false,
    items: [
      {
        text: "import动态导入使用与高级应用"
      },
      {
        text: "客户端和服务器端渲染区别"
      },
      {
        text: "构建时Hash与ContentHash的差异详解"
      },
      {
        text: "前端运行时与编译时的理解"
      }
    ]
  },
  {
    text: "工程化",
    collapsed: false,
    items: [
      {
        text: "前端发版后实现提醒用刷新页面策略"
      },
      {
        text: "移动端H5适配方案实践"
      },
      {
        text: "网站主题切换的原理与最佳实践"
      }
    ]
  },
  {
    text: "网络安全",
    collapsed: false,
    items: [
      {
        text: "前端常用加密方式"
      }
    ]
  },
  {
    text: "数据埋点",
    collapsed: false,
    items: [
      {
        text: "神策埋点"
      }
    ]
  },
  {
    text: "设计原则",
    collapsed: false,
    items: [
      {
        text: "软件设计五大核心原则"
      }
    ]
  },
  {
    text: "登录鉴权",
    collapsed: false,
    items: [
      {
        text: "APP扫码登录的实现原理"
      },
      {
        text: "邀请新用户返利链接的实现原理"
      },
      {
        text: "现代桌面应用跳转浏览器登录方案解析"
      }
    ]
  }
];

export const transformFrontendAdvanceList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(frontendAdvanceList, path, isFilterList);
};
