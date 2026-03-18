import { transformMenuList } from "../../utils/functions";

const aiFutureList = [
  {
    text: "基础认知",
    collapsed: false,
    items: [
      {
        text: "AI概念与AI Agent"
      },
      {
        text: "AI模型中的token是什么"
      },
      {
        text: "什么是MCP协议"
      },
      {
        text: '什么是模型蒸馏'
      }
    ]
  },
  {
    text: "工具提效",
    collapsed: false,
    items: [
      {
        text: "AGENTS规则约束"
      },
      {
        text: "Agent Skills"
      }
    ]
  },
  {
    text: "趋势观察",
    collapsed: false,
    items: [
      {
        text: "2026年AI应用趋势清单"
      }
    ]
  }
];

export const transformAIFutureList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aiFutureList, path, isFilterList);
};
