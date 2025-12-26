import { transformMenuList } from "../../utils/functions";

const dockerList = [
  {
    text: "Docker容器与部署",
    collapsed: false,
    items: [
      { text: "核心概念和安装" },
      { text: "Docker的镜像与容器" },
      { text: "Dockerfile" },
      { text: "Docker Compose" },
      { text: "Docker网络" },
      { text: "容器存储" },
      { text: "容器日志和监控" },
      { text: "为什么前端项目部署需要nginx或Apache" },
      { text: "Docker本地部署CSR前端项目" },
      { text: "Docker本地部署SSR前端项目" }
    ]
  }
];

export const transformDockerList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(dockerList, path, isFilterList);
};
