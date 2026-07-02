import { transformMenuList } from "../../utils/functions";

// AIFuture 模块相关：顺序会同步影响首页列表和侧边栏渲染顺序
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
        text: "什么是提示词工程"
      },
      {
        text: "什么是RAG检索增强生成"
      },
      {
        text: "什么是MCP协议"
      },
      {
        text: "什么是模型蒸馏"
      }
    ]
  },
  {
    text: "工具提效",
    collapsed: false,
    items: [
      {
        text: "AGENTS规则约束",
        items: [
          {
            text: "什么是AGENTS.md"
          },
          {
            text: "前端专用AGENTS.md模板"
          },
          {
            text: "后端专用AGENTS.md模板"
          }
        ]
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
        text: "从卷模型到卷产品：AI应用层的机会在哪"
      },
      {
        text: "AI变成基础设施之后，什么最值钱"
      },
      {
        text: "开发者的AI生存手册：哪些技能在贬值"
      }
    ]
  }
];

export const transformAIFutureList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aiFutureList, path, isFilterList);
};
