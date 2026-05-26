import { transformMenuList } from "../../utils/functions";

const aliyunList = [
  {
    text: "ECS部署",
    collapsed: false,
    items: [
      { text: "VitePress博客自动部署到ECS" },
      { text: "Next项目自动部署到ECS" },

    ]
  }
];

export const transformAliyunList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(aliyunList, path, isFilterList);
};
