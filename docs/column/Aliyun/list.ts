import { transformMenuList } from "../../utils/functions";

const aliyunList = [
  {
    text: "核心概念",
    collapsed: false,
    items: [
      { text: "阿里云 ECS 入门介绍" },
      { text: "为什么前端项目部署需要nginx或Apache" },
      { text: "GitHub Actions 核心概念详解" }
    ]
  },
  {
    text: "实战部署",
    collapsed: false,
    items: [
      { text: "VitePress博客自动部署到ECS" },
      { text: "Next项目自动部署到ECS-初始版" },
      { text: "Next项目自动部署到ECS-优化版" },
      { text: "PM2在Next项目部署中的作用" }
    ]
  },
];

export const transformAliyunList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aliyunList, path, isFilterList);
};
