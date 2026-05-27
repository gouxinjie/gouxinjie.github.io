import { transformMenuList } from "../../utils/functions";

const aliyunList = [
  {
    text: "ECS部署",
    collapsed: false,
    items: [
      { text: "VitePress博客自动部署到ECS" },
      { text: "Next项目自动部署到ECS-初始版" },
      { text: "Next项目自动部署到ECS-优化版" },
      { text: "PM2在Next项目部署中的作用" }
    ]
  }
];

export const transformAliyunList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aliyunList, path, isFilterList);
};
