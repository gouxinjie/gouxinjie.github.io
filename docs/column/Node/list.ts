import { transformMenuList } from "../../utils/functions";

// node模块相关
const nodeList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      {
        text: "npm package.json"
      },
      {
        text: "npm install 原理"
      },
      {
        text: "npm run 原理"
      },
      {
        text: "npx 命令使用"
      },
      {
        text: "node 全局变量"
      },
      { text: "模块化规范" },
      {
        text: "模块查找规则"
      },
      {
        text: "nvm 管理 node 版本"
      },
      {
        text: "fnm 管理 node 版本"
      },
      {
        text: "npm serve 插件"
      },
      {
        text: "pnpm 解决幽灵依赖"
      }
    ]
  },

  {
    text: "内置模块",
    collapsed: false,
    items: [
      {
        text: "path 模块"
      },
      {
        text: "os 模块"
      },
      {
        text: "fs 模块"
      },
      {
        text: "process 模块"
      },
      {
        text: "events 模块"
      },
      {
        text: "http 模块"
      },
      {
        text: "crypto 模块"
      },
      {
        text: "express 模块"
      }
    ]
  },
];

export const transformNodeList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(nodeList, path, isFilterList);
};
