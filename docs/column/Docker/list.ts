import { transformMenuList } from "../../utils/functions";

const dockerList = [
  {
    text: "基础",
    collapsed: false,
    items: [
      { text: "核心概念和安装" },
      { text: "Docker的镜像与容器" },
      { text: "为什么使用 Docker 镜像" },
      { text: "Dockerfile" },
      { text: "Docker Compose" },
      { text: "Docker网络" },
      { text: "容器存储" },
      { text: "容器日志和监控" },
    ]
  },
  {
    text: "进阶",
    collapsed: false,
    items: [
      { text: "Docker 镜像与网络隔离" },
      { text: "Docker本地部署CSR前端项目" },
      { text: "Docker本地部署SSR前端项目" }
    ]
  }
];

export const transformDockerList = (path: string, isFilterList: boolean = false) => {
  return transformMenuList(dockerList, path, isFilterList);
};
