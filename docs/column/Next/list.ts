import { transformMenuList } from "../../utils/functions";

// python模块相关
const nextList = [
  {
    text: "nextjs",
    collapsed: false,
    items: [
      {
        text:'客户端页面路由'
      },
      {
        text:'middleware中间件'
      },
      {
        text: "服务端API路由"
      },
      {
        text: "常见鉴权方案"
      },
      {
        text:"NextAuth认证"
      },
      {
        text:"NextAuth认证常见问题"
      },
    ]
  }
];

export const transformNextList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(nextList, path, isFilterList);
};
