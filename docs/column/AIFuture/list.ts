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
      },
      {
        text: "为什么 prompt 开头要写「你是 xx 专家」？"
      }
    ]
  }
];

export const transformAIFutureList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aiFutureList, path, isFilterList);
};
