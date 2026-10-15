import { transformMenuList } from "../../utils/functions";

// AIFuture 模块相关：顺序会同步影响首页列表和侧边栏渲染顺序
const aiFutureList = [
  {
    text: "基础认知",
    collapsed: false,
    items: [
      {
        text: "AI 技术生态全景图"
      },
      {
        text: "AI模型中的Token含义"
      },
      {
        text: "什么是AI命中缓存"
      },
      {
        text: "模型上下文与提示词工程"
      },
      {
        text: "什么是RAG检索增强生成"
      },
      {
        text: "什么是模型蒸馏"
      },
      {
        text: "什么是Embedding"
      },
      {
        text: "Function Calling详解"
      },
      {
        text: "AI编程中的任务分解与自主协作机制"
      },
      {
        text: "为什么AI编辑器工作时爆内存而CPU却空闲"
      },
      {
        text: "AI Agent工程与AI应用开发区别"
      },
      {
        text: "AI Agent 是怎么自己执行任务的"
      },
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
      },
      {
        text: "JAVA专用AGENTS.md模板"
      }
    ]
  },
  {
    text: "AI Agent 核心技术专题",
    collapsed: false,
    items: [
      {
        text: "AI Agent 是什么"
      },
      {
        text: "Tool Calling（工具调用）"
      },
      {
        text: "Agent Loop（智能体执行循环）"
      },
      {
        text: "AI Coding Agent 是如何修改项目代码的？"
      },
      {
        text: "AI 为什么需要权限？Sandbox 是如何工作的？"
      },
      {
        text: "AI Agent 是如何记住上下文的？"
      }
    ]
  },

];

export const transformAIFutureList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aiFutureList, path, isFilterList);
};
