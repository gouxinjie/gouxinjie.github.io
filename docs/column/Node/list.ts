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
        text: "npm install原理"
      },
      {
        text: "npm run原理"
      },
      {
        text: "npx 命令"
      },
      {
        text: "全局变量"
      },
      { text: "模块化规范" },
      {
        text: "模块查找规则"
      },
      {
        text: "nvm相关"
      },
      {
        text: "fnm管理node版本"
      },
      {
        text: "npm serve"
      },
      {
        text: "pnpm解决幽灵依赖"
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
