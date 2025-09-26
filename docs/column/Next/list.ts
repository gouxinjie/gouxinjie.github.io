import { transformMenuList } from "../../utils/functions";

// python模块相关
const nextList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text:'nextjs的哲学思想'
      },
      {
        text: "服务端和客户端组件"
      },
      {
        text: "新旧路由系统区别"
      },
      {
        text: "客户端页面路由"
      },
      {
        text: "服务端API路由"
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
        text: "自定义Document"
      },
      {
        text: "自定义错误页面"
      },
      {
        text: "middleware中间件"
      },
      {
        text:'图像优化'
      },
      {
        text: "turbopack构建打包"
      },
      {
        text:'NextRequest和NextResponse'
      },
      {
        text: "常见鉴权方案"
      },
      {
        text: "NextAuth认证"
      },
      {
        text: "NextAuth认证常见问题"
      }
    ]
  }
];

export const transformNextList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(nextList, path, isFilterList);
};
