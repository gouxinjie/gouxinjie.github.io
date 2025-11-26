import { transformMenuList } from "../../utils/functions";

const nginxList = [
  {
    text: "Nginx服务器与部署",
    collapsed: false,
    items: [
      { text: "核心概念" },
      { text: "location匹配规则" },
      { text: "alias和root区别" },
      { text: "部署项目和代理" },
      { text: "负载均衡策略" },
      { text: "开启gzip压缩" },
      { text: "开启域名跳转" },
      { text: "History路由404问题" }
    ]
  }
];

export const transformNginxList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(nginxList, path, isFilterList);
};
