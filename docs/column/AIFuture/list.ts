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
        text: "AI模型中的Token含义"
      },
      {
        text: "什么是模型蒸馏"
      },
      {
        text: "什么是提示词工程"
      },
      {
        text: "什么是RAG检索增强生成"
      },
      {
        text: "为什么 Prompt 开头要写 你是xx专家"
      }
    ]
  },
  {
    text: "MCP",
    collapsed: false,
    items: [
      {
        text: "MCP核心概念"
      },
      {
        text: "MCP端到端流程"
      },
      {
        text: 'MCP从零编写到发布上线'
      }
    ]
  },
  {
    text: "Skill",
    collapsed: false,
    items: [
      {
        text: "Skill（技能）详解"
      },
      {
        text: "Skill 从零编写到发布上线"
      }
    ]
  },
  {
    text: "AGENTS 规则约束",
    collapsed: false,
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

];

export const transformAIFutureList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aiFutureList, path, isFilterList);
};
