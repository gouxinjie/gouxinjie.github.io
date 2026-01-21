import { transformMenuList } from "../../utils/functions";

// nextjs 模块相关
const nextList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "了解Nextjs的哲学思想"
      },
      {
        text: "了解CSR、SSR、SSG"
      },
      {
        text: "什么是RSC渲染"
      },
      {
        text: "服务端和客户端组件"
      },
      {
        text: "路由系统",
        items: [
          {
            text: "Pages Router和App Router"
          },
          {
            text: "客户端页面路由"
          },
          {
            text: "平行路由"
          },
          {
            text: "路由组"
          },
          {
            text: "服务端API路由"
          }
        ]
      },

      {
        text: "layout页面布局"
      }
    ]
  },
  {
    text: "进阶",
    collapsed: false,
    items: [
      {
        text: "集成aiSDK"
      },
      {
        text: "自定义Document"
      },
      {
        text: "自定义错误页面"
      },
      {
        text: "middleware中间件"
      },
      {
        text: "图像优化"
      },
      {
        text: "Script组件"
      },
      {
        text: "Turbopack构建工具"
      },
      {
        text: "NextRequest和NextResponse"
      },
      {
        text: "常见鉴权方案"
      },
      {
        text: "NextAuth认证"
      },
      {
        text: "NextAuth认证常见问题"
      },
      {
        text: "Nextjs打包为什么比较大"
      }
    ]
  }
];

export const transformNextList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(nextList, path, isFilterList);
};
